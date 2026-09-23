/**
 * Serverless API Route: /api/designs
 * Fetches graphic design portfolio items securely from a Notion Database.
 * Compatible with Vercel Serverless Functions and local Vite Connect middleware.
 */

function sendJson(res, statusCode, data) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  // Set CORS headers for local testing and production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    return sendJson(res, 200, {
      configured: false,
      message: 'Notion credentials not set in environment variables. Using client-side portfolio items.',
      items: []
    });
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sorts: [
          {
            timestamp: 'created_time',
            direction: 'descending'
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Notion API Error:', response.status, errorText);
      return sendJson(res, 502, {
        configured: true,
        error: `Notion API returned ${response.status}`,
        items: []
      });
    }

    const data = await response.json();
    
    // Map Notion pages to clean design items
    const items = data.results.map(page => {
      const props = page.properties;

      // 1. Title / Name
      let title = 'Untitled Project';
      const nameProp = props.Name || props.Title || props.name || props.title;
      if (nameProp && nameProp.title && nameProp.title.length > 0) {
        title = nameProp.title.map(t => t.plain_text).join('').trim();
      }

      // 2. Category
      let category = 'Graphic Design';
      const catProp = props.Category || props.category || props.Type || props.type;
      if (catProp && catProp.select && catProp.select.name) {
        category = catProp.select.name;
      } else if (catProp && catProp.multi_select && catProp.multi_select.length > 0) {
        category = catProp.multi_select.map(s => s.name).join(', ');
      }

      // 3. Image URL
      let imageUrl = '';
      const imgProp = props.Images || props.images || props.Image || props.image || props.Cover || props.cover || props.Files || props.files;
      if (imgProp && imgProp.files && imgProp.files.length > 0) {
        const fileObj = imgProp.files[0];
        imageUrl = fileObj.file ? fileObj.file.url : (fileObj.external ? fileObj.external.url : '');
      } else if (page.cover) {
        imageUrl = page.cover.file ? page.cover.file.url : (page.cover.external ? page.cover.external.url : '');
      }

      // 4. Description
      let description = '';
      const descProp = props.Description || props.description || props.Details || props.details;
      if (descProp && descProp.rich_text && descProp.rich_text.length > 0) {
        description = descProp.rich_text.map(t => t.plain_text).join('');
      }

      // 5. Tools Used
      let tools = [];
      const toolProp = props.Tools || props.tools || props.Software || props.software;
      if (toolProp && toolProp.multi_select) {
        tools = toolProp.multi_select.map(t => t.name);
      } else if (toolProp && toolProp.rich_text && toolProp.rich_text.length > 0) {
        tools = toolProp.rich_text.map(t => t.plain_text).join('').split(',').map(s => s.trim());
      }

      // 6. Year / Date
      let year = new Date(page.created_time).getFullYear().toString();
      const yearProp = props.Year || props.year || props.Date || props.date;
      if (yearProp && yearProp.number) {
        year = yearProp.number.toString();
      } else if (yearProp && yearProp.rich_text && yearProp.rich_text.length > 0) {
        year = yearProp.rich_text.map(t => t.plain_text).join('');
      }

      return {
        id: page.id,
        title,
        category,
        imageUrl,
        description,
        tools,
        year
      };
    }).filter(item => item.imageUrl && item.title !== 'Name'); // Filter out empty placeholder rows

    // Cache for 30 minutes at CDN edge to keep presigned Notion image links fresh
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
    return sendJson(res, 200, {
      configured: true,
      items
    });
  } catch (err) {
    console.error('Server error fetching Notion designs:', err);
    return sendJson(res, 500, {
      configured: true,
      error: err.message,
      items: []
    });
  }
}

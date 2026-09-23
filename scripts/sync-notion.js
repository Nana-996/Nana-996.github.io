import fs from 'fs';
import path from 'path';

// Load .env if present
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

const apiKey = process.env.NOTION_API_KEY;
const databaseId = process.env.NOTION_DATABASE_ID;

if (!apiKey || !databaseId) {
  console.log('NOTION_API_KEY or NOTION_DATABASE_ID not set. Skipping Notion sync.');
  process.exit(0);
}

const designsDir = path.resolve(process.cwd(), 'assets', 'designs');
if (!fs.existsSync(designsDir)) {
  fs.mkdirSync(designsDir, { recursive: true });
}

async function sync() {
  console.log('Fetching designs from Notion database:', databaseId);
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sorts: [{ timestamp: 'created_time', direction: 'descending' }]
      })
    });

    if (!response.ok) {
      console.error('Notion API returned error:', response.status, await response.text());
      return;
    }

    const data = await response.json();
    const items = [];

    for (const page of data.results) {
      const props = page.properties;

      let title = 'Untitled Project';
      const nameProp = props.Name || props.Title || props.name || props.title;
      if (nameProp && nameProp.title && nameProp.title.length > 0) {
        title = nameProp.title.map(t => t.plain_text).join('').trim();
      }

      if (title === 'Name' && !props.Images?.files?.length) {
        // Skip empty placeholder header row
        continue;
      }

      let category = 'Graphic Design';
      const catProp = props.Category || props.category || props.Type || props.type;
      if (catProp && catProp.select && catProp.select.name) {
        category = catProp.select.name;
      } else if (catProp && catProp.multi_select && catProp.multi_select.length > 0) {
        category = catProp.multi_select.map(s => s.name).join(', ');
      }

      let remoteUrl = '';
      const imgProp = props.Images || props.images || props.Image || props.image || props.Cover || props.cover || props.Files || props.files;
      if (imgProp && imgProp.files && imgProp.files.length > 0) {
        const fileObj = imgProp.files[0];
        remoteUrl = fileObj.file ? fileObj.file.url : (fileObj.external ? fileObj.external.url : '');
      } else if (page.cover) {
        remoteUrl = page.cover.file ? page.cover.file.url : (page.cover.external ? page.cover.external.url : '');
      }

      if (!remoteUrl) continue;

      let localImageUrl = remoteUrl;
      // Download remote Notion image locally so it NEVER expires on GitHub Pages
      if (remoteUrl.startsWith('http')) {
        try {
          const imgRes = await fetch(remoteUrl);
          if (imgRes.ok) {
            const urlPath = new URL(remoteUrl).pathname;
            const ext = path.extname(urlPath) || '.png';
            const cleanId = page.id.replace(/-/g, '');
            const localFileName = `notion_${cleanId}${ext}`;
            const diskPath = path.resolve(designsDir, localFileName);
            const buffer = Buffer.from(await imgRes.arrayBuffer());
            fs.writeFileSync(diskPath, buffer);
            localImageUrl = `assets/designs/${localFileName}`;
            console.log(`Saved local image for "${title}": ${localImageUrl}`);
          }
        } catch (downloadErr) {
          console.error(`Failed to download image for ${title}:`, downloadErr);
        }
      }

      let description = '';
      const descProp = props.Description || props.description || props.Details || props.details;
      if (descProp && descProp.rich_text && descProp.rich_text.length > 0) {
        description = descProp.rich_text.map(t => t.plain_text).join('');
      }

      let tools = [];
      const toolProp = props.Tools || props.tools || props.Software || props.software;
      if (toolProp && toolProp.multi_select) {
        tools = toolProp.multi_select.map(t => t.name);
      } else if (toolProp && toolProp.rich_text && toolProp.rich_text.length > 0) {
        tools = toolProp.rich_text.map(t => t.plain_text).join('').split(',').map(s => s.trim());
      }

      let year = new Date(page.created_time).getFullYear().toString();
      const yearProp = props.Year || props.year || props.Date || props.date;
      if (yearProp && yearProp.number) {
        year = yearProp.number.toString();
      } else if (yearProp && yearProp.rich_text && yearProp.rich_text.length > 0) {
        year = yearProp.rich_text.map(t => t.plain_text).join('');
      }

      items.push({
        id: page.id,
        title,
        category,
        imageUrl: localImageUrl,
        description,
        tools,
        year
      });
    }

    const outPath = path.resolve(process.cwd(), 'assets', 'designs.json');
    fs.writeFileSync(outPath, JSON.stringify({ syncedAt: new Date().toISOString(), items }, null, 2));
    console.log(`Successfully synced ${items.length} items to assets/designs.json`);
  } catch (err) {
    console.error('Error during Notion sync:', err);
  }
}

sync();

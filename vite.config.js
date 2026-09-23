import { defineConfig, loadEnv } from 'vite';
import handler from './api/designs.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env.NOTION_API_KEY = env.NOTION_API_KEY;
  process.env.NOTION_DATABASE_ID = env.NOTION_DATABASE_ID;

  return {
    plugins: [
      {
        name: 'notion-api-dev-middleware',
        configureServer(server) {
          server.middlewares.use('/api/designs', async (req, res) => {
            await handler(req, res);
          });
        }
      }
    ]
  };
});

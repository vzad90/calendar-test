import path from 'path';
import { pathToFileURL } from 'url';

const serverPath = pathToFileURL(path.join(process.cwd(), 'server/dist/app.js')).href;

let appPromise: Promise<import('express').Express> | null = null;

function getApp() {
  if (!appPromise) {
    appPromise = import(serverPath).then((m) => m.createApp());
  }
  return appPromise;
}

export default async function handler(req: import('http').IncomingMessage, res: import('http').ServerResponse) {
  try {
    if (req.url && !req.url.startsWith('/api')) {
      const rest = req.url.startsWith('/') ? req.url : '/' + req.url;
      const pathOnly = rest.split('?')[0];
      const query = rest.includes('?') ? '?' + rest.split('?').slice(1).join('?') : '';
      req.url = (pathOnly === '/' || pathOnly === '' ? '/api/tasks' : '/api/tasks' + pathOnly) + query;
    }
    const app = await getApp();
    app(req, res);
  } catch (err) {
    console.error('API load error:', err);
    res.status(503).json({ error: 'Server failed to load', details: (err as Error).message });
  }
}

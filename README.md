# Calendar Test Task

Full-stack app: Node.js (Express) backend + React (Vite) frontend.

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

Copy environment files and set variables:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

- **server/.env:** `PORT` (default 5001), `DATABASE_URL` (PostgreSQL connection string; required for persistence).
- **client/.env:** `VITE_API_URL` — leave empty for dev (Vite proxies `/api` to the backend); set to the deployed API URL for production.

## Scripts

| Command     | Description                    |
|------------|--------------------------------|
| `npm run dev`   | Run client and server in dev mode |
| `npm run build` | Build server and client          |
| `npm run lint`  | Lint client and server           |

## Project structure

```
├── client/          # React + Vite frontend
│   └── src/
├── server/          # Express API
│   └── src/
│       ├── config/  # Env and constants
│       ├── routes/
│       └── app.ts
├── package.json     # Root scripts
└── .gitignore
```

## Development

- **Client:** http://localhost:5173 (Vite dev server, proxies `/api` to backend)
- **Server:** http://localhost:5001 (or `PORT` from `server/.env`)

Proxy is configured in `client/vite.config.ts`: `/api` → `http://localhost:5001`. The client uses `import.meta.env.VITE_API_URL` as the request base; when empty, requests go to the same origin and are proxied.

## Deploy

### Why `VITE_API_URL`?

- **Locally:** You leave `VITE_API_URL` empty. Vite proxies `/api` to `http://localhost:5001`, so the app uses the same origin and the proxy forwards requests to your backend.
- **In production:** The frontend is just static files (e.g. on Vercel). There is no proxy. A request to `/api/tasks` would go to the Vercel domain and get a 404. So the frontend must know the **full URL of the API**. That’s what `VITE_API_URL` is for: the base URL of your deployed backend (e.g. `https://your-app.railway.app`). Every API call becomes `fetch(VITE_API_URL + '/api/tasks')` and hits your real server.

### Deploy everything on Vercel (recommended)

You can host both the frontend and the API on the same Vercel project:

1. Push the repo to GitHub and import it in [Vercel](https://vercel.com) (New Project).
2. Leave **Root Directory** as the repo root (do not set it to `client`).
3. Vercel will use the repo’s `vercel.json`: it builds the server, then the client, serves static files from `client/dist`, and runs the API from the `api/` folder.
4. In the Vercel project, set **Environment variables**:
   - `DATABASE_URL` — PostgreSQL connection string (e.g. [Neon](https://neon.tech)).
5. Do **not** set `VITE_API_URL`: the frontend and API are on the same domain, so the app uses relative `/api` and it works.

After deploy, the app URL (e.g. `https://your-project.vercel.app`) serves the calendar; `/api/*` is handled by the same project.

### Hosting frontend and backend separately

1. **Deploy the backend first** (e.g. [Railway](https://railway.app) or [Render](https://render.com)):
   - Create a new project, connect the repo, set **Root Directory** to `server`.
   - Build: `npm install && npm run build`.
   - Start: `npm run start` (or `node dist/index.js`).
   - Set env: `PORT` (often provided by the host), `DATABASE_URL` (e.g. from [Neon](https://neon.tech) or Railway Postgres).
   - Note the public URL (e.g. `https://calendar-api-xxx.railway.app`).

2. **Deploy the frontend on Vercel:**
   - [vercel.com](https://vercel.com) → New Project → import your Git repo.
   - **Root Directory:** set to `client` (so Vercel builds only the frontend).
   - **Build Command:** `npm run build`.
   - **Output Directory:** `dist`.
   - **Environment variables:** add `VITE_API_URL` = your backend URL from step 1 (e.g. `https://calendar-api-xxx.railway.app`) — no trailing slash.
   - Deploy. The site will call your API using `VITE_API_URL`.

3. **CORS:** The server uses `cors()` with no options, so any origin is allowed. If you want to restrict it later, set `origin` to your Vercel URL (e.g. `https://your-app.vercel.app`).

### Summary

| Setup | What to set |
|-------|-------------|
| **All on Vercel** | Only `DATABASE_URL` in Vercel env. Do not set `VITE_API_URL`. |
| **Backend elsewhere** (Railway/Render) | Backend: `PORT`, `DATABASE_URL`. Frontend (Vercel, root = `client`): `VITE_API_URL` = backend URL (no trailing slash). |

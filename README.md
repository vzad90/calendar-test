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

Copy environment file and set variables:

```bash
cp server/.env.example server/.env
# Edit server/.env: PORT, MONGODB_URI (optional for basic run)
```

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

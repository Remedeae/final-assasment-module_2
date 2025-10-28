# Game Time Tracker (Express + Prisma + React + Vite)

A small full‑stack app to register users, simulate game play sessions, and visualize stats.
Designed for backend students: clean structure, TypeScript, Express, Prisma (SQLite), Zod, CRUD, and a React UI.

> 1 real second = 1 simulated minute when timing games.

## Tech
- Server: TypeScript, Express, Prisma (SQLite), Multer (uploads), Zod, CORS
- Client: React + Vite + TypeScript, React Router, TailwindCSS, Recharts
- Linting: ESLint
- DB: SQLite (file `dev.db` in `server/prisma`)

## Quick start

### 1) Install deps
```bash
# in root
npm run setup
```

### 2) Prepare database
```bash
# from root or ./server
npm run db:reset
```

### 3) Run dev (concurrently)
```bash
npm run dev
```

- Server: http://localhost:4000
- Client: http://localhost:5173

If ports are used, adjust in configs.

### Build
```bash
# build client
npm run build:client
# start server (serves API + static uploads)
npm run start:server
```

## Environment
No .env needed. Change ports in `server/src/config.ts` and client `vite.config.ts` proxy if needed.

## Notes
- Images are stored on disk (`server/uploads/`) and path saved in DB.
- 8 demo users + 4 games are seeded.
- Timer: navigate to **Choose Game** → pick a game → **Play** page → start/stop.
- Statistics page shows: Bar, Scatter (dots), and Line charts plus a 4-week leaderboard.

TeeFlow

Full-stack TeeFlow demo (Next.js frontend, Express backend, SQLite DB).

Quick start

1. Backend

```bash
cd server
npm install
node db/seed.js   # creates db/teeflow.db with sample data
node index.js     # runs server on http://localhost:3001
```

2. Frontend

```bash
cd frontend
npm install
npm run dev       # runs Next.js on http://localhost:3000
```

Pages
- Dashboard: `/` 
- Orders: `/orders`
- Inventory: `/inventory`
- Garments: `/garments`
- Import Orders: `/import`
- Production: `/production`

API (backend)
- `GET /api/orders`
- `POST /api/orders`
- `PUT /api/orders/:id`
- `DELETE /api/orders/:id`
- `GET /api/inventory`
- `GET /api/garments`
- `POST /api/import` (CSV upload)

This repo is scaffolded for a demo-ready presentation: seed the DB then run frontend + backend.

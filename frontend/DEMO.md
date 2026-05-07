# TeeFlow Demo Guide

## Start the app

Backend (API):

```bash
# from project root
node server/index.js
```

Frontend (Next.js):

```bash
# from project root
npm --prefix frontend install
npm --prefix frontend run dev
```

## Local URLs

- Frontend app: http://localhost:3000
- Backend API: http://localhost:3001
  - Dashboard: http://localhost:3001/api/dashboard
  - Orders: http://localhost:3001/api/orders
  - CSV import (file): POST http://localhost:3001/api/import
  - CSV import (pasted text): POST http://localhost:3001/api/import-text

## 2-minute demo walkthrough

0:00–0:15 — Open the app at `http://localhost:3000` and show the Dashboard summary cards: **Total Orders**, **Pending**, **Completed**, **Low Stock**.

0:15–0:45 — Click **Orders**. Show the orders table and actions: Start (In Production), Complete, Delete. Add a new order using the form (select a variant).

0:45–1:00 — Show **Inventory** and **Garments** pages. Point out variant-level inventory and sample garment models: Comfort Colors 1717, Gildan 5000, Bella Canvas 3001.

1:00–1:30 — Go to **Import**. Paste the example CSV or upload a CSV file, click Import. A green toast will confirm "Orders imported successfully." The app will redirect to **Orders** and the new rows appear. Dashboard counts update.

1:30–1:50 — Open **Production** to show aggregated quantities needed per garment/color/size for pending or in-production orders.

1:50–2:00 — Closing: summarize benefits and next steps (integrations, reporting, barcode scanning).

## Sample CSV format (header row expected, case-insensitive)

Example header and a row:

```
orderId,customerName,designId,garmentModel,color,size,quantity,status
1006,Frank Hill,D-900,Comfort Colors 1717,Black,M,1,Pending
```

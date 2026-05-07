const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_DIR = path.join(__dirname);
const DB_PATH = path.join(DB_DIR, 'teeflow.db');

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);

const db = new Database(DB_PATH);

db.exec(`
PRAGMA foreign_keys = ON;
CREATE TABLE garments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  brand TEXT,
  description TEXT
);

CREATE TABLE variants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  garment_id INTEGER NOT NULL,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  minimum_stock INTEGER DEFAULT 1,
  FOREIGN KEY (garment_id) REFERENCES garments(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT,
  customer_name TEXT,
  design_id TEXT,
  variant_id INTEGER,
  quantity INTEGER DEFAULT 1,
  status TEXT DEFAULT 'Pending',
  order_date TEXT,
  FOREIGN KEY (variant_id) REFERENCES variants(id)
);

`);

const insertGarment = db.prepare('INSERT INTO garments (name, brand, description) VALUES (?,?,?)');
const insertVariant = db.prepare('INSERT INTO variants (garment_id, color, size, quantity, minimum_stock) VALUES (?,?,?,?,?)');
const insertOrder = db.prepare('INSERT INTO orders (order_id, customer_name, design_id, variant_id, quantity, status, order_date) VALUES (?,?,?,?,?,?,?)');

// Garments
const g1 = insertGarment.run('Comfort Colors 1717', 'Comfort Colors', 'Heavyweight T-shirt').lastInsertRowid;
const g2 = insertGarment.run('Gildan 5000', 'Gildan', 'Classic cotton tee').lastInsertRowid;
const g3 = insertGarment.run('Bella Canvas 3001', 'Bella Canvas', 'Soft premium tee').lastInsertRowid;

// Variants (some sample inventory)
const v = [];
v.push(insertVariant.run(g1, 'Black', 'M', 25, 5).lastInsertRowid);
v.push(insertVariant.run(g1, 'White', 'L', 3, 5).lastInsertRowid);
v.push(insertVariant.run(g1, 'Red', 'S', 5, 2).lastInsertRowid);
v.push(insertVariant.run(g2, 'White', 'L', 10, 3).lastInsertRowid);
v.push(insertVariant.run(g2, 'Navy', 'XL', 0, 2).lastInsertRowid);
v.push(insertVariant.run(g3, 'Black', 'M', 7, 3).lastInsertRowid);

// Orders (sample data)
insertOrder.run('1001', 'Alice Johnson', 'D-101', v[0], 1, 'Pending', '2026-05-01');
insertOrder.run('1002', 'Bob Smith', 'D-205', v[3], 2, 'Completed', '2026-04-28');
insertOrder.run('1003', 'Carol Lee', 'D-101', v[2], 1, 'Pending', '2026-05-03');
insertOrder.run('1004', 'Dave Kim', 'D-333', v[4], 1, 'Pending', '2026-05-04');
insertOrder.run('1005', 'Eve Torres', 'D-500', v[5], 3, 'In Production', '2026-05-05');

console.log('Seeded database at', DB_PATH);

const express = require('express');
const cors = require('cors');
const path = require('path');
let Database;
try { Database = require('better-sqlite3'); } catch (e) { Database = null; }
const multer = require('multer');
const fs = require('fs');
const { parse } = require('csv-parse/sync');

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db', 'teeflow.db');
const SAMPLE_PATH = path.join(__dirname, 'db', 'sample-data.json');

let useJson = false;
let jsonDb = null;
let db = null;
if (Database && fs.existsSync(DB_PATH)) {
  try {
    db = new Database(DB_PATH);
  } catch (e) { db = null; }
}
if (!db) {
  // fallback to JSON sample data
  useJson = true;
  jsonDb = JSON.parse(fs.readFileSync(SAMPLE_PATH));
}

function getOrders() {
  if (!useJson) {
    return db.prepare(`SELECT o.id, o.order_id, o.customer_name, o.design_id, g.name as garment_model, v.color, v.size, o.quantity, o.status, o.order_date
      FROM orders o
      LEFT JOIN variants v ON o.variant_id = v.id
      LEFT JOIN garments g ON v.garment_id = g.id
      ORDER BY o.id DESC`).all();
  }
  // map json orders to join variant & garment
  return jsonDb.orders.slice().reverse().map(o => {
    const v = jsonDb.variants.find(x=>x.id===o.variant_id) || {};
    const g = jsonDb.garments.find(x=>x.id===v.garment_id) || {};
    return { ...o, color: v.color, size: v.size, garment_model: g.name };
  });
}

app.get('/api/orders', (req, res) => { res.json(getOrders()); });

app.post('/api/orders', (req, res) => {
  const { order_id, customer_name, design_id, variant_id, quantity, status, order_date } = req.body;
  if (!useJson) {
    const stmt = db.prepare('INSERT INTO orders (order_id, customer_name, design_id, variant_id, quantity, status, order_date) VALUES (?,?,?,?,?,?,?)');
    const info = stmt.run(order_id, customer_name, design_id, variant_id, quantity, status || 'Pending', order_date || new Date().toISOString());
    return res.json({ id: info.lastInsertRowid });
  }
  const id = (jsonDb.orders.reduce((m,x)=>Math.max(m,x.id),0)||0)+1;
  const o = { id, order_id: order_id||'', customer_name: customer_name||'', design_id: design_id||'', variant_id: variant_id||null, quantity: quantity||1, status: status||'Pending', order_date: order_date||new Date().toISOString() };
  jsonDb.orders.push(o);
  fs.writeFileSync(SAMPLE_PATH, JSON.stringify(jsonDb, null, 2));
  res.json({ id });
});

app.put('/api/orders/:id', (req, res) => {
  const id = Number(req.params.id);
  const { order_id, customer_name, design_id, variant_id, quantity, status } = req.body;
  if (!useJson) {
    const stmt = db.prepare('UPDATE orders SET order_id=?, customer_name=?, design_id=?, variant_id=?, quantity=?, status=? WHERE id=?');
    stmt.run(order_id, customer_name, design_id, variant_id, quantity, status, id);
    return res.json({ ok: true });
  }
  const idx = jsonDb.orders.findIndex(x=>x.id===id);
  if (idx===-1) return res.status(404).json({ error: 'not found' });
  jsonDb.orders[idx] = { ...jsonDb.orders[idx], order_id, customer_name, design_id, variant_id, quantity, status };
  fs.writeFileSync(SAMPLE_PATH, JSON.stringify(jsonDb, null, 2));
  res.json({ ok: true });
});

app.delete('/api/orders/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!useJson) { db.prepare('DELETE FROM orders WHERE id=?').run(id); return res.json({ ok: true }); }
  jsonDb.orders = jsonDb.orders.filter(x=>x.id!==id);
  fs.writeFileSync(SAMPLE_PATH, JSON.stringify(jsonDb, null, 2));
  res.json({ ok: true });
});

app.get('/api/inventory', (req, res) => {
  if (!useJson) {
    const rows = db.prepare(`SELECT v.id, g.name as garment_model, v.color, v.size, v.quantity, v.minimum_stock
      FROM variants v
      LEFT JOIN garments g ON v.garment_id = g.id
      ORDER BY g.name, v.color, v.size`).all();
    return res.json(rows);
  }
  const rows = jsonDb.variants.map(v=>({ id:v.id, garment_model:(jsonDb.garments.find(g=>g.id===v.garment_id)||{}).name, color:v.color, size:v.size, quantity:v.quantity, minimum_stock:v.minimum_stock}));
  res.json(rows);
});

app.get('/api/garments', (req, res) => { if (!useJson) { const rows = db.prepare('SELECT * FROM garments ORDER BY name').all(); return res.json(rows); } res.json(jsonDb.garments); });

// CSV import
const upload = multer({ dest: path.join(__dirname, 'tmp') });
function normalizeRecord(r){
  // normalize keys to: order_id, customer_name, design_id, garment_model, color, size, quantity, status, order_date
  const out = {};
  for (const k of Object.keys(r)){
    const lk = k.trim().toLowerCase();
    const v = r[k];
    if (lk === 'orderid' || lk === 'order_id' || lk === 'order id') out.order_id = v;
    else if (lk === 'customername' || lk === 'customer_name' || lk === 'customer name') out.customer_name = v;
    else if (lk === 'designid' || lk === 'design_id' || lk === 'design id') out.design_id = v;
    else if (lk === 'garmentmodel' || lk === 'garment_model' || lk === 'garment model' || lk==='garment') out.garment_model = v;
    else if (lk === 'color') out.color = v;
    else if (lk === 'size') out.size = v;
    else if (lk === 'quantity' || lk==='qty') out.quantity = v;
    else if (lk === 'status') out.status = v;
    else if (lk === 'order_date' || lk==='orderdate' || lk==='order date') out.order_date = v;
  }
  return out;
}

app.post('/api/import', upload.single('file'), (req, res) => {
  try {
    const csv = fs.readFileSync(req.file.path);
    const records = parse(csv, { columns: true, skip_empty_lines: true });
    const inserted = [];
    if (!useJson) {
      const insert = db.prepare('INSERT INTO orders (order_id, customer_name, design_id, variant_id, quantity, status, order_date) VALUES (?,?,?,?,?,?,?)');
      const variantByKey = db.prepare('SELECT id FROM variants WHERE garment_id=(SELECT id FROM garments WHERE name=?) AND color=? AND size=?').get;
      const garmentByName = db.prepare('SELECT id FROM garments WHERE name=?').get;
      for (const r of records) {
        const n = normalizeRecord(r);
        const g = garmentByName(n.garment_model || '');
        let variantId = null;
        if (g) {
          const v = variantByKey(g.id, n.color, n.size);
          if (v) variantId = v.id;
        }
        insert.run(n.order_id || '', n.customer_name || '', n.design_id || '', variantId, Number(n.quantity) || 1, n.status || 'Pending', n.order_date || new Date().toISOString());
        inserted.push(n.order_id || '');
      }
    } else {
      for (const r of records) {
        const n = normalizeRecord(r);
        const garmentName = n.garment_model || '';
        const g = jsonDb.garments.find(x => x.name === garmentName);
        let variantId = null;
        if (g) {
          const v = jsonDb.variants.find(x => x.garment_id === g.id && x.color === n.color && x.size === n.size);
          if (v) variantId = v.id;
        }
        const id = (jsonDb.orders.reduce((m,x)=>Math.max(m,x.id),0)||0)+1;
        jsonDb.orders.push({ id, order_id: n.order_id||'', customer_name: n.customer_name||'', design_id: n.design_id||'', variant_id: variantId, quantity: Number(n.quantity)||1, status: n.status||'Pending', order_date: n.order_date||new Date().toISOString() });
        inserted.push(n.order_id||'');
      }
      fs.writeFileSync(SAMPLE_PATH, JSON.stringify(jsonDb, null, 2));
    }
    fs.unlinkSync(req.file.path);
    res.json({ imported: inserted.length });
  } catch (err) {
    console.error('Import error', err);
    res.status(500).json({ error: err.message });
  }
});

// Accept pasted CSV text (text/plain)
app.post('/api/import-text', express.text({ limit: '1mb' }), (req, res) => {
  try {
    const text = req.body || '';
    const records = parse(text, { columns: true, skip_empty_lines: true });
    const inserted = [];
    if (!useJson) {
      const insert = db.prepare('INSERT INTO orders (order_id, customer_name, design_id, variant_id, quantity, status, order_date) VALUES (?,?,?,?,?,?,?)');
      const variantByKey = db.prepare('SELECT id FROM variants WHERE garment_id=(SELECT id FROM garments WHERE name=?) AND color=? AND size=?').get;
      const garmentByName = db.prepare('SELECT id FROM garments WHERE name=?').get;
      for (const r of records) {
        const n = normalizeRecord(r);
        const g = garmentByName(n.garment_model || '');
        let variantId = null;
        if (g) {
          const v = variantByKey(g.id, n.color, n.size);
          if (v) variantId = v.id;
        }
        insert.run(n.order_id || '', n.customer_name || '', n.design_id || '', variantId, Number(n.quantity) || 1, n.status || 'Pending', n.order_date || new Date().toISOString());
        inserted.push(n.order_id || '');
      }
    } else {
      for (const r of records) {
        const n = normalizeRecord(r);
        const garmentName = n.garment_model || '';
        const g = jsonDb.garments.find(x => x.name === garmentName);
        let variantId = null;
        if (g) {
          const v = jsonDb.variants.find(x => x.garment_id === g.id && x.color === n.color && x.size === n.size);
          if (v) variantId = v.id;
        }
        const id = (jsonDb.orders.reduce((m,x)=>Math.max(m,x.id),0)||0)+1;
        jsonDb.orders.push({ id, order_id: n.order_id||'', customer_name: n.customer_name||'', design_id: n.design_id||'', variant_id: variantId, quantity: Number(n.quantity)||1, status: n.status||'Pending', order_date: n.order_date||new Date().toISOString() });
        inserted.push(n.order_id||'');
      }
      fs.writeFileSync(SAMPLE_PATH, JSON.stringify(jsonDb, null, 2));
    }
    res.json({ imported: inserted.length });
  } catch (err) {
    console.error('Import-text error', err);
    res.status(500).json({ error: err.message });
  }
});

// Production summary
app.get('/api/production', (req, res) => {
  if (!useJson) {
    const rows = db.prepare(`SELECT g.name as garment_model, v.color, v.size, SUM(o.quantity) as needed
      FROM orders o
      JOIN variants v ON o.variant_id = v.id
      JOIN garments g ON v.garment_id = g.id
      WHERE o.status='Pending' OR o.status='In Production'
      GROUP BY g.name, v.color, v.size
      ORDER BY g.name`).all();
    return res.json(rows);
  }
  const map = {};
  for (const o of jsonDb.orders) {
    if (!(o.status === 'Pending' || o.status === 'In Production')) continue;
    const v = jsonDb.variants.find(x=>x.id===o.variant_id) || {};
    const g = jsonDb.garments.find(x=>x.id===v.garment_id) || {};
    const key = `${g.name}||${v.color}||${v.size}`;
    map[key] = (map[key] || { garment_model: g.name, color: v.color, size: v.size, needed: 0 });
    map[key].needed += o.quantity;
  }
  res.json(Object.values(map));
});

// Dashboard counts
app.get('/api/dashboard', (req, res) => {
  if (!useJson) {
    const total = db.prepare('SELECT COUNT(*) as c FROM orders').get().c;
    const pending = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status='Pending'").get().c;
    const completed = db.prepare("SELECT COUNT(*) as c FROM orders WHERE status='Completed'").get().c;
    const lowStock = db.prepare('SELECT COUNT(*) as c FROM variants WHERE quantity <= minimum_stock').get().c;
    return res.json({ total, pending, completed, lowStock });
  }
  const total = jsonDb.orders.length;
  const pending = jsonDb.orders.filter(o=>o.status==='Pending').length;
  const completed = jsonDb.orders.filter(o=>o.status==='Completed').length;
  const lowStock = jsonDb.variants.filter(v=>v.quantity <= v.minimum_stock).length;
  res.json({ total, pending, completed, lowStock });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`TeeFlow API running on http://localhost:${PORT}`));

import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'

function OrderRow({ o, onDelete, onUpdate }) {
  return (
    <tr>
      <td>{o.order_id}</td>
      <td>{o.customer_name}</td>
      <td>{o.design_id}</td>
      <td>{o.garment_model}</td>
      <td>{o.color}</td>
      <td>{o.size}</td>
      <td>{o.quantity}</td>
      <td>{o.status}</td>
      <td>
        <button onClick={() => onUpdate(o.id, 'In Production')}>Start</button>
        <button onClick={() => onUpdate(o.id, 'Completed')}>Complete</button>
        <button onClick={() => onDelete(o.id)}>Delete</button>
      </td>
    </tr>
  )
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [variants, setVariants] = useState([]);
  const [form, setForm] = useState({ order_id: '', customer_name: '', design_id: '', variant_id: '', quantity: 1, status: 'Pending' });

  useEffect(() => {
    load();
    axios.get('http://localhost:3001/api/inventory').then(r => setVariants(r.data));
  }, []);

  function load() {
    axios.get('http://localhost:3001/api/orders').then(r => setOrders(r.data));
  }

  function add(e) {
    e.preventDefault();
    axios.post('http://localhost:3001/api/orders', form).then(() => { setForm({ order_id: '', customer_name: '', design_id: '', variant_id: '', quantity: 1, status: 'Pending' }); load(); });
  }

  function remove(id) { axios.delete(`http://localhost:3001/api/orders/${id}`).then(load); }

  function update(id, status) { axios.put(`http://localhost:3001/api/orders/${id}`, { ...orders.find(o => o.id===id), status }).then(load); }

  return (
    <Layout>
      <h1 className="title">Orders</h1>
      <form onSubmit={add} className="form">
        <input placeholder="Order ID" value={form.order_id} onChange={e=>setForm({...form, order_id:e.target.value})} />
        <input placeholder="Customer" value={form.customer_name} onChange={e=>setForm({...form, customer_name:e.target.value})} />
        <input placeholder="Design ID" value={form.design_id} onChange={e=>setForm({...form, design_id:e.target.value})} />
        <select value={form.variant_id} onChange={e=>setForm({...form, variant_id:e.target.value})}>
          <option value="">Select Garment / Variant</option>
          {variants.map(v=> <option key={v.id} value={v.id}>{v.garment_model} — {v.color} — {v.size} (stock: {v.quantity})</option>)}
        </select>
        <input type="number" min="1" value={form.quantity} onChange={e=>setForm({...form, quantity:Number(e.target.value)})} />
        <button type="submit">Add Order</button>
      </form>

      <table className="table">
        <thead><tr><th>Order ID</th><th>Customer</th><th>Design</th><th>Garment</th><th>Color</th><th>Size</th><th>Qty</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {orders.map(o => <OrderRow key={o.id} o={o} onDelete={remove} onUpdate={update} />)}
        </tbody>
      </table>
    </Layout>
  )
}

import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, lowStock: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/dashboard').then(r => setStats(r.data));
    axios.get('http://localhost:3001/api/orders').then(r => setRecent(r.data.slice(0,6)));
  }, []);

  return (
    <Layout>
      <h1 className="title">TeeFlow Dashboard</h1>
      <div className="cards">
        <div className="card">
          <strong>Total Orders</strong>
          <div className="big">{stats.total}</div>
        </div>
        <div className="card">
          <strong>Pending</strong>
          <div className="big">{stats.pending}</div>
        </div>
        <div className="card">
          <strong>Completed</strong>
          <div className="big">{stats.completed}</div>
        </div>
        <div className="card">
          <strong>Low Stock Items</strong>
          <div className="big">{stats.lowStock}</div>
        </div>
      </div>

      <h2 className="sub">Recent Orders</h2>
      <table className="table">
        <thead>
          <tr><th>Order ID</th><th>Customer</th><th>Design</th><th>Garment</th><th>Color</th><th>Size</th><th>Qty</th><th>Status</th></tr>
        </thead>
        <tbody>
          {recent.map(r => (
            <tr key={r.id}><td>{r.order_id}</td><td>{r.customer_name}</td><td>{r.design_id}</td><td>{r.garment_model}</td><td>{r.color}</td><td>{r.size}</td><td>{r.quantity}</td><td>{r.status}</td></tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}

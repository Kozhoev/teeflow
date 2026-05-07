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
      <div className="page-card">
        <h1 className="title">Dashboard</h1>
        <p className="subtitle">Overview of recent activity and quick stats.</p>
        <div className="cards">
          <div className="card">
            <div className="label">Total Orders</div>
            <div className="big">{stats.total}</div>
          </div>
          <div className="card">
            <div className="label">Pending Orders</div>
            <div className="big">{stats.pending}</div>
          </div>
          <div className="card">
            <div className="label">Completed Orders</div>
            <div className="big">{stats.completed}</div>
          </div>
          <div className="card">
            <div className="label">Low Stock Items</div>
            <div className="big">{stats.lowStock}</div>
          </div>
        </div>
      </div>

      <div className="page-card">
        <h2 className="title">Recent Orders</h2>
        <p className="subtitle">Latest orders placed in the system.</p>
        <table className="table">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Design</th><th>Garment</th><th>Color</th><th>Size</th><th>Qty</th><th>Status</th></tr>
          </thead>
          <tbody>
            {recent.map(r => (
              <tr key={r.id}><td>{r.order_id}</td><td>{r.customer_name}</td><td>{r.design_id}</td><td>{r.garment_model}</td><td>{r.color}</td><td>{r.size}</td><td>{r.quantity}</td><td><span className={`badge ${r.status === 'Pending' ? 'pending' : r.status === 'Completed' ? 'completed' : r.status === 'In Production' ? 'inprod' : 'cancelled'}`}>{r.status}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

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
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h1 className="title">Dashboard</h1>
            <p className="subtitle">Welcome back. Here's what's happening in your shop today.</p>
          </div>
          <div className="top-actions">
            <a href="/orders" className="btn-ghost">View all →</a>
          </div>
        </div>

        <div className="cards">
          <div className="card">
            <div className="metric">
              <div>
                <div className="label">Total Orders</div>
                <div className="big">{stats.total}</div>
              </div>
              <div className="icon" style={{background:'linear-gradient(135deg,#2563eb,#0ea5e9)'}}>⌂</div>
            </div>
          </div>
          <div className="card">
            <div className="metric">
              <div>
                <div className="label">Pending</div>
                <div className="big">{stats.pending}</div>
              </div>
              <div className="icon" style={{background:'#f59e0b'}}>⏳</div>
            </div>
          </div>
          <div className="card">
            <div className="metric">
              <div>
                <div className="label">Completed</div>
                <div className="big">{stats.completed}</div>
              </div>
              <div className="icon" style={{background:'#10b981'}}>✔</div>
            </div>
          </div>
          <div className="card">
            <div className="metric">
              <div>
                <div className="label">Low / Out</div>
                <div className="big">{stats.lowStock}</div>
              </div>
              <div className="icon" style={{background:'#ef4444'}}>!</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h2 className="title">Recent Orders</h2>
            <p className="subtitle">Latest orders placed in the system.</p>
          </div>
          <div style={{alignSelf:'flex-start'}}>
            <a href="/orders" className="btn-ghost">View all →</a>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Design</th><th>Garment</th><th>Qty</th><th>Status</th></tr>
          </thead>
          <tbody>
            {recent.map(r => (
              <tr key={r.id}><td>#{r.order_id}</td><td>{r.customer_name}</td><td>{r.design_id}</td><td>{r.garment_model} · {r.color} · {r.size}</td><td>{r.quantity}</td><td><span className={`badge ${r.status === 'Pending' ? 'pending' : r.status === 'Completed' ? 'completed' : r.status === 'In Production' ? 'inprod' : 'cancelled'}`}>{r.status}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

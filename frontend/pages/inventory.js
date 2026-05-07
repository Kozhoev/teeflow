import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(()=>{ axios.get('http://localhost:3001/api/inventory').then(r=>setItems(r.data)); }, []);

  function status(q, m){
    if (q <= 0) return 'Out of Stock';
    if (q <= m) return 'Low Stock';
    return 'In Stock';
  }

  return (
    <Layout>
      <h1 className="title">Inventory</h1>
      <table className="table">
        <thead><tr><th>Garment Model</th><th>Color</th><th>Size</th><th>Quantity</th><th>Status</th></tr></thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}><td>{i.garment_model}</td><td>{i.color}</td><td>{i.size}</td><td>{i.quantity}</td><td>{status(i.quantity, i.minimum_stock)}</td></tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}

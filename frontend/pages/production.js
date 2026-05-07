import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Production(){
  const [items, setItems] = useState([]);
  useEffect(()=>{ axios.get('http://localhost:3001/api/production').then(r=>setItems(r.data)); }, []);

  return (
    <Layout>
      <div className="page-card">
        <h1 className="title">Production</h1>
        <p className="subtitle">Items queued for production with required quantities.</p>
        <table className="table">
          <thead><tr><th>Garment Model</th><th>Color</th><th>Size</th><th>Quantity Needed</th></tr></thead>
          <tbody>
            {items.map((it, idx) => (<tr key={idx}><td>{it.garment_model}</td><td>{it.color}</td><td>{it.size}</td><td>{it.needed}</td></tr>))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

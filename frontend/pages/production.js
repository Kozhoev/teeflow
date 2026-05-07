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
        {items.length === 0 ? (
          <div className="page-card">No production items found.</div>
        ) : (
          <table className="table">
            <thead><tr><th>Garment Model</th><th>Color</th><th>Size</th><th>Quantity Needed</th></tr></thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx}>
                  <td>{it.garment_model || 'Unknown'}</td>
                  <td>{it.color || 'Unknown'}</td>
                  <td>{it.size || 'Unknown'}</td>
                  <td style={{textAlign:'right'}}>{it.needed ?? 'Unknown'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}

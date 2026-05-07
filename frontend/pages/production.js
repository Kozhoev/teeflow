import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Production(){
  const [items, setItems] = useState([]);
  useEffect(()=>{ axios.get('http://localhost:3001/api/production').then(r=>setItems(r.data)); }, []);

  return (
    <Layout>
      <h1 className="title">Production</h1>
      <table className="table">
        <thead><tr><th>Design / Garment</th><th>Color</th><th>Size</th><th>Quantity Needed</th></tr></thead>
        <tbody>
          {items.map((it, idx) => (<tr key={idx}><td>{it.garment_model}</td><td>{it.color}</td><td>{it.size}</td><td>{it.needed}</td></tr>))}
        </tbody>
      </table>
    </Layout>
  )
}

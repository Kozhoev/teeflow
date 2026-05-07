import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Garments(){
  const [garments, setGarments] = useState([]);
  useEffect(()=>{ axios.get('http://localhost:3001/api/garments').then(r=>setGarments(r.data)); }, []);
  return (
    <Layout>
      <div className="page-card">
        <h1 className="title">Garments</h1>
        <p className="subtitle">Your product catalog</p>
        <div className="garment-grid">
          {garments.map(g => (
            <div className="garment-card" key={g.id}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:48,height:48,background:'linear-gradient(135deg,#eef2ff,#c7e0ff)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>👕</div>
                <div>
                  <div style={{fontWeight:800}}>{g.name}</div>
                  <div style={{color:'var(--muted)',fontSize:13}}>{g.brand}</div>
                </div>
              </div>
              <div style={{color:'var(--muted)'}}>{g.description}</div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{color:'var(--muted)'}}>{g.variants || 1} variants</div>
                <div className="color-chips">
                  {(g.colors||[]).slice(0,4).map((c,idx)=>(<div className="chip" key={idx} style={{background:c}}/>))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

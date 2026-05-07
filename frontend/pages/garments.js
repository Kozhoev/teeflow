import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Garments(){
  const [garments, setGarments] = useState([]);
  useEffect(()=>{ axios.get('http://localhost:3001/api/garments').then(r=>setGarments(r.data)); }, []);
  return (
    <Layout>
      <h1 className="title">Garments</h1>
      <table className="table">
        <thead><tr><th>Model</th><th>Brand</th><th>Description</th></tr></thead>
        <tbody>
          {garments.map(g => (<tr key={g.id}><td>{g.name}</td><td>{g.brand}</td><td>{g.description}</td></tr>))}
        </tbody>
      </table>
    </Layout>
  )
}

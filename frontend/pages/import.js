import Layout from '../components/Layout'
import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Toast from '../components/Toast'

const SAMPLE = `orderId,customerName,designId,garmentModel,color,size,quantity,status
1006,Frank Hill,D-900,Comfort Colors 1717,Black,M,1,Pending
`;

export default function ImportPage(){
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function uploadFile(e){
    e.preventDefault();
    setMessage('');
    if (!file) return setMessage('Select a CSV file.');
    const fd = new FormData();
    fd.append('file', file);
    setLoading(true);
    try{
      const res = await axios.post('http://localhost:3001/api/import', fd, { headers: {'Content-Type':'multipart/form-data'} });
      const count = res.data.imported || 0;
      setMessage(`Imported ${count} rows`);
      setToast({ msg: 'Orders imported successfully.', type: 'success' });
      setTimeout(()=> router.push('/orders'), 800);
    } catch(err){
      const text = 'Import failed: ' + (err.response?.data?.error || err.message);
      setMessage(text);
      setToast({ msg: text, type: 'error' });
    } finally{ setLoading(false); }
  }

  async function importText(e){
    e.preventDefault();
    setMessage('');
    if (!text || text.trim().length===0) return setMessage('Paste CSV data into the textarea.');
    setLoading(true);
    try{
      const res = await axios.post('http://localhost:3001/api/import-text', text, { headers: {'Content-Type':'text/plain'} });
      const count = res.data.imported || 0;
      setMessage(`Imported ${count} rows`);
      setToast({ msg: 'Orders imported successfully.', type: 'success' });
      setTimeout(()=> router.push('/orders'), 800);
    } catch(err){
      const textErr = 'Import failed: ' + (err.response?.data?.error || err.message);
      setMessage(textErr);
      setToast({ msg: textErr, type: 'error' });
    } finally{ setLoading(false); }
  }

  return (
    <Layout>
      <h1 className="title">Import Orders</h1>

      <section className="card">
        <h3>Upload CSV File</h3>
        <form onSubmit={uploadFile} className="form">
          <input type="file" accept=".csv" onChange={e=>setFile(e.target.files[0])} />
          <button type="submit" disabled={loading}>{loading? 'Importing...':'Upload CSV'}</button>
        </form>
      </section>

      <section style={{marginTop:14}} className="card">
        <h3>Or Paste CSV</h3>
        <p>Use these column names (case-insensitive): <strong>orderId, customerName, designId, garmentModel, color, size, quantity, status</strong></p>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={SAMPLE} rows={8} style={{width:'100%', padding:8, fontFamily:'monospace'}} />
        <div style={{marginTop:8}}>
          <button onClick={importText} disabled={loading}>{loading? 'Importing...':'Import Pasted CSV'}</button>
          <button style={{marginLeft:8}} onClick={(e)=>{e.preventDefault(); setText(SAMPLE);}}>Insert Example</button>
        </div>
      </section>

      <p style={{marginTop:12}}>{message}</p>
      <div className="toast-container">{toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}</div>
    </Layout>
  )
}


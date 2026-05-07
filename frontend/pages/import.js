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
  const [toast, setToast] = useState(null);
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
      <div className="page-card" style={{maxWidth:760, margin:'0 auto'}}>
        <h1 className="title">Import Orders</h1>
        <p className="subtitle">Upload a CSV file or paste CSV text to import orders quickly.</p>

        <div style={{display:'grid', gap:12}}>
          <div className="page-card">
            <h4 style={{margin:0}}>Upload CSV File</h4>
            <form onSubmit={uploadFile} className="form" style={{marginTop:12}}>
              <input type="file" accept=".csv" onChange={e=>setFile(e.target.files[0])} />
              <button type="submit" disabled={loading}>{loading? 'Importing...':'Upload CSV'}</button>
            </form>
          </div>

          <div className="page-card">
            <h4 style={{margin:0}}>Paste CSV</h4>
            <p className="subtitle">Use these columns: <strong>orderId, customerName, designId, garmentModel, color, size, quantity, status</strong></p>
            <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={SAMPLE} rows={8} style={{width:'100%', padding:10, fontFamily:'monospace', borderRadius:8}} />
            <div style={{marginTop:10}}>
              <div className="subtitle" style={{marginBottom:6}}>Example CSV</div>
              <pre className="code-sample">{SAMPLE}</pre>
            </div>
            <div style={{marginTop:8}}>
              <button onClick={importText} disabled={loading}>{loading? 'Importing...':'Import Pasted CSV'}</button>
              <button className="btn-ghost" style={{marginLeft:8}} onClick={(e)=>{e.preventDefault(); setText(SAMPLE);}}>Insert Example</button>
            </div>
          </div>
        </div>

        {message && <p style={{marginTop:12}}>{message}</p>}
        <div className="toast-container">{toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}</div>
      </div>
    </Layout>
  )
}


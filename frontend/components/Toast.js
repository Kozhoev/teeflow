import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }){
  useEffect(()=>{
    const t = setTimeout(()=>{ onClose && onClose(); }, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast ${type}`} role="status" aria-live="polite">
      {message}
      <style jsx>{`
        .toast{ padding:10px 14px; border-radius:8px; color:#fff; box-shadow:0 6px 18px rgba(13,17,26,0.12); font-weight:600 }
        .toast.success{ background: #16a34a }
        .toast.error{ background: #dc2626 }
      `}</style>
    </div>
  )
}

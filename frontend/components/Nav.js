import Link from 'next/link'
import { useRouter } from 'next/router'

function Icon({ name }){
  const size = 16;
  switch(name){
    case 'dashboard': return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>);
    case 'orders': return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18M7 3v4M17 3v4M21 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'inventory': return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l8 4v6l-8 4-8-4V6l8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'garments': return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21c0-4 4-6 9-6s9 2 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 3v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'import': return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 21H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    case 'production': return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13h18M7 6h10M5 20h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    default: return null;
  }
}

function NavLink({ href, icon, label }){
  const router = useRouter();
  const active = router.pathname === href;
  return (
    <div className={`nav-item ${active? 'active':''}`}>
      <Link href={href} className="nav-link">
        <span className="nav-left"><Icon name={icon} /></span>
        <span className="nav-label">{label}</span>
      </Link>
      <style jsx>{`
        .nav-item{ margin:4px 0 }
        .nav-link{ display:flex; gap:10px; align-items:center; padding:10px 12px; border-radius:10px; color:inherit; text-decoration:none }
        .nav-link:hover{ background:rgba(37,99,235,0.06); color:var(--accent) }
        .nav-left{ display:inline-flex; width:20px; color:rgba(255,255,255,0.9) }
        .nav-label{ font-weight:600 }
        .nav-item.active .nav-link{ background:var(--accent); color:#fff }
      `}</style>
    </div>
  )
}

export default function Nav(){
  return (
    <nav className="sidebar-nav">
      <div className="brand">TeeFlow</div>
      <div className="subtitle">Order & Inventory</div>
      <div className="menu">
        <NavLink href="/" icon="dashboard" label="Dashboard" />
        <NavLink href="/orders" icon="orders" label="Orders" />
        <NavLink href="/inventory" icon="inventory" label="Inventory" />
        <NavLink href="/garments" icon="garments" label="Garments" />
        <NavLink href="/import" icon="import" label="Import" />
        <NavLink href="/production" icon="production" label="Production" />
      </div>
      <style jsx>{`
        .sidebar-nav{ display:flex; flex-direction:column; gap:14px; color:var(--sidebar-text) }
        .brand{ font-size:20px; font-weight:800; color:#fff }
        .subtitle{ font-size:12px; color:rgba(255,255,255,0.8); margin-bottom:6px }
        .menu{ display:flex; flex-direction:column; gap:6px }
      `}</style>
    </nav>
  )
}

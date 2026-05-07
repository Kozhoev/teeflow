import Link from 'next/link'

function NavLink({ href, children }){
  return (<div className="nav-link"><Link href={href}><a>{children}</a></Link></div>);
}

export default function Nav(){
  return (
    <nav className="sidebar-nav">
      <div className="brand">TeeFlow</div>
      <div className="menu">
        <NavLink href="/">🏠 Dashboard</NavLink>
        <NavLink href="/orders">📦 Orders</NavLink>
        <NavLink href="/inventory">🗃️ Inventory</NavLink>
        <NavLink href="/garments">👕 Garments</NavLink>
        <NavLink href="/import">⬆️ Import</NavLink>
        <NavLink href="/production">🏭 Production</NavLink>
      </div>
      <style jsx>{`
        .sidebar-nav{ display:flex; flex-direction:column; gap:18px }
        .brand{ font-size:20px; font-weight:800; color:var(--accent); padding-bottom:6px }
        .menu{ display:flex; flex-direction:column; gap:6px }
        .nav-link a{ display:block; padding:8px 10px; color:rgba(2,6,23,0.8); border-radius:8px; text-decoration:none }
        .nav-link a:hover{ background:rgba(11,92,255,0.06); color:var(--accent) }
      `}</style>
    </nav>
  )
}

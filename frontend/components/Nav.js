import Link from 'next/link'

export default function Nav(){
  return (
    <nav className="nav">
      <div className="brand">TeeFlow</div>
      <div className="links">
        <Link href="/">Dashboard</Link>
        <Link href="/orders">Orders</Link>
        <Link href="/inventory">Inventory</Link>
        <Link href="/garments">Garments</Link>
        <Link href="/import">Import</Link>
        <Link href="/production">Production</Link>
      </div>
      <style jsx>{`
        .nav{ display:flex; align-items:center; justify-content:space-between; padding:12px 20px; background:#0b5cff; color:#fff }
        .brand{ font-weight:700 }
        .links a{ margin-left:12px; color:#fff; text-decoration:none }
      `}</style>
    </nav>
  )
}

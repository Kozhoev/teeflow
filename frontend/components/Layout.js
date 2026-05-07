import Nav from './Nav'

export default function Layout({ children }){
  return (
    <div className="app">
      <aside className="sidebar">
        <Nav />
      </aside>
      <div className="main">
        <div className="content">{children}</div>
      </div>
      <style jsx>{`
        .app{ display:flex; min-height:100vh; background:var(--bg,#f8fafc) }
        .sidebar{ width:220px; padding:20px 16px; border-right:1px solid rgba(15,23,42,0.04); background:transparent }
        .main{ flex:1; display:flex; flex-direction:column }
        .topbar{ height:64px; display:flex; align-items:center; justify-content:space-between; padding:0 20px; border-bottom:1px solid rgba(15,23,42,0.04); background:transparent }
        .content{ padding:28px; max-width:1200px; width:100%; margin:0 auto }
        @media (max-width:900px){ .sidebar{ display:none } .content{ padding:16px } }
      `}</style>
    </div>
  )
}

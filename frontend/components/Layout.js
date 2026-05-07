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
        .sidebar{ width:240px; padding:28px 20px; background:var(--sidebar); color:var(--sidebar-text); position:fixed; left:0; top:0; bottom:0; box-shadow:2px 0 12px rgba(2,6,23,0.06); z-index:20 }
        .main{ margin-left:240px; flex:1; display:flex; flex-direction:column }
        .content{ padding:32px; max-width:1200px; width:100%; margin:0 auto }
        @media (max-width:900px){ .sidebar{ display:none } .content{ padding:16px } }
      `}</style>
    </div>
  )
}

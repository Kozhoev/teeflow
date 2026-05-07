import Nav from './Nav'

export default function Layout({ children }){
  return (
    <div>
      <Nav />
      <main className="container">{children}</main>
      <style jsx>{`
        .container{ max-width:1100px; margin:28px auto; padding:0 16px }
      `}</style>
    </div>
  )
}

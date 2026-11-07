import './App.css'

const base = import.meta.env.BASE_URL

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '')
  const home = base.replace(/\/+$/, '')
  const isHome = path === home || path === `${home}/index.html`

  if (!isHome) {
    return (
      <main className="not-found">
        <h1 className="sr-only">404: Página no encontrada</h1>
        <div className="error-artwork">
          <img src={`${base}images/brucatgames-404.png`} alt="Un gorila gamer perdido en el mapa. Página no encontrada." />
          <a className="artwork-home-link" href={base} aria-label="Volver al inicio" />
        </div>
      </main>
    )
  }

  return (
    <main className="welcome">
      <img className="brand-logo" src={`${base}images/brucatgames-logo.png`}
        alt="BruCat Games: gorila blanco con audífonos y un control de videojuegos" fetchPriority="high" width="1536" height="1024" />
      <section className="welcome-copy" aria-labelledby="welcome-title">
        <span className="badge">JUEGA · DESCUBRE · APRENDE</span>
        <h1 id="welcome-title">¡Tu próxima aventura empieza aquí!</h1>
        <p>Prepárate para explorar un mundo de minijuegos.</p>
        <span className="soon">Próximamente · Nuevos desafíos</span>
      </section>
    </main>
  )
}

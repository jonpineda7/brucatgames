import { useEffect, useRef, useSyncExternalStore } from 'react'
import MemoryGame from './games/MemoryGame'
import './App.css'

const base = import.meta.env.BASE_URL
const subscribe = callback => { window.addEventListener('hashchange', callback); return () => window.removeEventListener('hashchange', callback) }
const getRoute = () => window.location.hash.slice(1) || '/'

function MemoryPreview() {
  return <div className="memory-preview" aria-hidden="true">{['🚀', 'B', '🪐', 'B', '⭐', 'B'].map((icon, index) => <span className={`preview-card preview-${index}`} key={index}>{icon}</span>)}</div>
}
function GameCard() {
  return <a className="catalog-game" href="#/infantil/memoria"><div className="catalog-art"><span className="game-tag">DEMO JUGABLE</span><MemoryPreview /></div><div className="catalog-copy"><div className="game-meta"><span>MEMORIA</span><span>1 jugador</span></div><h3>Memoria Gorila</h3><p>Descubre las cartas, conecta las parejas y completa el desafío.</p><span className="catalog-play">Jugar ahora <span>↗</span></span></div></a>
}
function Home() {
  return <>
    <section className="platform-hero" aria-labelledby="home-title"><div className="hero-copy"><span className="eyebrow"><span className="live-dot" /> TU NUEVO PUNTO DE ENCUENTRO</span><h1 id="home-title">Un universo de juegos.<br /><span className="gradient-text">Tu próxima partida.</span></h1><p>Una plataforma para todos los que disfrutan jugar. Explora nuestras categorías y encuentra tu próximo desafío.</p><div className="actions"><a className="primary-button" href="#/infantil">Explorar Infantil <span>↗</span></a><a className="text-link" href="#/infantil/memoria">Probar la demo →</a></div><div className="hero-notes"><span>✦ Directo en tu navegador</span><span>✦ Sin registro</span></div></div><div className="hero-brand"><img src={`${base}images/brucatgames-logo.png`} alt="BruCat Games, gorila gamer con audífonos y control" width="1536" height="1024" fetchPriority="high" /><span className="hero-brand-caption">ENCUENTRA TU SIGUIENTE DESAFÍO</span></div></section>
    <section className="category-section" aria-labelledby="categories-title"><div className="section-heading"><div><span className="eyebrow">ELIGE TU MUNDO</span><h2 id="categories-title">Cada jugador tiene su lugar<span className="cyan">.</span></h2></div><span className="muted section-note">Estamos empezando. Esto recién comienza.</span></div><div className="category-grid"><a className="category-card category-kids" href="#/infantil"><div className="category-top"><span className="category-symbol">✦</span><span className="available-tag">DISPONIBLE</span></div><h3>Infantil</h3><p>Curiosidad, colores y pequeños grandes desafíos.</p><span className="category-bottom">1 juego para descubrir <strong>↗</strong></span></a><div className="category-card category-coming"><div className="category-top"><span className="category-symbol">◈</span><span className="coming-tag">PRÓXIMAMENTE</span></div><h3>Más formas de jugar</h3><p>La plataforma seguirá creciendo con nuevas categorías para distintos gustos y edades.</p><span className="category-bottom">El universo BruCatGames se expande</span></div></div></section>
    <section className="featured-section" aria-labelledby="featured-title"><div className="section-heading"><div><span className="eyebrow">TU PRIMERA PARTIDA</span><h2 id="featured-title">Empieza con una buena pareja</h2></div><a className="text-link" href="#/infantil">Ver Infantil →</a></div><div className="featured-layout"><GameCard /><div className="featured-note"><span className="note-number">01</span><h3>Pequeño juego.<br />Grandes descubrimientos.</h3><p>Nuestra primera demo abre las puertas de Infantil. Seis parejas, un tablero y toda la curiosidad para encontrarlas.</p><span className="pill">Sin tiempo límite</span><span className="pill">Para jugar a tu ritmo</span></div></div></section>
  </>
}
function Kids() {
  return <section aria-labelledby="kids-title"><div className="category-banner"><div><span className="eyebrow">CATEGORÍA / INFANTIL</span><h1 id="kids-title">Pequeños jugadores.<br /><span className="gradient-text">Grandes aventuras.</span></h1><p>Un espacio para explorar, descubrir y divertirse sin prisa.</p></div><span className="category-banner-icon" aria-hidden="true">✦</span></div><div className="section-heading"><h2>Elige tu primera aventura</h2><span className="pill">1 juego disponible</span></div><div className="kids-catalog"><GameCard /><div className="next-game"><span aria-hidden="true">＋</span><h3>La aventura continúa</h3><p>Pronto habrá más juegos por descubrir en esta categoría.</p></div></div></section>
}
function NotFound() {
  return <main className="not-found"><h1 className="sr-only">404: Página no encontrada</h1><div className="error-artwork"><img src={`${base}images/brucatgames-404.png`} alt="Un gorila gamer perdido en el mapa. Página no encontrada." /><a className="artwork-home-link" href={base} aria-label="Volver al inicio" /></div></main>
}
export default function App() {
  const route = useSyncExternalStore(subscribe, getRoute)
  const main = useRef(null)
  const firstRender = useRef(true)
  useEffect(() => {
    document.title = `${route === '/infantil/memoria' ? 'Memoria Gorila' : route === '/infantil' ? 'Infantil' : 'Juegos para todos'} · BruCatGames`
    if (firstRender.current) { firstRender.current = false; return }
    window.scrollTo(0, 0)
    main.current?.focus({ preventScroll: true })
  }, [route])
  const path = window.location.pathname.replace(/\/+$/, '')
  const home = base.replace(/\/+$/, '')
  if (![home, `${home}/index.html`].includes(path) || !['/', '/infantil', '/infantil/memoria'].includes(route)) return <NotFound />
  return <div className="platform-shell"><a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); main.current?.focus() }}>Saltar al contenido</a><header className="platform-header"><a className="wordmark" href="#/" aria-label="BruCatGames, inicio"><span className="brand-emblem" aria-hidden="true">B<span>✦</span></span><span>BruCat<span className="cyan">Games</span><small>EL JUEGO NOS CONECTA</small></span></a><nav aria-label="Navegación principal"><a href="#/" aria-current={route === '/' ? 'page' : undefined}>Inicio</a><a href="#/infantil" aria-current={route.startsWith('/infantil') ? 'page' : undefined}>Infantil <span className="nav-count">01</span></a></nav><span className="header-label"><span className="live-dot" /> MODO EXPLORAR</span></header><main id="main-content" ref={main} tabIndex={-1} className="platform-main">{route === '/' ? <Home /> : route === '/infantil' ? <Kids /> : <MemoryGame />}</main><footer className="platform-footer"><span>BruCat<span className="cyan">Games</span> <span className="muted">· Un lugar para cada jugador.</span></span><a href="#/">Volver al inicio ↑</a></footer></div>
}

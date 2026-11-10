import { lazy, Suspense, useEffect, useRef, useSyncExternalStore } from 'react'
import MemoryGame from './games/MemoryGame'
import GorilaLoco from './games/gorila-loco/GorilaLoco'
import ConectaColores from './games/conecta-colores/ConectaColores'
import CategoryView from './categories/CategoryView'
import Home from './home/Home.jsx'
import { availableCategories,availableGames,allAvailableGames,isAvailableRoute } from './catalog/catalog.js'
import { revealSection,returnToTop } from './home/navigation.js'
import './App.css'

const MathAdventure = lazy(() => import('./games/math-adventure/MathAdventure'))
const DetectiveBruCat = lazy(() => import('./games/detective/DetectiveBruCat'))
const LaUltimaMordida = lazy(() => import('./games/ultima-mordida/LaUltimaMordida'))
const base = import.meta.env.BASE_URL
const gameViews={memory:MemoryGame,'gorila-loco':GorilaLoco,'conecta-colores':ConectaColores,'ultima-mordida':LaUltimaMordida,detective:DetectiveBruCat,math:MathAdventure}
const subscribe = callback => { window.addEventListener('hashchange', callback); return () => window.removeEventListener('hashchange', callback) }
const getRoute = () => window.location.hash.slice(1) || '/'

function NotFound() {
  return <main className="not-found"><h1 className="sr-only">404: Página no encontrada</h1><div className="error-artwork"><img src={`${base}images/brucatgames-404.png`} alt="Un gorila gamer perdido en el mapa. Página no encontrada." /><a className="artwork-home-link" href={base} aria-label="Volver al inicio" /></div></main>
}
export default function App() {
  const route = useSyncExternalStore(subscribe, getRoute)
  const categories=availableCategories(),category=categories.find(item=>item.href.slice(1)===route),game=allAvailableGames().find(item=>item.href.slice(1)===route),Game=game?gameViews[game.id]:null
  const title=category?.name||game?.title||'Juegos para todos'
  const main = useRef(null)
  const firstRender = useRef(true)
  useEffect(() => {
    document.title = `${title} · BruCatGames`
    if (firstRender.current) { firstRender.current = false; return }
    window.scrollTo(0, 0)
    main.current?.focus({ preventScroll: true })
  }, [route,title])
  const path = window.location.pathname.replace(/\/+$/, '')
  const home = base.replace(/\/+$/, '')
  if (![home, `${home}/index.html`].includes(path) || !isAvailableRoute(route) || (game&&!Game)) return <NotFound />
  return <div className={`platform-shell ${category ? 'category-shell' : route==='/'?'home-shell':''}`}><a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); revealSection(main.current) }}>Saltar al contenido</a><header className="platform-header"><a className="wordmark" href="#/" aria-label="BruCatGames, inicio"><img className="brand-emblem" src={`${base}brand/gorilla-icon-96.png`} width="96" height="96" alt=""/><span>BruCat<span className="cyan">Games</span><small>EL JUEGO NOS CONECTA</small></span></a><nav aria-label="Navegación principal"><a href="#/" aria-current={route === '/' ? 'page' : undefined}>Inicio</a>{categories.map(item=><a key={item.id} href={item.href} aria-current={category?.id===item.id||game?.categoryId===item.id?'page':undefined}>{item.name} <span className="nav-count">{String(availableGames(item.id).length).padStart(2,'0')}</span></a>)}</nav><span className="header-label"><span className="live-dot" /> MODO EXPLORAR</span></header><main id="main-content" ref={main} tabIndex={-1} className="platform-main">{route==='/'?<Home/>:category?<CategoryView categoryId={category.id}/>:Game?<Suspense fallback={<p role="status">Preparando {game.title}…</p>}><Game/></Suspense>:<NotFound/>}</main><footer className="platform-footer"><span>BruCat<span className="cyan">Games</span> <span className="muted">· Un lugar para cada jugador.</span></span>{route==='/'?<button type="button" className="footer-top" onClick={()=>returnToTop(main.current)}>Subir al inicio ↑</button>:<a href="#/">Volver al inicio</a>}</footer></div>
}

import { useRef } from 'react'
import { CATALOG,featuredGames,availableGames } from '../catalog/catalog.js'
import { CategoryCard,FeaturedGameCard } from './CatalogCards.jsx'
import { revealSection } from './navigation.js'
import './Home.css'
const base=import.meta.env.BASE_URL
// Immutable brand composition restored from Git; not part of category artwork.
const HERO_BRAND_IMAGE='images/brand/brucatgames-hero-original.png'
export default function Home(){
 const gamesTitle=useRef(null),featured=featuredGames(),memory=availableGames().find(game=>game.id==='memory')
 return <div className="discovery-home">
  <section className="platform-hero home-brand-hero" aria-labelledby="home-title"><div className="hero-copy"><span className="eyebrow"><span className="live-dot"/> TU NUEVO PUNTO DE ENCUENTRO</span><h1 id="home-title">Un universo de juegos.<br/><span className="gradient-text">Tu próxima partida.</span></h1><p>Juegos para aprender, pensar y superar nuevos desafíos. Directo en tu navegador.</p><div className="actions"><button type="button" className="primary-button" aria-controls="home-games" onClick={()=>revealSection(gamesTitle.current)}>Explorar juegos <span aria-hidden="true">↓</span></button>{memory&&<a className="text-link" href={memory.href}>Jugar Memoria <span aria-hidden="true">↗</span></a>}</div><div className="hero-notes"><span>✦ Directo en tu navegador</span><span>✦ Sin registro</span></div></div><div className="hero-brand"><img src={`${base}${HERO_BRAND_IMAGE}`} alt="BruCat Games: gorila albino con audífonos gamer, control y logotipo BRUCAT GAMES" width="1536" height="1024" fetchPriority="high" decoding="async"/><span className="hero-brand-caption">ENCUENTRA TU SIGUIENTE DESAFÍO</span></div></section>
  <section className="home-categories" aria-labelledby="home-categories-title"><div className="home-section-heading"><div><span className="eyebrow">ELIGE TU MUNDO</span><h2 id="home-categories-title">Una forma de jugar para ti.</h2></div><span className="home-section-note">A tu ritmo, desde tu navegador.</span></div><div className="home-category-grid">{CATALOG.categories.map(category=><CategoryCard key={category.id} category={category}/>)}</div></section>
  <section id="home-games" className="home-games" aria-labelledby="home-games-title"><div className="home-section-heading"><div><span className="eyebrow">DISPONIBLES PARA JUGAR</span><h2 id="home-games-title" ref={gamesTitle} tabIndex={-1}>Elige tu próxima partida</h2></div><a className="text-link" href="#/infantil">Ver todos los juegos infantiles <span aria-hidden="true">→</span></a></div><div className="home-featured-grid">{featured.map(game=><FeaturedGameCard key={game.id} game={game}/>)}</div></section>
 </div>
}

import { CATALOG, availableGames } from '../catalog/catalog.js'
import './CategoryView.css'

const base = import.meta.env.BASE_URL

function CategoryTile({ game, index }) {
  const content = <>
    <div className="neon-tile-heading"><span className="tile-number">{index + 1}</span><h2>{game.title}</h2></div>
    <div className={`neon-tile-art art-${game.id}`} aria-hidden="true"><img className="game-cover" src={`${base}images/game-covers/${game.image}`} alt="" width="512" height="512" loading="lazy" decoding="async" draggable={false} /></div>
    <p>{game.text}{game.age && <small className="game-age">Infantil · {game.age}</small>}</p>
    <span className="tile-skill">{game.skill}</span>
    <span className={`tile-availability ${game.href ? 'tile-play' : ''}`}>{game.href ? 'Jugar ahora ↗' : 'Próximamente'}</span>
  </>
  return game.href
    ? <a className={`neon-game-tile neon-${game.color}`} href={game.href} aria-label={`Jugar ${game.title}`}>{content}</a>
    : <article className={`neon-game-tile neon-${game.color} tile-upcoming`} aria-label={`${game.title}, próximamente`}>{content}</article>
}

export default function CategoryView({ categoryId = 'infantil' }) {
  const category = CATALOG.categories.find(item=>item.id===categoryId)
  if (!category || category.status!=='available') return null
  const games=availableGames(categoryId),available=games.length
  return (
    <section className="neon-category" aria-labelledby="category-heading">
      <aside className="category-mascot" aria-label="BruCatGames">
        <img className="category-brand-art" src={`${base}images/brucatgames-logo.png`} alt="BruCat Games" width="1536" height="1024" />
        <img className="category-gorilla" src={`${base}images/categories/gorilla-playing.png`} alt="Gorila de BruCatGames jugando con un control y audífonos" width="1109" height="1419" />
        <span className="mascot-message">¡Tu próxima<br /><strong>aventura te espera!</strong></span>
        <a className="category-back" href="#/">← Volver al inicio</a>
      </aside>
      <div className="category-catalog">
        <header className="neon-category-header">
          <div><span className="eyebrow">EXPLORA · DESCUBRE · JUEGA</span><h1 id="category-heading">{category.title}</h1><p>{category.catalogDescription}</p></div>
          <span className="neon-category-badge"><span aria-hidden="true">🎮</span> Categoría: {category.name}</span>
        </header>
        <div className="category-catalog-status"><span><i className="live-dot" /> {available} {available === 1 ? 'juego disponible' : 'juegos disponibles'}</span><span>Más aventuras en preparación</span></div>
        <div className="neon-games-grid">
          {games.map((game, index) => <CategoryTile key={game.id} game={game} index={index} />)}
        </div>
        <p className="category-roadmap-note">{available} {available===1?'aventura lista':'aventuras listas'} para jugar. ¡Elige tu favorita!</p>
      </div>
    </section>
  )
}

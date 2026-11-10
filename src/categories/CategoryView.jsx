import './CategoryView.css'

const base = import.meta.env.BASE_URL
const kidsGames = [
  { id: 'memory', image: 'memoria-gorila.png', title: 'Memoria Gorila', text: 'Encuentra los pares y entrena tu memoria.', skill: 'Memoria y atención', color: 'violet', href: '#/infantil/memoria' },
  { id: 'gorila-loco', image: 'gorila-loco.png', title: 'Gorila Loco', text: 'Atrapa animales, evita trampas y supera tu récord.', skill: 'Reflejos y coordinación', color: 'green', href: '#/infantil/gorila-loco', age: '4–10 años' },
  { id: 'conecta-colores', image: 'conecta-los-colores.png', title: 'Conecta los Colores', text: 'Une las parejas sin cruzar caminos. 30 niveles para explorar.', skill: 'Lógica · Fácil a difícil', color: 'pink', href: '#/infantil/conecta-colores', age: '4–10 años' },
  { id: 'ultima-mordida', image: 'la-ultima-mordida.png', title: 'La Última Mordida', text: 'Lee las pistas, reparte los platos y pulsa «¡A comer!».', skill: 'Deducción y estrategia', color: 'gold', href: '#/infantil/ultima-mordida', age: '6–10 años' },
  { id: 'detective', image: 'detective-brucat.png', title: 'Detective BruCat', text: 'Explora cinco capítulos y resuelve quince misterios con BruCat.', skill: 'Observación y lógica', color: 'blue', href: '#/infantil/detective', age: '5–10 años' },
  { id: 'math', image: 'brucat-math-adventure.png', title: 'BruCat Math Adventure', text: 'Explora diez zonas y abre caminos con sumas, restas, multiplicaciones y divisiones.', skill: 'Matemáticas y aventura', color: 'green', href: '#/infantil/math-adventure', age: '5–12 años' },

]

const categories = {
  infantil: { name: 'Infantil', title: '¡Un mundo de aventuras!', description: 'Elige tu juego, despierta tu curiosidad y diviértete a tu ritmo.', games: kidsGames },
}

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
  const category = categories[categoryId]
  if (!category) return null
  const available = category.games.filter(game => game.href).length
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
          <div><span className="eyebrow">EXPLORA · DESCUBRE · JUEGA</span><h1 id="category-heading">{category.title}</h1><p>{category.description}</p></div>
          <span className="neon-category-badge"><span aria-hidden="true">🎮</span> Categoría: {category.name}</span>
        </header>
        <div className="category-catalog-status"><span><i className="live-dot" /> {available} {available === 1 ? 'juego disponible' : 'juegos disponibles'}</span><span>Más aventuras en preparación</span></div>
        <div className="neon-games-grid">
          {category.games.map((game, index) => <CategoryTile key={game.id} game={game} index={index} />)}
        </div>
        <p className="category-roadmap-note">Seis aventuras listas para jugar. ¡Elige tu favorita!</p>
      </div>
    </section>
  )
}

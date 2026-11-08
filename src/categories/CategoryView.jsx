import './CategoryView.css'
import { GuestArt, DishArt } from '../games/ultima-mordida/BanquetArt'
import { CHARACTERS, MENUS } from '../games/ultima-mordida/data'

const base = import.meta.env.BASE_URL
const kidsGames = [
  { id: 'memory', title: 'Memoria Gorila', text: 'Encuentra los pares y entrena tu memoria.', skill: 'Memoria y atención', color: 'violet', href: '#/infantil/memoria' },
  { id: 'gorila-loco', title: 'Gorila Loco', text: 'Atrapa animales, evita trampas y supera tu récord.', skill: 'Reflejos y coordinación', color: 'green', href: '#/infantil/gorila-loco', age: '4–10 años' },
  { id: 'conecta-colores', title: 'Conecta los Colores', text: 'Une las parejas sin cruzar caminos. 30 niveles para explorar.', skill: 'Lógica · Fácil a difícil', color: 'pink', href: '#/infantil/conecta-colores', age: '4–10 años' },
  { id: 'ultima-mordida', title: 'La Última Mordida', text: 'Sigue las pistas y sirve un banquete lleno de magia. 20 misterios.', skill: 'Deducción y estrategia', color: 'gold', href: '#/infantil/ultima-mordida', age: '6–10 años' },
  { id: 'puzzle', title: 'Rompecabezas BruCat', text: 'Arma imágenes divertidas, pieza por pieza.', skill: 'Lógica y motricidad', color: 'blue' },
  { id: 'math', title: 'Aventura Matemática', text: 'Resuelve desafíos y descubre nuevos caminos.', skill: 'Matemáticas', color: 'green' },
  { id: 'words', title: 'Sopa de Letras', text: 'Explora el tablero y encuentra las palabras.', skill: 'Vocabulario', color: 'orange' },
  { id: 'trivia', title: 'Trivia Espacial', text: 'Descubre curiosidades sobre ciencias y espacio.', skill: 'Ciencias', color: 'violet' },
  { id: 'color', title: 'Colorea BruCat', text: 'Dale tu toque de color al universo BruCat.', skill: 'Creatividad', color: 'teal' },
  { id: 'story', title: 'Ordena la Historia', text: 'Ordena las escenas y descubre qué sucede.', skill: 'Comprensión lectora', color: 'pink' },
  { id: 'maze', title: 'Laberintos de Aventuras', text: 'Encuentra el camino y llega hasta la meta.', skill: 'Orientación y lógica', color: 'blue' },
  { id: 'detective', title: 'Detective BruCat', text: 'Observa los detalles y sigue las pistas.', skill: 'Observación', color: 'gold' },
  { id: 'fruit', title: 'Atrapa las Frutas', text: 'Atrapa frutas y pon a prueba tus reflejos.', skill: 'Reflejos y coordinación', color: 'red' },
]

const categories = {
  infantil: { name: 'Infantil', title: '¡Un mundo de aventuras!', description: 'Elige tu juego, despierta tu curiosidad y diviértete a tu ritmo.', games: kidsGames },
}

function Character({ name = 'turtle', className = '' }) {
  return <img className={className} src={`${base}images/memory/${name}.png`} alt="" loading="lazy" draggable={false} />
}

function GameArtwork({ kind }) {
  switch (kind) {
    case 'memory':
      return <div className="tile-memory">{['turtle', null, 'turtle', null].map((name, index) => <span key={index}>{name ? <Character name={name} /> : '♛'}</span>)}</div>
    case 'gorila-loco':
      return <img src={`${base}images/categories/gorilla-playing.png`} alt="" loading="lazy" />
    case 'conecta-colores':
      return <svg className="tile-connect" viewBox="0 0 210 180" fill="none"><rect x="15" y="10" width="180" height="160" rx="18" fill="#15132c" stroke="#8972b5"/><path d="M30 50H180M30 90H180M30 130H180M60 25V155M105 25V155M150 25V155" stroke="#7970a344"/><path d="M38 35H128V75H173M38 75V145H83V115H173" stroke="#69dfff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M38 35H128V75H173" stroke="#ff9c9b" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>{[[38,35,'#ff9c9b','♥'],[173,75,'#ff9c9b','♥'],[38,75,'#69dfff','◆'],[173,115,'#69dfff','◆']].map(([x,y,color,symbol],index)=><g key={index}><circle cx={x} cy={y} r="14" fill={color}/><text x={x} y={y+5} fill="#17142b" fontSize="15" textAnchor="middle">{symbol}</text></g>)}</svg>
    case 'ultima-mordida':
      return <div className="tile-banquet"><GuestArt character={CHARACTERS[4]} /><DishArt dish={MENUS.castle[0]} /><span>✦ ? ✦</span></div>
    case 'puzzle':
      return <div className="tile-puzzle"><Character name="hatter" /><div className="puzzle-lines" /><span>✚</span></div>
    case 'math':
      return <div className="tile-math"><span className="art-leaf">✦</span><div>{['5', '+', '3', '=', '?'].map((value, index) => <span key={index}>{value}</span>)}</div><span className="art-gem">◆</span></div>
    case 'words':
      return <div className="tile-words">{'ABJUEGGORILAPLANETCOFETE'.split('').map((letter, index) => <span className={index >= 6 && index <= 11 ? 'word-found' : ''} key={index}>{letter}</span>)}<span className="word-glass">⌕</span></div>
    case 'trivia':
      return <div className="tile-trivia"><span className="trivia-planet">🪐</span><strong>?</strong><span className="trivia-rocket">🚀</span><i>✦</i></div>
    case 'color':
      return <div className="tile-color"><div className="color-page"><Character name="llama" /></div><div className="crayons"><i /><i /><i /></div></div>
    case 'story':
      return <div className="tile-story">{['☀', '☁', '☾'].map((symbol, index) => <div key={symbol}><span>{symbol}<i /></span><b>{index + 1}</b></div>)}</div>
    case 'maze':
      return <svg className="tile-maze" viewBox="0 0 200 160" fill="none"><path d="M12 12H188V148H12V12ZM12 46H80V80H46V114H112V80H150V46H188M46 12V26H112V46M12 80H28M80 148V130M112 114H170V148M150 12V28M188 80H170V100M80 46V28M46 148V130" stroke="currentColor" strokeWidth="9" strokeLinejoin="round" /><text x="125" y="136" fontSize="24">♛</text><text x="155" y="38" fontSize="24">⚑</text></svg>
    case 'detective':
      return <div className="tile-detective"><Character name="orange-cat" /><span className="detective-hat">◢</span><span className="detective-glass">⌕</span><i>· · ·</i></div>
    case 'fruit':
      return <div className="tile-fruit"><span>🍓</span><span>🍌</span><span>🍎</span><Character name="llama" /><div className="fruit-basket" /></div>
    default: return null
  }
}

function CategoryTile({ game, index }) {
  const content = <>
    <div className="neon-tile-heading"><span className="tile-number">{index + 1}</span><h2>{game.title}</h2></div>
    <div className={`neon-tile-art art-${game.id}`} aria-hidden="true"><GameArtwork kind={game.id} /></div>
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
        <p className="category-roadmap-note">Elige Memoria Gorila, Gorila Loco, Conecta los Colores o La Última Mordida. Los juegos marcados como «Próximamente» todavía están en preparación.</p>
      </div>
    </section>
  )
}

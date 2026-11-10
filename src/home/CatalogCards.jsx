import { availableGames } from '../catalog/catalog.js'
const base=import.meta.env.BASE_URL
export function StatusBadge({status}){return <span className={`home-status status-${status}`}>{status==='available'?'Disponible':'Próximamente'}</span>}
export function CategoryCard({category}){
 const count=availableGames(category.id).length,available=category.status==='available'&&!!category.href&&count>0
 const content=<><div className="home-category-art"><img src={`${base}${category.imagePath}-320.png`} srcSet={`${base}${category.imagePath}-320.png ${category.width}w, ${base}${category.imagePath}-480.png ${Math.round(category.width*1.5)}w`} sizes="(max-width:760px) 108px, 160px" alt="" width={category.width} height={category.height} loading="lazy" decoding="async"/></div><div className="home-category-body"><StatusBadge status={available?'available':'comingSoon'}/><h3>{category.name}</h3><p>{category.description}</p>{available?<span className="home-category-access">Explorar {count} {count===1?'juego':'juegos'} <span aria-hidden="true">→</span></span>:<span className="home-category-wait">En preparación</span>}</div></>
 return available&&category.href&&count>0?<a className={`home-category category-${category.id}`} href={category.href} aria-label={`Explorar ${category.name}: ${count} juegos disponibles`}>{content}</a>:<article className={`home-category category-${category.id}`} aria-label={`${category.name}, próximamente`}>{content}</article>
}
export function FeaturedGameCard({game}){
 return <a className="home-featured-game" href={game.href} aria-label={`Jugar ${game.title}`}><div className="home-featured-art"><img src={`${base}images/game-covers/${game.image}`} alt="" width="512" height="512" loading="lazy" decoding="async"/></div><div className="home-featured-copy"><h3>{game.title}</h3><p>{game.text}</p><span>Jugar ahora <span aria-hidden="true">↗</span></span></div></a>
}

import { characterById } from './data.js'
import { GuestArt, DishArt } from './BanquetArt.jsx'
export default function RoundResults({resolution,dishes,eating=false}){
 return <ul className={`bite-round-results ${eating?'is-eating':''}`} aria-label={eating?'Todos los participantes están comiendo':'Resultados de todos los participantes'}>{resolution.participants.map(id=>{
  const character=characterById(id),outcome=resolution.outcomes[id],dish=dishes.find(item=>item.id===resolution.assignments[id])
  const poisoned=!eating&&outcome!=='safe'
  return <li key={id} className={poisoned?'is-poisoned':''}><GuestArt character={character} poisoned={poisoned}/><strong>{character.name}</strong><div className="bite-result-meal"><DishArt dish={dish}/><span>{dish.name}</span></div><span>{eating?'¡Ñam, ñam!':outcome==='safe'?'✓ Comida segura':outcome==='villain-defeated'?'¡Villano derrotado!':'Mareo · Fuera de la partida'}</span></li>
 })}</ul>
}

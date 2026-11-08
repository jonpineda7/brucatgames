import { CHARACTERS, VILLAIN_ID, characterById } from './data.js'
import { activeParticipants, guestAvailable, readyToEat, PHASES } from './engine.js'
import { GuestArt, DishArt, CastleArt } from './BanquetArt.jsx'
const foodNames={pizza:'Pizza',burger:'Búrguer',sushi:'Sushi',tacos:'Tacos',cake:'Pastel'}
export default function BanquetTable({state,dishes,act,drag,onInspect}){
 const interactive=state.phase===PHASES.SELECTING&&!state.showHelp
 const eating=state.phase===PHASES.EATING
 const characters=eating?state.resolution.beforeCharacters:state.characters
 const selected=dishes.find(dish=>dish.id===state.selectedDish)
 const served=Object.keys(state.round.assignments).length,total=eating?state.resolution.participants.length:activeParticipants(state).length
 const resolved=!!state.resolution&&!eating
 return <div className="bite-stage">
 <div className="bite-eat-bar"><div><strong>{eating?'Todos comiendo…':resolved?'Resultado de la ronda':'Reparto'}</strong><span id="bite-serving-progress" role="status">{served} de {eating||!resolved?total:state.resolution.participants.length} platos servidos</span></div><button type="button" className="bite-serve" disabled={!readyToEat(state)} aria-describedby="bite-serving-progress" onClick={()=>act({type:'eat'})}>¡A comer!</button></div>
 <div className="bite-pantry" aria-label={`${dishes.length} platos de esta ronda`}><div className="bite-pantry-heading"><h3>La cocina · Ronda {state.round.number}</h3><span>{selected?`${selected.name} → elige participante`:'Elige un plato y un personaje, o arrástralo'}</span></div><div className="bite-foods" style={{'--bite-dishes':dishes.length}}>{dishes.map(dish=>{
  const owner=Object.keys(state.round.assignments).find(guest=>state.round.assignments[guest]===dish.id)
  const reveal=resolved||state.round.hintRevealed
  const poisoned=reveal&&dish.id===state.round.poisonedDish
  return <div className={`bite-food ${state.selectedDish===dish.id?'is-selected':''} ${owner?'is-assigned':''} ${poisoned?'revealed-poison':''}`} key={dish.id}><button type="button" className="bite-food-pick" {...drag.handlers(dish.id)} disabled={!interactive} aria-pressed={state.selectedDish===dish.id} aria-label={`Seleccionar ${dish.name}${owner?`, asignado a ${characterById(owner).name}`:''}${reveal?poisoned?', envenenado':', seguro':''}`}><DishArt dish={dish}/><strong>{foodNames[dish.image]}</strong><span>{owner?`✓ ${characterById(owner).name}`:poisoned?'⚠ Envenenado':'Disponible'}</span></button><button className="bite-info" onClick={()=>onInspect({type:'dish',id:dish.id})} disabled={!interactive} aria-label={`Ver receta de ${dish.name}`}>Ver receta</button></div>
 })}</div></div>
 <div className="bite-table-wrap"><CastleArt/><span className="bite-table-caption">CUATRO AMIGOS · UN COCODRILO · TU GRAN IDEA</span><div className="bite-seats">{CHARACTERS.map(character=>{
  const status=characters[character.id],eliminated=status==='poisoned',defeated=status==='defeated'
  const available=guestAvailable(state,character.id),assigned=!!state.round.assignments[character.id]
  const dish=dishes.find(dish=>dish.id===state.round.assignments[character.id])
  const villain=character.id===VILLAIN_ID
  const label=eliminated?'Fuera de la partida':defeated?'¡Derrotado!':eating?'¡Ñam, ñam!':resolved?'Comida segura':assigned?'Plato listo':villain?'Villano activo':'Esperando su plato'
  return <article key={character.id} className={`bite-seat ${villain?'is-villain':''} ${eliminated?'is-eliminated':''} ${defeated?'is-defeated':''} ${assigned?'is-fed':''} ${eating&&status==='active'?'is-eating':''}`} data-bite-guest={character.id}>
   <span className="bite-seat-role">{villain?'VILLANO':'INOCENTE'}</span>
   <button className="bite-seat-pick" disabled={!interactive||!available} onClick={()=>act({type:'guest',guest:character.id})} aria-label={`${selected&&available?`Asignar ${selected.name} a `:''}${character.name}, ${label}${dish?`, plato: ${dish.name}`:''}`}><div className="bite-character-stage"><GuestArt character={character} poisoned={eliminated||defeated}/></div><b>{character.name}</b><span className="bite-seat-status">{label}</span></button>
   {dish&&<div className="bite-seat-meal"><DishArt dish={dish}/><span>{dish.name}</span>{interactive&&available&&<button type="button" className="bite-remove-plate" onClick={()=>act({type:'remove-assignment',guest:character.id})} aria-label={`Retirar plato de ${character.name}`}>Retirar plato</button>}</div>}
   {eliminated&&<span className="bite-rest-badge">☆ Descansando</span>}
  </article>
 })}</div></div>
 <p className="bite-feedback" role="status" aria-live="polite">{state.message}</p>
 <div className="bite-selection-actions"><button className="text-button" disabled={!interactive||!state.selectedDish} onClick={()=>act({type:'clear-selection'})}>Quitar selección</button><span>Puedes retirar platos. Para intercambiarlos, elige un plato asignado y otro personaje. Solo comen al pulsar «¡A comer!».</span></div>
 </div>
}

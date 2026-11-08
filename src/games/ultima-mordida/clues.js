import { MENUS, menuFor, guestsFor } from './data.js'
export function matches(item, rule) {
  const value = item[rule.field]
  switch(rule.op){
    case 'is':return value === rule.value
    case 'not':return value !== rule.value
    case 'has':return Array.isArray(value) && value.includes(rule.value)
    case 'lacks':return Array.isArray(value) && !value.includes(rule.value)
    case 'lt':return typeof value === 'number' && value < rule.value
    case 'gt':return typeof value === 'number' && value > rule.value
    default:return false
  }
}
export const candidates = (items, rules) => items.filter(item=>rules.every(rule=>matches(item,rule)))
export function clueText(rule, subject='dish'){
  if(subject==='guest'){
    if(rule.field==='ears')return `El travieso ${rule.op==='not'?'no tiene':'tiene'} las orejas ${rule.value}.`
    if(rule.field==='outfit')return `Su ropa ${rule.op==='not'?'no es':'es'} de color ${rule.value}.`
    if(rule.field==='gold')return `${rule.value?'Lleva':'No lleva'} un detalle dorado.`
  }
  if(rule.field==='ingredients')return `La receta encantada ${rule.op==='lacks'?'no contiene':'contiene'} ${rule.value}.`
  if(rule.field==='temperature')return `El plato encantado ${rule.op==='not'?'no se sirve':'se sirve'} ${rule.value}.`
  if(rule.field==='flavor')return `Su sabor ${rule.op==='not'?'no es':'es'} ${rule.value}.`
  if(rule.field==='baked')return `${rule.value?'Sí':'No'} pasó por el horno.`
  if(rule.field==='price')return `Cuesta ${rule.op==='lt'?'menos':'más'} de ${rule.value} monedas.`
  return 'Revisa la ficha de la receta.'
}
export function validateLevel(level){
  if(!level||!MENUS[level.menu]||!Array.isArray(level.dishes)||!Array.isArray(level.guests)||!Array.isArray(level.clues)||!Array.isArray(level.guestClues))return false
  const dishes=menuFor(level),guests=guestsFor(level)
  if(guests.some(guest=>!guest)||dishes.length!==level.dishes.length)return false
  const dishMatches=candidates(dishes,level.clues)
  const guestMatches=level.mode==='classic'?guests.filter(guest=>guest.id===level.villain):candidates(guests,level.guestClues)
  return dishes.length===guests.length && new Set(level.dishes).size===dishes.length && guests.every(Boolean) && new Set(level.guests).size===guests.length && dishMatches.length===1 && dishMatches[0].id===level.enchanted && guestMatches.length===1 && guestMatches[0].id===level.villain && (!level.twist || level.twist.length===2 && new Set(level.twist).size===2 && level.twist.every(id=>level.guests.includes(id)))
}
export function magnifierClue(level){
  const target=menuFor(level).find(dish=>dish.id===level.enchanted)
  const possible=[...target.ingredients.map(value=>({field:'ingredients',op:'has',value})),{field:'temperature',op:'is',value:target.temperature},{field:'flavor',op:'is',value:target.flavor}]
  return possible.find(rule=>!level.clues.some(existing=>JSON.stringify(existing)===JSON.stringify(rule))) || possible[0]
}

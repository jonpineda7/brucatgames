const FIELDS=new Set(['ingredients','temperature','flavor','baked','price'])
export function matches(item,rule){
 if(!item||!rule||!FIELDS.has(rule.field))return false
 const value=item[rule.field]
 switch(rule.op){
  case 'is':return value===rule.value
  case 'not':return value!==rule.value
  case 'has':return Array.isArray(value)&&value.includes(rule.value)
  case 'lacks':return Array.isArray(value)&&!value.includes(rule.value)
  case 'lt':return typeof value==='number'&&value<rule.value
  case 'gt':return typeof value==='number'&&value>rule.value
  default:return false
 }
}
export const candidates=(items,rules)=>items.filter(item=>rules.every(rule=>matches(item,rule)))
export function clueText(rule){
 if(rule.field==='ingredients')return `El plato envenenado ${rule.op==='lacks'?'no contiene':'contiene'} ${rule.value}.`
 if(rule.field==='temperature')return `El plato envenenado ${rule.op==='not'?'no se sirve':'se sirve'} ${rule.value}.`
 if(rule.field==='flavor')return `Su sabor ${rule.op==='not'?'no es':'es'} ${rule.value}.`
 if(rule.field==='baked')return `${rule.value?'Sí':'No'} pasó por el horno.`
 if(rule.field==='price')return `Cuesta ${rule.op==='lt'?'menos':'más'} de ${rule.value} monedas.`
 return 'Consulta los ingredientes de cada receta.'
}
function trueRules(dishes,target){
 const rules=[]
 for(const field of ['temperature','flavor'])for(const value of new Set(dishes.map(dish=>dish[field])))for(const op of ['is','not'])rules.push({field,op,value})
 for(const value of new Set(dishes.flatMap(dish=>dish.ingredients)))for(const op of ['has','lacks'])rules.push({field:'ingredients',op,value})
 for(const value of [2,3,4,5])for(const op of ['lt','gt'])rules.push({field:'price',op,value})
 for(const value of [true,false])rules.push({field:'baked',op:'is',value})
 return rules.filter(rule=>matches(target,rule)&&candidates(dishes,[rule]).length<dishes.length)
}
export function buildClues(dishes,poisonedId,difficulty){
 const target=dishes.find(dish=>dish.id===poisonedId)
 if(!target)throw Error('A round must have an existing poisoned dish')
 const rules=trueRules(dishes,target)
 if(difficulty==='easy'){
  const clues=[]
  let remaining=dishes
  while(remaining.length>1){
   const choices=rules.filter(rule=>!clues.includes(rule)&&candidates(remaining,[rule]).length<remaining.length)
   choices.sort((a,b)=>Math.abs(candidates(remaining,[a]).length-Math.ceil(remaining.length/2))-Math.abs(candidates(remaining,[b]).length-Math.ceil(remaining.length/2)))
   if(!choices.length)throw Error('Recipes cannot be distinguished by their properties')
   clues.push(choices[0]);remaining=candidates(remaining,[choices[0]])
  }
  return clues
 }
 const min=Math.min(difficulty==='normal'?2:3,dishes.length-1)
 const partial=rules.filter(rule=>{const count=candidates(dishes,[rule]).length;return count>=min&&count<dishes.length})
 partial.sort((a,b)=>difficulty==='normal'?candidates(dishes,[a]).length-candidates(dishes,[b]).length:candidates(dishes,[b]).length-candidates(dishes,[a]).length)
 // With two remaining dishes, preserve honest uncertainty rather than inventing
 // a discriminating partial clue. All recipes cost more than zero coins.
 if(dishes.length===2||!partial.length)return [{field:'price',op:'gt',value:0}]
 return [partial[0]]
}
export function validateRoundClues(dishes,poisonedId,clues,{unique=false}={}){
 if(dishes.length<2||dishes.length>5||new Set(dishes.map(dish=>dish.id)).size!==dishes.length||!Array.isArray(clues)||!clues.length)return false
 const target=dishes.find(dish=>dish.id===poisonedId)
 if(!target||!clues.every(rule=>matches(target,rule)))return false
 const possible=candidates(dishes,clues)
 return possible.some(dish=>dish.id===poisonedId)&&(!unique||possible.length===1)
}

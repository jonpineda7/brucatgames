import { menuFor, STAGES } from './data.js'
import { buildClues, validateRoundClues } from './clues.js'
export function randomIndex(roll,length){
 const value=Number.isFinite(roll)?Math.min(Math.max(roll,0),1-Number.EPSILON):0
 return Math.floor(value*length)
}
// All random values are injected; reducers and animation callbacks remain deterministic.
export function createRound(level,number,session,roll,count=5,shuffleRolls=[]){
 const menu=menuFor(level),pool=[...menu],difficulty=STAGES[level.stage].difficulty
 if(!Number.isInteger(count)||count<2||count>menu.length)throw Error('Invalid participant count')
 for(let i=pool.length-1;i>0;i--){const j=randomIndex(shuffleRolls[pool.length-1-i],i+1);[pool[i],pool[j]]=[pool[j],pool[i]]}
 const chosen=new Set(pool.slice(0,count).map(dish=>dish.id))
 const dishes=menu.filter(dish=>chosen.has(dish.id))
 const poisonedDish=dishes[randomIndex(roll,dishes.length)].id
 const clues=buildClues(dishes,poisonedDish,difficulty)
 if(!validateRoundClues(dishes,poisonedDish,clues,{unique:difficulty==='easy'}))throw Error('Invalid round configuration')
 return {dishes:dishes.map(dish=>dish.id),number,token:`${session}:${number}`,poisonedDish,clues,assignments:{},hintUsed:false,hintRevealed:false}
}

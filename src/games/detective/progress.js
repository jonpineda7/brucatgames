import { CASES } from './levels.js'
export const STORAGE_KEY='brucatgames:detective:v1'
const integer=(value,min,max)=>Number.isInteger(value)&&value>=min&&value<=max
export function cleanProgress(value){
 const completed={},lastPlacements={}
 for(const level of CASES){
  const record=value?.completed?.[level.id]
  if(CASES.filter(previous=>previous.id<level.id&&previous.status==='ready').every(previous=>completed[previous.id])&&level.status==='ready'&&record&&integer(record.stars,1,3)&&integer(record.hints,0,1000000)&&integer(record.mistakes,0,1000000))completed[level.id]={stars:record.stars,hints:record.hints,mistakes:record.mistakes,score:level.objects.length*100+record.stars*100}
 }
 for(const level of CASES)if(level.sceneConfig?.distributions.some(layout=>layout.id===value?.lastPlacements?.[level.id]))lastPlacements[level.id]=value.lastPlacements[level.id]
 const implemented=CASES.filter(level=>level.status==='ready')
 const firstIncomplete=implemented.find(level=>!completed[level.id])
 const unlocked=firstIncomplete?.id||Math.min(CASES.length,(implemented.at(-1)?.id||0)+1)
 return {completed,unlocked,lastPlacements,sound:value?.sound===true}
}
export function loadProgress(storage){try{return cleanProgress(JSON.parse(storage.getItem(STORAGE_KEY)))}catch{return cleanProgress(null)}}
export function persistProgress(storage,progress){try{storage.setItem(STORAGE_KEY,JSON.stringify(cleanProgress(progress)));return true}catch{return false}}
export function rememberResult(progress,id,result){
 const old=progress.completed[id]
 const better=!old||result.stars>old.stars||result.stars===old.stars&&(result.hints<old.hints||result.hints===old.hints&&result.mistakes<old.mistakes)
 return cleanProgress({...progress,completed:{...progress.completed,[id]:better?result:old}})
}

export const totalStars=progress=>Object.values(progress.completed).reduce((sum,record)=>sum+record.stars,0)
export const chapterProgress=(progress,world)=>{const cases=CASES.filter(level=>level.world===world);return {total:cases.length,completed:cases.filter(level=>progress.completed[level.id]).length,stars:cases.reduce((sum,level)=>sum+(progress.completed[level.id]?.stars||0),0),unlocked:cases.every(level=>level.status==='ready')&&CASES.filter(level=>level.world<world).every(level=>progress.completed[level.id])}}

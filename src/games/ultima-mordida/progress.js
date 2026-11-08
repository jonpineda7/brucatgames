export const STORAGE_KEY='brucatgames:ultima-mordida:v2'
export const LEGACY_KEY='brucatgames:ultima-mordida:v1'
const integer=(value,min,max)=>Number.isInteger(value)&&value>=min&&value<=max
export function cleanProgress(value){
 const completed={}
 for(let id=1;id<=20;id++){
  const result=value?.completed?.[id]
  if(result&&integer(result.stars,1,3)&&integer(result.score,0,1000000000)&&integer(result.rounds,1,1000000)&&integer(result.survivors,1,4)&&integer(result.safeServed,0,1000000)&&integer(result.poisonedServed,1,5)){
   completed[id]={stars:result.stars,score:result.score,rounds:result.rounds,survivors:result.survivors,safeServed:result.safeServed,poisonedServed:result.poisonedServed}
  }
 }
 const inheritedUnlocked=integer(value?.inheritedUnlocked,1,20)?value.inheritedUnlocked:1
 let unlocked=inheritedUnlocked
 while(unlocked<20&&completed[unlocked])unlocked++
 return {completed,unlocked,inheritedUnlocked,sound:value?.sound===true}
}
export function readProgress(storage){
 try{
  const raw=storage.getItem(STORAGE_KEY)
  if(raw!==null)return cleanProgress(JSON.parse(raw))
  const legacy=JSON.parse(storage.getItem(LEGACY_KEY))
  let inheritedUnlocked=1
  while(inheritedUnlocked<20){const result=legacy?.completed?.[inheritedUnlocked];if(!result||!integer(result.stars,1,3)||!integer(result.score,0,10000))break;inheritedUnlocked++}
  return cleanProgress({inheritedUnlocked,sound:legacy?.sound===true})
 }catch{return cleanProgress(null)}
}
export function saveProgress(storage,progress){try{storage.setItem(STORAGE_KEY,JSON.stringify(cleanProgress(progress)));return true}catch{return false}}
export function rememberResult(progress,id,result){
 if(!result.won)return progress
 const previous=progress.completed[id]
 const better=!previous||result.stars>previous.stars||result.stars===previous.stars&&(result.score>previous.score||result.score===previous.score&&result.rounds<previous.rounds)
 return cleanProgress({...progress,completed:{...progress.completed,[id]:better?result:previous}})
}

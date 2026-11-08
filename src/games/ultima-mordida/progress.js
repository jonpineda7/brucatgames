export const STORAGE_KEY='brucatgames:ultima-mordida:v1'
export function cleanProgress(value){
 const completed={}
 for(let id=1;id<=20;id++){
  const result=value?.completed?.[id]
  if(result&&Number.isInteger(result.stars)&&result.stars>=1&&result.stars<=3&&Number.isInteger(result.score)&&result.score>=0&&result.score<=10000)completed[id]={stars:result.stars,score:result.score}
 }
 let unlocked=1
 while(unlocked<20&&completed[unlocked])unlocked++
 return {completed,unlocked,sound:value?.sound===true}
}
export function readProgress(storage){try{return cleanProgress(JSON.parse(storage.getItem(STORAGE_KEY)))}catch{return cleanProgress(null)}}
export function saveProgress(storage,progress){try{storage.setItem(STORAGE_KEY,JSON.stringify(cleanProgress(progress)));return true}catch{return false}}
export function rememberResult(progress,id,result){
 const previous=progress.completed[id]
 const better=!previous||result.stars>previous.stars||result.stars===previous.stars&&result.score>previous.score
 return cleanProgress({...progress,completed:{...progress.completed,[id]:better?{stars:result.stars,score:result.score}:previous}})
}

import { ADVENTURE_CASES, CHAPTERS } from './adventureCases.js'
import { adventureScene } from './adventureScenes.js'
import { CASTLE_SCENE } from './scenes.js'
/** @typedef {{id:string,kind:keyof typeof import('./objects.js').OBJECTS,cx:number,cy:number,size:number,rotation:number,location:string,zoneId?:string,zoneName?:string,locationShort?:string,layer?:number,art?:{src:string}}} SceneObject */
/** @typedef {{id:number,name:string,world:number,status:'ready'|'pending',difficulty:'easy'|'normal'|'hard',mission?:string,objects?:SceneObject[],scene?:string,sceneConfig?:typeof CASTLE_SCENE,riddle?:{question:string,clue:string,options:{id:string,label:string,symbol:string}[],answer:string,explanation:string}}} DetectiveCase */
export const WORLDS = [
 {name:'El castillo misterioso',icon:'♜',description:'Libros, secretos y una fiesta por descubrir.'},
 {name:'La selva perdida',icon:'♧',description:'Mapas, huellas y el tesoro de la cascada.'},
 {name:'El laboratorio loco',icon:'⚗',description:'Inventos y pequeñas grandes preguntas.'},
 {name:'La ciudad de los animales',icon:'⌂',description:'Un barrio lleno de historias.'},
 {name:'La mansión encantada',icon:'◷',description:'Una casa de sorpresas, sin sustos.'},
]
const names=['La corona desaparecida','El libro secreto','La llave del tesoro','El mapa escondido','Las huellas misteriosas','El tesoro de la cascada','La fórmula perdida','El robot descompuesto','La máquina misteriosa','El collar perdido','El misterio del mercado','El paquete desaparecido','El reloj detenido','El cuadro misterioso','El gran secreto de BruCat']
/** @type {DetectiveCase[]} */
export const CASES = names.map((name,index)=>({id:index+1,name,world:Math.floor(index/3),status:'pending',difficulty:index<5?'easy':index<10?'normal':'hard'}))
Object.assign(CASES[0],{
 status:'ready',scene:'games/detective/castle-study.png',sceneTitle:'La biblioteca del castillo',sceneConfig:CASTLE_SCENE,description:'Una corona que cambió de lugar inicia una gran investigación.',outro:'En el cofre, BruCat descubre una invitación que conduce al libro secreto de la biblioteca antigua.',
 mission:'La corona no está en su lugar. Busca cinco objetos, anota dónde aparecen y ayuda a BruCat a resolver el misterio.',
 objects:[
  {id:'key',kind:'key',cx:.522,cy:.468,size:.108,rotation:-14,location:'Mira los libros del mueble del fondo, a la izquierda de la silla morada.'},
  {id:'glass',kind:'glass',cx:.445,cy:.599,size:.112,rotation:-18,location:'Está sobre la mesa grande, cerca de su borde delantero.'},
  {id:'scroll',kind:'scroll',cx:.735,cy:.390,size:.104,rotation:7,location:'Descansa en el estante vacío de la biblioteca, debajo de los libros altos.'},
  {id:'coin',kind:'coin',cx:.235,cy:.815,size:.082,rotation:0,location:'Busca sobre el libro verde de la pila que está en el suelo, a la izquierda.'},
  {id:'crown',kind:'crown',cx:.862,cy:.568,size:.108,rotation:9,location:'Mira la tapa del cofre morado, a la derecha de la mesa.'},
 ],
 riddle:{question:'¿Qué llave abre el cofre de las invitaciones?',clue:'El pergamino dice: «La llave con una estrella abre el cofre». Compara las empuñaduras.',
 options:[{id:'heart',label:'Llave con corazón',symbol:'♥'},{id:'star',label:'Llave con estrella',symbol:'★'},{id:'diamond',label:'Llave con rombo',symbol:'◆'}],answer:'star',
 explanation:'¡Caso resuelto! BruCat había dejado la corona junto al cofre mientras ordenaba la biblioteca. La llave con estrella abre el cofre de las invitaciones: todo era una sorpresa para la fiesta del castillo.'},
})
for(const data of ADVENTURE_CASES){
 const level=CASES.find(item=>item.id===data.id)
 const sceneConfig=adventureScene(data)
 const first=sceneConfig.distributions[0]
 Object.assign(level,data,{status:'ready',sceneConfig,objects:data.objects.map(object=>{const zone=sceneConfig.zones[first.slots[object.id]];return {...object,cx:zone.cx,cy:zone.cy,location:`Busca ${zone.location}.`}})})
}
export { CHAPTERS }
export const getCase=id=>CASES.find(item=>item.id===id)
export const hintLimit=level=>level.difficulty==='easy'?Infinity:3

export const nextImplementedCase=(id,cases=CASES)=>cases.find(level=>level.id>id&&level.status==='ready')||null
export function isCaseUnlocked(progress,id,cases=CASES){
 const target=cases.find(level=>level.id===id)
 return !!target&&target.status==='ready'&&cases.filter(level=>level.id<id&&level.status==='ready').every(level=>progress.completed[level.id])
}

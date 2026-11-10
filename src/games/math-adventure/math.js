/** Pure arithmetic generator. Randomness is injected, and never changes an active challenge. */
export const OPERATIONS={add:{name:'Sumas',symbol:'+'},subtract:{name:'Restas',symbol:'−'},multiply:{name:'Multiplicaciones',symbol:'×'},divide:{name:'Divisiones',symbol:'÷'}}
export const DIFFICULTIES={novato:{name:'Novato',description:'Cantidades pequeñas y apoyo visual.'},audaz:{name:'Audaz',description:'Decenas, reagrupación y tablas.'},guerrero:{name:'Guerrero',description:'Varias cifras y razonamientos de dos pasos.'}}
export const calculate=(op,a,b)=>op==='add'?a+b:op==='subtract'?a-b:op==='multiply'?a*b:op==='divide'&&b!==0?a/b:NaN
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n))
function random(seed){let value=(Number.isFinite(seed)?Math.floor(Math.abs(seed)*0xffffffff):1)>>>0;return()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296}}
const integer=(rng,min,max)=>min+Math.floor(rng()*(max-min+1))
export function explain(op,a,b,c=null){
 let steps=[]
 if(op==='add'){const tens=Math.floor(b/10)*10,units=b%10;steps=b>=10?[`Separa ${b} en ${tens} y ${units}.`,`${a} + ${tens} = ${a+tens}.`,`${a+tens} + ${units} = ${a+b}.`]:[`Junta un grupo de ${a} con otro de ${b}.`,`Al contar todos, tienes ${a+b}.`]}
 if(op==='subtract'){const tens=Math.floor(b/10)*10,units=b%10;steps=b>=10?[`Para quitar ${b}, retira primero ${tens} y después ${units}.`,`${a} − ${tens} = ${a-tens}.`,`${a-tens} − ${units} = ${a-b}.`]:[`Empieza con ${a} objetos y retira ${b}.`,`Quedan ${a-b} objetos.`]}
 if(op==='multiply')steps=b>=10?[`Separa ${b} en 10 y ${b-10}.`,`${a} × 10 = ${a*10}; ${a} × ${b-10} = ${a*(b-10)}.`,`Los dos productos juntos son ${a*b}.`]:[`Forma ${a} grupos iguales de ${b}.`,`Todos los grupos contienen ${a*b} objetos.`]
 if(op==='divide')steps=[`Reparte ${a} objetos por igual en ${b} grupos.`,`Cada grupo recibe ${a/b}. No sobra ningún objeto.`]
 if(c!==null){const first=calculate(op,a,b);steps.push(`Ahora continúa desde ${first}: ${first} ${OPERATIONS[op].symbol} ${c} = ${calculate(op,first,c)}.`)}
 return steps
}
function operands(op,difficulty,tier,rng){
 const range=(lo,hi)=>integer(rng,lo,lo+Math.max(1,Math.floor((hi-lo)*(.5+tier*.25))))
 if(difficulty==='novato'){
  if(op==='add')return [range(0,10),range(1,10)]
  if(op==='subtract'){const a=range(3,20);return [a,integer(rng,1,a)]}
  if(op==='multiply')return [range(1,5),range(1,5)]
  const b=range(1,5);return [b*range(1,5),b]
 }
 if(difficulty==='audaz'){
  if(op==='add')return [range(10,65),range(10,35)]
  if(op==='subtract'){const b=range(11,59),a=integer(rng,Math.max(30,b+1),99);return [a,b]}
  if(op==='multiply')return [range(2,10),range(2,10)]
  const b=range(2,10);return [b*range(2,10),b]
 }
 if(op==='add')return [range(100,699),range(100,299)]
 if(op==='subtract'){const a=range(250,999);return [a,integer(rng,100,a-1)]}
 if(op==='multiply')return [range(12,24),range(11,19)]
 const b=range(6,20);return [b*range(10,30),b]
}
export function generateProblem({op,difficulty='novato',level=1,history=[],pedagogy={},roll=0}){
 if(!OPERATIONS[op]||!DIFFICULTIES[difficulty])throw new RangeError('Operación o dificultad desconocida')
 const rng=random(roll+level*.0021),tier=clamp(Number.isInteger(pedagogy.tier)?pedagogy.tier:0,0,2)
 let a,b,c=null,key
 for(let attempt=0;attempt<80;attempt++){
  ;[a,b]=operands(op,difficulty,tier,rng);c=null
  if(difficulty==='guerrero'&&level%3===0){
   c=op==='add'?integer(rng,10,50):op==='subtract'?integer(rng,1,Math.min(60,a-b)):op==='multiply'?2:integer(rng,2,4)
   if(op==='divide')a=b*c*integer(rng,10,25)
  }
  key=`${op}:${a}:${b}:${c??''}`
  if(!(attempt<40?history.slice(-20):history.slice(-3)).includes(key))break
 }
 const first=calculate(op,a,b),answer=c===null?first:calculate(op,first,c)
 const expression=c===null?`${a} ${OPERATIONS[op].symbol} ${b}`:`(${a} ${OPERATIONS[op].symbol} ${b}) ${OPERATIONS[op].symbol} ${c}`
 const distractors=new Set(),candidates=[answer+1,answer-1,answer+(op==='multiply'||op==='divide'?b:10),answer-(op==='multiply'||op==='divide'?b:10)]
 for(const value of candidates)if(Number.isSafeInteger(value)&&value>=0&&value!==answer)distractors.add(value)
 for(let delta=2;distractors.size<2;delta++)distractors.add(answer+delta)
 const choices=[answer,...[...distractors].slice(0,2)]
 for(let i=choices.length-1;i>0;i--){const j=integer(rng,0,i);[choices[i],choices[j]]=[choices[j],choices[i]]}
 return {key,op,difficulty,a,b,c,expression,answer,choices,steps:explain(op,a,b,c),visual:{kind:op},tier}
}
export function operandsInRange(p){
 const {op,a,b,c,difficulty}=p,multi=c!==null&&c!==undefined
 if(multi&&difficulty!=='guerrero')return false
 if(difficulty==='novato')return op==='add'?a<=10&&b>=1&&b<=10:op==='subtract'?a>=3&&a<=20&&b>=1&&b<=a:op==='multiply'?a>=1&&a<=5&&b>=1&&b<=5:b>=1&&b<=5&&a/b>=1&&a/b<=5
 if(difficulty==='audaz')return op==='add'?a>=10&&a<=65&&b>=10&&b<=35:op==='subtract'?a>=30&&a<=99&&b>=11&&b<=59&&b<a:op==='multiply'?a>=2&&a<=10&&b>=2&&b<=10:b>=2&&b<=10&&a/b>=2&&a/b<=10
 if(op==='add')return a>=100&&a<=699&&b>=100&&b<=299&&(!multi||c>=10&&c<=50)
 if(op==='subtract')return a>=250&&a<=999&&b>=100&&b<a&&(!multi||c>=1&&c<=60&&c<=a-b)
 if(op==='multiply')return a>=12&&a<=24&&b>=11&&b<=19&&(!multi||c===2)
 return b>=6&&b<=20&&(multi?c>=2&&c<=4&&a/b/c>=10&&a/b/c<=25:a/b>=10&&a/b<=30)
}
export function validProblem(problem){
 if(!problem||!OPERATIONS[problem.op]||!DIFFICULTIES[problem.difficulty]||![problem.a,problem.b,problem.answer].every(Number.isSafeInteger)||problem.a<0||problem.b<0)return false
 const {op,a,b,c,answer,choices}=problem
 if(!operandsInRange(problem)||c!==null&&c!==undefined&&!Number.isSafeInteger(c))return false
 if(op==='divide'&&(b===0||a%b!==0||c!==null&&c!==undefined&&(c===0||(a/b)%c!==0)))return false
 const expected=c===null||c===undefined?calculate(op,a,b):calculate(op,calculate(op,a,b),c)
 return answer===expected&&answer>=0&&answer<=2000&&Array.isArray(choices)&&choices.length===3&&new Set(choices).size===3&&choices.every(value=>Number.isSafeInteger(value)&&value>=0&&value<=2000)&&choices.includes(answer)
}
export const hintText=problem=>({add:'Junta las dos cantidades. Puedes separar decenas y unidades.',subtract:'Empieza con la primera cantidad y retira la segunda. No debes quitar más de lo que hay.',multiply:'Busca grupos del mismo tamaño. Todos deben contener la misma cantidad.',divide:'Reparte por igual: ningún grupo debe recibir más que otro.'}[problem.op])

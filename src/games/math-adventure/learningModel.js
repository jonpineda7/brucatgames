/** @typedef {'add'|'subtract'|'multiply'|'divide'} LearningOperation */
const operation=(op,a,b)=>op==='add'?a+b:op==='subtract'?a-b:op==='multiply'?a*b:op==='divide'?a/b:NaN
export const OPERATION_LABELS={add:'Sumar es reunir',subtract:'Restar es retirar',multiply:'Multiplicar es formar grupos iguales',divide:'Dividir es repartir por igual'}
export const OPERATION_SIGNS={add:'+',subtract:'−',multiply:'×',divide:'÷'}
export function placeDigits(value){
 const digits=String(value).split('').reverse().map(Number)
 return digits.map((count,power)=>({power,count,value:10**power,label:power===0?'Unidades':power===1?'Decenas':power===2?'Centenas':power===3?'Millares':`Grupos de ${10**power}`})).reverse()
}
export function subtractionPlaces(a,b){
 const size=Math.max(String(a).length,String(b).length),top=String(a).padStart(size,'0').split('').map(Number),bottom=String(b).padStart(size,'0').split('').map(Number),original=[...top]
 let regrouped=false
 for(let index=size-1;index>0;index--){
  if(top[index]>=bottom[index])continue
  let lender=index-1
  while(lender>=0&&top[lender]===0)lender--
  if(lender<0)return null
  top[lender]--;for(let middle=lender+1;middle<index;middle++)top[middle]+=9
  top[index]+=10;regrouped=true
 }
 return {top,bottom,original,regrouped,places:placeDigits(a).map(item=>item.label),powers:top.map((_,index)=>10**(size-1-index))}
}
export const placeChunks=value=>placeDigits(value).filter(item=>item.count>0).map(item=>item.count*item.value)
/** A bounded visual model. No diagram ever creates an array proportional to a large operand. */
export function buildLearningModel(problem,level=1){
 if(!problem||!Object.hasOwn(OPERATION_LABELS,problem.op)||![problem.a,problem.b].every(value=>Number.isSafeInteger(value)&&value>=0))return null
 const {op,a,b}=problem
 if(op==='divide'&&(b===0||a%b!==0)||op==='subtract'&&b>a)return null
 const first=operation(op,a,b),hasSecond=problem.c!==undefined&&problem.c!==null,c=hasSecond?problem.c:null
 if(hasSecond&&(!Number.isSafeInteger(c)||c<0||op==='divide'&&(c===0||first%c!==0)||op==='subtract'&&c>first))return null
 const final=hasSecond?operation(op,first,c):first
 if(!Number.isSafeInteger(first)||!Number.isSafeInteger(final)||problem.answer!==final)return null
 const model={op,a,b,c,first,final,reveal:level>=2,title:OPERATION_LABELS[op],sign:OPERATION_SIGNS[op],hasSecond,steps:Array.isArray(problem.steps)?problem.steps.filter(step=>typeof step==='string'):[],expression:problem.expression||`${a} ${OPERATION_SIGNS[op]} ${b}${hasSecond?` ${OPERATION_SIGNS[op]} ${c}`:''}`}
 if(op==='add')return {...model,mode:a<=30&&b<=30?'join':'places',counts:[a,b],totalDots:a<=30&&b<=30?a+b:0,places:[placeDigits(a),placeDigits(b)]}
 if(op==='subtract')return {...model,mode:a<=30?'remove':'places',counts:[a,b],remaining:first,totalDots:a<=30?a:0,regrouping:subtractionPlaces(a,b)}
 if(op==='multiply')return {...model,mode:a<=30&&b<=30&&a*b<=60?'groups':'products',groups:a,each:b,totalDots:a<=30&&b<=30&&a*b<=60?a*b:0,chunks:[placeChunks(a),placeChunks(b)]}
 const quotient=a/b
 return {...model,mode:a<=60&&b<=30?'share':'portions',groups:b,each:quotient,totalDots:a<=60&&b<=30?a:0,portions:placeChunks(quotient).map(part=>({amount:part*b,groups:b,each:part}))}
}

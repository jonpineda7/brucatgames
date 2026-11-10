import { useId } from 'react'
import { buildLearningModel, OPERATION_SIGNS } from './learningModel.js'
import './LearningVisual.css'

const GOLD='#ffdc86',CYAN='#9ce6ee',VIOLET='#ccacf4'
function Dot({x,y,color=GOLD,crossed=false}){
 return <g opacity={crossed ? .4 : 1}><circle cx={x} cy={y} r="6.3" fill={color} stroke="#eaffed" strokeWidth=".8"/><path d={`M${x-2.7} ${y-3}q3 -2 4 .5`} stroke="#ffffffaa" strokeWidth="1.3" fill="none"/>{crossed&&<path d={`M${x-8} ${y-8}L${x+8} ${y+8}M${x+8} ${y-8}L${x-8} ${y+8}`} stroke="#ffb7ad" strokeWidth="2.6"/>}</g>
}
function Dots({count,x,y,columns=5,color=GOLD,removed=0,splitAt=Infinity}){
 return Array.from({length:count},(_,index)=><Dot key={index} x={x+(index%columns)*18} y={y+Math.floor(index/columns)*18} color={index>=splitAt?CYAN:color} crossed={index>=count-removed}/>)
}
function Box({x,y,width,height,color='#416479',children}){return <g><rect x={x} y={y} width={width} height={height} rx="13" fill="#172b3d" stroke={color} strokeWidth="1.5"/>{children}</g>}
function VisualFrame({height,title,description,children}){
 const id=useId()
 return <svg className="math-learning-svg" viewBox={`0 0 320 ${height}`} role="img" aria-labelledby={`${id}-title ${id}-desc`}><title id={`${id}-title`}>{title}</title><desc id={`${id}-desc`}>{description}</desc>{children}</svg>
}
function JoinDiagram({model}){
 const groupHeight=Math.max(1,Math.ceil(Math.max(model.a,model.b)/5))*18+45,resultHeight=Math.max(1,Math.ceil(model.first/10))*18+45,height=groupHeight+resultHeight+58
 return <VisualFrame height={height} title="Dos grupos se reúnen" description={`Un grupo de ${model.a} objetos dorados y otro de ${model.b} objetos azules. Abajo aparecen juntos, conservando los dos colores para poder contarlos.`}>
  <Box x={5} y={5} width={142} height={groupHeight}><text x="76" y="31" textAnchor="middle" fill={GOLD}>{model.a} objetos</text><Dots count={model.a} x={39} y={52}/></Box>
  <text x="160" y={groupHeight/2+10} textAnchor="middle" fill={CYAN}>+</text>
  <Box x={173} y={5} width={142} height={groupHeight}><text x="244" y="31" textAnchor="middle" fill={CYAN}>{model.b} objetos</text><Dots count={model.b} x={208} y={52} color={CYAN}/></Box>
  <path d={`M116 ${groupHeight+11}L144 ${groupHeight+35}M205 ${groupHeight+11}L177 ${groupHeight+35}`} stroke={VIOLET} strokeWidth="3" fill="none"/><path d={`M135 ${groupHeight+32}L144 ${groupHeight+35}L143 ${groupHeight+26}M178 ${groupHeight+26}L177 ${groupHeight+35}L186 ${groupHeight+32}`} stroke={VIOLET} strokeWidth="3" fill="none"/>
  <Box x={5} y={groupHeight+44} width={310} height={resultHeight}><text x="160" y={groupHeight+70} textAnchor="middle" fill="#f4ead7">Juntos, sin perder ninguno</text><Dots count={model.first} x={79} y={groupHeight+91} columns={10} splitAt={model.a}/></Box>
 </VisualFrame>
}
function RemoveDiagram({model}){
 const columns=10,rows=Math.max(1,Math.ceil(model.a/columns)),height=rows*18+96
 return <VisualFrame height={height} title="Retiramos los objetos marcados" description={`Hay ${model.a} objetos. Se tachan ${model.b}; cuenta solamente los que no están tachados. Ningún objeto nuevo se añade.`}>
  <Box x={5} y={5} width={310} height={height-10} color="#b28ba7"><text x="160" y="33" textAnchor="middle" fill={GOLD}>Empieza con {model.a}</text><Dots count={model.a} x={79} y={63} columns={columns} removed={model.b}/><text x="160" y={height-24} textAnchor="middle" fill="#ffd0c5">Retira los {model.b} tachados</text></Box>
 </VisualFrame>
}
function GroupDiagram({model}){
 const count=model.groups,columns=count>8?5:Math.max(1,Math.min(3,count)),width=(310-(columns-1)*6)/columns,dotColumns=Math.max(1,Math.floor((width-24)/18)),rowsPerGroup=Math.max(1,Math.ceil(model.each/dotColumns)),cardHeight=rowsPerGroup*18+38,rows=Math.max(1,Math.ceil(count/columns)),height=rows*(cardHeight+7)+38
 return <VisualFrame height={height} title={model.op==='divide'?'Un reparto igual para todos':'Grupos con la misma cantidad'} description={model.op==='divide'?`${model.a} objetos repartidos en ${model.b} grupos iguales. Cuenta los objetos que recibe cada grupo.`:`${model.a} grupos. Cada grupo tiene exactamente ${model.b} objetos. Cuenta todos los objetos o cuenta por grupos.`}>
  <text x="160" y="25" textAnchor="middle" fill={CYAN}>{count} grupos {model.op==='divide'?'para repartir':'iguales'}</text>
  {count===0?<text x="160" y="67" textAnchor="middle" fill={GOLD}>No hay grupos que llenar</text>:Array.from({length:count},(_,group)=>{const x=5+(group%columns)*(width+6),y=35+Math.floor(group/columns)*(cardHeight+7),shownColumns=Math.min(model.each||1,dotColumns),dotsWidth=(shownColumns-1)*18;return <Box key={group} x={x} y={y} width={width} height={cardHeight} color={group%2?'#7084aa':'#716d8f'}><text x={x+width/2} y={y+24} textAnchor="middle" fill="#d8d7ed">{group+1}</text><Dots count={model.each} x={x+width/2-dotsWidth/2} y={y+45} columns={dotColumns} color={group%2?CYAN:GOLD}/></Box>})}
 </VisualFrame>
}
function PlaceTable({model}){
 const longest=Math.max(model.places?.[0]?.length||0,model.places?.[1]?.length||0,model.regrouping?.top.length||0),values=Array.from({length:longest},(_,index)=>10**(longest-index-1)),label=value=>value===1?'U':value===10?'D':value===100?'C':value===1000?'UM':String(value)
 const digits=value=>String(value).padStart(longest,'0').split('').map(Number)
 const first=model.op==='subtract'?model.regrouping.top:digits(model.a),second=digits(model.b)
 return <div className="math-learning-place-wrap"><table className="math-learning-place-table"><caption>{model.op==='subtract'&&model.regrouping.regrouped?'Cambiamos una decena por diez unidades cuando hace falta':'Cada cifra ocupa su lugar'}</caption><thead><tr><th scope="col">Cantidad</th>{values.map(value=><th key={value} scope="col" aria-label={label(value)}>{label(value)}</th>)}</tr></thead><tbody><tr><th scope="row">{model.a}{model.op==='subtract'&&model.regrouping.regrouped&&<small>reagrupado</small>}</th>{first.map((digit,index)=><td className={model.regrouping&&model.regrouping.original[index]!==digit?'is-regrouped':''} key={index}>{digit}</td>)}</tr><tr><th scope="row">{model.sign} {model.b}</th>{second.map((digit,index)=><td key={index}>{digit}</td>)}</tr></tbody></table><p className="math-learning-place-key">U = unidades · D = decenas · C = centenas · UM = millares.</p></div>
}
function ProductTable({model}){
 const [rows,columns]=model.chunks
 if(!rows.length||!columns.length)return <p className="math-learning-zero">Un factor es cero: los grupos están vacíos.</p>
 return <div className="math-learning-place-wrap"><table className="math-learning-products"><caption>Separa los factores en partes conocidas</caption><thead><tr><th scope="col">×</th>{columns.map(value=><th key={value} scope="col">{value}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row}><th scope="row">{row}</th>{columns.map(column=><td key={column}>{model.reveal?row*column:<span>{row} × {column}</span>}</td>)}</tr>)}</tbody></table><p className="math-learning-place-key">Cada casilla multiplica su fila por su columna.</p></div>
}
function PortionTable({model}){
 return <div className="math-learning-portions"><p>Reparte por partes entre los mismos {model.b} grupos.</p>{model.portions.length?model.portions.map(part=><div key={part.amount}><span>{part.amount} objetos</span><b>÷ {part.groups}</b><span>{model.reveal?`${part.each} por grupo`:'¿Cuántos por grupo?'}</span></div>):<p>No hay objetos que repartir; todos reciben lo mismo.</p>}</div>
}
/** Progressive support: first the representation, then the full worked explanation. */
export default function LearningVisual({problem,level=1}){
 const model=buildLearningModel(problem,level)
 if(!model)return null
 const follow=model.op==='add'?`Después, reúne ${model.c} objetos más.`:model.op==='subtract'?`Después, retira ${model.c} más de lo que quede.`:model.op==='multiply'?`Después, toma ${model.c} veces la cantidad que obtengas.`:`Después, reparte la cantidad obtenida en ${model.c} grupos iguales.`
 return <section className="math-learning" aria-label={`Ayuda visual: ${model.title}`}><header><span className="math-learning-badge" aria-hidden="true">{OPERATION_SIGNS[model.op]}</span><div><h3>{model.title}</h3><p>{model.hasSecond?'Primera etapa: trabaja con los dos primeros números.':'Observa las cantidades antes de responder.'}</p></div></header>
  {model.mode==='join'?<JoinDiagram model={model}/>:model.mode==='remove'?<RemoveDiagram model={model}/>:model.mode==='groups'||model.mode==='share'?<GroupDiagram model={model}/>:model.mode==='places'?<PlaceTable model={model}/>:model.mode==='products'?<ProductTable model={model}/>:<PortionTable model={model}/>}
  {!model.reveal&&<p className="math-learning-prompt">{model.op==='add'?'Cuenta los dos grupos juntos.':model.op==='subtract'?'Cuenta lo que queda después de retirar.':model.op==='multiply'?'Todos los grupos tienen lo mismo. ¿Cuántos hay en total?':'Todos deben recibir lo mismo. ¿Cuántos recibe cada grupo?'}</p>}
  {model.hasSecond&&<p className="math-learning-next"><b>Segunda etapa</b>{follow}</p>}
  {model.reveal&&<div className="math-learning-worked"><h4>Vamos paso a paso</h4><ol>{(model.steps.length?model.steps:[`${model.a} ${model.sign} ${model.b} = ${model.first}`,...(model.hasSecond?[`${model.first} ${model.sign} ${model.c} = ${model.final}`]:[])]).map((step,index)=><li key={index}>{step}</li>)}</ol><p className="math-learning-answer">{model.expression} = <strong>{model.final}</strong></p></div>}
 </section>
}

import { useRef, useState } from 'react'
import ObjectArt, { MapFragment, ProofSymbol } from './ObjectArt.jsx'
import { addSequence, moveSequence, assignPuzzle, draftComplete, puzzleDrop } from './puzzleInteraction.js'
import './PuzzleBoard.css'

const patternColors={sun:'#f3cd6e',moon:'#acb9ee',star:'#edc876',diamond:'#97dce2',leaf:'#94c78e',drop:'#8adce8',cloud:'#c4e4e8',spiral:'#d2a0e8'}
export function Pattern({symbols}){return <span className="detective-pattern" aria-hidden="true">{symbols.map((symbol,index)=><svg viewBox="0 0 100 100" key={index}><ProofSymbol symbol={symbol} fill={patternColors[symbol]||'#f6d785'}/></svg>)}</span>}
function Piece({item,fullMap=false}){
 if(Number.isInteger(item.fragment))return <svg className="detective-puzzle-fragment" viewBox="0 0 100 100" aria-hidden="true">{!fullMap&&<rect x="12" y="18" width="76" height="62" rx="5" fill="#e4c58b"/>}<MapFragment fragment={item.fragment} full={fullMap}/></svg>
 if(item.pattern)return <Pattern symbols={item.pattern}/>
 return item.kind?<ObjectArt kind={item.kind} object={item}/>:item.symbol?<span className="detective-puzzle-symbol" aria-hidden="true">{item.symbol}</span>:null
}

export default function PuzzleBoard(props){
 return <PuzzleStage key={`${props.puzzle.question}:${props.stage||0}`} {...props}/>
}
function PuzzleStage({puzzle,stage=0,draft,onChange,onSubmit,disabled=false}){
 const active=puzzle.type==='multi'?puzzle.stages[stage]:puzzle
 const [selection,setSelection]=useState(null)
 const gesture=useRef(null),skipClick=useRef(false)
 const items=active.items||[],targets=active.targets||[],type=active.type||'choice'
 const order=Array.isArray(draft)?draft:[],map=draft&&typeof draft==='object'&&!Array.isArray(draft)?draft:{}
 const requiredCount=active.requiredCount??items.length,valid=draftComplete(active,draft)
 function choose(id){if(skipClick.current){skipClick.current=false;return}if(!disabled)setSelection(current=>current===id?null:id)}
 function place(id,target){if(disabled)return;if(type==='sequence')onChange(moveSequence(order,id,Number(target)));else onChange(assignPuzzle(map,id,target,items,targets));setSelection(null)}
 function pointerStart(event,id){if(disabled||event.button!==0)return;gesture.current={id,x:event.clientX,y:event.clientY,moved:false};event.currentTarget.setPointerCapture?.(event.pointerId)}
 function pointerMove(event){const drag=gesture.current;if(drag&&Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>10){drag.moved=true;event.preventDefault()}}
 function pointerEnd(event){const drag=gesture.current;gesture.current=null;if(disabled)return;const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-puzzle-target]'),drop=puzzleDrop(drag,{x:event.clientX,y:event.clientY},target?.dataset.puzzleTarget,!!target&&!!event.currentTarget.closest('.detective-puzzle-board')?.contains(target));if(drop){place(drop.id,drop.target);skipClick.current=true;event.preventDefault()}}
 const dragHandlers=id=>({onPointerDown:event=>pointerStart(event,id),onPointerMove:pointerMove,onPointerUp:pointerEnd,onPointerCancel:()=>{gesture.current=null}})
 return <div className={`detective-puzzle-board detective-puzzle-${type}`}>
  {puzzle.type==='multi'&&<p className="detective-puzzle-stage" role="status">Etapa {stage+1} de {puzzle.stages.length}</p>}
  <h3>{active.question}</h3><p className="detective-riddle-clue">{active.clue}</p>
  {(active.referencePattern||active.targetPattern)&&<div className="detective-pattern-reference"><span>Patrón de referencia</span><Pattern symbols={active.referencePattern||active.targetPattern}/></div>}
  {type==='choice'&&<div className="detective-puzzle-choices" role="group" aria-label="Respuestas posibles">{active.options.map(option=><button type="button" key={option.id} disabled={disabled} aria-pressed={draft===option.id} onClick={()=>onChange(option.id)}><Piece item={option}/><span>{option.label}</span></button>)}</div>}
  {type==='sequence'&&<>
   <p className="detective-puzzle-instruction">Selecciona {requiredCount} de {items.length} fichas en orden. Puedes moverlas con las flechas o arrastrarlas a otra posición.</p>
   <div className="detective-puzzle-bank" role="group" aria-label="Fichas disponibles">{items.filter(item=>!order.includes(item.id)).map(item=><button type="button" key={item.id} disabled={disabled||order.length>=requiredCount} onClick={()=>onChange(addSequence(order,item.id,items,requiredCount))}><Piece item={item}/><span>{item.label}</span></button>)}</div>
   <ol className="detective-sequence" aria-label="Tu secuencia">{order.map((id,index)=>{const item=items.find(item=>item.id===id);return item?<li key={id} data-puzzle-target={index}><button type="button" className="detective-sequence-tile" disabled={disabled} aria-label={`${index+1}. ${item.label}. Quitar de la secuencia`} onClick={()=>{if(skipClick.current){skipClick.current=false;return}onChange(order.filter(value=>value!==id))}} {...dragHandlers(id)}><b>{index+1}</b><Piece item={item}/><span>{item.label}</span></button><div className="detective-sequence-arrows"><button type="button" disabled={disabled||index===0} aria-label={`Mover ${item.label} antes`} onClick={()=>onChange(moveSequence(order,id,index-1))}>←</button><button type="button" disabled={disabled||index===order.length-1} aria-label={`Mover ${item.label} después`} onClick={()=>onChange(moveSequence(order,id,index+1))}>→</button></div></li>:null})}</ol>
  </>}
  {(type==='match'||type==='assemble')&&<>
   <p className="detective-puzzle-instruction">Selecciona una pieza y después su lugar, o arrástrala. También puedes usar los menús de cada pieza.</p>
   <div className="detective-puzzle-bank" role="group" aria-label="Piezas para colocar">{items.map(item=><button type="button" key={item.id} disabled={disabled} aria-pressed={selection===item.id} className={map[item.id]?'has-place':''} onClick={()=>choose(item.id)} {...dragHandlers(item.id)}><Piece item={item}/><span>{item.label}</span>{map[item.id]&&<small>En {targets.find(target=>target.id===map[item.id])?.label}</small>}</button>)}</div>
   {active.layout==='robot'&&<svg className="detective-robot-blueprint" viewBox="0 0 240 130" aria-hidden="true"><path d="M88 12H151V54H88ZM76 63H164V115H76Z" fill="#5a608a" stroke="#bcdaea" strokeWidth="3"/><path d="M91 115L82 129M149 115L158 129M76 75L44 96M164 75L195 96" stroke="#b8d7e2" strokeWidth="10" strokeLinecap="round"/><circle cx="106" cy="34" r="6" fill="#abe6ee"/><circle cx="133" cy="34" r="6" fill="#abe6ee"/><path d="M100 91H140" stroke="#efcd83" strokeWidth="5"/></svg>}
   <div className={`detective-puzzle-targets ${active.layout?'layout-'+active.layout:''}`} role="group" aria-label="Lugares para las piezas">{targets.map(target=>{const item=items.find(item=>map[item.id]===target.id);return <button type="button" key={target.id} data-puzzle-target={target.id} disabled={disabled} aria-label={`${target.label}: ${item?item.label:'sin pieza'}. ${selection?'Colocar la pieza seleccionada':'Selecciona primero una pieza'}`} onClick={()=>selection&&place(selection,target.id)}><span className="detective-target-label">{target.label}</span>{item?<><Piece item={item} fullMap={active.layout==='map'}/><span className="detective-placed-piece-label">{item.label}</span></>:<span className="detective-empty-slot" aria-hidden="true">+</span>}</button>})}</div>
   <details className="detective-puzzle-keyboard"><summary>Colocar con menús accesibles</summary>{items.map(item=><label key={item.id}><span>{item.label}</span><select disabled={disabled} aria-label={`Ubicación de ${item.label}`} value={map[item.id]||''} onChange={event=>{if(event.target.value)place(item.id,event.target.value);else{const next={...map};delete next[item.id];onChange(next)}}}><option value="">Sin colocar</option>{targets.map(target=><option key={target.id} value={target.id}>{target.label}</option>)}</select></label>)}</details>
  </>}
  <p className="detective-draft-status" role="status">{type==='choice'?(valid?'Respuesta seleccionada. Puedes comprobarla.':'Elige una respuesta antes de comprobar.'):`${type==='sequence'?order.length:Object.keys(map).length} de ${type==='sequence'?requiredCount:items.length} piezas ${type==='sequence'?'ordenadas':'colocadas'}.`}</p>
  <button type="button" className="primary-button detective-puzzle-submit" disabled={disabled||!valid} onClick={()=>onSubmit(draft)}>Comprobar respuesta</button>
 </div>
}

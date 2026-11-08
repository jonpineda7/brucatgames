import { characterById } from './data.js'
import { GuestArt } from './BanquetArt.jsx'
export function Gorilla({win=false,poisoned=false,className=''}){
 if(!win)return <GuestArt character={characterById('brucat')} poisoned={poisoned} className={`bite-gorilla ${className}`}/>
 return <img className={`bite-gorilla ${className}`} src={`${import.meta.env.BASE_URL}images/results/victory.png`} alt="BruCat celebra la victoria" width="1351" height="1163" draggable={false} decoding="async"/>
}
export function Stars({count}){return <span className="bite-stars" aria-label={`${count} de 3 estrellas`}>{[1,2,3].map(index=><span key={index} aria-hidden="true" className={index<=count?'earned':''}>★</span>)}</span>}
export function Hearts({count}){return <div className="bite-hearts" role="img" aria-label={`${count} de 4 oportunidades`}>{[1,2,3,4].map(index=><span key={index} aria-hidden="true" className={index<=count?'':'heart-lost'}>{index<=count?'♥':'♡'}</span>)}</div>}
export function RecipeDetails({dish}){return <dl className="bite-recipe-details">{[['Ingredientes',dish.ingredients.join(', ')],['Temperatura',dish.temperature],['Sabor',dish.flavor],['Precio',`${dish.price} monedas`],['Horno',dish.baked?'Sí':'No']].map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>}
export function ResultStats({result}){return <div className="bite-result-stats">{[['Rondas',result.rounds],['Sobrevivientes',`${result.survivors}/4`],['Platos seguros',result.safeServed],['Envenenados',result.poisonedServed]].map(([label,value])=><span key={label}><b>{value}</b>{label}</span>)}</div>}

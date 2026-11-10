import { OBJECTS, starPoints } from './objects.js'
export function ObjectShapes({kind,tint,symbol,pattern}){
 const object={...OBJECTS[kind],fill:tint||OBJECTS[kind].fill}
 return <g stroke="#62402f" strokeWidth="2.3" strokeLinejoin="round">
  {object.regions.map((region,index)=>region.type==='circle'?<circle key={index} cx={region.cx} cy={region.cy} r={region.r} fill={object.fill}/>:<polygon key={index} points={region.points.map(point=>point.join(',')).join(' ')} fill={object.fill}/>)}
  <ObjectDetails kind={kind} symbol={symbol} pattern={pattern}/>
  {kind==='key'&&<><circle cx="24" cy="43" r="12" fill="#663a77" stroke="#ffe7a1" strokeWidth="1.7"/>{!symbol||symbol==='star'?<polygon points={starPoints} transform="translate(14 33) scale(.2)" fill="#ffe583" stroke="none"/>:<g transform="translate(14 33) scale(.2)"><ProofSymbol symbol={symbol} fill="#ffe583"/></g>}<path d="M42 41H85" stroke="#ffedb0" strokeWidth="1.8"/></>}
  {kind==='glass'&&<><circle cx="38" cy="37" r="21" fill="#a5dce4" stroke="#ffd67c" strokeWidth="2"/><path d="M24 31Q29 20 40 20" fill="none" stroke="#ecf8e9" strokeWidth="4" strokeLinecap="round"/><path d="M64 61L81 80" stroke="#86523e" strokeWidth="4"/></>}
  {kind==='scroll'&&<><path d="M21 25H78M23 76H79M33 40H66M33 49H61M33 58H66" fill="none" stroke="#9a6b4c" strokeWidth="2.8"/><polygon points={starPoints} transform="translate(38 60) scale(.24)" fill="#7f519b" stroke="none"/></>}
  {kind==='coin'&&<><circle cx="50" cy="50" r="23" fill="none" stroke="#ffdc84" strokeWidth="3"/><polygon points={starPoints} transform="translate(27 26) scale(.46)" fill="#bc7b28" stroke="#ffe197" strokeWidth="1.5"/></>}
  {kind==='crown'&&<><path d="M21 68H79L77 76H23Z" fill="#b67b24"/><path d="M17 40L32 51L49 27L68 51L83 40" fill="none" stroke="#ffe9a1" strokeWidth="3"/><path d="M50 49l7 9l-7 9l-7 -9Z" fill="#8453a7" stroke="#ffe6b0" strokeWidth="1.2"/><circle cx="29" cy="59" r="3" fill="#659cae" stroke="none"/><circle cx="71" cy="59" r="3" fill="#659cae" stroke="none"/></>}
 </g>
}
function ObjectDetails({kind,symbol,pattern}){
 const ink='#654160',light='#fff0c1'
 const line={fill:'none',stroke:ink,strokeWidth:3,strokeLinecap:'round'}
 switch(kind){
  case 'book':return <><path d="M26 23L75 18V77L26 83Z" fill="#61367f"/><path d="M24 81L76 77M29 27V74" {...line} stroke={light}/><path d="M47 35l7 12l13 3l-11 8l1 13l-11 -7l-11 5l3 -13l-9 -9l13 -1Z" fill="#edcb73" strokeWidth="1.5"/></>
  case 'rune':return symbol?<g transform="translate(22 22) scale(.56)"><ProofSymbol symbol={symbol} fill={light}/></g>:<><path d="M31 30L50 65L69 30M36 48H64" {...line} stroke={light}/><path d="M22 61L30 72M69 64L76 51" {...line} stroke="#71669d"/></>
  case 'lock':return <><path d="M36 40V33a14 14 0 0 1 28 0V40" fill="none" stroke="#fff0b9" strokeWidth="7"/><path d="M25 44H76V80H25Z" fill="#bd853c"/>{symbol?<g transform="translate(34 45) scale(.32)"><ProofSymbol symbol={symbol} fill="#ffe6a2"/></g>:<><circle cx="50" cy="57" r="7" fill="#533657"/><path d="M47 59L44 70H56L53 59Z" fill="#533657"/></>}</>
  case 'map':return <><path d="M38 24L37 78M64 20L61 75" {...line} stroke="#c5a369" strokeWidth="1.8"/><path d="M23 60Q40 28 48 49T74 43" {...line} stroke="#a56b66" strokeDasharray="4 4"/><path d="M69 56l10 11m0 -11l-10 11" {...line}/></>
  case 'compass':return <><circle cx="50" cy="53" r="26" fill="#f8e5b6"/><path d="M50 25L59 53L50 81L42 53Z" fill="#9376bb"/><path d="M50 25L59 53H50Z" fill="#e5bc59"/><path d="M25 53H34M66 53H75" {...line}/><circle cx="50" cy="53" r="4" fill={ink}/></>
  case 'feather':return <><path d="M23 80L69 26M34 64L31 47M44 53L43 35M44 55L62 53M56 41L72 38" {...line} stroke="#d8fff1"/></>
  case 'paw':return <><circle cx="50" cy="50" r="32" fill="none" stroke="#efc88f" strokeWidth="2"/>{symbol==='bird'?<path d="M50 71V32M50 51L31 31M50 51L70 31" stroke="#78584c" strokeWidth="7" strokeLinecap="round"/>:<>{symbol!=='turtle'&&<ellipse cx="50" cy="62" rx="17" ry="15" fill="#78584c" stroke="none"/>}{(symbol==='monkey'?[[24,43],[34,29],[50,24],[65,29],[77,43]]:symbol==='turtle'?[[32,36],[66,36],[32,65],[66,65]]:[[27,38],[42,28],[59,28],[73,38]]).map(([cx,cy],i)=><ellipse key={i} cx={cx} cy={cy} rx={symbol==='turtle'?8:6} ry={symbol==='turtle'?11:9} fill="#78584c" stroke="none"/>)}</>}</>
  case 'leaf':return <><path d="M23 79L72 25M40 61L36 39M51 50L72 49" {...line} stroke="#d8f3ac"/></>
  case 'flower':return <><circle cx="50" cy="50" r="13" fill="#edc76b"/><circle cx="47" cy="47" r="4" fill="#fff0b3" stroke="none"/></>
  case 'crystal':return <><path d="M37 13L44 45L20 64M66 13L57 45L43 89M57 45L82 45L70 80M44 45H57" fill="none" stroke="#e5ffff" strokeWidth="2"/><path d="M37 14L43 43L22 34Z" fill="#abedec" stroke="none"/></>
  case 'bottle':return <><path d="M23 53H77V78H23Z" fill="#a69ad9"/><path d="M35 18H65M37 25H63" {...line} stroke="#e4c68c"/><circle cx="50" cy="62" r="10" fill="#e9d68c"/><path d="M47 58L54 65M54 58L47 65" {...line} strokeWidth="2"/></>
  case 'gear':return <><circle cx="50" cy="51" r="22" fill="#907c68"/><circle cx="50" cy="51" r="13" fill="#c8e3e2" stroke="#ffe3a2" strokeWidth="3"/><path d="M29 35L34 29M71 34L76 40M68 72L62 77" {...line} stroke={light}/></>
  case 'wrench':return <><path d="M23 79L42 46M27 28L32 39L49 43" {...line} stroke="#eef4ff" strokeWidth="4"/><circle cx="23" cy="79" r="3" fill={ink}/></>
  case 'battery':return <><path d="M26 29H73V78H26Z" fill="#7860ab"/><path d="M52 34L37 54H49L46 72L64 48H52Z" fill="#ffe596" stroke="none"/><path d="M39 19H61" {...line} stroke={light}/></>
  case 'wire':return <><path d="M26 23V41L34 46H55L60 52V73H75" {...line} stroke="#e1f7d5" strokeWidth="3"/><path d="M20 16V10M31 16V10M82 68H89M82 79H89" {...line} stroke="#e4c767"/></>
  case 'lens':return <><circle cx="50" cy="50" r="26" fill="#5c799d"/><circle cx="50" cy="50" r="18" fill="#b5e4ed"/><path d="M40 43Q45 35 53 36" {...line} stroke="#fff6d1" strokeWidth="4"/></>
  case 'collar':return <><path d="M26 26L31 59L44 72H58L71 58L76 26" {...line} stroke="#f1c5ed"/><path d="M50 67L60 77L50 89L40 77Z" fill="#f6d779"/><circle cx="50" cy="77" r="3" fill="#9561b5"/></>
  case 'ticket':return <><path d="M59 28V74" {...line} stroke="#b16e5d" strokeDasharray="3 4"/>{symbol?<text x="40" y="62" textAnchor="middle" fontSize="25" fontWeight="800" fontFamily="sans-serif" fill="#684366" stroke="none">{symbol}</text>:<polygon points={starPoints} transform="translate(25 37) scale(.33)" fill="#8c5896" stroke="none"/>}</>
  case 'apple':return <><path d="M52 26L52 41M60 26L73 22" {...line} stroke="#558253"/><path d="M22 49Q22 40 31 39" {...line} stroke="#ffe6bc" strokeWidth="5"/><path d="M46 77Q51 80 56 76" {...line} stroke="#b35b69"/></>
  case 'basket':return <><path d="M21 47H80M27 61H76M29 73H73M36 47L40 81M51 47V81M66 47L63 81" {...line} stroke="#f2c889" strokeWidth="2"/><path d="M31 42L36 27H64L71 42" {...line} stroke="#8c633f"/></>
  case 'parcel':return <><path d="M18 26L50 39L84 27M50 39V87" {...line} stroke="#8e6548"/><path d="M37 19L70 32V81L61 84V35L29 23Z" fill="#f6d99c" stroke="none"/><path d="M25 51L41 57V70L25 64Z" fill="#fff2d3" stroke="none"/></>
  case 'stamp':return <><path d="M26 25H74V75H26Z" fill="#e9d7f0" stroke="#d6bbec" strokeDasharray="4 3"/><path d="M34 60L45 40L53 52L62 35L69 63Z" fill="#6b94bd"/><circle cx="38" cy="35" r="6" fill="#e7bd69" stroke="none"/></>
  case 'envelope':return <><path d="M14 27L50 55L86 27M14 76L39 52M86 76L61 52" {...line} stroke="#ae835d"/><circle cx="50" cy="55" r="8" fill="#b07bac" stroke="#e5b9d6" strokeWidth="2"/></>
  case 'clock':{
   const hour=Number(symbol),angle=((Number.isFinite(hour)?hour:4)*30-90)*Math.PI/180
   return <><circle cx="50" cy="50" r="28" fill="#f4e6c0"/><path d="M50 26V31M26 50H31M50 69V74M69 50H74M50 36V50" {...line}/><path d={`M50 50L${50+Math.cos(angle)*16} ${50+Math.sin(angle)*16}`} {...line} strokeWidth="4"/><circle cx="50" cy="50" r="3" fill={ink}/></>
  }
  case 'brush':return <><path d="M32 55L47 64M49 31L60 39" {...line} stroke="#f2db9e" strokeWidth="4"/><path d="M25 70L23 83L38 75L41 65Z" fill="#9d7ba8" stroke="none"/></>
  case 'painting':return <><path d="M22 23H78V77H22Z" fill="#90cfd0"/>{pattern?<g>{pattern.map((mark,index)=><g key={index} transform={`translate(${24+index*17} 38) scale(.15)`}><ProofSymbol symbol={mark} fill="#674a82"/></g>)}</g>:<><path d="M25 68L44 43L55 57L66 40L76 72Z" fill="#7e90ae"/><circle cx="37" cy="34" r="7" fill="#efcc73" stroke="none"/></>}<path d="M17 18L23 24M83 18L77 24M17 82L23 76M83 82L77 76" {...line} stroke="#f6d899" strokeWidth="2"/></>
  case 'prism':return <><path d="M50 15L50 67L15 78M50 67L84 78M27 53H74" {...line} stroke="#e4f7fb" strokeWidth="2"/><path d="M50 15L50 67L16 78Z" fill="#b7a3da" stroke="none" opacity=".6"/></>
  case 'medal':return <><path d="M29 16L43 44M71 16L57 44" {...line} stroke="#9869b1" strokeWidth="6"/><circle cx="50" cy="63" r="18" fill="#b9853c" stroke="#ffe2a1"/><polygon points={starPoints} transform="translate(36 48) scale(.29)" fill="#ffe2a1" stroke="none"/></>
  default:return null
 }
}
// Semantic marks are vector paths, so the visible clue never depends on emoji fonts.
export function ProofSymbol({symbol,fill='#f6d785'}){
 switch(symbol){
  case 'heart':return <path d="M50 84L17 52C-1 25 25 4 50 29C75 4 101 25 83 52Z" fill={fill} stroke="none"/>
  case 'diamond':return <path d="M50 9L88 49L50 89L12 49Z" fill={fill} stroke="none"/>
  case 'sun':return <><circle cx="50" cy="50" r="20" fill={fill} stroke="none"/><path d="M50 5V20M50 80V95M5 50H20M80 50H95M18 18L28 28M72 72L82 82M18 82L28 72M72 28L82 18" stroke={fill} strokeWidth="6"/></>
  case 'moon':return <path d="M68 12A39 39 0 1 0 80 75A41 41 0 0 1 68 12Z" fill={fill} stroke="none"/>
  case 'cloud':return <path d="M23 76C1 75 1 42 24 42C23 14 62 6 71 33C103 29 110 72 81 76Z" fill={fill} stroke="none"/>
  case 'drop':return <path d="M50 9C39 25 14 51 20 69C29 99 72 99 80 69C86 51 62 26 50 9Z" fill={fill} stroke="none"/>
  case 'leaf':return <><path d="M15 83Q5 12 88 10Q90 88 15 83Z" fill={fill} stroke="none"/><path d="M16 84L69 30" fill="none" stroke="#ffffff88" strokeWidth="5"/></>
  case 'spiral':return <path d="M82 67C94 17 17 4 14 49C10 92 73 94 70 50C68 29 34 30 37 53C38 66 57 67 57 52" fill="none" stroke={fill} strokeWidth="8"/>
  default:return <polygon points={starPoints} fill={fill} stroke="none"/>
 }
}
export default function ObjectArt({kind,object,className=''}){return <svg className={`detective-object-icon ${className}`} viewBox="0 0 100 100" aria-hidden="true">{object?<ObjectVisual object={object}/>:<ObjectShapes kind={kind}/>}</svg>}

// Every fragment views a different quadrant of the same illustrated map.
export function MapFragment({fragment=0,full=false}){
 const index=Math.max(0,Math.min(3,Math.floor(fragment))),x=index%2*100,y=Math.floor(index/2)*100
 return <svg x={full?0:18} y={full?0:24} width={full?100:64} height={full?100:51} viewBox={`${x} ${y} 100 100`} preserveAspectRatio="none" overflow="hidden" aria-hidden="true"><rect width="200" height="200" fill="#f7e6b6"/><path d="M0 35Q50 20 82 45T140 40T200 20V0H0ZM0 180Q44 152 90 180T200 166V200H0Z" fill="#a7c68d" stroke="none"/><path d="M188 65Q175 85 151 97T114 118T85 152T0 185" fill="none" stroke="#79b7d5" strokeWidth="17"/><path d="M48 67Q75 85 111 92T110 128T145 166" fill="none" stroke="#a46966" strokeWidth="6" strokeDasharray="6 4"/><path d="M15 67L41 23L68 67ZM43 68L65 36L84 68Z" fill="#9b9ba0" stroke="#70717c" strokeWidth="3"/><path d="M29 43L41 23L53 43L44 39L39 45Z" fill="#fff2ce" stroke="none"/><circle cx="155" cy="39" r="17" fill="#edba54" stroke="#b28241" strokeWidth="2"/><path d="M155 12V17M155 61V67M127 39H132M178 39H184M136 20L140 24M173 55L178 60" stroke="#d6a146" strokeWidth="3"/><path d="M122 177L150 132L179 177Z" fill="#b88ac5" stroke="#77527b" strokeWidth="3"/><path d="M150 132V177H166Z" fill="#816197" stroke="#77527b" strokeWidth="2"/><path d="M145 162L139 177H153Z" fill="#5b4d66" stroke="none"/><path d="M111 180H187" stroke="#b2825e" strokeWidth="3"/></svg>
}
// Transparent PNG/WebP replacements use the same normalized 100×100 artwork frame.
// Their matching masks must be approved in OBJECTS before an asset is enabled.
export function ObjectVisual({object}){
 const art=object.art||OBJECTS[object.kind].art
 return object.kind==='map'&&Number.isInteger(object.fragment)?<><ObjectShapes kind="map" tint={object.tint}/><MapFragment fragment={object.fragment}/></>:art?<image href={`${import.meta.env.BASE_URL}${art.src}`} x="0" y="0" width="100" height="100" preserveAspectRatio="none"/>:<ObjectShapes kind={object.kind} tint={object.tint} symbol={object.symbol} pattern={object.pattern}/>
}

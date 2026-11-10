// In-page navigation must not write to location.hash: it belongs to the router.
export function revealSection(node){
 if(!node)return
 node.focus({preventScroll:true})
 node.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})
}
export function returnToTop(node){
 node?.focus({preventScroll:true})
 window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})
}

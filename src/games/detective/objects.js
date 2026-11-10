/** Geometry in each object's 100 × 100 local artwork; shared by rendering and hit detection. */
export const OBJECTS = {
 key: { name:'Llave dorada', detail:'Su empuñadura tiene una estrella.', anchor:[55,44], fill:'#efba46', regions:[{type:'circle',cx:24,cy:43,r:17},{type:'polygon',points:[[36,37],[89,37],[89,57],[80,57],[80,48],[71,48],[71,57],[62,57],[62,48],[36,48]]}] },
 glass: { name:'Lupa', detail:'Una lupa para mirar los detalles.', anchor:[38,37], fill:'#79cfdc', regions:[{type:'circle',cx:38,cy:37,r:26},{type:'polygon',points:[[53,56],[63,49],[89,79],[78,89]]}] },
 scroll: { name:'Pergamino', detail:'«Anota dónde aparece la corona para preparar la fiesta».', anchor:[50,50], fill:'#f5db9f', regions:[{type:'polygon',points:[[17,16],[78,16],[85,25],[80,77],[87,85],[23,85],[15,77],[21,25]]}] },
 coin: { name:'Moneda', detail:'Una moneda con el emblema de la fiesta.', anchor:[50,50], fill:'#f3bd43', regions:[{type:'circle',cx:50,cy:50,r:29}] },
 crown: { name:'Corona', detail:'¡La encontramos! Falta descubrir por qué cambió de lugar.', anchor:[50,61], fill:'#eebb45', regions:[{type:'polygon',points:[[11,29],[33,45],[50,17],[67,45],[89,29],[80,77],[20,77]]}] },
}
export const starPoints='50,12 59,37 86,38 65,54 72,81 50,65 28,81 35,54 14,38 41,37'

// The visible base silhouettes below are also the interaction masks used by ObjectArt.
const polygon=points=>({type:'polygon',points})
const circle=(cx,cy,r)=>({type:'circle',cx,cy,r})
const icon=(name,fill,regions,anchor=[50,50])=>({name,detail:'Una prueba de esta investigación.',fill,regions,anchor})
Object.assign(OBJECTS,{
 book:icon('Libro secreto','#9460c7',[polygon([[18,16],[74,12],[82,20],[82,84],[24,89],[18,82]])]),
 rune:icon('Piedra de símbolos','#9d8ed0',[polygon([[29,13],[73,18],[88,49],[75,83],[29,88],[12,56]])]),
 lock:icon('Cerradura','#e4af45',[polygon([[22,40],[78,40],[78,84],[22,84]]),circle(50,34,22)]),
 map:icon('Fragmento de mapa','#f0d8a5',[polygon([[13,16],[39,23],[65,15],[88,23],[84,85],[61,78],[37,86],[15,78]])]),
 compass:icon('Brújula','#e6b952',[circle(50,53,32),circle(50,17,8)],[50,53]),
 feather:icon('Pluma','#8fd8d9',[polygon([[22,78],[26,46],[49,18],[77,12],[81,36],[60,65],[33,77],[20,89],[14,85]])],[48,50]),
 paw:icon('Placa de huellas','#cba16b',[circle(50,50,38)]),
 leaf:icon('Hoja','#84bd6d',[polygon([[17,77],[20,43],[42,20],[83,13],[80,52],[57,79],[28,85]])]),
 flower:icon('Flor','#e6a1c9',[circle(50,50,13),circle(50,26,15),circle(73,43,15),circle(64,70,15),circle(35,70,15),circle(26,43,15)]),
 crystal:icon('Cristal','#8bd4ed',[polygon([[37,12],[66,12],[85,45],[70,81],[43,90],[18,65],[20,34]])]),
 bottle:icon('Frasco','#7fcfd0',[polygon([[35,12],[65,12],[65,34],[80,49],[80,82],[20,82],[20,49],[35,34]])]),
 gear:icon('Engranaje','#ceac64',[polygon([[40,12],[61,12],[65,23],[76,23],[83,31],[78,43],[89,47],[89,62],[77,66],[78,78],[67,85],[57,79],[48,90],[35,84],[35,73],[22,72],[15,60],[23,50],[13,40],[21,27],[34,29]])]),
 wrench:icon('Llave mecánica','#b5c9db',[polygon([[23,12],[32,29],[46,29],[53,14],[63,23],[65,39],[56,53],[43,56],[27,88],[15,82],[34,49],[22,43],[17,28]])],[38,46]),
 battery:icon('Batería','#e8c368',[polygon([[22,23],[42,23],[42,15],[59,15],[59,23],[78,23],[78,85],[22,85]])]),
 wire:icon('Cable','#73d0de',[polygon([[19,16],[34,16],[34,38],[57,38],[67,48],[67,68],[82,68],[82,82],[57,82],[51,74],[51,54],[30,54],[19,44]]),polygon([[18.5,8.5],[21.5,8.5],[21.5,18],[18.5,18]]),polygon([[29.5,8.5],[32.5,8.5],[32.5,18],[29.5,18]]),polygon([[81,66.5],[90.5,66.5],[90.5,69.5],[81,69.5]]),polygon([[81,77.5],[90.5,77.5],[90.5,80.5],[81,80.5]])],[40,46]),
 lens:icon('Lente','#9cdbf0',[circle(50,50,33)]),
 collar:icon('Collar','#c78ad9',[polygon([[18,22],[33,17],[39,57],[50,67],[63,56],[68,17],[83,24],[78,63],[63,82],[39,82],[23,63]]),polygon([[50,67],[60,77],[50,89],[40,77]])],[50,74]),
 ticket:icon('Entrada','#eab777',[polygon([[15,23],[85,23],[85,39],[75,42],[75,59],[85,63],[85,79],[15,79],[15,63],[25,59],[25,42],[15,39]])]),
 apple:icon('Manzana','#e99391',[circle(33,57,24),circle(65,57,24),polygon([[45,19],[56,19],[59,43],[43,43]]),polygon([[57,25],[70,13],[84,17],[74,31]])],[50,57]),
 basket:icon('Cesta','#cb9a61',[polygon([[15,42],[85,42],[77,84],[24,84]]),polygon([[23,43],[28,23],[40,14],[61,14],[74,23],[79,43],[68,43],[63,29],[39,29],[33,43]])],[50,62]),
 parcel:icon('Paquete','#d3a96d',[polygon([[17,25],[50,13],[84,27],[84,76],[50,89],[17,76]])]),
 stamp:icon('Sello','#aa9ada',[polygon([[18,17],[82,17],[82,83],[18,83]])]),
 envelope:icon('Sobre','#f2d9ae',[polygon([[12,25],[88,25],[88,78],[12,78]])]),
 clock:icon('Reloj','#e5ba65',[circle(50,50,34)]),
 brush:icon('Pincel','#dba66e',[polygon([[61,12],[75,20],[48,60],[44,77],[25,88],[20,70],[32,52]])],[44,52]),
 painting:icon('Cuadro','#d7ad62',[polygon([[14,15],[86,15],[86,85],[14,85]])]),
 prism:icon('Prisma','#a9b6eb',[polygon([[50,12],[88,80],[12,80]])],[50,53]),
 medal:icon('Medalla','#efbf55',[circle(50,63,24),polygon([[24,12],[43,12],[56,41],[37,51]]),polygon([[58,12],[77,12],[63,51],[44,41]])],[50,63]),
})

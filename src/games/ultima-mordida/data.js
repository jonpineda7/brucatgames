const png = (name,width,height) => ({src:`games/ultima-mordida/characters/${name}.png`,width,height})
export const VILLAIN_ID='cocodrilo'
export const CHARACTERS=[
 {id:'brucat',name:'BruCat',title:'El gorila anfitrión',innocent:true,art:{normal:png('brucat-normal',884,887),poisoned:png('brucat-poisoned',1199,1312)}},
 {id:'gata',name:'Gata',title:'La invitada del lazo morado',innocent:true,art:{normal:png('gata-normal',1312,1199),poisoned:png('gata-poisoned',1199,1312)}},
 {id:'ajolote',name:'Axo',title:'El ajolote de la sudadera turquesa',innocent:true,art:{normal:png('ajolote-normal',1312,1199),poisoned:png('ajolote-poisoned',1312,1199)}},
 {id:'bruno',name:'Bruno',title:'El caballero rana',innocent:true,art:{normal:png('bruno-normal',1312,1199),poisoned:png('bruno-poisoned',1287,1222)}},
 {id:VILLAIN_ID,name:'Cocodrilo',title:'El villano del sombrero elegante',innocent:false,art:{normal:png('cocodrilo-normal',890,887),poisoned:png('cocodrilo-poisoned',1220,1289)}},
]
// Explicit recipes: clues describe THESE dishes, rather than assumptions about all food.
const dish = (id,name,image,category,ingredients,temperature,flavor,price,baked) => ({id,name,image,category,ingredients,temperature,flavor,price,baked})
export const MENUS = {
  castle:[
    dish('pizza','Pizza del huerto','pizza','horno',['masa','tomate','queso','verduras'],'caliente','salado',3,true),
    dish('burger','Hamburguesa real','burger','pan',['pan','carne','queso','verduras'],'caliente','salado',4,false),
    dish('sushi','Sushi del jardín','sushi','rollitos',['arroz','alga','pescado','verduras'],'frío','salado',5,false),
    dish('tacos','Tacos del castillo','tacos','tortilla',['maíz','carne','verduras'],'caliente','salado',2,false),
    dish('cake','Pastel de fresas','cake','postre',['harina','huevo','fresa','chocolate'],'frío','dulce',1,true),
  ],
  garden:[
    dish('pizza','Pizza fría del jardín','pizza','horno',['masa','tomate','queso','verduras'],'frío','salado',4,true),
    dish('burger','Hamburguesa de arroz','burger','pan',['pan','arroz','verduras'],'caliente','salado',3,false),
    dish('sushi','Sushi dulce de mango','sushi','rollitos',['arroz','mango','coco'],'frío','dulce',5,false),
    dish('tacos','Tacos de chocolate','tacos','tortilla',['maíz','chocolate','fresa'],'frío','dulce',2,false),
    dish('cake','Pastel salado de queso','cake','horno',['harina','queso','verduras'],'caliente','salado',1,true),
  ],
  festival:[
    dish('pizza','Pizza de manzana','pizza','horno',['masa','manzana','canela'],'caliente','dulce',2,true),
    dish('burger','Hamburguesa de setas','burger','pan',['pan','setas','queso','verduras'],'caliente','salado',5,false),
    dish('sushi','Sushi de pepino','sushi','rollitos',['arroz','alga','verduras'],'frío','salado',3,false),
    dish('tacos','Tacos fríos de queso','tacos','tortilla',['maíz','queso','verduras'],'frío','salado',1,false),
    dish('cake','Pastel tibio de chocolate','cake','horno',['harina','huevo','chocolate'],'caliente','dulce',4,true),
  ],
}
export const STAGES=[
 {id:0,name:'Fácil',subtitle:'Pistas con solución única · Tutorial guiado',from:1,to:5,difficulty:'easy'},
 {id:1,name:'Normal',subtitle:'Pistas parciales · Ayuda opcional',from:6,to:10,difficulty:'normal'},
 {id:2,name:'Difícil',subtitle:'Menos información · Más incertidumbre',from:11,to:15,difficulty:'hard'},
 {id:3,name:'Experto',subtitle:'Recetas especiales · Riesgo controlado',from:16,to:20,difficulty:'expert'},
]
export const characterById = id => CHARACTERS.find(character=>character.id===id)
export const menuFor = level => MENUS[level.menu] || []
export const guestsFor = () => CHARACTERS

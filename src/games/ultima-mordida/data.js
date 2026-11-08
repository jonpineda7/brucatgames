export const CHARACTERS = [
  { id:'pipo', name:'Pipo', title:'El conejo nervioso', image:'rabbit', ears:'largas', outfit:'azul', gold:false, detail:'Lazo azul; orejas largas; sin detalle dorado.' },
  { id:'miga', name:'Miga', title:'El gato glotón', image:'cat', ears:'puntiagudas', outfit:'verde', gold:false, detail:'Babero verde; orejas puntiagudas; sin detalle dorado.' },
  { id:'bruno', name:'Bruno', title:'El oso dormilón', image:'bear', ears:'redondas', outfit:'azul', gold:true, detail:'Gorro azul con estrella dorada; orejas redondas.' },
  { id:'lino', name:'Lino', title:'El zorro elegante', image:'fox', ears:'puntiagudas', outfit:'azul', gold:true, detail:'Pajarita azul y monóculo dorado; orejas puntiagudas.' },
  { id:'moru', name:'Moru', title:'El monstruito bromista', image:'monster', ears:'redondas', outfit:'verde', gold:true, detail:'Capa verde con broche dorado; orejas redondas y cuernos suaves.' },
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
export const STAGES = [
  {id:0,name:'Aprendiz',subtitle:'Tres invitados · Tutorial guiado',from:1,to:5},
  {id:1,name:'Investigador',subtitle:'Cinco invitados · Tres pistas',from:6,to:10},
  {id:2,name:'Detective',subtitle:'Encuentra también al travieso',from:11,to:15},
  {id:3,name:'Maestro del Banquete',subtitle:'Recetas especiales · Cambia-Platos',from:16,to:20},
]
export const characterById = id => CHARACTERS.find(character => character.id === id)
export const menuFor = level => MENUS[level.menu].filter(dish => level.dishes.includes(dish.id))
export const guestsFor = level => level.guests.map(characterById)

// Shared catalogue: availability is explicit and independent of presentation.
const games = [
  { categoryId: 'infantil', status: 'available', id: 'memory', image: 'memoria-gorila.png', title: 'Memoria Gorila', text: 'Encuentra los pares y entrena tu memoria.', skill: 'Memoria y atención', color: 'violet', href: '#/infantil/memoria' },
  { categoryId: 'infantil', status: 'available', id: 'gorila-loco', image: 'gorila-loco.png', title: 'Gorila Loco', text: 'Atrapa animales, evita trampas y supera tu récord.', skill: 'Reflejos y coordinación', color: 'green', href: '#/infantil/gorila-loco', age: '4–10 años' },
  { categoryId: 'infantil', status: 'available', id: 'conecta-colores', image: 'conecta-los-colores.png', title: 'Conecta los Colores', text: 'Une las parejas sin cruzar caminos. 30 niveles para explorar.', skill: 'Lógica · Fácil a difícil', color: 'pink', href: '#/infantil/conecta-colores', age: '4–10 años' },
  { categoryId: 'infantil', status: 'available', id: 'ultima-mordida', image: 'la-ultima-mordida.png', title: 'La Última Mordida', text: 'Lee las pistas, reparte los platos y pulsa «¡A comer!».', skill: 'Deducción y estrategia', color: 'gold', href: '#/infantil/ultima-mordida', age: '6–10 años' },
  { categoryId: 'infantil', status: 'available', id: 'detective', image: 'detective-brucat.png', title: 'Detective BruCat', text: 'Explora cinco capítulos y resuelve quince misterios con BruCat.', skill: 'Observación y lógica', color: 'blue', href: '#/infantil/detective', age: '5–10 años' },
  { categoryId: 'infantil', status: 'available', id: 'math', image: 'brucat-math-adventure.png', title: 'BruCat Math Adventure', text: 'Explora diez zonas y abre caminos con sumas, restas, multiplicaciones y divisiones.', skill: 'Matemáticas y aventura', color: 'green', href: '#/infantil/math-adventure', age: '5–12 años' },

]

const categories=[
 {id:'infantil',name:'Infantil',status:'available',href:'#/infantil',description:'Aprende y descubre jugando, a tu ritmo',title:'¡Un mundo de aventuras!',catalogDescription:'Elige tu juego, despierta tu curiosidad y diviértete a tu ritmo.',imagePath:'images/categories/brucat-infantil',width:250,height:320},
 {id:'desafios-mentales',name:'Desafíos mentales',status:'comingSoon',description:'Lógica, memoria y acertijos para pensar diferente',imagePath:'images/categories/brucat-desafios-mentales',width:250,height:320},
 {id:'arcade',name:'Arcade',status:'comingSoon',description:'Reflejos, habilidad y partidas llenas de energía',imagePath:'images/categories/brucat-arcade',width:250,height:320},
]
export const CATALOG=Object.freeze({categories,games})
export function availableGames(categoryId='infantil',catalog=CATALOG){
 const category=catalog.categories.find(item=>item.id===categoryId)
 return category?.status==='available'&&category.href?catalog.games.filter(game=>game.categoryId===categoryId&&game.status==='available'&&game.href?.startsWith('#/')):[]
}
export const availableCategories=(catalog=CATALOG)=>catalog.categories.filter(category=>category.status==='available'&&category.href&&availableGames(category.id,catalog).length>0)
export const allAvailableGames=(catalog=CATALOG)=>availableCategories(catalog).flatMap(category=>availableGames(category.id,catalog))
export const featuredGames=(catalog=CATALOG)=>['memory','math','detective'].map(id=>allAvailableGames(catalog).find(game=>game.id===id)).filter(Boolean).slice(0,3)
export function isAvailableRoute(route,catalog=CATALOG){return route==='/'||availableCategories(catalog).some(category=>category.href.slice(1)===route)||allAvailableGames(catalog).some(game=>game.href.slice(1)===route)}

// Approved surfaces in the existing clean castle illustration. Coordinates are normalized.
const zone=(name,location,cx,cy,bounds,kinds)=>({name,location,cx,cy,bounds,kinds})
const all=['key','glass','scroll','coin','crown']
export const CASTLE_SCENE={
 id:'castle-study',background:'games/detective/castle-study.png',layers:{background:0,objects:10,feedback:30},
 zones:{
  books:zone('Los libros del fondo','sobre los libros del mueble del fondo',.522,.468,[.455,.40,.595,.54],all),
  deskLeft:zone('La mesa grande','sobre la parte izquierda de la mesa grande',.345,.604,[.275,.535,.415,.68],all),
  deskCenter:zone('La mesa grande','sobre el centro de la mesa grande',.49,.599,[.42,.53,.56,.68],all),
  deskRight:zone('La mesa grande','sobre la parte derecha de la mesa grande',.65,.604,[.58,.53,.72,.68],all),
  shelf:zone('La repisa de la biblioteca','en la repisa vacía de la biblioteca',.735,.39,[.665,.315,.805,.465],all),
  chest:zone('El cofre morado','sobre la tapa del cofre morado',.862,.568,[.79,.495,.935,.65],all),
  frontBooks:zone('Los libros del suelo','sobre el libro verde de la pila del suelo',.235,.809,[.16,.735,.31,.88],all),
  chair:zone('El sillón verde','sobre el asiento del sillón verde',.205,.624,[.13,.55,.28,.70],all),
  window:zone('La ventana','en el alféizar de la ventana, junto a las cortinas',.235,.318,[.16,.24,.31,.395],all),
  cushion:zone('El cojín morado','sobre el cojín morado que está en el suelo',.72,.88,[.645,.805,.795,.955],all),
 },
 distributions:[
  {id:'library',name:'Biblioteca',slots:{key:'books',glass:'deskCenter',scroll:'shelf',coin:'frontBooks',crown:'chest'}},
  {id:'preparations',name:'Los preparativos',slots:{key:'deskRight',glass:'deskLeft',scroll:'window',coin:'chest',crown:'frontBooks'}},
  {id:'reading',name:'Rincón de lectura',slots:{key:'window',glass:'shelf',scroll:'deskCenter',coin:'books',crown:'chair'}},
  {id:'celebration',name:'La sorpresa',slots:{key:'frontBooks',glass:'deskRight',scroll:'deskLeft',coin:'cushion',crown:'window'}},
 ],
}

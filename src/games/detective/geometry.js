import { OBJECTS } from './objects.js'
export const clamp=(value,min,max)=>Math.min(max,Math.max(min,value))
export function cameraAt(zoom=1,cx=.5,cy=.5){
 zoom=Number.isFinite(zoom)?clamp(zoom,1,3):1
 const half=.5/zoom
 return {zoom,cx:clamp(Number.isFinite(cx)?cx:.5,half,1-half),cy:clamp(Number.isFinite(cy)?cy:.5,half,1-half)}
}
export const cameraBox=camera=>({x:camera.cx-.5/camera.zoom,y:camera.cy-.5/camera.zoom,size:1/camera.zoom})
export function screenToScene(x,y,rect,camera){
 if(!rect||rect.width<=0||rect.height<=0||![x,y,rect.left,rect.top,rect.width,rect.height].every(Number.isFinite))return null
 if(x<rect.left||x>rect.left+rect.width||y<rect.top||y>rect.top+rect.height)return null
 const box=cameraBox(camera)
 return {x:box.x+(x-rect.left)/rect.width*box.size,y:box.y+(y-rect.top)/rect.height*box.size}
}
export function panCamera(camera,dx,dy,rect){
 if(!rect||rect.width<=0||rect.height<=0||![dx,dy].every(Number.isFinite))return camera
 return cameraAt(camera.zoom,camera.cx-dx/rect.width/camera.zoom,camera.cy-dy/rect.height/camera.zoom)
}
export function sceneToLocal(point,object){
 const radians=-object.rotation*Math.PI/180,dx=(point.x-object.cx)/object.size*100,dy=(point.y-object.cy)/object.size*100
 return {x:50+dx*Math.cos(radians)-dy*Math.sin(radians),y:50+dx*Math.sin(radians)+dy*Math.cos(radians)}
}
export function localToScene(point,object){
 const radians=object.rotation*Math.PI/180,dx=(point.x-50)*object.size/100,dy=(point.y-50)*object.size/100
 return {x:object.cx+dx*Math.cos(radians)-dy*Math.sin(radians),y:object.cy+dx*Math.sin(radians)+dy*Math.cos(radians)}
}
export function insideRegion(point,region){
 if(region.type==='circle')return (point.x-region.cx)**2+(point.y-region.cy)**2<=region.r**2
 let inside=false
 const vertices=region.points
 for(let i=0,j=vertices.length-1;i<vertices.length;j=i++){
  const [xi,yi]=vertices[i],[xj,yj]=vertices[j]
  if((yi>point.y)!==(yj>point.y)&&point.x<(xj-xi)*(point.y-yi)/(yj-yi)+xi)inside=!inside
 }
 return inside
}
export const objectAnchor=object=>localToScene({x:OBJECTS[object.kind].anchor[0],y:OBJECTS[object.kind].anchor[1]},object)
export function hitTest(point,objects){
 if(!point||![point.x,point.y].every(Number.isFinite)||point.x<0||point.x>1||point.y<0||point.y>1)return null
 return [...objects].reverse().find(object=>OBJECTS[object.kind].regions.some(region=>insideRegion(sceneToLocal(point,object),region)))?.id||null
}

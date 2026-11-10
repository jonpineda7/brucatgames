import { OBJECTS } from './objects.js'
export const objectName=object=>object.name||OBJECTS[object.kind].name
export const objectDetail=object=>object.detail||OBJECTS[object.kind].detail

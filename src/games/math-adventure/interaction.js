// A tap selects a token; only a deliberate in-target drag places it.
export function quantityDrop(start,point,inside){return !!start&&inside&&Number.isFinite(point.x)&&Number.isFinite(point.y)&&Math.hypot(point.x-start.x,point.y-start.y)>10}

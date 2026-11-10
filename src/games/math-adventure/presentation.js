import { generateProblem } from './math.js'
export function difficultyExamples(settings,difficulty){
 const operations=settings.operation==='mixed'?settings.enabled:[settings.operation]
 return operations.map(op=>generateProblem({op,difficulty,level:1,pedagogy:{tier:2},roll:.42}).expression)
}

import { reducer,PHASES } from './engine.js'
export const act=(state,type,data={})=>reducer(state,{type,session:state.session,transition:state.transition,...data})
export function solve(state){
 state=act(state,'answer',{value:state.problem.answer,roll:.47})
 if(state.phase===PHASES.OBSTACLE_RESOLVING)return act(act(state,'obstacle-resolved'),'arrived')
 return act(act(state,'resolved'),'impact-ended')
}
export function toBoss(state){
 if(state.phase===PHASES.EXPLORE)state=act(state,'explore',{roll:.35})
 while(state.obstacleIndex<3)state=solve(state)
 if(state.phase===PHASES.BOSS_INTRO)state=act(state,'fight',{roll:.3})
 return state
}

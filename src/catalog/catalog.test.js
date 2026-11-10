import test from 'node:test'
import assert from 'node:assert/strict'
import {existsSync} from 'node:fs'
import {CATALOG,availableGames,availableCategories,allAvailableGames,featuredGames,isAvailableRoute} from './catalog.js'

test('only the six real games in Infantil contribute to available counts and routes',()=>{
 const games=availableGames();assert.equal(games.length,6);assert.equal(new Set(games.map(g=>g.href)).size,6)
 assert.deepEqual(availableCategories().map(c=>c.id),['infantil'])
 assert.equal(allAvailableGames().length,6)
 for(const game of games){assert.equal(isAvailableRoute(game.href.slice(1)),true);assert.ok(existsSync(`public/images/game-covers/${game.image}`))}
 assert.equal(isAvailableRoute('/'),true);assert.equal(isAvailableRoute('/infantil'),true)
})
test('coming categories stay inaccessible, even if a future href or game is configured early',()=>{
 const configured={categories:CATALOG.categories.map(c=>c.id==='arcade'?{...c,href:'#/arcade'}:c),games:[...CATALOG.games,{id:'future',categoryId:'arcade',status:'available',href:'#/arcade/future'}]}
 assert.deepEqual(availableGames('arcade',configured),[])
 assert.equal(isAvailableRoute('/arcade',configured),false);assert.equal(isAvailableRoute('/arcade/future',configured),false)
 assert.equal(isAvailableRoute('/desafios-mentales'),false);assert.equal(isAvailableRoute('/unknown'),false)
 assert.equal(allAvailableGames(configured).length,6)
})
test('unavailable or incomplete games cannot inflate counters, feature cards or route access',()=>{
 const changed={...CATALOG,games:CATALOG.games.map(g=>g.id==='math'?{...g,status:'comingSoon'}:g.id==='memory'?{...g,href:null}:g)}
 assert.equal(availableGames('infantil',changed).length,4)
 assert.deepEqual(featuredGames(changed).map(g=>g.id),['detective'])
 assert.equal(isAvailableRoute('/infantil/math-adventure',changed),false)
 const empty={...CATALOG,games:[]};assert.deepEqual(availableCategories(empty),[]);assert.equal(isAvailableRoute('/infantil',empty),false)
})
test('featured games are existing playable entries, include Memory and Math, and never exceed three',()=>{
 const featured=featuredGames();assert.deepEqual(featured.map(g=>g.id),['memory','math','detective']);assert.ok(featured.length<=3)
 for(const game of featured)assert.ok(allAvailableGames().includes(game))
 for(const category of CATALOG.categories)if(category.status==='comingSoon')assert.equal(category.href,undefined)
})

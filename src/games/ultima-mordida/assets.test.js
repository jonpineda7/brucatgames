import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {CHARACTERS,VILLAIN_ID} from './data.js'
test('all ten official normal/dizzy PNGs exist with expected dimensions and an alpha channel',()=>{
 const paths=new Set()
 for(const character of CHARACTERS)for(const state of ['normal','poisoned']){
  const asset=character.art[state],buffer=readFileSync(new URL(`../../../public/${asset.src}`,import.meta.url))
  assert.equal(buffer.subarray(1,4).toString(),'PNG');assert.equal(buffer.readUInt32BE(16),asset.width);assert.equal(buffer.readUInt32BE(20),asset.height)
  assert.ok([4,6].includes(buffer[25]),`${asset.src} has alpha`);paths.add(asset.src)
 }
 assert.equal(paths.size,10);assert.equal(CHARACTERS.filter(character=>character.innocent).length,4)
 assert.equal(CHARACTERS.find(character=>character.id===VILLAIN_ID).art.normal.src.endsWith('cocodrilo-normal.png'),true)
 assert.equal(CHARACTERS.filter(character=>character.temporary).length,0)
})

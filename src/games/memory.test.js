import test from 'node:test'
import assert from 'node:assert/strict'
import { createGame, memoryReducer } from './memory.js'

test('a new game contains six distinct pairs and twelve unique cards', () => {
  const game = createGame()
  assert.equal(game.cards.length, 12)
  assert.equal(new Set(game.cards.map(card => card.id)).size, 12)
  for (let pair = 0; pair < 6; pair++) assert.equal(game.cards.filter(card => card.pair === pair).length, 2)
})
test('double clicks and a third card do not add moves or reveal cards', () => {
  let game = createGame()
  const [first, second, third] = game.cards
  game = memoryReducer(game, { type: 'flip', id: first.id })
  assert.equal(memoryReducer(game, { type: 'flip', id: first.id }), game)
  game = memoryReducer(game, { type: 'flip', id: second.id })
  assert.equal(game.moves, 1)
  assert.equal(memoryReducer(game, { type: 'flip', id: third.id }), game)
})
test('mismatches close while matched pairs stay found and cannot be selected again', () => {
  let game = createGame()
  const first = game.cards[0]
  const wrong = game.cards.find(card => card.pair !== first.pair)
  const partner = game.cards.find(card => card.pair === first.pair && card.id !== first.id)
  game = memoryReducer(game, { type: 'flip', id: first.id })
  game = memoryReducer(game, { type: 'flip', id: wrong.id })
  assert.equal(game.matched.length, 0)
  game = memoryReducer(game, { type: 'resolve' })
  assert.equal(game.flipped.length, 0)
  game = memoryReducer(game, { type: 'flip', id: first.id })
  game = memoryReducer(game, { type: 'flip', id: partner.id })
  game = memoryReducer(game, { type: 'resolve' })
  assert.equal(game.moves, 2)
  assert.equal(game.matched.length, 2)
  assert.equal(memoryReducer(game, { type: 'flip', id: first.id }), game)
})
test('six correct pairs complete a game; restart clears progress', () => {
  let game = createGame()
  for (let pair = 0; pair < 6; pair++) {
    for (const card of game.cards.filter(item => item.pair === pair)) game = memoryReducer(game, { type: 'flip', id: card.id })
    game = memoryReducer(game, { type: 'resolve' })
  }
  assert.equal(game.matched.length, 12)
  assert.equal(game.moves, 6)
  game = memoryReducer(game, { type: 'restart', game: createGame() })
  assert.equal(game.matched.length, 0)
  assert.equal(game.moves, 0)
  assert.deepEqual(game.flipped, [])
})

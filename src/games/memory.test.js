import test from 'node:test'
import assert from 'node:assert/strict'
import { createGame, getGameStatus, memoryReducer } from './memory.js'

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

function revealPair(game, pair) {
  for (const card of game.cards.filter(item => item.pair === pair)) game = memoryReducer(game, { type: 'flip', id: card.id })
  return memoryReducer(game, { type: 'resolve' })
}
test('challenge ends in defeat after twelve unsuccessful moves and blocks further flips', () => {
  let game = createGame(Math.random, 12)
  const first = game.cards[0]
  const wrong = game.cards.find(card => card.pair !== first.pair)
  for (let i = 0; i < 12; i++) {
    game = memoryReducer(game, { type: 'flip', id: first.id })
    game = memoryReducer(game, { type: 'flip', id: wrong.id })
    game = memoryReducer(game, { type: 'resolve' })
  }
  assert.equal(getGameStatus(game), 'lost')
  assert.equal(memoryReducer(game, { type: 'flip', id: first.id }), game)
})
test('completing the last pair on the final allowed move is a victory', () => {
  let game = createGame(Math.random, 12)
  const first = game.cards[0]
  const wrong = game.cards.find(card => card.pair !== first.pair)
  for (let i = 0; i < 6; i++) {
    game = memoryReducer(game, { type: 'flip', id: first.id })
    game = memoryReducer(game, { type: 'flip', id: wrong.id })
    game = memoryReducer(game, { type: 'resolve' })
  }
  for (let pair = 0; pair < 6; pair++) game = revealPair(game, pair)
  assert.equal(game.moves, 12)
  assert.equal(getGameStatus(game), 'won')
})
test('unlimited mode keeps playing after twelve moves and restart clears defeat', () => {
  let game = createGame()
  game = { ...game, moves: 20 }
  assert.equal(getGameStatus(game), 'playing')
  game = memoryReducer(game, { type: 'restart', game: createGame(Math.random, 12) })
  assert.equal(game.moves, 0)
  assert.equal(game.moveLimit, 12)
  assert.equal(getGameStatus(game), 'playing')
})

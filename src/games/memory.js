export const symbols = [
  { name: 'Sombrero de paja', image: 'images/memory/straw-hat.png' },
  { name: 'Sombrerero', image: 'images/memory/hatter.png' },
  { name: 'Pelo de punta', image: 'images/memory/spiky-hair.png' },
  { name: 'Tortuga héroe', image: 'images/memory/turtle.png' },
  { name: 'Gato naranja', image: 'images/memory/orange-cat.png' },
  { name: 'Llama con gafas', image: 'images/memory/llama.png' },
]
export function createGame(random = Math.random) {
  const cards = symbols.flatMap((symbol, pair) => [0, 1].map(copy => ({ ...symbol, pair, id: `${pair}-${copy}` })))
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return { cards, flipped: [], matched: [], moves: 0 }
}
export function memoryReducer(state, action) {
  if (action.type === 'restart') return action.game
  if (action.type === 'resolve') return { ...state, flipped: [] }
  if (action.type !== 'flip' || state.flipped.length === 2 || state.flipped.includes(action.id) || state.matched.includes(action.id)) return state
  const card = state.cards.find(item => item.id === action.id)
  if (!card) return state
  const flipped = [...state.flipped, action.id]
  if (flipped.length === 1) return { ...state, flipped }
  const first = state.cards.find(item => item.id === flipped[0])
  const match = first.pair === card.pair
  return { ...state, flipped, moves: state.moves + 1, matched: match ? [...state.matched, ...flipped] : state.matched }
}

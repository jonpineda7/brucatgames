// Level identities retained; poison and verified clues are sampled per round.
export const LEVELS = [
  {
    "id": 1,
    "name": "La primera cena",
    "stage": 0,
    "menu": "castle"
  },
  {
    "id": 2,
    "name": "Una receta misteriosa",
    "stage": 0,
    "menu": "castle"
  },
  {
    "id": 3,
    "name": "El brindis de Miga",
    "stage": 0,
    "menu": "garden"
  },
  {
    "id": 4,
    "name": "Sorpresa en la cocina",
    "stage": 0,
    "menu": "castle"
  },
  {
    "id": 5,
    "name": "El gran mantel",
    "stage": 0,
    "menu": "castle"
  },
  {
    "id": 6,
    "name": "La mesa de cinco",
    "stage": 1,
    "menu": "garden"
  },
  {
    "id": 7,
    "name": "Una pista de más",
    "stage": 1,
    "menu": "castle"
  },
  {
    "id": 8,
    "name": "Aroma de misterio",
    "stage": 1,
    "menu": "castle"
  },
  {
    "id": 9,
    "name": "El menú del jardín",
    "stage": 1,
    "menu": "garden"
  },
  {
    "id": 10,
    "name": "La noche de las recetas",
    "stage": 1,
    "menu": "castle"
  },
  {
    "id": 11,
    "name": "Un bocado arriesgado",
    "stage": 2,
    "menu": "castle"
  },
  {
    "id": 12,
    "name": "La pista del banquete",
    "stage": 2,
    "menu": "garden"
  },
  {
    "id": 13,
    "name": "El turno del cocodrilo",
    "stage": 2,
    "menu": "castle"
  },
  {
    "id": 14,
    "name": "La estrella escondida",
    "stage": 2,
    "menu": "castle"
  },
  {
    "id": 15,
    "name": "Cinco platos, un misterio",
    "stage": 2,
    "menu": "garden"
  },
  {
    "id": 16,
    "name": "Una ronda más",
    "stage": 3,
    "menu": "garden"
  },
  {
    "id": 17,
    "name": "Recetas bajo la luna",
    "stage": 3,
    "menu": "festival"
  },
  {
    "id": 18,
    "name": "La vuelta del plato",
    "stage": 3,
    "menu": "garden"
  },
  {
    "id": 19,
    "name": "Un banquete de ideas",
    "stage": 3,
    "menu": "festival"
  },
  {
    "id": 20,
    "name": "La última gran mordida",
    "stage": 3,
    "menu": "garden"
  }
]
export const getLevel = id => LEVELS.find(level=>level.id===id) || LEVELS[0]

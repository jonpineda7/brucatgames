// Fixed banquet cases. Clues and uniqueness are checked in levels.test.js.
export const LEVELS = [
  {
    "id": 1,
    "name": "La primera cena",
    "stage": 0,
    "menu": "castle",
    "dishes": [
      "pizza",
      "sushi",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "moru"
    ],
    "enchanted": "sushi",
    "villain": "moru",
    "mode": "classic",
    "clues": [
      {
        "field": "temperature",
        "op": "not",
        "value": "caliente"
      },
      {
        "field": "flavor",
        "op": "is",
        "value": "salado"
      }
    ],
    "guestClues": [],
    "powers": {
      "magnifier": 0,
      "shield": 0,
      "swap": 0
    },
    "twist": null
  },
  {
    "id": 2,
    "name": "Una receta misteriosa",
    "stage": 0,
    "menu": "castle",
    "dishes": [
      "burger",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "moru"
    ],
    "enchanted": "tacos",
    "villain": "moru",
    "mode": "classic",
    "clues": [
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "pan"
      },
      {
        "field": "baked",
        "op": "is",
        "value": false
      }
    ],
    "guestClues": [],
    "powers": {
      "magnifier": 0,
      "shield": 0,
      "swap": 0
    },
    "twist": null
  },
  {
    "id": 3,
    "name": "El brindis de Miga",
    "stage": 0,
    "menu": "garden",
    "dishes": [
      "pizza",
      "burger",
      "sushi"
    ],
    "guests": [
      "pipo",
      "miga",
      "moru"
    ],
    "enchanted": "burger",
    "villain": "moru",
    "mode": "classic",
    "clues": [
      {
        "field": "flavor",
        "op": "not",
        "value": "dulce"
      },
      {
        "field": "price",
        "op": "lt",
        "value": 4
      }
    ],
    "guestClues": [],
    "powers": {
      "magnifier": 0,
      "shield": 0,
      "swap": 0
    },
    "twist": null
  },
  {
    "id": 4,
    "name": "Sorpresa en la cocina",
    "stage": 0,
    "menu": "castle",
    "dishes": [
      "sushi",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "moru"
    ],
    "enchanted": "tacos",
    "villain": "moru",
    "mode": "classic",
    "clues": [
      {
        "field": "temperature",
        "op": "is",
        "value": "caliente"
      },
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "fresa"
      }
    ],
    "guestClues": [],
    "powers": {
      "magnifier": 0,
      "shield": 0,
      "swap": 0
    },
    "twist": null
  },
  {
    "id": 5,
    "name": "El gran mantel",
    "stage": 0,
    "menu": "castle",
    "dishes": [
      "pizza",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "moru"
    ],
    "enchanted": "tacos",
    "villain": "moru",
    "mode": "classic",
    "clues": [
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "fresa"
      },
      {
        "field": "baked",
        "op": "is",
        "value": false
      }
    ],
    "guestClues": [],
    "powers": {
      "magnifier": 0,
      "shield": 0,
      "swap": 0
    },
    "twist": null
  },
  {
    "id": 6,
    "name": "La mesa de cinco",
    "stage": 1,
    "menu": "garden",
    "dishes": [
      "pizza",
      "burger",
      "sushi",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "bruno",
      "lino",
      "moru"
    ],
    "enchanted": "burger",
    "villain": "moru",
    "mode": "classic",
    "clues": [
      {
        "field": "flavor",
        "op": "is",
        "value": "salado"
      },
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "harina"
      },
      {
        "field": "price",
        "op": "lt",
        "value": 4
      }
    ],
    "guestClues": [],
    "powers": {
      "magnifier": 0,
      "shield": 0,
      "swap": 0
    },
    "twist": null
  },
  {
    "id": 7,
    "name": "Una pista de más",
    "stage": 1,
    "menu": "castle",
    "dishes": [
      "pizza",
      "burger",
      "sushi",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "bruno",
      "lino",
      "moru"
    ],
    "enchanted": "cake",
    "villain": "moru",
    "mode": "classic",
    "clues": [
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "tomate"
      },
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "verduras"
      },
      {
        "field": "price",
        "op": "lt",
        "value": 3
      }
    ],
    "guestClues": [],
    "powers": {
      "magnifier": 0,
      "shield": 0,
      "swap": 0
    },
    "twist": null
  },
  {
    "id": 8,
    "name": "Aroma de misterio",
    "stage": 1,
    "menu": "castle",
    "dishes": [
      "pizza",
      "burger",
      "sushi",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "bruno",
      "lino",
      "moru"
    ],
    "enchanted": "sushi",
    "villain": "moru",
    "mode": "classic",
    "clues": [
      {
        "field": "temperature",
        "op": "not",
        "value": "caliente"
      },
      {
        "field": "ingredients",
        "op": "has",
        "value": "alga"
      },
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "maíz"
      }
    ],
    "guestClues": [],
    "powers": {
      "magnifier": 0,
      "shield": 0,
      "swap": 0
    },
    "twist": null
  },
  {
    "id": 9,
    "name": "El menú del jardín",
    "stage": 1,
    "menu": "garden",
    "dishes": [
      "pizza",
      "burger",
      "sushi",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "bruno",
      "lino",
      "moru"
    ],
    "enchanted": "pizza",
    "villain": "moru",
    "mode": "classic",
    "clues": [
      {
        "field": "price",
        "op": "gt",
        "value": 2
      },
      {
        "field": "price",
        "op": "lt",
        "value": 5
      },
      {
        "field": "baked",
        "op": "is",
        "value": true
      }
    ],
    "guestClues": [],
    "powers": {
      "magnifier": 0,
      "shield": 0,
      "swap": 0
    },
    "twist": null
  },
  {
    "id": 10,
    "name": "La noche de las recetas",
    "stage": 1,
    "menu": "castle",
    "dishes": [
      "pizza",
      "burger",
      "sushi",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "bruno",
      "lino",
      "moru"
    ],
    "enchanted": "tacos",
    "villain": "moru",
    "mode": "classic",
    "clues": [
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "harina"
      },
      {
        "field": "price",
        "op": "lt",
        "value": 3
      },
      {
        "field": "price",
        "op": "lt",
        "value": 5
      }
    ],
    "guestClues": [],
    "powers": {
      "magnifier": 0,
      "shield": 0,
      "swap": 0
    },
    "twist": null
  },
  {
    "id": 11,
    "name": "¿Quién hace travesuras?",
    "stage": 2,
    "menu": "castle",
    "dishes": [
      "pizza",
      "burger",
      "sushi",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "bruno",
      "lino",
      "moru"
    ],
    "enchanted": "burger",
    "villain": "moru",
    "mode": "detective",
    "clues": [
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "tomate"
      },
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "pescado"
      },
      {
        "field": "price",
        "op": "gt",
        "value": 3
      }
    ],
    "guestClues": [
      {
        "field": "ears",
        "op": "is",
        "value": "redondas"
      },
      {
        "field": "outfit",
        "op": "not",
        "value": "azul"
      }
    ],
    "powers": {
      "magnifier": 1,
      "shield": 1,
      "swap": 1
    },
    "twist": null
  },
  {
    "id": 12,
    "name": "El secreto del lazo",
    "stage": 2,
    "menu": "garden",
    "dishes": [
      "pizza",
      "burger",
      "sushi",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "bruno",
      "lino",
      "moru"
    ],
    "enchanted": "cake",
    "villain": "lino",
    "mode": "detective",
    "clues": [
      {
        "field": "ingredients",
        "op": "has",
        "value": "queso"
      },
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "maíz"
      },
      {
        "field": "price",
        "op": "lt",
        "value": 3
      }
    ],
    "guestClues": [
      {
        "field": "ears",
        "op": "not",
        "value": "redondas"
      },
      {
        "field": "gold",
        "op": "is",
        "value": true
      }
    ],
    "powers": {
      "magnifier": 1,
      "shield": 1,
      "swap": 1
    },
    "twist": null
  },
  {
    "id": 13,
    "name": "Una mirada sospechosa",
    "stage": 2,
    "menu": "castle",
    "dishes": [
      "pizza",
      "burger",
      "sushi",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "bruno",
      "lino",
      "moru"
    ],
    "enchanted": "sushi",
    "villain": "miga",
    "mode": "detective",
    "clues": [
      {
        "field": "temperature",
        "op": "is",
        "value": "frío"
      },
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "masa"
      },
      {
        "field": "ingredients",
        "op": "has",
        "value": "verduras"
      }
    ],
    "guestClues": [
      {
        "field": "ears",
        "op": "not",
        "value": "redondas"
      },
      {
        "field": "outfit",
        "op": "not",
        "value": "azul"
      }
    ],
    "powers": {
      "magnifier": 1,
      "shield": 1,
      "swap": 1
    },
    "twist": null
  },
  {
    "id": 14,
    "name": "La estrella escondida",
    "stage": 2,
    "menu": "castle",
    "dishes": [
      "pizza",
      "burger",
      "sushi",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "bruno",
      "lino",
      "moru"
    ],
    "enchanted": "pizza",
    "villain": "bruno",
    "mode": "detective",
    "clues": [
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "maíz"
      },
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "huevo"
      },
      {
        "field": "price",
        "op": "lt",
        "value": 4
      }
    ],
    "guestClues": [
      {
        "field": "ears",
        "op": "is",
        "value": "redondas"
      },
      {
        "field": "outfit",
        "op": "not",
        "value": "verde"
      }
    ],
    "powers": {
      "magnifier": 1,
      "shield": 1,
      "swap": 1
    },
    "twist": null
  },
  {
    "id": 15,
    "name": "Cinco sonrisas, un misterio",
    "stage": 2,
    "menu": "garden",
    "dishes": [
      "pizza",
      "burger",
      "sushi",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "bruno",
      "lino",
      "moru"
    ],
    "enchanted": "tacos",
    "villain": "pipo",
    "mode": "detective",
    "clues": [
      {
        "field": "temperature",
        "op": "is",
        "value": "frío"
      },
      {
        "field": "price",
        "op": "lt",
        "value": 3
      },
      {
        "field": "price",
        "op": "lt",
        "value": 5
      }
    ],
    "guestClues": [
      {
        "field": "outfit",
        "op": "is",
        "value": "azul"
      },
      {
        "field": "gold",
        "op": "is",
        "value": false
      }
    ],
    "powers": {
      "magnifier": 1,
      "shield": 1,
      "swap": 1
    },
    "twist": null
  },
  {
    "id": 16,
    "name": "El cambio inesperado",
    "stage": 3,
    "menu": "garden",
    "dishes": [
      "pizza",
      "burger",
      "sushi",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "bruno",
      "lino",
      "moru"
    ],
    "enchanted": "burger",
    "villain": "moru",
    "mode": "swap",
    "clues": [
      {
        "field": "temperature",
        "op": "not",
        "value": "frío"
      },
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "harina"
      },
      {
        "field": "baked",
        "op": "is",
        "value": false
      }
    ],
    "guestClues": [
      {
        "field": "ears",
        "op": "is",
        "value": "redondas"
      },
      {
        "field": "outfit",
        "op": "is",
        "value": "verde"
      }
    ],
    "powers": {
      "magnifier": 1,
      "shield": 1,
      "swap": 1
    },
    "twist": [
      "moru",
      "pipo"
    ]
  },
  {
    "id": 17,
    "name": "Recetas bajo la luna",
    "stage": 3,
    "menu": "festival",
    "dishes": [
      "pizza",
      "burger",
      "sushi",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "bruno",
      "lino",
      "moru"
    ],
    "enchanted": "cake",
    "villain": "lino",
    "mode": "swap",
    "clues": [
      {
        "field": "temperature",
        "op": "is",
        "value": "caliente"
      },
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "canela"
      },
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "pan"
      }
    ],
    "guestClues": [
      {
        "field": "ears",
        "op": "is",
        "value": "puntiagudas"
      },
      {
        "field": "outfit",
        "op": "is",
        "value": "azul"
      }
    ],
    "powers": {
      "magnifier": 1,
      "shield": 1,
      "swap": 1
    },
    "twist": [
      "lino",
      "pipo"
    ]
  },
  {
    "id": 18,
    "name": "La vuelta del plato",
    "stage": 3,
    "menu": "garden",
    "dishes": [
      "pizza",
      "burger",
      "sushi",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "bruno",
      "lino",
      "moru"
    ],
    "enchanted": "sushi",
    "villain": "miga",
    "mode": "swap",
    "clues": [
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "pan"
      },
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "chocolate"
      },
      {
        "field": "baked",
        "op": "is",
        "value": false
      }
    ],
    "guestClues": [
      {
        "field": "ears",
        "op": "is",
        "value": "puntiagudas"
      },
      {
        "field": "outfit",
        "op": "not",
        "value": "azul"
      }
    ],
    "powers": {
      "magnifier": 1,
      "shield": 1,
      "swap": 1
    },
    "twist": [
      "miga",
      "pipo"
    ]
  },
  {
    "id": 19,
    "name": "Un banquete de ideas",
    "stage": 3,
    "menu": "festival",
    "dishes": [
      "pizza",
      "burger",
      "sushi",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "bruno",
      "lino",
      "moru"
    ],
    "enchanted": "pizza",
    "villain": "bruno",
    "mode": "swap",
    "clues": [
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "pan"
      },
      {
        "field": "ingredients",
        "op": "lacks",
        "value": "maíz"
      },
      {
        "field": "price",
        "op": "lt",
        "value": 3
      }
    ],
    "guestClues": [
      {
        "field": "ears",
        "op": "is",
        "value": "redondas"
      },
      {
        "field": "outfit",
        "op": "is",
        "value": "azul"
      }
    ],
    "powers": {
      "magnifier": 1,
      "shield": 1,
      "swap": 1
    },
    "twist": [
      "bruno",
      "pipo"
    ]
  },
  {
    "id": 20,
    "name": "La última gran mordida",
    "stage": 3,
    "menu": "garden",
    "dishes": [
      "pizza",
      "burger",
      "sushi",
      "tacos",
      "cake"
    ],
    "guests": [
      "pipo",
      "miga",
      "bruno",
      "lino",
      "moru"
    ],
    "enchanted": "tacos",
    "villain": "pipo",
    "mode": "swap",
    "clues": [
      {
        "field": "flavor",
        "op": "not",
        "value": "salado"
      },
      {
        "field": "flavor",
        "op": "is",
        "value": "dulce"
      },
      {
        "field": "price",
        "op": "lt",
        "value": 3
      }
    ],
    "guestClues": [
      {
        "field": "outfit",
        "op": "not",
        "value": "verde"
      },
      {
        "field": "gold",
        "op": "is",
        "value": false
      }
    ],
    "powers": {
      "magnifier": 1,
      "shield": 1,
      "swap": 1
    },
    "twist": [
      "pipo",
      "miga"
    ]
  }
]
export const getLevel = id => LEVELS.find(level=>level.id===id) || LEVELS[0]

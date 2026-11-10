/**
 * Detective BruCat V3: authored adventure content, independent of React and storage.
 * Every puzzle is supported by the details of the found objects and its evidence panel.
 * Placement coordinates belong to scene metadata, not these narrative definitions.
 * @typedef {{id:string,kind:string,name:string,detail:string,clue:string,size:number,rotation:number,fragment?:number,symbol?:string,pattern?:string[],tint?:string}} AdventureObject
 * @typedef {{id:number,name:string,world:number,difficulty:'easy'|'normal'|'hard',description:string,mission:string,outro:string,scene:string,sceneTitle:string,objects:AdventureObject[],puzzle:object}} AdventureCase
 */
/** @type {AdventureCase[]} */
export const ADVENTURE_CASES = [
  {
    "id": 2,
    "name": "El libro secreto",
    "world": 0,
    "difficulty": "easy",
    "description": "Tres símbolos guardan el secreto de una biblioteca antigua.",
    "mission": "La corona nos condujo a un catálogo cerrado. Reúne el libro y sus fichas para descubrir qué estantería esconde el plano del tesoro.",
    "outro": "El plano señala la sala del tesoro: allí espera una cerradura con un emblema especial.",
    "scene": "games/detective/scenes/case-02.jpg",
    "sceneTitle": "Biblioteca antigua con estanterías, escaleras y mesa de lectura",
    "objects": [
      {
        "id": "secret-book",
        "kind": "book",
        "name": "Libro del catálogo",
        "detail": "En su última página, una estantería dorada tiene la etiqueta sol–luna–estrella.",
        "clue": "En su última página, una estantería dorada tiene la etiqueta sol–luna–estrella.",
        "size": 0.095,
        "rotation": -7
      },
      {
        "id": "sun-card",
        "kind": "rune",
        "name": "Ficha del sol",
        "detail": "Dice: «El sol va primero».",
        "clue": "Dice: «El sol va primero».",
        "symbol": "sun",
        "size": 0.095,
        "rotation": 5
      },
      {
        "id": "moon-card",
        "kind": "rune",
        "name": "Ficha de la luna",
        "detail": "Dice: «La luna viene después del sol».",
        "clue": "Dice: «La luna viene después del sol».",
        "symbol": "moon",
        "size": 0.095,
        "rotation": -3
      },
      {
        "id": "star-card",
        "kind": "rune",
        "name": "Ficha de la estrella",
        "detail": "Dice: «La estrella cierra la secuencia».",
        "clue": "Dice: «La estrella cierra la secuencia».",
        "symbol": "star",
        "size": 0.095,
        "rotation": 8
      },
      {
        "id": "library-lens",
        "kind": "glass",
        "name": "Lupa del bibliotecario",
        "detail": "Permite leer las tres etiquetas del catálogo: dorada sol–luna–estrella; violeta luna–sol–estrella; azul estrella–luna–sol.",
        "clue": "Permite leer las tres etiquetas del catálogo: dorada sol–luna–estrella; violeta luna–sol–estrella; azul estrella–luna–sol.",
        "size": 0.095,
        "rotation": 0
      }
    ],
    "puzzle": {
      "type": "multi",
      "question": "El secreto del catálogo",
      "clue": "Resuelve las dos páginas del catálogo. Todas las respuestas están en tus fichas.",
      "evidence": "La ficha solar dice «primero»; la ficha lunar, «después del sol»; la estrella, «al final». El catálogo dibuja la estantería dorada con el orden sol–luna–estrella.",
      "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
      "explanation": "La estantería dorada ocultaba el libro con el plano de la sala del tesoro.",
      "stages": [
        {
          "type": "sequence",
          "question": "Ordena los símbolos del catálogo",
          "clue": "Pulsa los símbolos en el orden que indican las tres fichas. Puedes corregirlo antes de comprobar.",
          "evidence": "La ficha solar dice «primero»; la ficha lunar, «después del sol»; la estrella, «al final». El catálogo dibuja la estantería dorada con el orden sol–luna–estrella.",
          "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
          "explanation": "El orden de las fichas es sol, luna y estrella.",
          "items": [
            {
              "id": "moon",
              "label": "Luna",
              "kind": "rune",
              "symbol": "moon"
            },
            {
              "id": "star",
              "label": "Estrella",
              "kind": "rune",
              "symbol": "star"
            },
            {
              "id": "sun",
              "label": "Sol",
              "kind": "rune",
              "symbol": "sun"
            }
          ],
          "answer": [
            "sun",
            "moon",
            "star"
          ]
        },
        {
          "type": "choice",
          "question": "¿Qué estantería esconde el libro secreto?",
          "clue": "Compara el orden que resolviste con las etiquetas del catálogo.",
          "evidence": "La ficha solar dice «primero»; la ficha lunar, «después del sol»; la estrella, «al final». El catálogo dibuja la estantería dorada con el orden sol–luna–estrella.",
          "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
          "explanation": "La etiqueta sol–luna–estrella pertenece a la estantería dorada. Dentro del libro apareció un plano de la sala del tesoro.",
          "options": [
            {
              "id": "violet",
              "label": "Estantería violeta · luna–sol–estrella",
              "pattern": [
                "moon",
                "sun",
                "star"
              ]
            },
            {
              "id": "gold",
              "label": "Estantería dorada · sol–luna–estrella",
              "pattern": [
                "sun",
                "moon",
                "star"
              ]
            },
            {
              "id": "blue",
              "label": "Estantería azul · estrella–luna–sol",
              "pattern": [
                "star",
                "moon",
                "sun"
              ]
            }
          ],
          "answer": "gold"
        }
      ]
    }
  },
  {
    "id": 3,
    "name": "La llave del tesoro",
    "world": 0,
    "difficulty": "easy",
    "description": "Una cerradura dorada espera su pareja.",
    "mission": "El libro revela un cofre real. Encuentra la cerradura, las tres llaves y la nota del guardián; compara sus símbolos.",
    "outro": "Dentro del cofre hay una brújula y una invitación: el siguiente rastro comienza en la selva perdida.",
    "scene": "games/detective/scenes/case-03.jpg",
    "sceneTitle": "Sala del tesoro con cofres, columnas y vitrinas doradas",
    "objects": [
      {
        "id": "star-lock",
        "kind": "lock",
        "name": "Cerradura estrellada",
        "detail": "La cerradura del cofre tiene una estrella de cinco puntas.",
        "clue": "La cerradura del cofre tiene una estrella de cinco puntas.",
        "symbol": "star",
        "size": 0.095,
        "rotation": -7
      },
      {
        "id": "key-heart",
        "kind": "key",
        "name": "Llave del corazón",
        "detail": "Su empuñadura lleva un corazón. No coincide con la estrella de la cerradura.",
        "clue": "Su empuñadura lleva un corazón. No coincide con la estrella de la cerradura.",
        "symbol": "heart",
        "size": 0.095,
        "rotation": 5
      },
      {
        "id": "key-star",
        "kind": "key",
        "name": "Llave de la estrella",
        "detail": "Su empuñadura lleva la misma estrella de cinco puntas que la cerradura.",
        "clue": "Su empuñadura lleva la misma estrella de cinco puntas que la cerradura.",
        "symbol": "star",
        "size": 0.095,
        "rotation": -3
      },
      {
        "id": "key-diamond",
        "kind": "key",
        "name": "Llave del rombo",
        "detail": "Su empuñadura lleva un rombo de cuatro esquinas.",
        "clue": "Su empuñadura lleva un rombo de cuatro esquinas.",
        "symbol": "diamond",
        "size": 0.095,
        "rotation": 8
      },
      {
        "id": "guard-note",
        "kind": "scroll",
        "name": "Nota del guardián",
        "detail": "«Une el mismo símbolo: la cerradura elige por su forma, no por su color».",
        "clue": "«Une el mismo símbolo: la cerradura elige por su forma, no por su color».",
        "size": 0.095,
        "rotation": 0
      }
    ],
    "puzzle": {
      "type": "choice",
      "question": "¿Qué llave abre el cofre real?",
      "clue": "Observa el emblema de la cerradura y el de cada llave.",
      "evidence": "La cerradura lleva una estrella de cinco puntas. La nota del guardián explica que la llave debe tener exactamente el mismo emblema; el color no importa.",
      "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
      "explanation": "La llave estrellada encaja con la cerradura estrellada. El cofre guardaba el comienzo de una ruta hacia la selva.",
      "referencePattern": [
        "star"
      ],
      "options": [
        {
          "id": "key-heart",
          "label": "Llave con corazón",
          "kind": "key",
          "symbol": "heart"
        },
        {
          "id": "key-star",
          "label": "Llave con estrella",
          "kind": "key",
          "symbol": "star"
        },
        {
          "id": "key-diamond",
          "label": "Llave con rombo",
          "kind": "key",
          "symbol": "diamond"
        }
      ],
      "answer": "key-star"
    }
  },
  {
    "id": 4,
    "name": "El mapa escondido",
    "world": 1,
    "difficulty": "easy",
    "description": "Cuatro fragmentos vuelven a contar un camino.",
    "mission": "En el campamento, una ráfaga separó el mapa. Recupera sus cuatro fragmentos y la brújula para reconstruir la ruta.",
    "outro": "El mapa reconstruido lleva a un sendero con huellas muy curiosas.",
    "scene": "games/detective/scenes/case-04.jpg",
    "sceneTitle": "Campamento selvático con tienda violeta, mesa de exploración y troncos",
    "objects": [
      {
        "id": "map-nw",
        "kind": "map",
        "name": "Fragmento de la montaña",
        "detail": "La esquina del noroeste muestra una montaña y el inicio del sendero.",
        "clue": "La esquina del noroeste muestra una montaña y el inicio del sendero.",
        "fragment": 0,
        "size": 0.095,
        "rotation": -7
      },
      {
        "id": "map-ne",
        "kind": "map",
        "name": "Fragmento del sol",
        "detail": "El sol está al noreste, sobre el río.",
        "clue": "El sol está al noreste, sobre el río.",
        "fragment": 1,
        "size": 0.095,
        "rotation": 5
      },
      {
        "id": "map-sw",
        "kind": "map",
        "name": "Fragmento del río",
        "detail": "El río baja por la esquina suroeste y continúa desde el norte.",
        "clue": "El río baja por la esquina suroeste y continúa desde el norte.",
        "fragment": 2,
        "size": 0.095,
        "rotation": -3
      },
      {
        "id": "map-se",
        "kind": "map",
        "name": "Fragmento del campamento",
        "detail": "El campamento se encuentra en la esquina sureste, al final del sendero.",
        "clue": "El campamento se encuentra en la esquina sureste, al final del sendero.",
        "fragment": 3,
        "size": 0.095,
        "rotation": 8
      },
      {
        "id": "north-compass",
        "kind": "compass",
        "name": "Brújula del norte",
        "detail": "La punta dorada señala el norte: en este mapa queda arriba.",
        "clue": "La punta dorada señala el norte: en este mapa queda arriba.",
        "size": 0.095,
        "rotation": 0
      }
    ],
    "puzzle": {
      "type": "assemble",
      "question": "Reconstruye el mapa de la selva",
      "clue": "Arrastra cada fragmento a su esquina o elige su destino con los controles. Sigue las señales de la brújula.",
      "evidence": "La brújula indica norte arriba. El dibujo se divide en cuatro: montaña arriba a la izquierda, sol arriba a la derecha, río abajo a la izquierda y campamento abajo a la derecha. El sendero y el río deben continuar entre piezas.",
      "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
      "explanation": "Las cuatro piezas vuelven a formar un mapa continuo: el campamento queda al sureste y la ruta continúa por el sendero.",
      "layout": "map",
      "items": [
        {
          "id": "map-se",
          "label": "Campamento · sureste",
          "fragment": 3,
          "kind": "map"
        },
        {
          "id": "map-nw",
          "label": "Montaña · noroeste",
          "fragment": 0,
          "kind": "map"
        },
        {
          "id": "map-sw",
          "label": "Río · suroeste",
          "fragment": 2,
          "kind": "map"
        },
        {
          "id": "map-ne",
          "label": "Sol · noreste",
          "fragment": 1,
          "kind": "map"
        }
      ],
      "targets": [
        {
          "id": "nw",
          "label": "Noroeste · arriba izquierda"
        },
        {
          "id": "ne",
          "label": "Noreste · arriba derecha"
        },
        {
          "id": "sw",
          "label": "Suroeste · abajo izquierda"
        },
        {
          "id": "se",
          "label": "Sureste · abajo derecha"
        }
      ],
      "answer": {
        "map-nw": "nw",
        "map-ne": "ne",
        "map-sw": "sw",
        "map-se": "se"
      }
    }
  },
  {
    "id": 5,
    "name": "Las huellas misteriosas",
    "world": 1,
    "difficulty": "easy",
    "description": "Un pequeño manual revela quién pasó por aquí.",
    "mission": "El mapa termina en un sendero. Reúne las huellas y las fichas de animales para descubrir quién camina hacia la cascada.",
    "outro": "El mono dejó una flecha de hojas: nos espera junto a la cascada y su antigua puerta.",
    "scene": "games/detective/scenes/case-05.jpg",
    "sceneTitle": "Sendero selvático entre raíces, flores, piedras y un puente de madera",
    "objects": [
      {
        "id": "trail-print",
        "kind": "paw",
        "name": "Huella del sendero",
        "detail": "Tiene cinco dedos redondos y una palma ancha: coincide con el mono.",
        "clue": "Tiene cinco dedos redondos y una palma ancha: coincide con el mono.",
        "symbol": "monkey",
        "size": 0.095,
        "rotation": -7
      },
      {
        "id": "tortoise-card",
        "kind": "book",
        "name": "Ficha de la tortuga",
        "detail": "Su rastro tiene cuatro marcas anchas, sin palma redonda.",
        "clue": "Su rastro tiene cuatro marcas anchas, sin palma redonda.",
        "symbol": "turtle",
        "size": 0.095,
        "rotation": 5
      },
      {
        "id": "toucan-feather",
        "kind": "feather",
        "name": "Pluma y ficha del tucán",
        "detail": "El tucán deja tres dedos finos hacia delante.",
        "clue": "El tucán deja tres dedos finos hacia delante.",
        "symbol": "bird",
        "size": 0.095,
        "rotation": -3
      },
      {
        "id": "monkey-card",
        "kind": "book",
        "name": "Ficha del mono",
        "detail": "El mono deja cinco dedos y una palma; es el dibujo de las huellas del sendero.",
        "clue": "El mono deja cinco dedos y una palma; es el dibujo de las huellas del sendero.",
        "symbol": "monkey",
        "size": 0.095,
        "rotation": 8
      },
      {
        "id": "leaf-arrow",
        "kind": "leaf",
        "name": "Flecha de hojas",
        "detail": "Una nota: «Quien dejó cinco dedos irá a la cascada».",
        "clue": "Una nota: «Quien dejó cinco dedos irá a la cascada».",
        "size": 0.095,
        "rotation": 0
      }
    ],
    "puzzle": {
      "type": "match",
      "question": "Une cada rastro con su dueño",
      "clue": "Compara el número de dedos y la forma de la marca. Cada animal tiene un rastro diferente.",
      "evidence": "El cuaderno identifica tres rastros: la tortuga deja cuatro marcas anchas; el tucán, tres dedos finos hacia delante; el mono, cinco dedos y una palma. Las huellas del sendero muestran cinco dedos y una palma.",
      "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
      "explanation": "La marca de cinco dedos y una palma pertenece al mono, que nos guía hacia la cascada. Los otros rastros también quedan identificados.",
      "items": [
        {
          "id": "five",
          "label": "Cinco dedos y una palma",
          "kind": "paw",
          "symbol": "monkey"
        },
        {
          "id": "three",
          "label": "Tres dedos finos",
          "kind": "paw",
          "symbol": "bird"
        },
        {
          "id": "four",
          "label": "Cuatro marcas anchas",
          "kind": "paw",
          "symbol": "turtle"
        }
      ],
      "targets": [
        {
          "id": "turtle",
          "label": "Tortuga"
        },
        {
          "id": "monkey",
          "label": "Mono"
        },
        {
          "id": "bird",
          "label": "Tucán"
        }
      ],
      "answer": {
        "five": "monkey",
        "three": "bird",
        "four": "turtle"
      }
    }
  },
  {
    "id": 6,
    "name": "El tesoro de la cascada",
    "world": 1,
    "difficulty": "normal",
    "description": "El ciclo del agua abre una puerta antigua.",
    "mission": "El mono nos dejó un mural al pie de la cascada. Busca siete pruebas y activa los símbolos para abrir la entrada del tesoro.",
    "outro": "La puerta guarda una pieza de máquina con una dirección: el laboratorio loco necesita nuestra ayuda.",
    "scene": "games/detective/scenes/case-06.jpg",
    "sceneTitle": "Cascada turquesa con ruinas, estanque y terrazas de piedra",
    "objects": [
      {
        "id": "sun-stone",
        "kind": "rune",
        "name": "Piedra del sol",
        "detail": "El mural dice: «Primero el sol calienta el agua».",
        "clue": "El mural dice: «Primero el sol calienta el agua».",
        "symbol": "sun",
        "size": 0.085,
        "rotation": -7
      },
      {
        "id": "cloud-stone",
        "kind": "rune",
        "name": "Piedra de la nube",
        "detail": "«Después del sol se forma una nube».",
        "clue": "«Después del sol se forma una nube».",
        "symbol": "cloud",
        "size": 0.085,
        "rotation": 5
      },
      {
        "id": "drop-stone",
        "kind": "rune",
        "name": "Piedra de la gota",
        "detail": "«Después de la nube cae una gota».",
        "clue": "«Después de la nube cae una gota».",
        "symbol": "drop",
        "size": 0.085,
        "rotation": -3
      },
      {
        "id": "leaf-stone",
        "kind": "leaf",
        "name": "Piedra de la hoja",
        "detail": "«Después de la lluvia crece una hoja».",
        "clue": "«Después de la lluvia crece una hoja».",
        "symbol": "leaf",
        "size": 0.085,
        "rotation": 8
      },
      {
        "id": "water-mural",
        "kind": "scroll",
        "name": "Copia del mural",
        "detail": "Las flechas marcan sol → nube → gota → hoja. No se repite ningún símbolo.",
        "clue": "Las flechas marcan sol → nube → gota → hoja. No se repite ningún símbolo.",
        "size": 0.085,
        "rotation": 0
      },
      {
        "id": "cascade-prism",
        "kind": "prism",
        "name": "Prisma de la cascada",
        "detail": "La luz revela las cuatro flechas del mural; no falta ningún paso.",
        "clue": "La luz revela las cuatro flechas del mural; no falta ningún paso.",
        "size": 0.085,
        "rotation": 4
      },
      {
        "id": "machine-part",
        "kind": "gear",
        "name": "Engranaje antiguo",
        "detail": "Lleva grabado el emblema del laboratorio loco y una flecha hacia su entrada.",
        "clue": "Lleva grabado el emblema del laboratorio loco y una flecha hacia su entrada.",
        "size": 0.085,
        "rotation": -5
      }
    ],
    "puzzle": {
      "type": "sequence",
      "question": "Abre la puerta del agua",
      "clue": "Activa los símbolos en el orden del mural. Puedes deshacer antes de comprobar.",
      "evidence": "El mural enseña el ciclo del agua con flechas: primero el sol calienta, después aparece la nube, luego cae la gota y al final crece la hoja. Las cuatro piedras deben pulsarse en ese mismo orden.",
      "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
      "explanation": "Sol, nube, gota y hoja completan el ciclo del agua. La puerta se abre y revela una pieza que pertenece al laboratorio loco.",
      "items": [
        {
          "id": "drop",
          "label": "Gota",
          "kind": "rune",
          "symbol": "drop"
        },
        {
          "id": "leaf",
          "label": "Hoja",
          "kind": "leaf",
          "symbol": "leaf"
        },
        {
          "id": "sun",
          "label": "Sol",
          "kind": "rune",
          "symbol": "sun"
        },
        {
          "id": "cloud",
          "label": "Nube",
          "kind": "rune",
          "symbol": "cloud"
        }
      ],
      "answer": [
        "sun",
        "cloud",
        "drop",
        "leaf"
      ]
    }
  },
  {
    "id": 7,
    "name": "La fórmula perdida",
    "world": 2,
    "difficulty": "normal",
    "description": "Una receta de luz necesita sus tres ingredientes.",
    "mission": "En el laboratorio faltan las páginas de una fórmula segura. Encuentra los ingredientes y reconstruye la receta que encenderá la lámpara del taller.",
    "outro": "La lámpara funciona. En el taller, un pequeño robot espera que le devolvamos sus piezas.",
    "scene": "games/detective/scenes/case-07.jpg",
    "sceneTitle": "Laboratorio de pociones con frascos, mesa y vitrales luminosos",
    "objects": [
      {
        "id": "green-leaf",
        "kind": "leaf",
        "name": "Hoja verde",
        "detail": "La etiqueta indica paso 1 de la receta de luz.",
        "clue": "La etiqueta indica paso 1 de la receta de luz.",
        "size": 0.085,
        "rotation": -7
      },
      {
        "id": "blue-drop",
        "kind": "bottle",
        "name": "Gota azul",
        "detail": "La etiqueta indica paso 2: añadir después de la hoja verde.",
        "clue": "La etiqueta indica paso 2: añadir después de la hoja verde.",
        "symbol": "drop",
        "size": 0.085,
        "rotation": 5
      },
      {
        "id": "violet-petal",
        "kind": "flower",
        "name": "Pétalo violeta",
        "tint": "#ae74ed",
        "detail": "La etiqueta indica paso 3: cerrar la receta con el pétalo.",
        "clue": "La etiqueta indica paso 3: cerrar la receta con el pétalo.",
        "size": 0.085,
        "rotation": -3
      },
      {
        "id": "red-salt",
        "kind": "crystal",
        "name": "Sal roja",
        "tint": "#ef6662",
        "detail": "La nota del laboratorio dice: «Esta sal se guarda; no se usa en la receta de luz».",
        "clue": "La nota del laboratorio dice: «Esta sal se guarda; no se usa en la receta de luz».",
        "symbol": "diamond",
        "size": 0.085,
        "rotation": 8
      },
      {
        "id": "formula-book",
        "kind": "book",
        "name": "Cuaderno de fórmula",
        "detail": "La secuencia completa es hoja verde, gota azul y pétalo violeta.",
        "clue": "La secuencia completa es hoja verde, gota azul y pétalo violeta.",
        "size": 0.085,
        "rotation": 0
      },
      {
        "id": "measure-spoon",
        "kind": "bottle",
        "name": "Frasco medidor",
        "detail": "Sirve para medir un ingrediente en cada paso, sin mezclarlos de nuevo.",
        "clue": "Sirve para medir un ingrediente en cada paso, sin mezclarlos de nuevo.",
        "size": 0.085,
        "rotation": 4
      },
      {
        "id": "light-lens",
        "kind": "lens",
        "name": "Lente de la lámpara",
        "detail": "La lámpara del taller solo necesita la receta de tres pasos.",
        "clue": "La lámpara del taller solo necesita la receta de tres pasos.",
        "size": 0.085,
        "rotation": -5
      }
    ],
    "puzzle": {
      "type": "sequence",
      "question": "Reconstruye la receta de luz",
      "requiredCount": 3,
      "clue": "Elige solo los tres ingredientes de la receta, en el orden de sus etiquetas. La sal roja debe quedar fuera.",
      "evidence": "La receta de luz se prepara en tres pasos: primero la hoja verde, luego la gota azul y al final el pétalo violeta. La sal roja no forma parte de la receta.",
      "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
      "explanation": "La hoja verde, la gota azul y el pétalo violeta devuelven la luz a la lámpara del taller. No se utiliza la sal roja.",
      "items": [
        {
          "id": "petal",
          "label": "Pétalo violeta",
          "kind": "flower"
        },
        {
          "id": "salt",
          "label": "Sal roja",
          "kind": "crystal"
        },
        {
          "id": "drop",
          "label": "Gota azul",
          "kind": "bottle"
        },
        {
          "id": "leaf",
          "label": "Hoja verde",
          "kind": "leaf"
        }
      ],
      "answer": [
        "leaf",
        "drop",
        "petal"
      ]
    }
  },
  {
    "id": 8,
    "name": "El robot descompuesto",
    "world": 2,
    "difficulty": "normal",
    "description": "Cuatro piezas devuelven la sonrisa a un robot.",
    "mission": "La luz revela las piezas perdidas del robot. Reúne siete pruebas y coloca sus cuatro componentes según el plano del taller.",
    "outro": "El robot despierta y reconoce una máquina que puede leer la dirección de nuestra invitación.",
    "scene": "games/detective/scenes/case-08.jpg",
    "sceneTitle": "Taller mecánico con robot, banco de trabajo y cajones de herramientas",
    "objects": [
      {
        "id": "robot-lens",
        "kind": "lens",
        "name": "Lente del robot",
        "detail": "El plano la coloca en la cabeza: permite ver.",
        "clue": "El plano la coloca en la cabeza: permite ver.",
        "size": 0.085,
        "rotation": -7
      },
      {
        "id": "robot-battery",
        "kind": "battery",
        "name": "Batería del robot",
        "detail": "El plano la coloca en el pecho: da energía.",
        "clue": "El plano la coloca en el pecho: da energía.",
        "size": 0.085,
        "rotation": 5
      },
      {
        "id": "robot-wire",
        "kind": "wire",
        "name": "Cable del robot",
        "detail": "El plano lo coloca en el brazo: conecta la mano.",
        "clue": "El plano lo coloca en el brazo: conecta la mano.",
        "size": 0.085,
        "rotation": -3
      },
      {
        "id": "robot-gear",
        "kind": "gear",
        "name": "Engranaje del robot",
        "detail": "El plano lo coloca en la base: permite moverse.",
        "clue": "El plano lo coloca en la base: permite moverse.",
        "size": 0.085,
        "rotation": 8
      },
      {
        "id": "robot-blueprint",
        "kind": "scroll",
        "name": "Plano de reparación",
        "detail": "Cabeza: lente. Pecho: batería. Brazo: cable. Base: engranaje.",
        "clue": "Cabeza: lente. Pecho: batería. Brazo: cable. Base: engranaje.",
        "size": 0.085,
        "rotation": 0
      },
      {
        "id": "robot-wrench",
        "kind": "wrench",
        "name": "Llave del taller",
        "detail": "Ajusta cada pieza en su ranura sin intercambiar funciones.",
        "clue": "Ajusta cada pieza en su ranura sin intercambiar funciones.",
        "size": 0.085,
        "rotation": 4
      },
      {
        "id": "robot-medal",
        "kind": "medal",
        "name": "Insignia del robot",
        "detail": "Dice «Ayudante de la gran fiesta». El robot conserva una pista sobre la invitación.",
        "clue": "Dice «Ayudante de la gran fiesta». El robot conserva una pista sobre la invitación.",
        "size": 0.085,
        "rotation": -5
      }
    ],
    "puzzle": {
      "type": "assemble",
      "question": "Repara a nuestro ayudante",
      "clue": "Arrastra cada pieza a su ranura o elige el destino. El plano explica para qué sirve cada una.",
      "evidence": "El plano del robot indica: lente en la cabeza para ver, batería en el pecho para energía, cable en el brazo para conectar y engranaje en la base para moverse. Cada pieza ocupa una sola ranura.",
      "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
      "explanation": "Lente en la cabeza, batería en el pecho, cable en el brazo y engranaje en la base: el robot vuelve a funcionar y nos lleva hasta la máquina de direcciones.",
      "layout": "robot",
      "items": [
        {
          "id": "gear",
          "label": "Engranaje",
          "kind": "gear"
        },
        {
          "id": "lens",
          "label": "Lente",
          "kind": "lens"
        },
        {
          "id": "wire",
          "label": "Cable",
          "kind": "wire"
        },
        {
          "id": "battery",
          "label": "Batería",
          "kind": "battery"
        }
      ],
      "targets": [
        {
          "id": "head",
          "label": "Cabeza · visión"
        },
        {
          "id": "chest",
          "label": "Pecho · energía"
        },
        {
          "id": "arm",
          "label": "Brazo · conexión"
        },
        {
          "id": "base",
          "label": "Base · movimiento"
        }
      ],
      "answer": {
        "lens": "head",
        "battery": "chest",
        "wire": "arm",
        "gear": "base"
      }
    }
  },
  {
    "id": 9,
    "name": "La máquina misteriosa",
    "world": 2,
    "difficulty": "normal",
    "description": "Energía, luz y movimiento esconden una dirección.",
    "mission": "El robot reconoce la máquina de invitaciones. Busca sus siete piezas y prepara las conexiones para leer la siguiente dirección.",
    "outro": "La máquina imprime «Plaza de los animales». Allí, una gata busca un collar muy especial.",
    "scene": "games/detective/scenes/case-09.jpg",
    "sceneTitle": "Laboratorio tecnológico con consola antigua, tubos y paneles luminosos",
    "objects": [
      {
        "id": "power-module",
        "kind": "battery",
        "name": "Módulo de energía",
        "detail": "El manual lo conecta a la entrada de energía.",
        "clue": "El manual lo conecta a la entrada de energía.",
        "size": 0.085,
        "rotation": -7
      },
      {
        "id": "optical-lens",
        "kind": "lens",
        "name": "Lente óptica",
        "detail": "El manual la conecta a la entrada de luz.",
        "clue": "El manual la conecta a la entrada de luz.",
        "size": 0.085,
        "rotation": 5
      },
      {
        "id": "drive-gear",
        "kind": "gear",
        "name": "Engranaje motriz",
        "detail": "El manual lo conecta a la entrada de movimiento.",
        "clue": "El manual lo conecta a la entrada de movimiento.",
        "size": 0.085,
        "rotation": -3
      },
      {
        "id": "power-wire",
        "kind": "wire",
        "name": "Cable de alimentación",
        "detail": "Una flecha explica: la batería enciende antes que la luz y el movimiento.",
        "clue": "Una flecha explica: la batería enciende antes que la luz y el movimiento.",
        "size": 0.085,
        "rotation": 8
      },
      {
        "id": "machine-manual",
        "kind": "book",
        "name": "Manual de conexiones",
        "detail": "Conecta batería con energía, lente con luz y engranaje con movimiento. Activa en ese orden.",
        "clue": "Conecta batería con energía, lente con luz y engranaje con movimiento. Activa en ese orden.",
        "size": 0.085,
        "rotation": 0
      },
      {
        "id": "address-ticket",
        "kind": "ticket",
        "name": "Tira de dirección",
        "detail": "La dirección solo aparecerá al activar energía → luz → movimiento.",
        "clue": "La dirección solo aparecerá al activar energía → luz → movimiento.",
        "size": 0.085,
        "rotation": 4
      },
      {
        "id": "crystal-switch",
        "kind": "crystal",
        "name": "Interruptor de cristal",
        "detail": "El robot señala la misma secuencia de tres pasos en su superficie.",
        "clue": "El robot señala la misma secuencia de tres pasos en su superficie.",
        "size": 0.085,
        "rotation": -5
      }
    ],
    "puzzle": {
      "type": "multi",
      "question": "La combinación de la máquina",
      "clue": "Primero conecta los módulos; después activa sus funciones en orden.",
      "evidence": "El manual conecta por función, no por color: la batería alimenta la entrada de energía; la lente lleva la luz a la entrada óptica; el engranaje mueve la entrada mecánica. Solo después se pulsa el botón con esos tres pasos: energía, luz, movimiento.",
      "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
      "explanation": "La máquina vuelve a leer invitaciones. Su mensaje revela la plaza de la ciudad de los animales.",
      "stages": [
        {
          "type": "match",
          "question": "Conecta cada módulo",
          "clue": "Cada entrada tiene una función distinta. Sigue el manual.",
          "evidence": "El manual conecta por función, no por color: la batería alimenta la entrada de energía; la lente lleva la luz a la entrada óptica; el engranaje mueve la entrada mecánica. Solo después se pulsa el botón con esos tres pasos: energía, luz, movimiento.",
          "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
          "explanation": "Las tres conexiones funcionan.",
          "items": [
            {
              "id": "battery",
              "label": "Batería",
              "kind": "battery"
            },
            {
              "id": "lens",
              "label": "Lente",
              "kind": "lens"
            },
            {
              "id": "gear",
              "label": "Engranaje",
              "kind": "gear"
            }
          ],
          "targets": [
            {
              "id": "motion",
              "label": "Entrada de movimiento"
            },
            {
              "id": "energy",
              "label": "Entrada de energía"
            },
            {
              "id": "light",
              "label": "Entrada de luz"
            }
          ],
          "answer": {
            "battery": "energy",
            "lens": "light",
            "gear": "motion"
          }
        },
        {
          "type": "sequence",
          "question": "Activa los tres mecanismos",
          "clue": "El manual indica energía, después luz y al final movimiento.",
          "evidence": "El manual conecta por función, no por color: la batería alimenta la entrada de energía; la lente lleva la luz a la entrada óptica; el engranaje mueve la entrada mecánica. Solo después se pulsa el botón con esos tres pasos: energía, luz, movimiento.",
          "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
          "explanation": "La secuencia energía → luz → movimiento imprime la dirección de la plaza.",
          "items": [
            {
              "id": "light",
              "label": "Luz",
              "kind": "lens"
            },
            {
              "id": "motion",
              "label": "Movimiento",
              "kind": "gear"
            },
            {
              "id": "energy",
              "label": "Energía",
              "kind": "battery"
            }
          ],
          "answer": [
            "energy",
            "light",
            "motion"
          ]
        }
      ]
    }
  },
  {
    "id": 10,
    "name": "El collar perdido",
    "world": 3,
    "difficulty": "normal",
    "description": "Tres testigos ayudan a una amiga de BruCat.",
    "mission": "La gata de la plaza busca su collar. Reúne los testimonios y las señales del paseo para deducir dónde lo dejó.",
    "outro": "El collar ya está a salvo. Su medallón lleva el sello del mercado: los comerciantes preparan algo para la fiesta.",
    "scene": "games/detective/scenes/case-10.jpg",
    "sceneTitle": "Plaza de animales con fuente, quiosco, bancos y macetas",
    "objects": [
      {
        "id": "cat-collar",
        "kind": "collar",
        "name": "Collar de la gata",
        "detail": "La etiqueta dice «Recuperado por el jardinero». Falta descubrir en qué lugar lo encontró.",
        "clue": "La etiqueta dice «Recuperado por el jardinero». Falta descubrir en qué lugar lo encontró.",
        "size": 0.085,
        "rotation": -7
      },
      {
        "id": "cat-story",
        "kind": "book",
        "name": "Testimonio de la gata",
        "detail": "«Lo tenía al pasar por la fuente; después me senté y até mi cinta al banco».",
        "clue": "«Lo tenía al pasar por la fuente; después me senté y até mi cinta al banco».",
        "symbol": "cat",
        "size": 0.085,
        "rotation": 5
      },
      {
        "id": "rabbit-story",
        "kind": "ticket",
        "name": "Testimonio de la coneja",
        "detail": "«Vi a la gata sentada; no fue en el quiosco».",
        "clue": "«Vi a la gata sentada; no fue en el quiosco».",
        "symbol": "rabbit",
        "size": 0.085,
        "rotation": -3
      },
      {
        "id": "bird-story",
        "kind": "feather",
        "name": "Testimonio del pájaro",
        "detail": "«El banco junto a las flores tenía una cinta violeta».",
        "clue": "«El banco junto a las flores tenía una cinta violeta».",
        "symbol": "bird",
        "size": 0.085,
        "rotation": 8
      },
      {
        "id": "violet-ribbon",
        "kind": "rune",
        "name": "Cinta violeta",
        "detail": "Es la señal que la gata dejó en el banco junto a las flores.",
        "clue": "Es la señal que la gata dejó en el banco junto a las flores.",
        "symbol": "spiral",
        "size": 0.085,
        "rotation": 0
      },
      {
        "id": "garden-flower",
        "kind": "flower",
        "name": "Flor del jardinero",
        "detail": "El jardinero encontró el collar debajo del banco que tenía la cinta.",
        "clue": "El jardinero encontró el collar debajo del banco que tenía la cinta.",
        "size": 0.085,
        "rotation": 4
      },
      {
        "id": "market-medal",
        "kind": "medal",
        "name": "Medallón del mercado",
        "detail": "El medallón invita a pasar por los puestos antes de continuar el viaje.",
        "clue": "El medallón invita a pasar por los puestos antes de continuar el viaje.",
        "size": 0.085,
        "rotation": -5
      }
    ],
    "puzzle": {
      "type": "choice",
      "question": "¿Dónde encontró el jardinero el collar?",
      "clue": "Cruza las tres declaraciones y sigue la cinta violeta.",
      "evidence": "La gata dejó el collar después de pasar por la fuente. La coneja la vio sentarse en un banco, y el pájaro vio una cinta violeta en el banco junto a las flores. La fuente y el quiosco no tienen esa cinta.",
      "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
      "explanation": "La cinta identifica el banco junto a las flores. Allí encontró el jardinero el collar, después del paseo de la gata.",
      "options": [
        {
          "id": "fountain",
          "label": "En la fuente",
          "kind": "bottle"
        },
        {
          "id": "bench",
          "label": "Bajo el banco junto a las flores",
          "kind": "flower"
        },
        {
          "id": "kiosk",
          "label": "En el quiosco de música",
          "kind": "book"
        }
      ],
      "answer": "bench"
    }
  },
  {
    "id": 11,
    "name": "El misterio del mercado",
    "world": 3,
    "difficulty": "hard",
    "description": "Los productos no faltan: están bien guardados.",
    "mission": "Los comerciantes creen que sus productos desaparecieron. Reúne nueve pruebas y compara sus notas para encontrar dónde los guardaron.",
    "outro": "Las notas del mercado incluyen un recibo de correos: el paquete de la fiesta todavía no llegó a su destino.",
    "scene": "games/detective/scenes/case-11.jpg",
    "sceneTitle": "Mercado de animales con puestos de frutas, flores y pan",
    "objects": [
      {
        "id": "market-apple",
        "kind": "apple",
        "name": "Manzana roja",
        "detail": "La nota de la coneja pide conservarla en un lugar fresco.",
        "clue": "La nota de la coneja pide conservarla en un lugar fresco.",
        "size": 0.075,
        "rotation": -7
      },
      {
        "id": "market-flower",
        "kind": "flower",
        "name": "Ramo de flores",
        "detail": "El tucán escribe que necesita luz junto a una ventana.",
        "clue": "El tucán escribe que necesita luz junto a una ventana.",
        "size": 0.075,
        "rotation": 5
      },
      {
        "id": "market-bread",
        "kind": "basket",
        "name": "Panera del mercado",
        "detail": "La tortuga pide guardar el pan en una caja seca.",
        "clue": "La tortuga pide guardar el pan en una caja seca.",
        "size": 0.075,
        "rotation": -3
      },
      {
        "id": "rabbit-receipt",
        "kind": "ticket",
        "name": "Nota de la coneja",
        "detail": "«Las manzanas están en la cámara fresca».",
        "clue": "«Las manzanas están en la cámara fresca».",
        "symbol": "rabbit",
        "size": 0.075,
        "rotation": 8
      },
      {
        "id": "toucan-receipt",
        "kind": "feather",
        "name": "Nota del tucán",
        "detail": "«Las flores esperan en la ventana del puesto».",
        "clue": "«Las flores esperan en la ventana del puesto».",
        "symbol": "bird",
        "size": 0.075,
        "rotation": 0
      },
      {
        "id": "turtle-receipt",
        "kind": "book",
        "name": "Nota de la tortuga",
        "detail": "«La caja de madera protege el pan de la humedad».",
        "clue": "«La caja de madera protege el pan de la humedad».",
        "symbol": "turtle",
        "size": 0.075,
        "rotation": 4
      },
      {
        "id": "storage-key",
        "kind": "key",
        "name": "Llave del almacén",
        "detail": "Abre el paso a las tres zonas de guardado, ninguna está cerrada con otro candado.",
        "clue": "Abre el paso a las tres zonas de guardado, ninguna está cerrada con otro candado.",
        "size": 0.075,
        "rotation": -5
      },
      {
        "id": "delivery-stamp",
        "kind": "stamp",
        "name": "Sello de entrega",
        "detail": "El paquete de correos tiene un sello con la misma estrella de la invitación.",
        "clue": "El paquete de correos tiene un sello con la misma estrella de la invitación.",
        "size": 0.075,
        "rotation": 3
      },
      {
        "id": "post-receipt",
        "kind": "envelope",
        "name": "Recibo de correos",
        "detail": "Una entrega para la fiesta sigue pendiente en la oficina de correos.",
        "clue": "Una entrega para la fiesta sigue pendiente en la oficina de correos.",
        "size": 0.075,
        "rotation": 0
      }
    ],
    "puzzle": {
      "type": "match",
      "question": "Devuelve cada producto a su lugar",
      "clue": "Une las tres notas de comerciantes con sus lugares de guardado. Usa cada destino una vez.",
      "evidence": "La coneja guardó las manzanas donde se mantienen frescas: la cámara fresca. El tucán puso las flores donde reciben luz: la ventana. La tortuga guardó el pan en un lugar seco: la caja de madera. Ningún producto comparte destino.",
      "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
      "explanation": "Las manzanas estaban en la cámara fresca, las flores en la ventana y el pan en su caja seca. Los comerciantes no habían perdido nada: estaban preparando la fiesta.",
      "items": [
        {
          "id": "flowers",
          "label": "Flores del tucán",
          "kind": "flower"
        },
        {
          "id": "bread",
          "label": "Pan de la tortuga",
          "kind": "basket"
        },
        {
          "id": "apples",
          "label": "Manzanas de la coneja",
          "kind": "apple"
        }
      ],
      "targets": [
        {
          "id": "wood",
          "label": "Caja de madera seca"
        },
        {
          "id": "fresh",
          "label": "Cámara fresca"
        },
        {
          "id": "window",
          "label": "Ventana con luz"
        }
      ],
      "answer": {
        "apples": "fresh",
        "flowers": "window",
        "bread": "wood"
      }
    }
  },
  {
    "id": 12,
    "name": "El paquete desaparecido",
    "world": 3,
    "difficulty": "hard",
    "description": "Una etiqueta devuelve el rumbo a una entrega.",
    "mission": "El paquete no salió de correos: sus etiquetas se mezclaron. Busca nueve pruebas, ordena las salidas y descubre su destino.",
    "outro": "La dirección nos lleva a la mansión: sus relojes esperan la hora de una gran sorpresa.",
    "scene": "games/detective/scenes/case-12.jpg",
    "sceneTitle": "Oficina de correos con ventanilla, casilleros, báscula y paquetes",
    "objects": [
      {
        "id": "star-parcel",
        "kind": "parcel",
        "name": "Paquete estrellado",
        "detail": "Su etiqueta tiene una estrella y la salida de las 11:00.",
        "clue": "Su etiqueta tiene una estrella y la salida de las 11:00.",
        "symbol": "star",
        "size": 0.075,
        "rotation": -7
      },
      {
        "id": "nine-tag",
        "kind": "ticket",
        "name": "Etiqueta de las 9:00",
        "detail": "Es la primera salida: antes de las 10:00 y las 11:00.",
        "clue": "Es la primera salida: antes de las 10:00 y las 11:00.",
        "symbol": "9",
        "size": 0.075,
        "rotation": 5
      },
      {
        "id": "ten-tag",
        "kind": "ticket",
        "name": "Etiqueta de las 10:00",
        "detail": "Es la segunda salida, entre las 9:00 y las 11:00.",
        "clue": "Es la segunda salida, entre las 9:00 y las 11:00.",
        "symbol": "10",
        "size": 0.075,
        "rotation": -3
      },
      {
        "id": "eleven-tag",
        "kind": "ticket",
        "name": "Etiqueta de las 11:00",
        "detail": "Es la tercera salida y corresponde al paquete con estrella.",
        "clue": "Es la tercera salida y corresponde al paquete con estrella.",
        "symbol": "11",
        "size": 0.075,
        "rotation": 8
      },
      {
        "id": "mansion-envelope",
        "kind": "envelope",
        "name": "Sobre de la mansión",
        "detail": "La dirección completa es «Mansión de la Amistad · Sala de relojes».",
        "clue": "La dirección completa es «Mansión de la Amistad · Sala de relojes».",
        "size": 0.075,
        "rotation": 0
      },
      {
        "id": "postal-book",
        "kind": "book",
        "name": "Libro de salidas",
        "detail": "Las entregas se ordenan por hora, de la más temprana a la más tardía.",
        "clue": "Las entregas se ordenan por hora, de la más temprana a la más tardía.",
        "size": 0.075,
        "rotation": 4
      },
      {
        "id": "star-stamp",
        "kind": "stamp",
        "name": "Sello de estrella",
        "detail": "Confirma que el sobre de la mansión pertenece al paquete estrellado.",
        "clue": "Confirma que el sobre de la mansión pertenece al paquete estrellado.",
        "symbol": "star",
        "size": 0.075,
        "rotation": -5
      },
      {
        "id": "office-key",
        "kind": "key",
        "name": "Llave de casilleros",
        "detail": "La empleada encontró el paquete al reorganizar los casilleros de salida.",
        "clue": "La empleada encontró el paquete al reorganizar los casilleros de salida.",
        "size": 0.075,
        "rotation": 3
      },
      {
        "id": "delivery-bell",
        "kind": "medal",
        "name": "Ficha de la entrega",
        "detail": "BruCat puede llevar el paquete a la sala de relojes y descubrir la sorpresa.",
        "clue": "BruCat puede llevar el paquete a la sala de relojes y descubrir la sorpresa.",
        "size": 0.075,
        "rotation": 0
      }
    ],
    "puzzle": {
      "type": "multi",
      "question": "Organiza la entrega de la fiesta",
      "clue": "Resuelve las dos pistas de la oficina sin perder las pruebas.",
      "evidence": "Las etiquetas de salida se leen de menor a mayor hora: 9:00, 10:00 y 11:00. El paquete de estrella viaja a las 11:00. Su etiqueta completa dice «Mansión de la Amistad · Sala de relojes», no «Mercado» ni «Castillo».",
      "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
      "explanation": "Ordenar las horas permite identificar el paquete de las 11:00. Su etiqueta lleva a la sala de relojes de la Mansión de la Amistad.",
      "stages": [
        {
          "type": "sequence",
          "question": "Ordena las salidas de correos",
          "clue": "Pon primero la salida más temprana y al final la más tardía.",
          "evidence": "Las etiquetas de salida se leen de menor a mayor hora: 9:00, 10:00 y 11:00. El paquete de estrella viaja a las 11:00. Su etiqueta completa dice «Mansión de la Amistad · Sala de relojes», no «Mercado» ni «Castillo».",
          "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
          "explanation": "Las salidas se leen 9:00, 10:00 y 11:00.",
          "items": [
            {
              "id": "eleven",
              "label": "11:00",
              "kind": "ticket"
            },
            {
              "id": "nine",
              "label": "9:00",
              "kind": "ticket"
            },
            {
              "id": "ten",
              "label": "10:00",
              "kind": "ticket"
            }
          ],
          "answer": [
            "nine",
            "ten",
            "eleven"
          ]
        },
        {
          "type": "choice",
          "question": "¿Adónde va el paquete de estrella?",
          "clue": "Lee el destino del sobre con el mismo sello del paquete.",
          "evidence": "Las etiquetas de salida se leen de menor a mayor hora: 9:00, 10:00 y 11:00. El paquete de estrella viaja a las 11:00. Su etiqueta completa dice «Mansión de la Amistad · Sala de relojes», no «Mercado» ni «Castillo».",
          "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
          "explanation": "El paquete de estrella viaja a la sala de relojes de la Mansión de la Amistad.",
          "options": [
            {
              "id": "market",
              "label": "Al mercado de animales",
              "kind": "basket"
            },
            {
              "id": "mansion",
              "label": "A la mansión · sala de relojes",
              "kind": "clock"
            },
            {
              "id": "castle",
              "label": "Al castillo · biblioteca",
              "kind": "book"
            }
          ],
          "answer": "mansion"
        }
      ]
    }
  },
  {
    "id": 13,
    "name": "El reloj detenido",
    "world": 4,
    "difficulty": "hard",
    "description": "Tres horas ponen en marcha una sorpresa.",
    "mission": "El reloj mágico se detuvo esperando su programa. Encuentra nueve pruebas y devuelve cada pareja de agujas a la hora indicada.",
    "outro": "El reloj vuelve a sonar. Una puerta se abre hacia la galería, donde los cuadros guardan el último mensaje.",
    "scene": "games/detective/scenes/case-13.jpg",
    "sceneTitle": "Habitación de relojes con péndulos, engranajes y vitrales de luna",
    "objects": [
      {
        "id": "three-clock",
        "kind": "clock",
        "name": "Reloj de las 3",
        "detail": "La aguja corta apunta al 3 y la larga al 12: llega BruCat.",
        "clue": "La aguja corta apunta al 3 y la larga al 12: llega BruCat.",
        "symbol": "3",
        "size": 0.075,
        "rotation": -7
      },
      {
        "id": "six-clock",
        "kind": "clock",
        "name": "Reloj de las 6",
        "detail": "La aguja corta apunta al 6 y la larga al 12: se encienden las luces.",
        "clue": "La aguja corta apunta al 6 y la larga al 12: se encienden las luces.",
        "symbol": "6",
        "size": 0.075,
        "rotation": 5
      },
      {
        "id": "nine-clock",
        "kind": "clock",
        "name": "Reloj de las 9",
        "detail": "La aguja corta apunta al 9 y la larga al 12: empieza la fiesta.",
        "clue": "La aguja corta apunta al 9 y la larga al 12: empieza la fiesta.",
        "symbol": "9",
        "size": 0.075,
        "rotation": -3
      },
      {
        "id": "hour-program",
        "kind": "scroll",
        "name": "Programa horario",
        "detail": "Llegada a las 3, luces a las 6, fiesta a las 9. Primero llegada, después luces y al final fiesta.",
        "clue": "Llegada a las 3, luces a las 6, fiesta a las 9. Primero llegada, después luces y al final fiesta.",
        "size": 0.075,
        "rotation": 8
      },
      {
        "id": "clock-gear",
        "kind": "gear",
        "name": "Rueda del reloj",
        "detail": "Faltaba leer las horas correctas; ninguna pieza del reloj estaba rota.",
        "clue": "Faltaba leer las horas correctas; ninguna pieza del reloj estaba rota.",
        "size": 0.075,
        "rotation": 0
      },
      {
        "id": "clock-key",
        "kind": "key",
        "name": "Llave del péndulo",
        "detail": "La encargada dejó el mecanismo en pausa para que todos llegaran a tiempo.",
        "clue": "La encargada dejó el mecanismo en pausa para que todos llegaran a tiempo.",
        "size": 0.075,
        "rotation": 4
      },
      {
        "id": "moon-medallion",
        "kind": "medal",
        "name": "Medallón lunar",
        "detail": "Cada minutero señala el 12: todas las horas son en punto.",
        "clue": "Cada minutero señala el 12: todas las horas son en punto.",
        "symbol": "moon",
        "size": 0.075,
        "rotation": -5
      },
      {
        "id": "time-lens",
        "kind": "glass",
        "name": "Lupa de las agujas",
        "detail": "Distingue la aguja corta de las horas de la larga de los minutos.",
        "clue": "Distingue la aguja corta de las horas de la larga de los minutos.",
        "size": 0.075,
        "rotation": 3
      },
      {
        "id": "gallery-ticket",
        "kind": "ticket",
        "name": "Entrada a la galería",
        "detail": "El último sonido del reloj abre la puerta de los cuadros.",
        "clue": "El último sonido del reloj abre la puerta de los cuadros.",
        "size": 0.075,
        "rotation": 0
      }
    ],
    "puzzle": {
      "type": "multi",
      "question": "Pon en hora el reloj mágico",
      "clue": "Reconoce las agujas y después ordena el programa de la fiesta.",
      "evidence": "El reloj mágico espera las tres horas de la tarjeta: a las 3 llega BruCat, a las 6 se encienden las luces y a las 9 comienza la fiesta. En todas, el minutero señala el 12. La aguja corta señala 3, luego 6 y al final 9.",
      "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
      "explanation": "Las agujas marcan las 3, las 6 y las 9 en punto. El programa vuelve a funcionar y abre la puerta de la galería.",
      "stages": [
        {
          "type": "match",
          "question": "Empareja las agujas con su hora",
          "clue": "La aguja corta marca la hora; la larga permanece en el 12.",
          "evidence": "El reloj mágico espera las tres horas de la tarjeta: a las 3 llega BruCat, a las 6 se encienden las luces y a las 9 comienza la fiesta. En todas, el minutero señala el 12. La aguja corta señala 3, luego 6 y al final 9.",
          "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
          "explanation": "Cada pareja de agujas tiene una hora distinta.",
          "items": [
            {
              "id": "clock9",
              "label": "Corta al 9 · larga al 12",
              "kind": "clock",
              "symbol": "9"
            },
            {
              "id": "clock3",
              "label": "Corta al 3 · larga al 12",
              "kind": "clock",
              "symbol": "3"
            },
            {
              "id": "clock6",
              "label": "Corta al 6 · larga al 12",
              "kind": "clock",
              "symbol": "6"
            }
          ],
          "targets": [
            {
              "id": "six",
              "label": "6:00 · luces"
            },
            {
              "id": "nine",
              "label": "9:00 · fiesta"
            },
            {
              "id": "three",
              "label": "3:00 · llegada"
            }
          ],
          "answer": {
            "clock3": "three",
            "clock6": "six",
            "clock9": "nine"
          }
        },
        {
          "type": "sequence",
          "question": "Activa las horas de la fiesta",
          "clue": "Sigue el programa: llegada, luces y fiesta.",
          "evidence": "El reloj mágico espera las tres horas de la tarjeta: a las 3 llega BruCat, a las 6 se encienden las luces y a las 9 comienza la fiesta. En todas, el minutero señala el 12. La aguja corta señala 3, luego 6 y al final 9.",
          "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
          "explanation": "El orden correcto es 3:00, 6:00 y 9:00.",
          "items": [
            {
              "id": "nine",
              "label": "9:00 · fiesta",
              "kind": "clock",
              "symbol": "9"
            },
            {
              "id": "three",
              "label": "3:00 · llegada",
              "kind": "clock",
              "symbol": "3"
            },
            {
              "id": "six",
              "label": "6:00 · luces",
              "kind": "clock",
              "symbol": "6"
            }
          ],
          "answer": [
            "three",
            "six",
            "nine"
          ]
        }
      ]
    }
  },
  {
    "id": 14,
    "name": "El cuadro misterioso",
    "world": 4,
    "difficulty": "hard",
    "description": "Una diferencia revela un mensaje escondido.",
    "mission": "En la galería hay un mensaje hecho de formas. Reúne nueve pruebas, compara los cuadros y descubre qué palabra se esconde.",
    "outro": "La palabra JARDÍN abre la sala secreta. Allí nos esperan las pistas de los cinco capítulos.",
    "scene": "games/detective/scenes/case-14.jpg",
    "sceneTitle": "Galería de arte con cuadros fantásticos, caballetes y esculturas",
    "objects": [
      {
        "id": "original-picture",
        "kind": "painting",
        "name": "Cuadro original",
        "detail": "La fila del cuadro original es sol, luna y estrella.",
        "clue": "La fila del cuadro original es sol, luna y estrella.",
        "pattern": [
          "sun",
          "moon",
          "star"
        ],
        "size": 0.075,
        "rotation": -7
      },
      {
        "id": "changed-picture",
        "kind": "painting",
        "name": "Cuadro de la hoja",
        "detail": "Muestra sol, luna y hoja: cambia solo la estrella del original.",
        "clue": "Muestra sol, luna y hoja: cambia solo la estrella del original.",
        "pattern": [
          "sun",
          "moon",
          "leaf"
        ],
        "size": 0.075,
        "rotation": 5
      },
      {
        "id": "extra-change",
        "kind": "painting",
        "name": "Cuadro de dos cambios",
        "detail": "Muestra luna, luna y hoja: cambian dos posiciones, no una.",
        "clue": "Muestra luna, luna y hoja: cambian dos posiciones, no una.",
        "pattern": [
          "moon",
          "moon",
          "leaf"
        ],
        "size": 0.075,
        "rotation": -3
      },
      {
        "id": "water-picture",
        "kind": "painting",
        "name": "Cuadro de la gota",
        "detail": "Muestra sol, luna y gota: no usa la hoja que pide la nota.",
        "clue": "Muestra sol, luna y gota: no usa la hoja que pide la nota.",
        "pattern": [
          "sun",
          "moon",
          "drop"
        ],
        "size": 0.075,
        "rotation": 8
      },
      {
        "id": "artist-note",
        "kind": "scroll",
        "name": "Nota de la artista",
        "detail": "«Cambia solo la estrella por una hoja. Conserva el sol y la luna».",
        "clue": "«Cambia solo la estrella por una hoja. Conserva el sol y la luna».",
        "size": 0.075,
        "rotation": 0
      },
      {
        "id": "leaf-dictionary",
        "kind": "book",
        "name": "Diccionario de símbolos",
        "detail": "Hoja significa JARDÍN; gota significa COCINA; estrella significa SALÓN.",
        "clue": "Hoja significa JARDÍN; gota significa COCINA; estrella significa SALÓN.",
        "size": 0.075,
        "rotation": 4
      },
      {
        "id": "artist-brush",
        "kind": "brush",
        "name": "Pincel violeta",
        "detail": "La artista dejó el mensaje con tres formas grandes para que todos pudieran leerlo.",
        "clue": "La artista dejó el mensaje con tres formas grandes para que todos pudieran leerlo.",
        "size": 0.075,
        "rotation": -5
      },
      {
        "id": "prism-light",
        "kind": "prism",
        "name": "Prisma de la galería",
        "detail": "La luz deja ver las formas sin cambiar su orden.",
        "clue": "La luz deja ver las formas sin cambiar su orden.",
        "size": 0.075,
        "rotation": 3
      },
      {
        "id": "secret-door-key",
        "kind": "key",
        "name": "Llave de la sala secreta",
        "detail": "La puerta escucha la palabra que indique la forma nueva del cuadro.",
        "clue": "La puerta escucha la palabra que indique la forma nueva del cuadro.",
        "size": 0.075,
        "rotation": 0
      }
    ],
    "puzzle": {
      "type": "multi",
      "question": "Descifra el mensaje de los cuadros",
      "clue": "Compara las tres formas; después consulta su diccionario.",
      "evidence": "El cuadro original muestra sol–luna–estrella. La nota pide una sola sustitución: cambiar la estrella por una hoja y conservar el resto. El diccionario de símbolos dice hoja = jardín, gota = cocina y estrella = salón.",
      "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
      "explanation": "La única sustitución pedida cambia estrella por hoja. Hoja significa JARDÍN: esa palabra abre la sala secreta.",
      "stages": [
        {
          "type": "choice",
          "question": "¿Qué cuadro cumple la nota?",
          "clue": "Conserva el sol y la luna, y sustituye solamente la estrella por una hoja.",
          "evidence": "El cuadro original muestra sol–luna–estrella. La nota pide una sola sustitución: cambiar la estrella por una hoja y conservar el resto. El diccionario de símbolos dice hoja = jardín, gota = cocina y estrella = salón.",
          "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
          "explanation": "El cuadro sol–luna–hoja es el único que cumple la nota.",
          "referencePattern": [
            "sun",
            "moon",
            "star"
          ],
          "options": [
            {
              "id": "water",
              "label": "Cuadro de la gota",
              "pattern": [
                "sun",
                "moon",
                "drop"
              ]
            },
            {
              "id": "leaf",
              "label": "Cuadro de la hoja",
              "pattern": [
                "sun",
                "moon",
                "leaf"
              ]
            },
            {
              "id": "double",
              "label": "Cuadro de dos cambios",
              "pattern": [
                "moon",
                "moon",
                "leaf"
              ]
            }
          ],
          "answer": "leaf"
        },
        {
          "type": "choice",
          "question": "¿Qué palabra revela la forma nueva?",
          "clue": "La forma nueva es una hoja. Usa el diccionario de símbolos encontrado.",
          "evidence": "El cuadro original muestra sol–luna–estrella. La nota pide una sola sustitución: cambiar la estrella por una hoja y conservar el resto. El diccionario de símbolos dice hoja = jardín, gota = cocina y estrella = salón.",
          "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
          "explanation": "La hoja se traduce como JARDÍN.",
          "options": [
            {
              "id": "hall",
              "label": "SALÓN",
              "kind": "rune",
              "symbol": "star"
            },
            {
              "id": "kitchen",
              "label": "COCINA",
              "kind": "rune",
              "symbol": "drop"
            },
            {
              "id": "garden",
              "label": "JARDÍN",
              "kind": "leaf",
              "symbol": "leaf"
            }
          ],
          "answer": "garden"
        }
      ]
    }
  },
  {
    "id": 15,
    "name": "El gran secreto de BruCat",
    "world": 4,
    "difficulty": "hard",
    "description": "Cinco capítulos, una aventura y una gran reunión.",
    "mission": "La sala secreta reúne las pruebas de todo el viaje. Encuentra nueve recuerdos y resuelve tres etapas para descubrir por qué todos colaboraban.",
    "outro": "¡Aventura completada! BruCat y sus amigos celebran la Fiesta de la Amistad. Cada pista fue una pequeña ayuda para reunirlos.",
    "scene": "games/detective/scenes/case-15.jpg",
    "sceneTitle": "Sala secreta de la mansión con recuerdos de la aventura y mesa de celebración",
    "objects": [
      {
        "id": "castle-memory",
        "kind": "crown",
        "name": "Recuerdo del castillo",
        "detail": "Capítulo 1: la corona abrió el camino al libro y al cofre del castillo.",
        "clue": "Capítulo 1: la corona abrió el camino al libro y al cofre del castillo.",
        "size": 0.075,
        "rotation": -7
      },
      {
        "id": "jungle-memory",
        "kind": "leaf",
        "name": "Recuerdo de la selva",
        "detail": "Capítulo 2: el mapa y la cascada revelaron una pieza del laboratorio.",
        "clue": "Capítulo 2: el mapa y la cascada revelaron una pieza del laboratorio.",
        "size": 0.075,
        "rotation": 5
      },
      {
        "id": "lab-memory",
        "kind": "gear",
        "name": "Recuerdo del laboratorio",
        "detail": "Capítulo 3: el robot y la máquina revelaron la dirección de la ciudad.",
        "clue": "Capítulo 3: el robot y la máquina revelaron la dirección de la ciudad.",
        "size": 0.075,
        "rotation": -3
      },
      {
        "id": "city-memory",
        "kind": "envelope",
        "name": "Recuerdo de la ciudad",
        "detail": "Capítulo 4: los comerciantes y correos enviaron un paquete hacia la mansión.",
        "clue": "Capítulo 4: los comerciantes y correos enviaron un paquete hacia la mansión.",
        "size": 0.075,
        "rotation": 8
      },
      {
        "id": "mansion-memory",
        "kind": "clock",
        "name": "Recuerdo de la mansión",
        "detail": "Capítulo 5: el reloj y el mensaje del jardín nos llevaron a esta sala.",
        "clue": "Capítulo 5: el reloj y el mensaje del jardín nos llevaron a esta sala.",
        "size": 0.075,
        "rotation": 0
      },
      {
        "id": "preparation-book",
        "kind": "book",
        "name": "Libro de preparativos",
        "detail": "Mercado: preparar pan. Laboratorio: encender luces. Correos: repartir invitaciones.",
        "clue": "Mercado: preparar pan. Laboratorio: encender luces. Correos: repartir invitaciones.",
        "size": 0.075,
        "rotation": 4
      },
      {
        "id": "friendship-invitation",
        "kind": "scroll",
        "name": "Invitación de la amistad",
        "detail": "«No buscábamos un tesoro perdido: preparábamos la Fiesta de la Amistad para todos».",
        "clue": "«No buscábamos un tesoro perdido: preparábamos la Fiesta de la Amistad para todos».",
        "size": 0.075,
        "rotation": -5
      },
      {
        "id": "friendship-medal",
        "kind": "medal",
        "name": "Medalla de buen compañero",
        "detail": "Ayudar, escuchar y compartir permitió completar los cinco capítulos.",
        "clue": "Ayudar, escuchar y compartir permitió completar los cinco capítulos.",
        "size": 0.075,
        "rotation": 3
      },
      {
        "id": "celebration-prism",
        "kind": "prism",
        "name": "Prisma de los cinco colores",
        "detail": "La luz reúne los colores de los cinco lugares: cada capítulo aportó algo a la celebración.",
        "clue": "La luz reúne los colores de los cinco lugares: cada capítulo aportó algo a la celebración.",
        "size": 0.075,
        "rotation": 0
      }
    ],
    "puzzle": {
      "type": "multi",
      "question": "El gran secreto de los cinco capítulos",
      "clue": "Recuerda la ruta, reúne los preparativos y lee la invitación final. Tus nueve pruebas contienen todas las respuestas.",
      "evidence": "El cuaderno recuerda la ruta: 1 castillo (corona), 2 selva (hoja), 3 laboratorio (engranaje), 4 ciudad (sobre), 5 mansión (reloj). La lista de preparativos asigna pan al mercado, luces al laboratorio e invitaciones a correos. La invitación final dice: «No faltaba un tesoro: estábamos preparando la Fiesta de la Amistad para todos». ",
      "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
      "explanation": "Toda la aventura preparaba la Fiesta de la Amistad. El castillo, la selva, el laboratorio, la ciudad y la mansión colaboraron para reunir a los amigos de BruCat. ¡El verdadero tesoro fue ayudarnos!",
      "stages": [
        {
          "type": "sequence",
          "question": "Recorre otra vez la aventura",
          "clue": "Ordena los cinco recuerdos por el capítulo al que pertenecen.",
          "evidence": "El cuaderno recuerda la ruta: 1 castillo (corona), 2 selva (hoja), 3 laboratorio (engranaje), 4 ciudad (sobre), 5 mansión (reloj). La lista de preparativos asigna pan al mercado, luces al laboratorio e invitaciones a correos. La invitación final dice: «No faltaba un tesoro: estábamos preparando la Fiesta de la Amistad para todos». ",
          "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
          "explanation": "Castillo, selva, laboratorio, ciudad y mansión: la ruta que recorrimos juntos.",
          "items": [
            {
              "id": "city",
              "label": "Ciudad · capítulo 4",
              "kind": "envelope"
            },
            {
              "id": "castle",
              "label": "Castillo · capítulo 1",
              "kind": "crown"
            },
            {
              "id": "mansion",
              "label": "Mansión · capítulo 5",
              "kind": "clock"
            },
            {
              "id": "jungle",
              "label": "Selva · capítulo 2",
              "kind": "leaf"
            },
            {
              "id": "lab",
              "label": "Laboratorio · capítulo 3",
              "kind": "gear"
            }
          ],
          "answer": [
            "castle",
            "jungle",
            "lab",
            "city",
            "mansion"
          ]
        },
        {
          "type": "match",
          "question": "Reúne los preparativos de los amigos",
          "clue": "El libro de preparativos dice qué aportó cada lugar.",
          "evidence": "El cuaderno recuerda la ruta: 1 castillo (corona), 2 selva (hoja), 3 laboratorio (engranaje), 4 ciudad (sobre), 5 mansión (reloj). La lista de preparativos asigna pan al mercado, luces al laboratorio e invitaciones a correos. La invitación final dice: «No faltaba un tesoro: estábamos preparando la Fiesta de la Amistad para todos». ",
          "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
          "explanation": "El mercado aporta el pan, el laboratorio las luces y correos las invitaciones.",
          "items": [
            {
              "id": "bread",
              "label": "Pan para compartir",
              "kind": "basket"
            },
            {
              "id": "lights",
              "label": "Luces de la celebración",
              "kind": "lens"
            },
            {
              "id": "invitations",
              "label": "Invitaciones de los amigos",
              "kind": "envelope"
            }
          ],
          "targets": [
            {
              "id": "post",
              "label": "Correos"
            },
            {
              "id": "market",
              "label": "Mercado"
            },
            {
              "id": "lab",
              "label": "Laboratorio"
            }
          ],
          "answer": {
            "bread": "market",
            "lights": "lab",
            "invitations": "post"
          }
        },
        {
          "type": "choice",
          "question": "¿Cuál era el gran secreto?",
          "clue": "La invitación explica para qué se reunieron todas las pruebas.",
          "evidence": "El cuaderno recuerda la ruta: 1 castillo (corona), 2 selva (hoja), 3 laboratorio (engranaje), 4 ciudad (sobre), 5 mansión (reloj). La lista de preparativos asigna pan al mercado, luces al laboratorio e invitaciones a correos. La invitación final dice: «No faltaba un tesoro: estábamos preparando la Fiesta de la Amistad para todos». ",
          "feedback": "Mira otra vez las pruebas: puedes volver a intentarlo sin repetir la búsqueda.",
          "explanation": "No desaparecieron objetos por arte de magia: todos preparaban la Fiesta de la Amistad. BruCat puede celebrar con sus amigos.",
          "options": [
            {
              "id": "race",
              "label": "Preparar una carrera en solitario",
              "kind": "compass"
            },
            {
              "id": "friendship",
              "label": "Preparar la Fiesta de la Amistad",
              "kind": "medal"
            },
            {
              "id": "hide",
              "label": "Esconder todos los libros",
              "kind": "book"
            }
          ],
          "answer": "friendship"
        }
      ]
    }
  }
]

/** The three cases in each chapter unlock in narrative order. */
export const CHAPTERS = [
  {
    "id": 0,
    "name": "El castillo misterioso",
    "description": "La corona revela un libro y la llave del primer camino.",
    "clue": "La brújula del cofre apunta hacia la selva perdida.",
    "scene": "games/detective/scenes/chapter-1.jpg"
  },
  {
    "id": 1,
    "name": "La selva perdida",
    "description": "Un mapa, unas huellas y una cascada guardan la siguiente pista.",
    "clue": "Un engranaje antiguo nos lleva al laboratorio loco.",
    "scene": "games/detective/scenes/chapter-2.jpg"
  },
  {
    "id": 2,
    "name": "El laboratorio loco",
    "description": "Recetas, piezas y conexiones devuelven la luz al viaje.",
    "clue": "La máquina imprime una dirección de la ciudad de los animales.",
    "scene": "games/detective/scenes/chapter-3.jpg"
  },
  {
    "id": 3,
    "name": "La ciudad de los animales",
    "description": "Escuchar a los vecinos ayuda a preparar una sorpresa.",
    "clue": "El paquete de estrella tiene como destino la mansión.",
    "scene": "games/detective/scenes/chapter-4.jpg"
  },
  {
    "id": 4,
    "name": "La mansión encantada",
    "description": "Relojes y cuadros revelan el secreto de toda la aventura.",
    "clue": "La Fiesta de la Amistad reúne a todos los amigos de BruCat.",
    "scene": "games/detective/scenes/chapter-5.jpg"
  }
]

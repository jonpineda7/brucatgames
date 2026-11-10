# BruCat Math Adventure — juego 6

Integrado en Infantil en `#/infantil/math-adventure`. Reutiliza React, JavaScript, Vite, la navegación y el gorila oficial. No añade dependencias. React, SVG y CSS bastan para esta aventura de avance dirigido; no incorpora físicas de plataformas continuas.

## Contenido terminado

La Selva de los Números contiene diez desafíos completos. Cada acierto mueve a BruCat, entrega cinco monedas internas y abre la siguiente zona. Las operaciones se generan para la selección del jugador, independientemente de la zona.

| Zona | Desafío | Interacción |
|---|---|---|
| 1 | El puente interrumpido | Elegir plataforma y saltar |
| 2 | La puerta de las raíces | Introducir el código |
| 3 | Provisiones para el camino | Arrastrar una cantidad o seleccionarla y colocarla |
| 4 | El ascensor de bambú | Construir el número con incrementos |
| 5 | El claro de las luciérnagas | Repartir cantidades o formar grupos |
| 6 | Los tres senderos | Elegir camino |
| 7 | El santuario escondido | Descifrar el código |
| 8 | El tesoro de la selva | Colocar cantidades en la mochila |
| 9 | El gran salto | Elegir plataforma |
| 10 | El portal de los números | Activar el portal y celebrar |

Aprender y Aventura comparten el motor. Se pueden practicar sumas, restas, multiplicaciones, divisiones o una selección mixta configurable. Novato, Audaz y Guerrero están disponibles para todas las operaciones. Guerrero introduce ejercicios de dos pasos de la misma operación seleccionada.

Las ayudas muestran agrupaciones, objetos retirados, arreglos rectangulares, reparto equitativo y descomposición de cantidades. Las representaciones grandes son compactas. La primera ayuda orienta; la segunda explica la solución. Los errores permiten reintentar sin perder monedas ni bloquear el avance. No hay tiempo límite ni vidas.

La adaptación permanece dentro de la dificultad elegida: tres aciertos consecutivos aumentan el nivel interno de exigencia y dos errores lo reducen. Nunca cambia automáticamente de Novato a otra dificultad.

## Recompensas y persistencia

Diez aciertos dan 50 monedas. La puntuación final es 1000 más 100 por estrella. Se obtienen tres estrellas con hasta un error y una ayuda; dos con hasta cinco de cada; una en los demás casos. Repetir no reduce el mejor registro.

`localStorage` guarda preferencias, estadísticas por operación y dificultad, mejores resultados y ruta activa con sus desafíos completados, pregunta exacta, ayudas y borrador. Si falla el almacenamiento se puede seguir jugando. No se recopilan datos personales.

El motor bloquea respuestas duplicadas y protege las transiciones mediante identificadores de partida. Los temporizadores se cancelan al desmontar. Los diálogos gestionan el foco, hay alternativas de teclado al arrastre y se respeta movimiento reducido. El audio es sintético, opcional y se activa desde un gesto del usuario.

## Archivos principales

- `math.js`: generador, rangos, distractores y explicaciones puras.
- `difficulty.js`: adaptación pedagógica.
- `engine.js`: fases, avance, recompensas y reinicio.
- `progress.js`: validación y persistencia.
- `LearningVisual.jsx` y `learningModel.js`: apoyos pedagógicos SVG.
- `WorldScene.jsx`: escenario, personaje y mecanismos.
- `QuantityBuilder.jsx` e `interaction.js`: construcción, reparto y arrastre.
- `MathAdventure.jsx`, `MathDialog.jsx` y hojas CSS: menús, HUD y resultados.
- `useMathAdventure.js`: integración, audio y transiciones.
- `src/App.jsx` y `src/categories/CategoryView.*`: ruta y tarjeta del catálogo.
- `public/games/math-adventure/`: fondo original, miniatura y procedencia de recursos.

## Verificación

La suite del repositorio incluye pruebas del generador con 7200 ejercicios, rangos, aritmética, distractores únicos, divisiones exactas, dos pasos, ayudas y representaciones. También cubre los 30 perfiles de modo/dificultad/operación a través de las diez zonas, modo mixto restringido, errores, doble envío, progresión, recompensas, reinicio, pausa, persistencia, fallos de almacenamiento y semántica del arrastre.

Verificación manual realizada en Safari: expedición completa de diez zonas con divisiones Novato y modo Aprender; error y reintento, recarga y recuperación de la misma pregunta, arrastre real, colocación por clic, engranajes, reparto equitativo, pausa y victoria con 50 monedas. En Chrome se comprobó la vista emulada a 375 × 812 y la progresión mixta suma/resta en Guerrero. Se corrigió el desborde móvil detectado.

## Contenido previsto y límites

Cavernas, Castillo y Galaxia están identificados como próximos mundos; no se presentan como jugables ni se desbloquea contenido vacío. Sus escenarios y desafíos son la siguiente ampliación.

BruCat reutiliza ilustraciones oficiales con transiciones de salto, avance, reacción y celebración. Quedan para una ampliación las animaciones dibujadas de caminar y otras poses específicas. No se ha realizado una auditoría formal con lector de pantalla, audición de efectos ni prueba en dispositivos físicos móviles. No se ha publicado esta modificación.

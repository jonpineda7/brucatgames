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

BruCat utiliza ahora la hoja animada de explorador aportada por el usuario: espera/parpadeo, celebración y ayuda con cuaderno. Se prepararon sus doce celdas para limpiar halos y estabilizar el anclaje. Quedan para una ampliación animaciones específicas de caminar. No se ha realizado una auditoría formal con lector de pantalla, audición de efectos ni prueba en dispositivos físicos móviles. No se ha publicado esta modificación.

## Integración del explorador animado

`BruCatCharacter.jsx/.css` recorta discretamente una celda de la hoja 4×3 en un espacio cuadrado reservado. `characterAnimation.js` separa secuencias, reloj y prioridad de la lógica educativa. Las pruebas están en `characterAnimation.test.js`. `WorldScene.jsx` conecta aciertos, ayudas y errores; una clave por partida/zona descarta la animación anterior. Los intervalos y la carga de imagen se limpian al desmontar. La pausa congela el reloj; movimiento reducido usa la pose neutral. Si falla la precarga se utiliza la ilustración estática. No se modificó la mascota de la plataforma ni el catálogo.

Verificado manualmente en Safari: ayuda real, respuesta correcta, pausa/reanudación y cambio de zona. La vista temporal de revisión reprodujo las secuencias a 160 y 100 px, simuló movimiento reducido y una URL de sprite inexistente para comprobar la imagen de respaldo. Se revisó el juego dentro de un viewport de 375×812 sin superposición sobre operaciones ni controles. La vista temporal fue retirada del proyecto.

Los doce dibujos se inspeccionaron; no hay celdas vecinas visibles ni recortes de cabeza/pies en el recurso preparado. Se conservan pequeñas variaciones propias del dibujo generado y la flexión/salto intencionales de celebración. Falta prueba en teléfono físico.

## Ajuste UI/UX: inicio y partida compactos

El menú presenta un resumen de la configuración guardada, inicio rápido «Jugar ahora» y personalización desplegable con grupos de selección semánticos. Cuando hay una ruta guardada se prioriza «Continuar aventura», con su propia operación, modo, dificultad y zona. La opción de nueva aventura muestra por separado la configuración que usará. Los ejemplos de dificultad se generan con el motor real, también en modo mixto. La selva se identifica como disponible; los otros tres mundos se agrupan en «Próximas aventuras» sin controles jugables.

La acción atómica `play` combina inicio y apertura del primer reto; no concede puntos ni altera las reglas. Las zonas siguientes conservan el avance mediante el recorrido. Se redujeron encabezado, HUD y alturas de escena; el problema y «Ver pista» quedan juntos. Reiniciar se encuentra en pausa con confirmación. La ayuda mantiene su representación educativa junto a la interacción. El personaje, el fondo de selva y la paleta se conservan.

Se corrigieron tamaños intrínsecos con `min-width:0`, anchos del contenedor y `box-sizing:border-box`, sin introducir `overflow-x:hidden`. El mapa desplegable usa una cuadrícula de cinco columnas para no desbordarse en escenas estrechas. Los controles nuevos alcanzan 44×44 px; el foco se gestiona al entrar, personalizar, mostrar ayuda, responder incorrectamente, reintentar y cerrar pausa. Escape devuelve el foco a su botón.

### Verificación ejecutada

- Chrome: inicio desde personalización directo al primer reto, configuración mixta guardada en Guerrero, respuesta incorrecta y reintento, pista, acierto, apertura de puerta con entrada numérica, avance hasta un problema real de dos pasos, salida, continuación guardada, pausa/reanudación y reinicio confirmado.
- Vista local temporal con iframes de 360, 375 y 390×812, 812×375 y escritorio 1200×812: medición del ancho de documento y controles, sin desbordamiento horizontal; ningún botón, enlace del juego o desplegable visible menor de 44×44 en las pantallas medidas. Se comprobó mapa abierto en móvil y horizontal, y ayudas de varias cifras. Chrome reserva 15 px de barra vertical en estos iframes: el ancho útil fue respectivamente 345/360/375/797/1185 px; `scrollWidth` no excedió ese ancho.
- Se revisaron visualmente menú, personalización, escena, controles y ayudas mediante capturas de la herramienta.
- Contraste calculado para seis pares de colores nuevos de texto/fondo: entre 12,35:1 y 14,58:1, por encima de AA. Esto no equivale a una auditoría WCAG completa de toda la plataforma.
- La suite incluye pruebas del inicio directo, ejemplos, persistencia exacta, reinicio y pausa sobre errores.

La vista temporal de medición se retira antes de entregar. No se añadieron dependencias y no se desplegó. Pendientes: prueba en dispositivos físicos y auditoría formal con lector de pantalla.

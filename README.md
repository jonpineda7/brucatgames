# brucatgames
juegos de entretencion


Aplicación de minijuegos con React y Vite.

## Desarrollo

```sh
npm ci
npm run dev
```

## Verificación

```sh
npm run lint
npm run build
npm run preview
```

## Publicación

Configurar Settings → Pages → Source: GitHub Actions. Cada push a main compila y publica dist automáticamente. No se necesita una rama gh-pages ni npm run deploy.

URL: https://jonpineda7.github.io/brucatgames/

BruCatGames es una plataforma para todo público. La primera categoría es Infantil, con Memoria Gorila: doce cartas, seis parejas, sin reloj ni vidas, sonido opcional y reinicio.

Rutas compatibles con GitHub Pages:
- Inicio: `/brucatgames/`
- Infantil: `/brucatgames/#/infantil`
- Memoria: `/brucatgames/#/infantil/memoria`

`npm test` verifica el tablero, los bloqueos de selección, las parejas y el reinicio.


## Gorila Loco

Ruta: `/brucatgames/#/infantil/gorila-loco`. Arcade de 60 segundos con 9 agujeros. Fácil: 1 personaje, visible 1800 ms. Normal: hasta 2, 1200 ms. Difícil: hasta 3, 800 ms. La dificultad permanece fija en cada ronda.

Animal +10, banana dorada +30 y trampa −10 (mínimo cero). El tercer acierto seguido activa ×2 y el sexto ×3; el multiplicador aplica al acierto que lo activa. Tocar vacío, una trampa o dejar escapar un animal rompe la racha. Los errores incluyen toques fallidos y animales que escaparon; evitar una trampa no penaliza.

Pausa manual, tecla Esc y pausa automática al ocultar la pestaña. El récord se guarda por dificultad en localStorage; si está bloqueado, el juego continúa y avisa al terminar. Estrellas: una por participar, dos desde 150 puntos y tres desde 450.

Los SVG del mono, banana, trampas y fondo de selva son recursos vectoriales propios. Gato, llama, tortuga y gorilas reutilizan las ilustraciones aportadas al proyecto. Sustituciones de personajes: `src/games/gorila-loco/engine.js`.

Pruebas: `npm test` incluye lógica de Memoria Gorila, puntuación, combos, límites de aparición, partidas completas, pausa, reinicio, cierre del reloj y almacenamiento de Gorila Loco.


### Conecta los Colores

Ruta: `#/infantil/conecta-colores`. Tercer juego de Infantil, sin nuevas dependencias.

- 30 niveles fijos en `src/games/conecta-colores/levels.js`: 1–10 fáciles (3×3/4×4), 11–20 normales (5×5), 21–30 difíciles (6×6/7×7). Desde el nivel 25 hay que cubrir todas las casillas.
- Cada nivel incluye rutas de solución explícitas. Las pruebas validan extremos, adyacencia, ausencia de cruces y victoria, y reproducen las 30 soluciones con el reducer real. Para añadir niveles, seguir ese contrato y ampliar el máximo de colección/persistencia.
- Arrastre con Pointer Events y captura de puntero; se interpolan saltos rectos validando cada casilla. Soltar fuera o cancelar termina el gesto. No se permiten diagonales, cruces ni atravesar otra pareja.
- Teclado: flechas para seleccionar; Enter/espacio en un punto inicia el camino; flechas para dibujar; Esc termina el gesto. Colores acompañados de símbolos y nombres. Las pistas incluyen una descripción del recorrido para tecnologías de asistencia.
- Deshacer restaura un gesto completo; pulsar un color borra su camino. Reiniciar limpia el tablero y suma un reinicio. Volver a niveles comienza una partida nueva al seleccionar otro nivel.
- Las pistas se basan en la solución del nivel. Si hay conflicto, piden confirmar qué caminos se borrarán antes de mostrar la ruta. Se puede deshacer ese cambio, pero la ayuda usada sigue contando.
- Estrellas: 3 sin pistas y con hasta 1 reinicio; 2 con hasta 2 pistas y 3 reinicios; 1 con más ayuda. No hay penalización por tiempo. El mejor resultado prioriza estrellas y luego menos pistas, reinicios e intentos de camino.
- Progreso, mejor resultado por nivel y sonido en `brucatgames:conecta-colores:v1`. El desbloqueo es secuencial; si falla localStorage, se avisa y se sigue jugando en memoria.
- Reutiliza los gorilas y efectos Web Audio existentes. Ilustraciones del tablero en SVG, sin descargas ni nuevas licencias. Respeta movimiento reducido.

Verificación de esta entrega: `npm test`, `npm run lint`, `npm run build`; pruebas manuales del primer nivel por teclado, segundo nivel por arrastre en emulación táctil de Chrome (375×812), victoria, estrellas, desbloqueo y persistencia tras recarga. Revisión visual de pistas y consola de desarrollo sin errores observados. Pendiente: interacción en teléfonos/tablets físicos, Safari/iOS y comprobación con lector de pantalla real; la emulación no sustituye esas pruebas.


### La Última Mordida · Reparto y resolución conjunta

Ruta conservada: `#/infantil/ultima-mordida`. Se mantienen el diseño, los personajes y sus PNG normales/mareados, las recetas, los 20 niveles y la carga bajo demanda. Sin nuevas dependencias. Bruno utiliza las dos ilustraciones oficiales del caballero rana: festín y mareo.

- La partida comienza con BruCat, Gata, Axo y Bruno como inocentes y cuatro oportunidades; Cocodrilo es siempre el villano. Los eliminados permanecen visibles con su imagen mareada y «Fuera de la partida», sin poder recibir comida.
- Cada ronda ofrece exactamente tantos platos distintos como participantes activos, siempre con uno envenenado. El menú se selecciona sin reemplazo y el veneno se sortea una sola vez entre esos platos. Todos los valores aleatorios se inyectan desde el hook; el reducer es determinista.
- Repartir no evalúa el veneno ni modifica vidas, resultados o estadísticas. Selección + participante, teclado o arrastre asignan el plato. «Retirar plato» lo libera; elegir un plato ya asignado y otro participante intercambia sus platos si ambos tenían uno, o mueve el plato si el destino estaba vacío.
- «¡A comer!» muestra el progreso y solo se habilita con un reparto completo y único. Confirma una copia inmutable de todas las asignaciones, calcula todos los resultados y actualiza estadísticas y récord una sola vez. El reparto se bloquea; todos comen a la vez y después se presentan los resultados. Las animaciones no calculan consecuencias.
- Un inocente envenenado pierde exactamente una oportunidad y queda eliminado durante toda la partida. Los demás siguen activos. El resumen ofrece «Siguiente ronda»: conserva las eliminaciones, vacía el reparto y genera platos y pistas nuevos. Si Gata sale en la primera ronda, la segunda reúne a cuatro participantes y cuatro platos.
- El Cocodrilo envenenado produce victoria. Perder al cuarto inocente produce GAME OVER. No hay transformaciones en ranas. Reiniciar restaura los cinco participantes, cuatro oportunidades, ronda 1 y contadores de la partida.
- Fácil identifica una única receta en todos los subconjuntos posibles. Las otras dificultades mantienen pistas verdaderas con incertidumbre: Normal suele dejar dos candidatas; Difícil/Experto más cuando el menú lo permite. Con solo dos platos se da una pista verdadera compatible con ambos, sin inventar una distinción. La lupa opcional se conserva; las asignaciones nunca revelan el veneno por sí mismas. Su uso se contabiliza al resolver la ronda.
- Fases: READY, SELECTING (reparto), EATING, REVEALING, ROUND_END, VICTORY y GAME_OVER. Los callbacks validan identidad y token de ronda. El hook cancela temporizadores al reiniciar, cambiar de nivel o salir; incluso un callback antiguo que llegara a ejecutarse no puede modificar la nueva partida. Movimiento reducido desactiva el balanceo y acorta las transiciones; los resultados completos siguen disponibles.
- Se conservan estrellas, fórmula de puntuación y progreso `brucatgames:ultima-mordida:v2`: 3 estrellas con cuatro inocentes, 2 con tres y 1 con uno o dos. Derrota: 0 nuevas estrellas. Puntos de victoria: `500 + sobrevivientes*250 + max(0,100-(rondas-1)*25)`. Los mejores récords no se degradan. Si localStorage falla, se continúa en memoria con aviso.
- Recursos y procedencia: `public/games/ultima-mordida/characters/README.md`.

Verificación: 67 pruebas automáticas totales, con regresiones de los otros tres juegos; reparto editable, intercambios sin duplicados, bloqueo de eliminados, reparto incompleto, doble pulsación, resolución conjunta, estadísticas únicas, rondas con 2–5 platos, victoria, GAME OVER, reinicio, callbacks antiguos, progresión y recursos PNG. Se comprueban todos los subconjuntos de recetas de 2–5 platos para los veinte niveles y cada posible plato envenenado. `npm run lint` y `npm run build` correctos.

Revisión manual en Chrome: intercambio y retirada sin perder oportunidades; reparto completo; todos comiendo; resumen de cinco resultados; Gata eliminada; segunda ronda con cuatro platos; arrastre táctil y selección/asignación con Tab, espacio y Enter en emulación móvil 375 × 812; victoria con tres sobrevivientes, dos estrellas y siete platos seguros contabilizados. Consola sin errores observados. Pendientes: dispositivos físicos, Safari/iOS, lector de pantalla real y audición de efectos. La emulación no reemplaza esas pruebas.


### Detective BruCat V3 · aventura completa

Ruta `#/infantil/detective`. Quince casos jugables en cinco capítulos, cuatro distribuciones por caso, 105 objetos de prueba y acertijos variados: secuencias, asociaciones, montaje, patrones y deducción. Conserva los récords de V2 y restaura etapas y borradores. El caso 15 cierra la historia con celebración y resumen de capítulos.

Informe de contenido, arquitectura, recursos, pruebas y limitaciones: [DETECTIVE-V3.md](DETECTIVE-V3.md). Los quince casos se completaron también mediante sus controles reales en Safari. No hay casos marcados como pendientes en Detective.

## BruCat Math Adventure

Sexto juego de Infantil: una selva con diez desafíos, cuatro operaciones, tres dificultades y modos Aprender y Aventura. Incluye ayudas visuales, avance, recompensas y guardado local. Consulta [contenido, arquitectura y verificación](MATH-ADVENTURE.md).

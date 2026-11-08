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


### La Última Mordida

Ruta: `#/infantil/ultima-mordida`. Cuarto juego de Infantil (6–10 años), cargado bajo demanda mediante React.lazy. Sin nuevas dependencias.

- 20 casos fijos: Aprendiz (1–5, 3 invitados), Investigador (6–10, 5 invitados), Detective (11–15, plato y travieso desconocidos) y Maestro del Banquete (16–20, recetas alternativas y Cambia-Platos). Las etapas se desbloquean consecutivamente.
- `data.js` define las propiedades explícitas de recetas y personajes. `clues.js` evalúa reglas estructuradas y comprueba una única receta encantada y un único travieso. La identidad secreta es única; los demás platos pueden repartirse libremente entre los inocentes. Las pistas avanzadas no identifican la respuesta por sí solas.
- Selección de plato + invitado accesible por teclado/táctil, y arrastre mediante Pointer Events con captura/liberación y cancelación. Asignar un plato que ya está servido mueve o intercambia las asignaciones de forma atómica. Intercambiar y deshacer son gratis.
- Servir requiere todos los platos repartidos y una confirmación cancelable. En Maestro, el primer intento de servir muestra el intercambio de dos invitados, con su nuevo plato, y vuelve al reparto para permitir corregirlo; nunca se cambia nada después de la confirmación final.
- Lupa: una propiedad verdadera adicional. Escudo: se aplica a un invitado; protege a un inocente de la transformación, pero un reparto incorrecto sigue sin ganar estrellas (si se elige al travieso, no revela su identidad ni lo protege). Intercambio mágico: con la mesa completa, corrige el reparto del plato encantado; cualquier intercambio visible posterior todavía debe revisarse. Cada poder está disponible una vez por partida desde el nivel 11.
- Reiniciar despeja la mesa sin devolver poderes usados, borrar ayudas ni repetir el giro ya anunciado. Repetir desde el resultado comienza una partida nueva. Estrellas por victoria: 3 sin ayudas, 2 con una, 1 con dos o más; derrota: 0 nuevas estrellas. Puntuación: máximo de 100 y `1000 + etapa*100 - ayudas*150 - reinicios*25`; derrota: 0. Los mejores resultados priorizan estrellas y después puntuación.
- Persistencia independiente en `brucatgames:ultima-mordida:v1`: niveles, estrellas, puntuación y sonido. Si falla, continúa en memoria y muestra un aviso. El temporizador de revelación se cancela al salir y respeta movimiento reducido.
- `BanquetArt.jsx` contiene ilustraciones vectoriales originales provisionales de cinco invitados, cinco platos y castillo, preparadas para sustituirse por futuras ilustraciones aprobadas. El gorila y los efectos sintetizados se reutilizan de los juegos anteriores; no se descargaron imágenes de terceros.

Verificación ejecutada: 56 pruebas totales (17 nuevas), incluidos todos los repartos posibles de los 20 casos, unicidad/veracidad de pistas, asignaciones rápidas, poderes, intercambios, resultado, progresión, persistencia y limpieza del temporizador. `npm run lint` y `npm run build` correctos. Navegador: receta, selección + invitado, confirmación y cancelación, victoria con burbuja, derrota con rana temporal, conservación del mejor resultado y arrastre táctil emulado a 375×812. Pendiente: teléfonos/tablets físicos, Safari/iOS, lector de pantalla real, audición de efectos y revisión manual completa de las etapas avanzadas (cubiertas por pruebas del motor).

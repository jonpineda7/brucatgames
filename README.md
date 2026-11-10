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


### Detective BruCat V2 · El Misterio de los Objetos Perdidos

Quinto juego de Infantil, ruta `#/infantil/detective`. Se conserva React + JavaScript/Vite, la carga bajo demanda y la estética ilustrada de la plataforma. Sin dependencias nuevas; configuraciones documentadas con JSDoc y lógica pura separada de React.

**Diagnóstico:** el escenario ya era un fondo limpio y los cinco objetivos eran SVG independientes; no había que borrar objetos incrustados. Las posiciones provenían de una única lista fija. El motor anterior sí intentaba abrir el acertijo al completar el contador, pero faltaban una fase explícita de descubrimiento, validación del conjunto de IDs y una única gestión de diálogos. El bloqueo original no se reprodujo antes del ajuste; se corrigieron estas debilidades y se verificó el flujo completo nuevo.

**Contenido real:** caso 1, «La corona desaparecida», terminado. Los casos 2–15 siguen «En preparación», sin accesos a pantallas simuladas. El motor busca el siguiente caso implementado y comprueba su desbloqueo; con el catálogo actual no existe uno, por lo que el botón final lo indica y ofrece repetir o volver al selector.

- `scenes.js` define fondo, capas, diez zonas de muebles y cuatro distribuciones completas. `placements.js` valida IDs únicos, límites del escenario y de cada zona, geometría seleccionable y ausencia de solapamientos. Nueva partida/reinicio excluyen la distribución anterior; las posiciones no cambian al usar pistas, zoom, pausa o redimensionar.
- El dibujo y la detección consumen los mismos objetos de la distribución activa y las mismas regiones normalizadas de `objects.js`/`geometry.js`. Los objetos visibles también cambian de lugar, sin copias fijas en el fondo. `ObjectVisual` admite futuros PNG/WebP transparentes; deben compartir el encuadre y la máscara de interacción aprobados. No hacen falta nuevos recursos para estas cuatro variantes.
- Flujo controlado: INTRO → SEARCHING → ALL_OBJECTS_FOUND → SOLVING → CASE_SOLVED → RESULT → NEXT_CASE, además de CASE_FAILED recuperable y PAUSED. Encontrar los cinco IDs reales bloquea la búsqueda y muestra descubrimiento; el acertijo aparece automáticamente. Temporizadores con cancelación y tokens de sesión/transición impiden callbacks antiguos o premios duplicados. Ayuda y confirmación de reinicio tienen un único propietario de diálogo.
- El acertijo pregunta dónde apareció la corona **en esta partida**. Tiene tres lugares diferentes, una sola respuesta correcta y una prueba consultable. Fallar explica el lugar anotado y permite reintentar sin repetir la búsqueda. La victoria muestra BruCat celebrando, estrellas animadas, pruebas, ayudas, puntuación, explicación y navegación completa.
- Las tres ayudas consultan objetos pendientes de la distribución activa: círculo luminoso, descripción de ubicación y lupa mágica de cinco segundos. La lupa restaura la cámara anterior. Espera de seis segundos entre ayudas; ilimitadas en Fácil. Pausa manual/Esc y automática al ocultar la pestaña; los relojes de ayuda se congelan al pausar.
- Pointer Events y captura distinguen toque de arrastre; desplazar no recoge objetos. Zoom 1–3×, controles alternativos de desplazamiento, Tab/Enter/espacio y lista de enfoque. Se conservan el diseño responsive, el foco visible y `prefers-reduced-motion`; movimiento reducido acorta las transiciones y elimina animaciones decorativas.
- Puntuación conservada: 3 estrellas sin ayudas, 2 con una o dos, 1 con tres o más. Puntos: `objetos*100 + estrellas*100`. Los errores no bloquean el caso; los récords mejores nunca se degradan.
- Compatibilidad con `brucatgames:detective:v1`: mantiene estrellas, mejores resultados y sonido; añade la última distribución. La investigación activa usa `brucatgames:detective:session:v2`: recupera la distribución exacta, objetos encontrados, ayudas, errores, cámara y fase. Las ayudas visuales temporales no se restauran, pero su uso sigue contado. Si un guardado de búsqueda ya contiene todas las pruebas, continúa por descubrimiento. Datos inválidos o almacenamiento bloqueado permiten seguir en memoria con aviso.
- Depuración solo local: `?detectiveDebug=1#/infantil/detective` dibuja regiones con `import.meta.env.DEV`. No se muestran en producción. Efectos sintetizados reutilizados del proyecto; no se añade audio externo.

Archivos principales: `src/games/detective/engine.js`, `scenes.js`, `placements.js`, `puzzle.js`, `session.js`, `transitions.js`, `useDetective.js`, `CaseFlow.jsx`, `DetectiveScene.jsx`, `DetectiveBruCat.jsx/.css`, sus pruebas y `public/games/detective/README.md`.

Verificación V2: `npm test` incluye 105 pruebas totales y regresiones de los otros cuatro juegos; comprueba cuatro distribuciones, no repetición, límites/superposición, sincronización de coordenadas a 320/375/768/1100 px y zoom 1/1.5/2/3×, pistas, último objeto, flujo, respuesta incorrecta/correcta, puntuación única, callbacks cancelados, persistencia y restauración. El salto a un sucesor implementado se verifica con una configuración de prueba temporal, sin publicarla como contenido real. `npm run lint` y `npm run build` completan la verificación.

Revisión manual V2 en Safari: recogida por teclado; recarga y recuperación de un objeto encontrado con la misma distribución; último objeto → descubrimiento → acertijo automático; respuesta incorrecta y reintento; victoria → resultado automático (3 estrellas, 800 puntos); siguiente caso pendiente; repetir cambia visualmente las ubicaciones y conserva el récord. Ventana estrecha: lista compacta, escena y controles; clic real sobre el objeto, zoom 1.5×, arrastre sin recogida y pista de ubicación coherente. Las pruebas de coordenadas no sustituyen interacción táctil en un teléfono físico ni lector de pantalla real; esa verificación y la audición de efectos siguen pendientes.

Pendientes de contenido: ilustración específica de BruCat detective y escenas/objetos/acertijos de los otros catorce casos. Se reutiliza el gorila oficial. Próximo contenido recomendado: implementar «El libro secreto» con este mismo contrato de escenas y validar sus distribuciones antes de marcarlo `ready`.

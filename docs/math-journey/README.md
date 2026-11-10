# Recorrido y combate final · verificación

## Cambios

Se mantienen diez zonas y sus jefes. Cada zona tiene entrada, tres obstáculos distintos, apoyos y destinos configurados, llegada a arena, presentación omisible, combate y victoria con salida manual. `journey.js` concentra la configuración; `JourneyScene` presenta el recorrido y `WorldScene` conserva la arena. El generador educativo y las ilustraciones existentes se reutilizan.

El escenario se repara antes del desplazamiento: puente completado, puerta abierta, engranaje activado, luces encendidas o mochila preparada. BruCat salta con su pose existente o viaja sobre un elevador, y la cámara revela paneles conectados. No se presenta una imagen deslizándose como un ciclo de caminar. Los puntos son porcentajes del viewport, de modo que el apoyo de pies y la trayectoria se mantienen al cambiar el ancho.

La interfaz diferencia «Recorrido: n/3» de «Desafío final», muestra el objetivo junto a la operación, usa acciones específicas y reserva «Lanzar respuesta» para el combate. El HUD global dice «Zonas», separado de monedas y estrellas. El mapa expone las cuatro situaciones mediante texto y símbolos.

El guardado usa esquema 3 bajo la clave existente. Guarda solo checkpoints y preguntas válidas. En animaciones interrumpidas se guarda el destino ya ganado con el acierto; no posiciones intermedias. Se conserva el tiempo restante al pausar. La migración de combates anteriores considera transitados sus tres obstáculos para preservar el daño y la pregunta pendientes, sin conceder premios adicionales. Las zonas completadas y los récords no se borran. Detalle: [MATH-ADVENTURE.md](../../MATH-ADVENTURE.md).

## Pruebas ejecutadas

- Suite completa: **175/175**; Math Adventure: **46**.
- Diez configuraciones válidas: tres mecánicas distintas, cuatro apoyos, avance monotónico y jefe/recompensa asignados.
- Recorridos completos mediante reducer para **30 combinaciones** de modo, dificultad y operación: diez zonas, tres obstáculos por zona y 3–5 aciertos de jefe.
- Ningún daño en recorrido, un segmento por acierto en combate, bloqueo de duplicados, una recompensa por zona y avance manual único.
- Errores y ayudas conservan pregunta, apoyo, energía y monedas; las pistas no reducen premios.
- Pausa/reanudación en reparación, movimiento, llegada a arena, efecto e impacto; callbacks antiguos, salida y reinicio.
- Guardado de pregunta exacta/borrador/ayuda, checkpoints durante reparaciones y combate; último golpe y victoria restaurados sin duplicados.
- Migración de partidas anteriores con zonas ya completadas, escudo parcial y pregunta pendiente en **las diez posiciones**. Rechazo de guardados incoherentes.
- `npm run lint`, `npm run build`, `npm run check:build` y `git diff --check`: correctos. Se conserva la base `/` del dominio personalizado.

## Recorrido visual realmente realizado

En **Safari**, una partida nueva de sumas/Novato se completó desde entrada de zona 1 hasta victoria:

1. Puente: `2 + 5`, selección de plataforma 7, reparación y cambio al segundo apoyo.
2. Ascensor: `1 + 4`, incremento de cantidad a 5, plataforma y llegada al tercer apoyo.
3. Puerta: `1 + 5`, cantidad 6, apertura y llegada a arena.
4. El jefe apareció entonces con **30/30**, sin haber perdido energía durante el recorrido.
5. Combate: `0 + 4`, `5 + 5` y `3 + 6`; escudo 30 → 20 → 10 → 0.
6. Entre los primeros dos golpes se recargó: «Continuar» conservó `5 + 5` y **20/30**.
7. Victoria amistosa, **1/10 zonas** y **cinco monedas**. «Siguiente zona» abrió zona 2 sin jefe y conservando esas cinco monedas. Se abrió el mapa con la primera zona lista, la segunda en recorrido y las demás pendientes.

En **Chrome**, una partida aislada en `localhost:5176` recorrió los tres obstáculos, incluido un ascensor visible en movimiento, pausa/reanudación y recarga en el tercer apoyo con la misma pregunta. El jefe apareció solo después; se comprobó error y apoyo sin quitar monedas ni regenerar energía. Esa revisión no se presenta como una victoria completa de Chrome: la zona completa se verificó en Safari.

Se capturaron e inspeccionaron los anchos **360, 375 y 390 px**, con el tercer obstáculo, personaje completo, apoyo correcto y operación/controles separados. No se observaron superposiciones ni desbordamiento horizontal en esas vistas. Las capturas de viewport no incluyen todo el panel inferior; los controles continúan mediante desplazamiento vertical normal.

## Capturas

- [Primer obstáculo](route-1.png), [segundo](route-2.png), [tercero](route-3.png).
- [360 px](mobile-360.png), [375 px](mobile-375.png), [390 px](mobile-390.png).
- [Aparición del jefe en móvil](arena-mobile.png).
- [Recorrido en Safari](safari-route.png), [detalle de victoria en Safari](victory.png), [avance a zona 2 con cinco monedas](next-zone.png).

## Limitaciones

No se completaron manualmente las otras nueve zonas; su contenido y avance sí se verificaron por lógica automatizada. No hay fotogramas de caminar ni se añadieron; se emplean salto y elevador. Movimiento reducido está implementado con cambios inmediatos y lógica independiente del CSS; su emulación visual en este recorrido nuevo queda pendiente, junto con teléfonos físicos, lector de pantalla y mediciones de FPS. No se publicaron cambios, no se hizo push y no se desplegó.

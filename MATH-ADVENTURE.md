# BruCat Math Adventure

Juego de Infantil en `/#/infantil/math-adventure`. Reutiliza React, JavaScript, SVG, CSS, el fondo ilustrado, el explorador albino y los diez jefes existentes. No añade dependencias ni un motor de físicas.

## Estructura vigente

Cada zona comienza con una entrada breve, seguida por **tres obstáculos matemáticos**, un desplazamiento hasta la arena, presentación omisible del jefe y combate final. La victoria se conserva hasta pulsar «Siguiente zona». El jefe y su energía no aparecen durante el recorrido; sus aciertos no descuentan energía ni conceden monedas.

| Zona | Recorrido: tres obstáculos | Jefe final |
|---|---|---|
| El puente interrumpido | Puente, ascensor, puerta | Rey Burbuja |
| La puerta de las raíces | Sendero, ascensor, puerta | Capitán Crujiente |
| Provisiones para el camino | Puente, mochila, luces/grupos | Remolino Dulzón |
| El ascensor de bambú | Sendero, ascensor, puente | Scroll Infinito |
| El claro de las luciérnagas | Puente, luces/grupos, puerta | Píxel Desvelado |
| Los tres senderos | Sendero, mochila, puerta | Don Sofanazo |
| El santuario escondido | Puente, luces/grupos, puerta | Pelusa Enredada |
| El tesoro de la selva | Sendero, mochila, ascensor | Torbellino Apurado |
| El gran salto | Puente, ascensor, sendero | Bocina Boom |
| El portal de los números | Sendero, luces/grupos, portal | Mochila Caótica |

Cada respuesta correcta repara un elemento y bloquea nuevas confirmaciones mientras BruCat avanza al siguiente apoyo. La cámara recorre tres paneles conectados del fondo existente; los ascensores cambian la altura de destino. La arena tiene otro encuadre y presenta al jefe por primera vez. El mapa distingue pendiente, recorrido en progreso, jefe pendiente y completada, además del progreso global de diez zonas.

## Aprendizaje y premios

Se mantienen Aprender y Aventura, las cuatro operaciones, mixto restringido, Novato/Audaz/Guerrero y los ejercicios de dos pasos. El contexto matemático conserva la operación, dificultad elegida y nivel de zona tanto en recorrido como en combate. La adaptación pedagógica previa sigue respondiendo al desempeño dentro del nivel elegido; no hay un incremento especial por entrar en la arena.

Plataformas y senderos utilizan selección; mochilas permiten selección/colocación y arrastre; puertas y mecanismos utilizan cantidades; los grupos emplean reparto o agrupación cuando corresponde. Las ayudas SVG se conservan. En combate las opciones anuncian «Lanzar respuesta». Los ejercicios de dos pasos no usan un reparto que represente solo su primera operación.

Los errores conservan pregunta y apoyo y permiten reintentar sin perder monedas, energía ni zonas. Las pistas no reducen daño ni premios. No hay reloj obligatorio ni vidas.

Cada jefe requiere 3, 4 o 5 aciertos, según `bosses.js`; cada segmento equivale a 10 puntos. Una zona completada entrega cinco monedas y su insignia previsible. Diez zonas suman 50 monedas; ahora hay 30 ejercicios de recorrido y 40 aciertos de jefe en una expedición sin errores. Se conserva la puntuación `1000 + estrellas × 100` y la regla ya vigente de estrellas por reintentos (hasta 1: tres; hasta 5: dos; después: una), sin penalizar pistas. Los récords previos no se recalculan ni degradan.

## Estado y guardado

El reducer distingue introducción (`EXPLORE`), obstáculo (`OBSTACLE`), reparación (`OBSTACLE_RESOLVING`), desplazamiento (`MOVING`/`ARENA_MOVING`), presentación (`BOSS_INTRO`), combate (`CHALLENGE`), efecto (`RESOLVING`), impacto (`IMPACT`), victoria con zona completada (`VICTORY`), pausa y resultado global. La sesión y el token de transición rechazan callbacks antiguos. La victoria registra una zona y su premio una sola vez.

Se conserva la clave `brucatgames:math-adventure:v1` y se versiona el contenido de la partida activa con **esquema 3**: zona, fase estable, índice/lista de obstáculos resueltos, pregunta pendiente, energía, zonas premiadas, ayudas y borrador. No se guardan coordenadas intermedias. Al aceptar un acierto se prepara la próxima pregunta; un cierre durante la reparación o el movimiento se recupera en el apoyo de destino, sin repetir el acierto. Un último golpe interrumpido se recupera como victoria sin duplicar recompensas.

Migración: las zonas ya completadas permanecen completadas. Una partida del antiguo sistema de jefes con pregunta o daño pendiente continúa en su arena, conservando energía y ejercicio; se considera su recorrido ya transitado, **sin añadir monedas ni zonas**. Una presentación antigua aún sin jugar comienza el nuevo recorrido. Un guardado anterior al sistema de jefes conserva su ejercicio como primer obstáculo pendiente. Se validan datos inconsistentes y se conservan preferencias, estadísticas y mejores resultados.

La pausa detiene animaciones y conserva el tiempo restante de los efectos/movimientos. Salir o reiniciar cancela temporizadores. Las transiciones lógicas no dependen de eventos CSS. Movimiento reducido utiliza pose neutral, posiciones finales inmediatas y temporizadores breves.

## Archivos

- `journey.js`: diez recorridos, obstáculos, apoyos, destinos, jefe, recompensa y salida.
- `JourneyScene.jsx/.css`: escenario conectado, cambios de obstáculos, cámara, saltos y elevador.
- `WorldScene.jsx`: presentación y arena, mapa, jefe, escudo, impacto y victoria.
- `engine.js`, `progress.js`, `useMathAdventure.js`: estado, persistencia/migración y reloj cancelable.
- `MathAdventure.jsx`, `MathAdventure.css`, `QuantityBuilder.jsx`: HUD contextual, respuestas y ayudas compactas.
- `BruCatCharacter.jsx`: conserva sus secuencias y añade selección explícita de la pose de salto existente.
- `math.js`, `difficulty.js`, `learningModel.js`, `LearningVisual.jsx`: generador y apoyos educativos reutilizados.

## Verificación y límites

`npm test`: **175 pruebas aprobadas**, incluidas 46 de Math Adventure. Se recorren las diez zonas con los 30 perfiles de modo/dificultad/operación, verificando tres obstáculos por zona y los jefes. Se prueban daño/premios únicos, errores, pistas, pausa, callbacks, posiciones configuradas, guardados estables e interrumpidos y migración en las diez posiciones anteriores. Build, lint y comprobación del artefacto de Pages correctos.

Se recorrió **una zona completa en Safari**, desde entrada y tres obstáculos hasta los tres aciertos del jefe, victoria y avance explícito a zona 2. La recarga durante combate conservó la pregunta y el escudo. Chrome permitió revisar los tres obstáculos, pausa/reanudación, guardado del tercer obstáculo, aparición del jefe y error sin penalización. Las capturas de 360, 375 y 390 px se inspeccionaron sin superposiciones ni desbordamientos visibles. No se afirma haber completado manualmente las diez zonas de esta versión.

Informe y capturas: [docs/math-journey/README.md](docs/math-journey/README.md).

No hay ciclo de caminar en el recurso aportado: los cruces usan la pose de salto existente con una trayectoria breve y las subidas emplean una plataforma que transporta al personaje. No se inventaron fotogramas. Quedan como verificaciones adicionales teléfonos físicos, lector de pantalla y emulación visual de movimiento reducido en este nuevo recorrido; la lógica y las reglas de movimiento reducido están cubiertas sin depender de animaciones. Los demás mundos siguen anunciados como futuros. No se ha publicado ni desplegado esta modificación.

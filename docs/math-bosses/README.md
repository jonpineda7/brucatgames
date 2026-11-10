# BruCat Math Adventure · jefes matemáticos

Implementación local, sin despliegue ni dependencias nuevas. Se mantiene React y el reducer existentes.

## Cambios principales

- `src/games/math-adventure/bosses.js`: configuración documentada con tipo JSDoc `Boss`; diez identidades, tres recursos por personaje, frases, colores, efectos y energía. Cada segmento equivale a 10 puntos; se necesitan 3, 4 o 5 aciertos según zona.
- `engine.js`: presentación (`EXPLORE`), respuesta (`CHALLENGE`), resolución (`RESOLVING`), impacto (`IMPACT`), victoria (`VICTORY`) y pausa. Los eventos de temporizador incluyen sesión y transición para rechazar callbacks antiguos. La confirmación se bloquea inmediatamente al acertar. Solo la victoria añade la zona a `completed`; las monedas siguen siendo cinco por zona.
- `progress.js`: conserva la clave de almacenamiento anterior, récords y preferencias. Las partidas antiguas conservan las zonas completadas y comienzan el escudo pendiente con energía completa. Las nuevas partidas guardan la versión 2, identidad, energía y pregunta. Un guardado interrumpido después del daño se recupera sin volver a aplicarlo; un golpe final interrumpido se convierte en victoria. El resultado final se registra también al continuar una victoria guardada.
- `useMathAdventure.js`: efectos cancelables al salir, pausar o cambiar de transición; 450 ms para el efecto matemático y 300 ms para el impacto; cambios breves de pose con movimiento reducido.
- `WorldScene.jsx`: personajes sobre islas independientes, barra accesible con segmentos, restauración de elementos de zona, precarga del jefe actual y pose inicial del siguiente; las poses usan imágenes estáticas y movimiento CSS. Si falla impacto o victoria, se usa la pose de espera.
- `MathAdventure.jsx`, `QuantityBuilder.jsx`, `MathAdventure.css`: transición centrada sin columna vacía, operación y respuesta juntas, ayuda desplegable, cero inicial visible, foco tras cambiar de ejercicio y victoria, y controles separados de personajes.

## Recompensas y compatibilidad

Los aciertos internos del jefe no añaden estrellas de zona ni monedas. Se mantienen diez zonas, cincuenta monedas y la fórmula de puntos `1000 + estrellas × 100`.

Cambio explícito de regla: en nuevas expediciones las pistas dejan de reducir estrellas. Se conservan los umbrales por reintentos (0–1: tres estrellas; 2–5: dos; más: una) y los récords previos no se recalculan. La interfaz explica la regla. No se exige rapidez ni una racha perfecta.

## Preparación de recursos

`python3 scripts/prepare-math-bosses.py`

El script usa la biblioteca estándar de Python y el decodificador PNG que ya emplea el proyecto. Busca siluetas conectadas en toda la hoja, antes de asignarlas a sus columnas y filas: algunas manos y adornos cruzan los límites nominales. Conserva accesorios próximos y descarta residuos ajenos. No inventa poses ni estira los dibujos.

Los originales de ambas hojas están en `public/games/math-adventure/bosses/`. Las treinta poses tienen lienzos RGBA de 352 × 352, escala original y apoyo común en y=336; `frames.json` conserva recortes y desplazamientos. Se revisó visualmente una hoja de contacto de las treinta poses. El explorador original coincide con el recurso ya presente; se mantiene el atlas de BruCat previamente normalizado por el proyecto.

## Validación ejecutada

- `npm test`: **166 pruebas aprobadas**, ninguna fallida. Incluye 37 pruebas de Math Adventure.
- Recorrido completo mediante reducer para las 30 combinaciones de modo, operación y dificultad, incluidos diez jefes y resultado final.
- Daño único, límites, callbacks obsoletos, victoria y registro únicos, errores/pistas sin penalización de energía o premios, pausa en ambas fases animadas, salida, migración y múltiples recargas de guardados estables/interrumpidos.
- `npm run build`: correcto. `npm run lint`: sin advertencias. `git diff --check`: correcto.
- Chrome de escritorio y anchos emulados de **360, 375 y 390 px**: personajes completos, islas, respuestas y tarjetas separados, sin desbordamiento visible en las vistas revisadas.
- Interacción real: tres respuestas por plataformas, victoria amistosa con cinco monedas, avance manual a zona 2, entrada inicial cero, campo editable, apertura/cierre de pista y respuesta por cantidad.
- Recarga y continuación real de zona 2: misma pregunta, un segmento restante y cinco monedas conservados.
- `prefers-reduced-motion: reduce` activado explícitamente desde Rendering de Chrome: un acierto actualizó energía y generó otra pregunta. Sonido apagado durante toda la revisión. Emulación y viewport restaurados al terminar.

Capturas: [escritorio](desktop.png), [360 px](mobile-360.png), [375 px](mobile-375.png), [390 px](mobile-390.png). Las capturas móviles documentan la primera zona; las decoraciones ligeras se ajustaron después de esas capturas.

## Límites y siguientes verificaciones recomendadas

La ruta completa de diez zonas se verificó por lógica automatizada; la revisión manual de navegador cubrió zonas 1 y 2. Quedan como verificaciones adicionales una partida manual completa en dispositivos iOS/Android físicos, lector de pantalla y mediciones de FPS/Core Web Vitals en móviles modestos. No se afirma certificación WCAG ni se han tomado mediciones de rendimiento. Las animaciones consumen pocos elementos CSS y no se añadió un motor de juego.

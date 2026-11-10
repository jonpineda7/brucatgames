# Detective BruCat V3 — informe de entrega

La aventura contiene quince casos reales, cinco capítulos, quince escenas distintas, 105 pruebas para recoger y sesenta distribuciones validadas. Se conserva el primer caso y sus pruebas. No se han añadido juegos matemáticos dentro de este módulo.

| Caso | Capítulo | Acertijo | Objetos | Distribuciones | Estado |
|---|---|---|---:|---:|---|
| 1. La corona desaparecida | Castillo | Ubicación real de la corona | 5 | 4 | Jugable |
| 2. El libro secreto | Castillo | Orden de símbolos y estantería | 5 | 4 | Jugable |
| 3. La llave del tesoro | Castillo | Llave y emblema de cerradura | 5 | 4 | Jugable |
| 4. El mapa escondido | Selva | Cuatro cuadrantes de un mapa continuo | 5 | 4 | Jugable |
| 5. Las huellas misteriosas | Selva | Asociar rastros con animales | 5 | 4 | Jugable |
| 6. El tesoro de la cascada | Selva | Secuencia del agua | 7 | 4 | Jugable |
| 7. La fórmula perdida | Laboratorio | Tres ingredientes entre cuatro, en orden | 7 | 4 | Jugable |
| 8. El robot descompuesto | Laboratorio | Ensamblar piezas y funciones | 7 | 4 | Jugable |
| 9. La máquina misteriosa | Laboratorio | Conexiones y secuencia de activación | 7 | 4 | Jugable |
| 10. El collar perdido | Ciudad | Deducción con testimonios | 7 | 4 | Jugable |
| 11. El misterio del mercado | Ciudad | Asociar comerciantes y almacenaje | 9 | 4 | Jugable |
| 12. El paquete desaparecido | Ciudad | Ordenar horarios e identificar destino | 9 | 4 | Jugable |
| 13. El reloj detenido | Mansión | Relacionar agujas y ordenar horas | 9 | 4 | Jugable |
| 14. El cuadro misterioso | Mansión | Comparar patrones y descifrar símbolos | 9 | 4 | Jugable |
| 15. El gran secreto de BruCat | Mansión | Ruta de capítulos, preparativos y secreto | 9 | 4 | Jugable; final especial |

## Recursos y decisiones

Catorce fondos originales creados con ImageGen integrado, miniaturas de cinco capítulos y BruCat detective conservando pelaje blanco, audífonos de marca y vestimenta morada. El escenario original permanece. Veintinueve siluetas SVG nuevas más las cinco originales comparten máscaras y transformaciones con la detección. Las piezas del mapa se recortan de una misma imagen vectorial; sus cuadrantes encajan realmente.

Los fondos opacos nuevos se codificaron a JPEG de alta calidad: 13,70 MiB frente a 48,27 MiB originales. Las miniaturas de 480 px evitan cargar los fondos completos en el selector. Se mantiene el PNG transparente de la mascota. Prompts completos, dimensiones, procedencia y huellas de archivos: `public/games/detective/scenes/README.md`, `prompts.json`, `asset-manifest.json` y `scene-metadata.json`. Las ubicaciones reales inspeccionadas están en `sceneZones.js`.

Se reutiliza React + JavaScript/Vite sin dependencias nuevas. Cada caso es una configuración con evidencia suficiente y solución verificable; los renderizadores de acertijos y el motor son compartidos. Los mejores resultados y sonido conservan la clave v1; las sesiones conservan la clave v2, añadiendo etapa y borrador con recuperación segura. Repetir no borra estrellas ni récords. El final permite repetir toda la aventura y volver al mapa.

## Verificación

129 pruebas automatizadas aprobadas en el cierre de V3, lint limpio y build de producción correcto durante la integración. Incluyen completar secuencialmente los quince casos, cuatro distribuciones por caso, imágenes cuadradas reales, formas y máscaras, coordenadas a 320/375/768/1440 px con zoom 1–3×, pistas, respuestas correctas/incorrectas, etapas, desbloqueos, récords, repetición, restauración y callbacks antiguos. También se ejecutan las regresiones de los otros cuatro juegos.

Revisión manual mediante Safari: los quince casos completados secuencialmente a través de sus controles reales; selección por teclado, secuencia incorrecta y reordenación, restauración en la segunda etapa del libro, mapa ensamblado, asociaciones, receta, robot, conexiones, testigos, horarios, relojes, comparación de cuadros y tres etapas finales. La pantalla final mostró los cinco capítulos completados y 44/45 estrellas (una ayuda usada en correos). Ventana estrecha: controles legibles, zoom, arrastre que no recoge y clic posterior que sí recoge el objeto en su posición correcta.

Defectos corregidos: receta que exigía también el ingrediente descartable; marcas del mapa que no coincidían con sus pistas; símbolos, tintes y agujas que debían verse en los objetos; selección residual entre etapas; control de carga de un escenario nuevo; supresión de clic posterior a arrastre que podía descartar un toque independiente. Las regresiones correspondientes permanecen en la suite.

No quedan casos ni recursos gráficos pendientes para esta entrega. Limitaciones de verificación: no se probaron teléfonos/tablets físicos, VoiceOver real ni la audición de los efectos. La geometría responsive y los gestos puros no sustituyen esa comprobación de dispositivos.

Archivos principales: `levels.js`, `adventureCases.js`, `scenes.js`, `adventureScenes.js`, `sceneZones.js`, `objects.js`, `ObjectArt.jsx`, `placements.js`, `puzzle.js`, `puzzleInteraction.js`, `engine.js`, `progress.js`, `session.js`, `CaseFlow.jsx`, `PuzzleBoard.jsx/.css`, `DetectiveBruCat.jsx/.css`, `DetectiveScene.jsx`, `DetectiveBits.jsx` y sus pruebas, dentro de `src/games/detective/`.

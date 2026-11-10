# Recursos · Detective BruCat

`castle-study.png`: escenario original generado con la herramienta integrada de ImageGen, 8 de noviembre de 2026. PNG cuadrado de 1254 × 1254, sin personajes ni objetivos interactivos incrustados. Archivo final incorporado al proyecto, sin referencias a rutas locales externas.

El prompt solicitó superficies de colocación aproximadas; después se inspeccionó el escenario obtenido y se fijaron las zonas finales sobre los muebles reales. V2 define diez zonas y cuatro distribuciones en `src/games/detective/scenes.js`; `placements.js` valida límites, ausencia de superposición y regiones seleccionables. La distribución activa gobierna tanto dibujo como detección y se conserva al restaurar la investigación. Los objetivos son recursos vectoriales propios de `ObjectArt.jsx`/`objects.js`, visibles en el SVG de la escena. El fondo no determina los aciertos.

BruCat reutiliza `public/images/categories/gorilla-playing.png`, imagen oficial previamente proporcionada por el usuario. Victoria: `public/images/results/victory.png`. La ilustración específica con gabardina/lupa queda pendiente, sin reemplazar la identidad por otro gorila.

## Prompt final utilizado (herramienta integrada, no CLI)

Use case: illustration-story. Asset type: background for an actual hidden-object web game, square 1024x1024. Create a richly illustrated friendly cartoon castle study for children age 5–10, with crisp ink outlines, softly shaded painterly forms, beautiful teal stone walls, purple curtains, warm golden late-afternoon window light, an arched window at upper left, wooden desk with a clear writing surface in lower center, a big closed violet-and-gold treasure chest on the lower right, crowded bookshelves along the upper right, an ornate round clock near the upper center, a green upholstered reading chair, plants, tiny framed landscapes, cushions, stacks of books and playful decorative details. Inspired by a polished cozy illustrated room hidden-object game, not photorealistic and not a screenshot/UI mockup. Composition must be clear and inviting, moderately cluttered, no people or animals, no scary elements. Leave small relatively clear surfaces for gameplay objects at these normalized positions: (0.19,0.27) on a shelf/windowsill for a key, (0.68,0.38) on a shelf for a scroll, (0.38,0.64) on the desk for a magnifying glass, (0.77,0.76) on chest/near chest for a crown, (0.25,0.84) on a low book stack for a coin. DO NOT draw keys, crowns, magnifying glasses, coins, loose parchment scrolls, glowing circles or markers: these five target objects will be rendered by code at exact positions. Draw the furniture and environment only. No text, lettering, numbers, logos, watermarks or interface. A strong, charming, premium hand-painted storybook game environment with harmonious blue-purple-gold color palette.

## Variantes V2 y sustitución de objetos

Las cuatro distribuciones reutilizan este fondo limpio. Llave, lupa, pergamino, moneda y corona se dibujan una sola vez como objetos independientes, con coordenadas normalizadas y transformaciones compartidas con sus máscaras. No falta ningún recurso para la variación visual implementada.

`ObjectVisual` admite `art: {src}` para incorporar PNG/WebP transparentes en el mismo marco local 100 × 100. La imagen debe respetar ese encuadre y la máscara de `objects.js`; si cambia la silueta, hay que actualizar y verificar su región de selección. No basta con cambiar el archivo y conservar una máscara que ya no coincide.

Los catorce casos pendientes necesitan sus propios fondos limpios, objetos y distribuciones validadas. Una ilustración de BruCat detective sigue siendo una mejora gráfica opcional; la interfaz utiliza el personaje oficial existente.

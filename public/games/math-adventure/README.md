# Recursos · BruCat Math Adventure

## Selva de los Números

`jungle.jpg`: fondo original generado con la herramienta integrada ImageGen, 10 de noviembre de 2026. Ilustración cuadrada cartoon con campamento morado, puente de cuerda interrumpido, portal dorado, cascadas y río turquesa. Sin personajes, texto, números ni respuestas integradas: las plataformas, mecanismos y respuestas se dibujan por código.

`jungle-thumb.jpg`: miniatura cuadrada de480×480 derivada del mismo recurso para portada/catálogo; la interfaz puede recortarla con CSS para una tarjeta apaisada. No representa un segundo mundo o contenido adicional.

Se utiliza el gorila albino oficial ya existente (`public/images/categories/gorilla-playing.png`) y sus imágenes de resultados. Este encargo no crea ni sustituye personajes.

### Composición inspeccionada

- Campamento: parte superior izquierda.
- Portal: parte superior derecha.
- Puente roto: tercio superior/centro.
- Islote izquierdo: centro aproximado normalizado(.15,.53), superficie de llegada en y≈.53.
- Islote central:(.51,.50).
- Islote derecho:(.85,.55).
- Agua despejada en y=.65–.90: zona sugerida para plataformas y mecanismos SVG; no hay números ni plataformas de respuesta incrustados.

El fondo es decorativo y no determina aciertos ni colisiones. El dibujo de respuestas y su interacción deben compartir la configuración activa de la escena.

### Generación y optimización

Modo: herramienta integrada `image_gen`, sin CLI/API propia. Fuente PNG conservada en el directorio generado de Codex (ruta exacta en `asset-manifest.json`). Para producción se codificó a JPEG de calidad86 con sips, sin recortar ni alterar la composición. Miniatura480 codificada a calidad82. Se inspeccionó la salida generada y la versión JPEG optimizada; dimensiones comprobadas con sips.

Los otros tres mundos no tienen recursos nuevos en este directorio y deben seguir identificados como pendientes hasta implementar su contenido real.

### Prompt utilizado

Use case: illustration-story. Asset type: square original background for a real premium children's educational adventure game, BruCat Math Adventure, first world 'Jungle of Numbers'. Create ONE complete illustrated jungle scene, no collage, no UI. Rich hand-painted storybook cartoon art, crisp dark ink contours, softly shaded dimensional forms, beautiful textures, magical warm golden sunlight through green rainforest canopy, violet orchids, electric-cyan/turquoise water and gold stone accents. Uplifting exploration for ages 5–12. Composition: deep layered jungle and turquoise river that opens into a broad calm pool across the lower half; small expedition camp with purple canopy on the distant upper left, vine-wrapped ancient golden stone portal and ruins on distant upper right, a broken rope-and-plank footbridge crossing in the middle distance. Three low natural mossy islands/stone banks in foreground, arranged left, middle and right, with ample calm water and clear space between them. Left island gives a safe place for the official gorilla character to stand later; do NOT draw the character now. Clear lower-center play space for SVG answer platforms and bridge pieces that will be rendered separately; avoid dense leaves obscuring these areas. The scenery itself tells a magical expedition story, with rich environmental details at edges, ferns, enormous leaves, distant cascades, warm firefly light points. Keep the foreground safe, friendly and legible with no threatening falls. NO people, animals, gorilla, written numbers, arithmetic, letters, text, answer platforms with labels, UI, interface, logo, watermark or collectible coins/stars. Square1024x1024, polished professional illustrated game background.

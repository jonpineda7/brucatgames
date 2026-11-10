# Recursos originales · Detective BruCat V3

Creados mediante la herramienta integrada `image_gen`, una llamada por escenario y una para el personaje. Sin CLI, API propia, imágenes descargadas de terceros ni dependencias nuevas. Generación: 9 de noviembre de 2026 (America/Santiago; algunos metadatos UTC corresponden al día 10).

## Archivos finales

- `case-02.jpg` a `case-15.jpg`: catorce fondos originales distintos, cuadrados de 1254 × 1254. JPEG de alta calidad (86), codificado mediante sips sin recortar ni alterar la composición. Total 13.70 MiB, frente a 48.27 MiB en PNG. Se cargan bajo demanda.
- `chapter-1.jpg` a `chapter-5.jpg`: cinco miniaturas de 480 × 480. El capítulo 1 reutiliza el castillo original; capítulos 2–5 utilizan casos 4, 7, 10 y 13.
- `../detective-brucat.png`: BruCat oficial con traje de detective, alfa transparente, 702 × 900 px. Referencia de identidad: `public/images/categories/gorilla-playing.png`; conserva pelaje blanco, ojos magenta, audífonos naranja/negro con B/corona y hoodie morado. Añade gabardina, sombrero, lupa y cuaderno. No sustituye imágenes anteriores.
- `asset-manifest.json`: medidas, pesos y SHA-256 de los catorce fondos.
- `scene-metadata.json`: diez zonas reales por fondo (once en el campamento), inspeccionadas sobre la imagen generada. El archivo de consumo directo es `src/games/detective/sceneZones.js`.
- `prompts.json`: prompts completos, archivos fuente y correspondencia final, incluida la referencia de identidad del personaje.

Los PNG fuente originales permanecen en el directorio de imágenes generadas de Codex que indica `prompts.json`. Se conservaron al optimizar y no se requieren en ejecución.

## Inspección y contrato visual

Se inspeccionaron individualmente los catorce PNG antes de definir sus zonas: muebles, repisas, escritorios, bancos, rocas, troncos, pedestales, alféizares o suelo transitable. Las coordenadas están normalizadas; no son una rejilla ciega sobre el arte. Se inspeccionó también el JPEG final del caso 15 para verificar que la compresión conserva iluminación, contornos y detalles. Todas las dimensiones finales se validaron con sips. La transparencia del personaje fue verificada con `hasAlpha: yes`.

Los fondos contienen decoración ambiental, no copias de los objetivos interactivos. Los objetos de juego se renderizan de manera independiente con una sola transformación compartida por dibujo y detección. Algunas superficies amplias tienen dos zonas (mesa final, por ejemplo), separadas para permitir selección sin solapamiento. La validación de distribuciones del motor tiene prioridad y evita combinaciones que llegaran a superponerse.

## Temas

2 biblioteca antigua; 3 sala del tesoro; 4 campamento selvático; 5 sendero selvático; 6 cascada y ruinas; 7 laboratorio de pociones; 8 taller de robot; 9 laboratorio tecnológico; 10 plaza; 11 mercado; 12 oficina de correos; 13 sala de relojes; 14 galería de arte; 15 sala secreta de la celebración.

Estilo compartido: ilustración cartoon de cuento, contornos definidos, texturas pintadas, violeta/morado, teal/azul eléctrico y dorado, iluminación fantástica y atmósfera amable. No se añadieron marcas, instrucciones ni cuadrículas al escenario.

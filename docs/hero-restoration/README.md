# Restauración del hero de BruCat Games

El banner original se conserva en `public/images/brucatgames-logo.png`, incorporado en el commit `e2f0c07`. El hero usa una copia independiente, sin conversión ni recorte, en `public/images/brand/brucatgames-hero-original.png`.

Ambos archivos coinciden byte por byte con el original de Git. SHA-256:
`7b5c8eb8e52425198c272ac361b90fa406235b527e5a18e3acbae84df1e7ddaf`.

`src/home/Home.jsx` referencia explícitamente este banner. Reutiliza las clases originales de `src/App.css`: dos columnas en escritorio, imagen encima del contenido hasta 700 px. `src/home/Home.css` mantiene `object-fit: contain`; la imagen declara sus dimensiones originales 1536 × 1024.

Las categorías usan exclusivamente `public/images/categories/brucat-{categoria}-{320|480}.png`:

- Infantil: imagen adjunta 08_28_05, pulgares arriba.
- Desafíos mentales: imagen adjunta 08_28_16, rompecabezas.
- Arcade: imagen adjunta 08_28_24, control.

Los originales están en `public/images/categories/originals/`. Ejecutar `sh scripts/prepare-category-assets.sh` para regenerar sus variantes. El antiguo punto de entrada `prepare-home-assets.sh` delega en este script. Ninguno escribe el banner, logo o favicon.

## Comprobaciones realizadas

- Build de Vite correcto; check:build confirma referencias existentes en `/assets/`, sin `/brucatgames/`.
- Lint correcto y 182 pruebas aprobadas, cero fallos.
- Identidad SHA-256 del banner verificada; `index.html`, `src/App.css`, logo original y favicons existentes sin modificaciones.
- Preview local en puerto 4180: documento, banner, logo, iconos, seis variantes de categorías y los dos bundles de entrada responden 200 con tipos MIME correctos.
- Revisión estática de los estilos responsive y separación de referencias completada.
- Pendiente: comprobación visual renderizada en escritorio, tablet y móvil. La conexión al navegador falla al navegar y el control nativo de Chrome y Safari no inicia; por eso no se afirma una validación visual ni de consola completa.

No se publicó, no se revirtieron commits y no se cambiaron juegos ni navegación como parte de esta restauración. Los cambios previos de home y catálogo se conservaron.

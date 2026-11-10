# Corrección de base para brucatgames.cl

## Causa y alcance

La configuración de Vite seguía compilando con `base: '/brucatgames/'`. Esto explica que el documento principal del dominio personalizado pudiera devolver 200 mientras los scripts y estilos se solicitaban bajo un prefijo inexistente y devolvían 404.

Se revisaron las instrucciones aportadas para AGENTS.md; no se encontró otro AGENTS.md en el repositorio ni en sus directorios ascendientes. Se inspeccionaron configuración, scripts, workflow, navegación y recursos antes de editar. Se respetaron los cambios de Math Adventure ya presentes en el directorio de trabajo.

## Archivos de esta corrección

- `vite.config.js`: base explícita `/` para desarrollo y producción en el dominio raíz.
- `public/404.html`: favicon, Apple touch icon, ilustración y enlace de inicio desde la raíz; sin el nombre del repositorio.
- `scripts/check-pages-build.mjs`: valida el artefacto compilado; entradas JavaScript/CSS bajo `/assets/`, recursos HTML/CSS existentes y ausencia del prefijo antiguo en HTML/CSS/JS.
- `package.json`: añade `npm run check:build`, sin nuevas dependencias.
- `.github/workflows/deploy.yml`: ejecuta esa comprobación después de compilar y antes de subir `dist`. Conserva triggers, permisos, environment, upload y despliegue mediante GitHub Actions. No había `--base` ni variable de entorno del workflow que impusiera otro prefijo.
- `README.md`: documenta el dominio, rutas y validación.

## Recursos y compatibilidad

La navegación conserva los hashes (`/#/infantil` y `/#/infantil/math-adventure`); el router existente usa `hashchange`, no React Router, y no declara `basename`. La validación de pathname toma la base de Vite, que ahora corresponde a `/`.

Imágenes, fondos y sprites ya utilizan `import.meta.env.BASE_URL` o rutas desde `/images/`. No requieren cambios de lógica. Los favicon del HTML principal ya tenían rutas raíz. Los archivos `asset-manifest.json` son inventarios de ilustraciones con nombres relativos; no hay manifiesto PWA ni `start_url` pendiente. Se utilizan fuentes del sistema y efectos de Web Audio sintetizados, sin fuentes ni audio descargados. No se encontró service worker ni registro de caché offline que invalidar.

El dominio personalizado ya está configurado en GitHub Pages según la información del usuario. No se cambiaron DNS, Settings → Pages ni configuración remota. El checkout no contiene CNAME; no se creó uno ni se cambió el método de publicación.

## Comprobaciones ejecutadas

- `npm run build`: correcto.
- `npm run check:build`: dos entradas de JavaScript/CSS en `/assets/` y ocho rutas de recursos comprobadas. `dist/index.html` referencia `/assets/index-BCSQf72P.js` y `/assets/index-M2jpRhRR.css`; ambos archivos existen.
- Pruebas negativas del control del artefacto con directorios temporales: rechaza un prefijo `/brucatgames/` y una entrada JavaScript inexistente.
- `npm run lint`: correcto, sin advertencias.
- `npm test`: 166 pruebas aprobadas, cero fallidas.
- `git diff --check`: correcto.
- Preview real: `npm run preview -- --host 127.0.0.1 --port 4175 --strictPort`, sirviendo `dist` desde `http://127.0.0.1:4175/`.
- Auditoría HTTP de los **115 archivos** de `dist`: todos responden **200**, con bytes idénticos al archivo generado. No se recibió HTML como sustituto de scripts, estilos o imágenes. La raíz también devuelve 200 y el `index.html` esperado.
- Chrome: inicio `/`, categoría `/#/infantil` y Math Adventure `/#/infantil/math-adventure` renderizados mediante navegación real; juego iniciado y ejercicio visible. Carga diferida de JS/CSS, fondo, atlas de BruCat y poses de jefes correcta.
- Diagnóstico de solicitudes en Chrome tras recorrer esas vistas: **22 recursos, cero estados distintos de 200 y cero imágenes rotas**. Consola inicial sin mensajes de error de la aplicación.

Capturas del preview: [inicio](home.png), [Infantil](infantil.png), [Math Adventure](math-adventure.png).

## Publicación pendiente

No se realizó commit, push, ejecución remota del workflow ni despliegue. Publicar requiere autorización del usuario. Como el workflow se dispara con pushes a `main`, no se debe hacer ese push antes de autorizarlo.

Después de la publicación autorizada, comprobar el dominio real, que su `index.html` solicite `/assets/`, y las tres rutas anteriores. La corrección se verificó localmente; no se afirma que producción esté corregida todavía.

# Roadmap de BruCat Games

La meta comercial es generar ingresos adicionales de $100.000 a $300.000 CLP mensuales. El presupuesto de alojamiento estático es $0 CLP mensuales mientras el plan gratuito cubra la operación. La migración es una decisión de infraestructura. El progreso comercial se medirá con ingresos mensuales, costos y tráfico, tomando como referencia Web Analytics y Search Console.

| Prioridad | Fase | Dependencia y resultado |
| --- | --- | --- |
| P0 | Mejoras SEO de la portada | Validar el build con el título estable, seis juegos descritos, robots y sitemap. Tras una publicación autorizada, comprobar la URL canónica y su renderizado en Search Console. |
| P1 | Migración GitHub Pages → Cloudflare Pages | Preparar y validar el entorno temporal. El cambio de dominio requiere autorización, un plan de reversión y que el plan Free cubra el proyecto. |
| P2 | URLs indexables por juego | Tras estabilizar el alojamiento, diseñar páginas con URL real, HTML descriptivo, canonical propia y respuesta directa. Mantener la compatibilidad con los enlaces hash compartidos e incluir solo las nuevas URLs canónicas verificadas en el sitemap. |

## Migración GitHub Pages → Cloudflare Pages

Mantener GitHub como repositorio y servir el build estático desde Cloudflare Pages Free. Conservar `brucatgames.cl` y Cloudflare Web Analytics. La migración de alojamiento precede al trabajo de URLs por juego.

1. **Revisar requisitos y límites.** Comparar el tamaño máximo de los archivos, cantidad de archivos y frecuencia de builds con el plan Free. La documentación consultada indica 500 builds mensuales, 20.000 archivos por sitio y 25 MiB por archivo. Confirmar si el dominio raíz ya usa nameservers de Cloudflare y, si requiere una delegación, inventariar los registros de la zona. [Límites de Pages](https://developers.cloudflare.com/pages/platform/limits/) · [Dominios personalizados](https://developers.cloudflare.com/pages/configuration/custom-domains/)
2. **Crear el proyecto conectado a GitHub.** Autorizar solo el repositorio necesario y definir rama de producción y ramas de pruebas para controlar el consumo de builds. [Integración con Git](https://developers.cloudflare.com/pages/configuration/git-integration/)
3. **Configurar el build.** Usar la raíz del repositorio, una versión de Node compatible y validada, `npm run build` y salida `dist`. Ejecutar las pruebas, lint y `npm run check:build` sobre el artefacto a promover. [Configuración de build](https://developers.cloudflare.com/pages/configuration/build-configuration/)
4. **Probar en `pages.dev`.** Desplegar el commit candidato en el dominio temporal. Restringir su indexación mediante una configuración exclusiva del entorno de prueba y verificar que la restricción quede fuera del dominio público al activar el sitio.
5. **Verificar los seis juegos.** Probar apertura directa por hash, navegación, inicio de partida, controles principales y recursos de cada juego. Comparar tiempos de carga, tamaños transferidos y errores con GitHub Pages.
6. **Comprobar analítica, SEO y responsive.** Validar título, canonical, robots, sitemap, 404 y pantallas móviles y de escritorio. El beacon actual solo se carga en `https://brucatgames.cl`. Usar una configuración de prueba aislada si se necesitan datos de `pages.dev` y comprobar que producción envíe un solo beacon tras el cambio.
7. **Preparar la reversión.** Registrar los valores DNS, TTL, configuración del dominio y commit servido por GitHub Pages. Acordar responsable y procedimiento para restaurar los registros y la configuración previos si fallan HTTPS, recursos, juegos o rastreo. Incluir el plazo de propagación DNS.
8. **Migrar el dominio con autorización expresa.** Asociar el dominio en Pages y coordinar los cambios DNS en la ventana acordada. Mantener la redirección permanente de `www` y HTTP a `https://brucatgames.cl/`.
9. **Validar después del cambio.** Comprobar HTTPS, DNS y redirecciones, y revisar GitHub Actions para mantener los controles de calidad y evitar publicaciones paralelas durante la estabilización. Confirmar la recepción de analítica y verificar la portada y el sitemap en la propiedad existente de Search Console.
10. **Conservar el respaldo.** Retener temporalmente el último artefacto funcional y la configuración de GitHub Pages hasta confirmar estabilidad y aprobar el cierre de la ventana de reversión.

### Criterios para autorizar el cambio de dominio

- El entorno temporal supera las comprobaciones de los seis juegos, navegación hash, assets, 404 y responsive, con rendimiento comparable a la referencia de GitHub Pages.
- El build y la frecuencia prevista de despliegues caben en Free. Se comprueba la configuración que conservará la analítica y la canonical de producción.
- Se conoce el estado de DNS, se han documentado los valores a restaurar y existe una persona responsable de la ventana y de la decisión de revertir.
- Se cuenta con autorización explícita para el cambio del dominio y con el respaldo operativo de GitHub Pages.

### Configuración para crear el proyecto

En Cloudflare, abrir **Workers & Pages**, elegir **Create application → Pages → Connect to Git** y seleccionar `jonpineda7/brucatgames`. Mantener GitHub Pages como origen del dominio durante toda la prueba. [Guía de integración](https://developers.cloudflare.com/pages/get-started/git-integration/)

| Campo | Valor recomendado |
| --- | --- |
| Rama de producción | `main`. Desactivar sus despliegues automáticos durante la preparación y limitar los previews a una rama de validación. |
| Framework y raíz | React (Vite), raíz del repositorio. Mantener `base: '/'` en `vite.config.js`. |
| Build y salida | `npm run build && npm run check:build`. Publicar `dist`. Mantener el lockfile de npm. |
| Variables | La aplicación no requiere variables `VITE_*` ni secretos. Fijar `NODE_VERSION` a la versión exacta de Node 22 LTS validada en CI y en el preview. Aplicar la misma versión a Preview y Production. |
| Rutas | Las rutas `/#/infantil/…` cargan `/` y React resuelve el fragmento. Conservar `404.html`, comprobar URLs inexistentes y evitar una reescritura global a `index.html`. |

Usar una URL de preview de rama o de commit y verificar en la respuesta `X-Robots-Tag: noindex`. Si se necesita acceso privado, habilitar Cloudflare Access para los previews. Reservar el host principal `<proyecto>.pages.dev` durante la validación y, una vez aprobado el corte, redirigirlo al dominio canónico como parte de la configuración autorizada. Verificar que `brucatgames.cl` responda sin `noindex`. [Previews](https://developers.cloudflare.com/pages/configuration/preview-deployments/) · [Build image](https://developers.cloudflare.com/pages/configuration/build-image/) · [Servicio de archivos](https://developers.cloudflare.com/pages/configuration/serving-pages/)

Antes del corte, guardar el commit y artefacto de GitHub Pages, verificar que el dominio siga configurado allí y registrar los valores DNS y de redirección con sus TTL. Ante un fallo del artefacto de Cloudflare, volver a un despliegue de producción validado en Pages. Ante un fallo de dominio, TLS o servicio que requiera volver a GitHub Pages, restaurar los registros anteriores, confirmar HTTPS y redirecciones tras la propagación y volver a probar portada, recursos y los seis juegos. [Rollback de Pages](https://developers.cloudflare.com/pages/configuration/rollbacks/)

# brucatgames
juegos de entretencion


Aplicación de minijuegos con React y Vite.

## Desarrollo

```sh
npm ci
npm run dev
```

## Verificación

```sh
npm run lint
npm run build
npm run preview
```

## Publicación

Configurar Settings → Pages → Source: GitHub Actions. Cada push a main compila y publica dist automáticamente. No se necesita una rama gh-pages ni npm run deploy.

URL: https://jonpineda7.github.io/brucatgames/

BruCatGames es una plataforma para todo público. La primera categoría es Infantil, con Memoria Gorila: doce cartas, seis parejas, sin reloj ni vidas, sonido opcional y reinicio.

Rutas compatibles con GitHub Pages:
- Inicio: `/brucatgames/`
- Infantil: `/brucatgames/#/infantil`
- Memoria: `/brucatgames/#/infantil/memoria`

`npm test` verifica el tablero, los bloqueos de selección, las parejas y el reinicio.

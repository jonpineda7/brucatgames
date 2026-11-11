# Corrección P0 de BruCat Math Adventure — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evitar que ajustes o problemas corruptos del almacenamiento local bloqueen BruCat Math Adventure.

**Architecture:** Mantener las API existentes de limpieza y generación. Restringir operaciones y dificultades a claves propias de sus catálogos; los datos inválidos se normalizan al cargar, y la función generadora rechaza entradas inválidas antes de entrar en el bucle de candidatos. Sin migración de formato ni cambio de reglas.

**Tech Stack:** React 19, JavaScript ES modules, Node test runner, Vite 8.

**Spec:** `docs/auditoria-brucat-games.md`, hallazgo A1.

## Global Constraints

- No modificar hero, logotipo, favicon ni recursos oficiales.
- No cambiar mecánicas, rangos de ejercicios, récords válidos ni formato de guardado.
- No publicar, hacer push ni instalar dependencias en el proyecto.

## Review Focus

- Datos JSON con claves heredadas de `Object.prototype` (`constructor`, `toString`, `__proto__`).
- Ajustes de dificultad inválidos combinados con operaciones válidas.
- Listas mixtas que contienen operaciones inválidas junto a válidas.
- Problemas restaurados que declaran una operación heredada.
- Conservación de ajustes y ejercicios legítimos de las cuatro operaciones.

### Task 1: Validar claves del juego educativo

**Files:** `src/games/math-adventure/progress.js`, `src/games/math-adventure/math.js`, `src/games/math-adventure/math.test.js`, `src/games/math-adventure/engine.test.js` (solo si hace falta).

**Acceptance:** Un guardado con nombres heredados produce ajustes seguros y permite iniciar una expedición; `generateProblem` rechaza operación/dificultad desconocida con `RangeError`; `validProblem` devuelve `false` para ellas; las 182 pruebas previas siguen pasando.

- [x] Escribir pruebas de regresión de ajustes corruptos y validación de problemas. Fallaron contra el código previo por aceptación indebida.
- [x] Ejecutar las pruebas nuevas y confirmar el fallo esperado. Dos fallos de aserción, sin bucles.
- [x] Sustituir la validación por comprobaciones de claves propias en `cleanSettings`, `generateProblem` y `validProblem`. Solo las cuatro operaciones y tres dificultades se aceptan.
- [x] Ejecutar los tests de Matemáticas y `npm test`. Resultado: 184/184.
- [x] Ejecutar `npm run lint`, `npm run build` y `npm run check:build`. Resultado: salida 0.
- [x] Repetir en navegador el arranque con guardado corrupto. Resultado: pregunta válida “3 + 3 = ?” y ajustes saneados, sin error de página.

## Backlog después de P0

P1 A2–A4 se completaron en `docs/superpowers/plans/2026-11-10-mejoras-p1.md`. Queda A5 (medición de Core Web Vitals y evaluación de derivados del hero, preservando el original). P2: A6 (ARIA), A7 (SEO), A8 (CSS/tokens). P3: A9 (mediciones y dispositivos físicos), A10 (expansión).

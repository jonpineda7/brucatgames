# BruCat explorador

Recursos aportados por el usuario. Hoja de 1448×1086, 4×3 celdas de 362 px. Se conservaron las poses y la escala originales; se retiraron píxeles desconectados y halos de alfa alrededor del componente principal de cada celda, dejando dos píxeles de suavizado. Desplazamiento horizontal común de −12 px para conservar el anclaje de los pies al señalar el cuaderno. Baseline 350 px salvo el salto intencional del fotograma 5. Sin recortes de cabeza ni pies en la copia preparada.

`frames.json` registra límites y desplazamientos. La preparación reproducible está en `scripts/prepare-math-sprites.py`; usa solo la biblioteca estándar de Python. Uso: `python3 scripts/prepare-math-sprites.py hoja-original.png directorio-destino`. No se ha regenerado el dibujo. La ilustración estática aportada se conserva para fallo de carga.

Espera: pose 0 y ciclo corto de 540 ms cada cinco segundos. Celebración: 820 ms una vez. Ayuda: 1250 ms, incluidos 750 ms señalando el cuaderno. Son cambios discretos de celda, sin interpolación.

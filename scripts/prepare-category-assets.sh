#!/bin/sh
# Category artwork only. Never writes hero, brand, logo or favicon resources.
set -eu
cd "$(dirname "$0")/.."
for category in infantil desafios-mentales arcade; do
 for size in 320 480; do
  sips -Z "$size" "public/images/categories/originals/brucat-$category-2026-11-10.png" --out "public/images/categories/brucat-$category-$size.png"
 done
done

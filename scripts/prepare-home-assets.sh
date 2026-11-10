#!/bin/sh
# Compatibility entry point: category variants only, independent of the hero.
set -eu
exec sh "$(dirname "$0")/prepare-category-assets.sh"

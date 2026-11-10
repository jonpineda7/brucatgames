import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import { resolve, sep } from 'node:path'

// Validate the actual Pages artifact, including any CLI/workflow base override.
const directory = resolve(process.argv[2] || 'dist')
const checked = new Set()
async function verifyResource(reference) {
  if (!reference.startsWith('/') || reference.startsWith('//')) return
  const pathname = decodeURIComponent(reference.split(/[?#]/)[0])
  const file = resolve(directory, `.${pathname}`)
  assert.ok(file === directory || file.startsWith(directory + sep), `Ruta fuera del artefacto: ${reference}`)
  assert.ok((await stat(file)).isFile() || pathname === '/', `Recurso inexistente: ${reference}`)
  checked.add(pathname)
}
async function inspect(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = resolve(folder, entry.name)
    if (entry.isDirectory()) { await inspect(file); continue }
    if (!/\.(?:html|css|js)$/.test(entry.name)) continue
    const content = await readFile(file, 'utf8')
    assert.ok(!content.includes('/brucatgames/'), `Prefijo antiguo en ${file}`)
    if (entry.name.endsWith('.html')) {
      for (const [, reference] of content.matchAll(/(?:src|href)=["']([^"']+)["']/g)) await verifyResource(reference)
    } else if (entry.name.endsWith('.css')) {
      for (const [, reference] of content.matchAll(/url\(["']?([^"')]+)["']?\)/g)) await verifyResource(reference)
    }
  }
}
const html = await readFile(resolve(directory, 'index.html'), 'utf8')
const entrypoints = [...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css))["']/g)].map(match => match[1])
assert.ok(entrypoints.some(path => path.endsWith('.js')), 'Falta el JavaScript de entrada')
assert.ok(entrypoints.some(path => path.endsWith('.css')), 'Falta la hoja de estilos')
for (const path of entrypoints) assert.ok(path.startsWith('/assets/'), `La entrada debe estar en /assets/: ${path}`)
await inspect(directory)
console.log(`Pages: ${entrypoints.length} entradas en /assets/ y ${checked.size} rutas de recursos verificadas; sin prefijo del repositorio.`)

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { generarSvgAdopcion } from '../src/components/BranchModelBadges.js';

const RAIZ = resolve(import.meta.dirname, '..');
const datosRamas = JSON.parse(
  readFileSync(resolve(RAIZ, 'src/data/branch-models.json'), 'utf8')
);

test('branch-models.json contiene los 3 modelos esperados, suma 100% y documenta fuente', () => {
  assert.equal(typeof datosRamas.notaFuente, 'string');
  assert.match(datosRamas.notaFuente, /estimaci/i);
  assert.equal(Array.isArray(datosRamas.modelos), true);
  assert.equal(datosRamas.modelos.length, 3);

  const nombres = datosRamas.modelos.map((m) => m.nombre);
  assert.deepEqual(nombres, ['GitHub Flow', 'GitFlow', 'Trunk-Based Development']);

  const total = datosRamas.modelos.reduce((acc, m) => acc + m.adopcion, 0);
  assert.equal(total, 100);
});

test('generarSvgAdopcion genera un SVG ligero (< 20 KB) con los 3 modelos', () => {
  const svg = generarSvgAdopcion(datosRamas.modelos);
  assert.match(svg, /^<svg\b/);
  assert.equal(Buffer.byteLength(svg, 'utf8') < 20 * 1024, true);

  for (const modelo of datosRamas.modelos) {
    assert.match(svg, new RegExp(modelo.nombre));
    assert.match(svg, new RegExp(`${modelo.adopcion}%`));
  }
});

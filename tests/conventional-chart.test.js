import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { generarDonutSvg } from '../src/components/ConventionalChart.js';

const RAIZ = resolve(import.meta.dirname, '..');
const datosCC = JSON.parse(
  readFileSync(resolve(RAIZ, 'src/data/conventional-commits.json'), 'utf8')
);

test('conventional-commits.json suma 100%, incluye los 7 tipos, anclas y nota transparente', () => {
  assert.match(datosCC.notaTransparencia, /datos estimados basados en repos públicos/i);
  assert.equal(Array.isArray(datosCC.tipos), true);
  assert.equal(datosCC.tipos.length, 7);

  const suma = datosCC.tipos.reduce((acc, t) => acc + t.porcentaje, 0);
  assert.equal(suma, 100);

  for (const tipo of datosCC.tipos) {
    assert.match(tipo.ancla, /^#cc-[a-z]+$/);
    assert.match(tipo.color, /^#[0-9a-f]{6}$/i);
  }
});

test('generarDonutSvg genera un SVG donut con un <circle> por cada tipo', () => {
  const svg = generarDonutSvg(datosCC.tipos);
  assert.match(svg, /^<svg\b/);
  const circulos = svg.match(/<circle\b/g) || [];
  // 1 círculo de fondo + 7 segmentos
  assert.equal(circulos.length, 8);
});

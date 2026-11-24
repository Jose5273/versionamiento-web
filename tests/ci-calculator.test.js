import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularMinutosCI } from '../src/components/CICalculator.js';

test('calcularMinutosCI aplica fórmula y multiplicadores de SO correctamente', () => {
  const linux = calcularMinutosCI({ jobsDia: 5, duracionMin: 4, diasMes: 20, so: 'linux' });
  assert.equal(linux.minutosBase, 400);
  assert.equal(linux.multiplicador, 1);
  assert.equal(linux.minutosFacturados, 400);
  assert.equal(linux.comparacion.find((p) => p.id === 'gitlab-free').excede, false);

  const windows = calcularMinutosCI({ jobsDia: 5, duracionMin: 4, diasMes: 20, so: 'windows' });
  assert.equal(windows.multiplicador, 2);
  assert.equal(windows.minutosFacturados, 800);
  assert.equal(windows.comparacion.find((p) => p.id === 'gitlab-free').excede, true);
  assert.equal(windows.comparacion.find((p) => p.id === 'github-free').excede, false);

  const macos = calcularMinutosCI({ jobsDia: 5, duracionMin: 4, diasMes: 20, so: 'macos' });
  assert.equal(macos.multiplicador, 10);
  assert.equal(macos.minutosFacturados, 4000);
  assert.equal(macos.comparacion.find((p) => p.id === 'github-pro').excede, true);
  assert.equal(macos.comparacion.find((p) => p.id === 'gitlab-premium').excede, false);
});

test('calcularMinutosCI maneja casos límite (0 jobs, negativos, NaN y valores altos) sin errores ni NaN', () => {
  const cero = calcularMinutosCI({ jobsDia: 0, duracionMin: 10, diasMes: 22, so: 'linux' });
  assert.equal(cero.minutosFacturados, 0);
  assert.equal(cero.comparacion.every((p) => p.excede === false), true);

  const negativos = calcularMinutosCI({ jobsDia: -5, duracionMin: 'abc', diasMes: NaN, so: 'desconocido' });
  assert.equal(Number.isNaN(negativos.minutosFacturados), false);
  assert.equal(negativos.minutosFacturados, 0);
  assert.equal(negativos.so, 'linux');

  const alto = calcularMinutosCI({ jobsDia: 50, duracionMin: 15, diasMes: 30, so: 'macos' });
  assert.equal(alto.minutosFacturados, 225000);
  assert.equal(alto.comparacion.every((p) => p.excede === true), true);
  assert.match(alto.recomendacion, /runners propios|self-hosted/i);
});

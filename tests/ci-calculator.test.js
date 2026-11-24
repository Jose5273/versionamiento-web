
import test from 'node:test'; // Importa el módulo de pruebas integrado de Node.js.

import assert from 'node:assert/strict'; // Importa las funciones para comprobar los resultados esperados.

import { calcularMinutosCI } from '../src/components/CICalculator.js'; // Importa la función que calcula los minutos de CI/CD.

// Primera prueba: verifica que la fórmula de cálculo y los multiplicadores
// correspondientes a Linux, Windows y macOS funcionen correctamente.
test('calcularMinutosCI aplica fórmula y multiplicadores de SO correctamente', () => {

  // Calcula el consumo utilizando Linux:
  // 5 trabajos diarios, 4 minutos por trabajo y 20 días al mes.
  const linux = calcularMinutosCI({ jobsDia: 5, duracionMin: 4, diasMes: 20, so: 'linux' });

  // Comprueba que el consumo base sea 400 minutos.
  assert.equal(linux.minutosBase, 400);

  // Comprueba que Linux tenga un multiplicador de 1.
  assert.equal(linux.multiplicador, 1);

  // Comprueba que los minutos facturados sean 400.
  assert.equal(linux.minutosFacturados, 400);

  // Busca el plan gratuito de GitLab y comprueba que el consumo
  // no supere su límite según la lógica de la calculadora.
  assert.equal(linux.comparacion.find((p) => p.id === 'gitlab-free').excede, false);


  // Calcula el consumo utilizando Windows con los mismos valores.
  const windows = calcularMinutosCI({ jobsDia: 5, duracionMin: 4, diasMes: 20, so: 'windows' });

  // Comprueba que Windows tenga un multiplicador de 2.
  assert.equal(windows.multiplicador, 2);

  // Comprueba que los minutos facturados sean 800.
  assert.equal(windows.minutosFacturados, 800);

  // Comprueba que el consumo supere el límite del plan gratuito de GitLab.
  assert.equal(windows.comparacion.find((p) => p.id === 'gitlab-free').excede, true);

  // Comprueba que el consumo no supere el límite del plan gratuito de GitHub.
  assert.equal(windows.comparacion.find((p) => p.id === 'github-free').excede, false);


  // Calcula el consumo utilizando macOS con los mismos valores.
  const macos = calcularMinutosCI({ jobsDia: 5, duracionMin: 4, diasMes: 20, so: 'macos' });

  // Comprueba que macOS tenga un multiplicador de 10.
  assert.equal(macos.multiplicador, 10);

  // Comprueba que los minutos facturados sean 4000.
  assert.equal(macos.minutosFacturados, 4000);

  // Comprueba que el consumo supere el límite del plan GitHub Pro.
  assert.equal(macos.comparacion.find((p) => p.id === 'github-pro').excede, true);

  // Comprueba que el consumo no supere el límite del plan GitLab Premium.
  assert.equal(macos.comparacion.find((p) => p.id === 'gitlab-premium').excede, false);
});


// Segunda prueba: verifica que la función controle situaciones especiales,
// como valores en cero, negativos, datos no numéricos y consumos elevados.
test('calcularMinutosCI maneja casos límite (0 jobs, negativos, NaN y valores altos) sin errores ni NaN', () => {

  // Caso 1: no se ejecuta ningún trabajo durante el día.
  const cero = calcularMinutosCI({ jobsDia: 0, duracionMin: 10, diasMes: 22, so: 'linux' });

  // Comprueba que el consumo facturado sea cero.
  assert.equal(cero.minutosFacturados, 0);

  // Comprueba que ningún plan aparezca como excedido.
  assert.equal(cero.comparacion.every((p) => p.excede === false), true);


  // Caso 2: se proporcionan valores negativos, texto en lugar de un número,
  // NaN como cantidad de días y un sistema operativo desconocido.
  const negativos = calcularMinutosCI({ jobsDia: -5, duracionMin: 'abc', diasMes: NaN, so: 'desconocido' });

  // Comprueba que el resultado no sea NaN.
  assert.equal(Number.isNaN(negativos.minutosFacturados), false);

  // Comprueba que el resultado final sea cero.
  assert.equal(negativos.minutosFacturados, 0);

  // Comprueba que un sistema operativo desconocido se sustituya por Linux.
  assert.equal(negativos.so, 'linux');


  // Caso 3: se calcula un consumo elevado utilizando macOS.
  const alto = calcularMinutosCI({ jobsDia: 50, duracionMin: 15, diasMes: 30, so: 'macos' });

  // Comprueba que el resultado sea de 225 000 minutos facturados.
  assert.equal(alto.minutosFacturados, 225000);

  // Comprueba que todos los planes comparados aparezcan como excedidos.
  assert.equal(alto.comparacion.every((p) => p.excede === true), true);

  // Comprueba que la recomendación mencione runners propios o self-hosted.
  assert.match(alto.recomendacion, /runners propios|self-hosted/i);
});

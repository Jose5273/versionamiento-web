
// Importa el módulo de pruebas de Node.js.
// Permite definir y ejecutar pruebas automatizadas mediante test().
import test from 'node:test';

// Importa las funciones de comprobación.
// Permite verificar resultados y detener una prueba cuando una condición no se cumple.
import assert from 'node:assert/strict';

// Importa la función para leer archivos del sistema.
import { readFileSync } from 'node:fs';

// Importa la función para construir rutas de archivos.
import { resolve } from 'node:path';

// Importa la función que genera el SVG de adopción de modelos de ramas.
import { generarSvgAdopcion } from '../src/components/BranchModelBadges.js';

// Calcula la ruta raíz del proyecto.
// import.meta.dirname representa el directorio del archivo actual.
// resolve() permite construir una ruta absoluta.
const RAIZ = resolve(import.meta.dirname, '..');

// Lee el archivo JSON que contiene los modelos de ramas.
// Después, JSON.parse() convierte su contenido de texto en un objeto JavaScript.
const datosRamas = JSON.parse(
  readFileSync(resolve(RAIZ, 'src/data/branch-models.json'), 'utf8')
);

// Primera prueba automatizada.
// Comprueba que branch-models.json tenga tres modelos esperados,
// que sus porcentajes sumen 100 y que documente la fuente de los datos.
test('branch-models.json contiene los 3 modelos esperados, suma 100% y documenta fuente', () => {

  // Comprueba que la propiedad notaFuente exista y sea de tipo texto.
  assert.equal(typeof datosRamas.notaFuente, 'string');

  // Comprueba que la nota de fuente incluya una palabra relacionada con estimaciones.
  // La expresión regular /estimaci/i no distingue entre mayúsculas y minúsculas.
  assert.match(datosRamas.notaFuente, /estimaci/i);

  // Comprueba que modelos sea un array.
  assert.equal(Array.isArray(datosRamas.modelos), true);

  // Comprueba que el array contenga exactamente tres modelos.
  assert.equal(datosRamas.modelos.length, 3);

  // Extrae el nombre de cada modelo para comprobar que sean los esperados.
  const nombres = datosRamas.modelos.map((m) => m.nombre);

  // Compara los nombres obtenidos con los tres modelos definidos para el proyecto.
  // También comprueba que estén en el orden indicado.
  assert.deepEqual(nombres, ['GitHub Flow', 'GitFlow', 'Trunk-Based Development']);

  // Suma los porcentajes de adopción de todos los modelos.
  // reduce() acumula los valores utilizando acc como acumulador.
  const total = datosRamas.modelos.reduce((acc, m) => acc + m.adopcion, 0);

  // Comprueba que la suma de los porcentajes sea exactamente 100.
  assert.equal(total, 100);
});

// Segunda prueba automatizada.
// Comprueba que generarSvgAdopcion() produzca un SVG válido,
// que su tamaño sea inferior a 20 KB y que incluya los tres modelos.
test('generarSvgAdopcion genera un SVG ligero (< 20 KB) con los 3 modelos', () => {

  // Ejecuta la función con los modelos obtenidos del archivo JSON.
  // El resultado esperado es una cadena de texto que contiene código SVG.
  const svg = generarSvgAdopcion(datosRamas.modelos);

  // Comprueba que el contenido generado comience con una etiqueta SVG.
  assert.match(svg, /^<svg\b/);

  // Calcula el tamaño del SVG en bytes usando codificación UTF-8.
  // Comprueba que no supere los 20 KB.
  assert.equal(Buffer.byteLength(svg, 'utf8') < 20 * 1024, true);

  // Recorre todos los modelos para comprobar que aparezcan en el SVG.
  for (const modelo of datosRamas.modelos) {

    // Comprueba que el nombre del modelo esté presente en el SVG.
    assert.match(svg, new RegExp(modelo.nombre));

    // Comprueba que el porcentaje de adopción aparezca acompañado del símbolo %.
    assert.match(svg, new RegExp(`${modelo.adopcion}%`));
  }
});

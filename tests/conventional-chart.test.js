
import test from 'node:test'; // Importa el módulo de pruebas integrado de Node.js.
import assert from 'node:assert/strict'; // Importa las funciones para comprobar los resultados.
import { readFileSync } from 'node:fs'; // Permite leer archivos del proyecto.
import { resolve } from 'node:path'; // Permite construir rutas de archivos.

// Importa la función que genera el gráfico circular tipo dona en formato SVG.
import { generarDonutSvg } from '../src/components/ConventionalChart.js';

// Obtiene la ruta raíz del proyecto para localizar los archivos que se van a comprobar.
const RAIZ = resolve(import.meta.dirname, '..');

// Lee el archivo JSON que contiene los datos de Conventional Commits.
// JSON.parse convierte el contenido de texto en un objeto JavaScript.
const datosCC = JSON.parse(
  readFileSync(resolve(RAIZ, 'src/data/conventional-commits.json'), 'utf8')
);


// Primera prueba: comprueba que el archivo JSON tenga los siete tipos
// de Conventional Commits, que sus porcentajes sumen 100 %,
// que sus anclas y colores tengan el formato esperado y que incluya
// una nota que explique el origen estimado de los datos.
test('conventional-commits.json suma 100%, incluye los 7 tipos, anclas y nota transparente', () => {

  // Comprueba que la nota de transparencia incluya la explicación
  // sobre los datos estimados basados en repositorios públicos.
  // La expresión regular ignora diferencias entre mayúsculas y minúsculas.
  assert.match(datosCC.notaTransparencia, /datos estimados basados en repos públicos/i);

  // Comprueba que la propiedad tipos sea un arreglo.
  assert.equal(Array.isArray(datosCC.tipos), true);

  // Comprueba que existan exactamente siete tipos de commits.
  assert.equal(datosCC.tipos.length, 7);

  // Suma los porcentajes de todos los tipos.
  // reduce() acumula los valores de porcentaje en una sola cantidad.
  const suma = datosCC.tipos.reduce((acc, t) => acc + t.porcentaje, 0);

  // Comprueba que la suma de los porcentajes sea exactamente 100.
  assert.equal(suma, 100);

  // Recorre cada tipo de Conventional Commit para validar sus propiedades.
  for (const tipo of datosCC.tipos) {

    // Comprueba que el ancla comience con #cc-
    // y continúe con letras minúsculas.
    assert.match(tipo.ancla, /^#cc-[a-z]+$/);

    // Comprueba que el color tenga el formato hexadecimal de seis caracteres.
    // Por ejemplo: #3498db.
    // La expresión i permite aceptar letras mayúsculas o minúsculas.
    assert.match(tipo.color, /^#[0-9a-f]{6}$/i);
  }
});


// Segunda prueba: comprueba que la función generarDonutSvg()
// genere un gráfico SVG y que incluya un círculo de fondo
// más un segmento por cada uno de los siete tipos de commits.
test('generarDonutSvg genera un SVG donut con un <circle> por cada tipo', () => {

  // Genera el código SVG del gráfico utilizando los datos del archivo JSON.
  const svg = generarDonutSvg(datosCC.tipos);

  // Comprueba que el contenido generado comience con una etiqueta <svg>.
  assert.match(svg, /^<svg\b/);

  // Busca todas las etiquetas <circle> dentro del SVG.
  // match() devuelve las coincidencias encontradas.
  // Si no encuentra ninguna, se utiliza un arreglo vacío.
  const circulos = svg.match(/<circle\b/g) || [];

  // 1 círculo de fondo + 7 segmentos.
  // Comprueba que el gráfico tenga exactamente ocho círculos.
  assert.equal(circulos.length, 8);
});


import test from 'node:test'; // Importa el módulo de pruebas integrado de Node.js.
import assert from 'node:assert/strict'; // Importa las funciones para realizar comprobaciones estrictas.
import { readFileSync } from 'node:fs'; // Importa la función que permite leer archivos.
import { resolve } from 'node:path'; // Importa la función para construir rutas de archivos.
import { filtrarTopComandos } from '../src/components/TopCommands.js'; // Importa la función que filtra los comandos destacados.

// Obtiene la ruta raíz del proyecto para localizar los archivos.
const RAIZ = resolve(import.meta.dirname, '..');

// Lee el archivo JSON que contiene los diez comandos destacados.
// JSON.parse() convierte el contenido de texto en un arreglo de objetos JavaScript.
const comandosTop10 = JSON.parse(
  readFileSync(resolve(RAIZ, 'src/data/commands-top10.json'), 'utf8')
);

// Primera prueba: comprueba que commands-top10.json
// contenga diez comandos únicos y que todos tengan una estructura válida.
test('commands-top10.json contiene 10 comandos únicos con esquema válido', () => {

  // Comprueba que los datos cargados sean un arreglo.
  assert.equal(Array.isArray(comandosTop10), true);

  // Comprueba que el arreglo contenga exactamente diez comandos.
  assert.equal(comandosTop10.length, 10);

  // Crea un conjunto para almacenar los rankings y detectar duplicados.
  const rankings = new Set();

  // Crea un conjunto para almacenar los comandos y detectar duplicados.
  const comandos = new Set();

  // Define los únicos roles profesionales permitidos.
  const rolesValidos = new Set(['junior', 'senior', 'lead']);

  // Recorre cada comando del arreglo para validar sus propiedades.
  for (const item of comandosTop10) {

    // Comprueba que el ranking sea un número entero.
    assert.equal(Number.isInteger(item.ranking), true);

    // Comprueba que el ranking esté entre 1 y 10.
    assert.equal(item.ranking >= 1 && item.ranking <= 10, true);

    // Comprueba que el ranking no se encuentre repetido.
    assert.equal(rankings.has(item.ranking), false, `Ranking duplicado: ${item.ranking}`);

    // Agrega el ranking al conjunto para futuras comprobaciones.
    rankings.add(item.ranking);

    // Comprueba que el comando sea un texto.
    assert.equal(typeof item.comando, 'string');

    // Comprueba que el texto del comando no esté vacío.
    assert.equal(item.comando.length > 0, true);

    // Comprueba que el comando no se encuentre repetido.
    assert.equal(comandos.has(item.comando), false, `Comando duplicado: ${item.comando}`);

    // Agrega el comando al conjunto para detectar posibles duplicados.
    comandos.add(item.comando);

    // Comprueba que la frecuencia tenga el formato esperado:
    // un número seguido de "usos/día" o "usos/semana".
    assert.match(item.frecuencia, /usos\/(día|semana)$/);

    // Comprueba que el rol pertenezca a los tres roles permitidos.
    assert.equal(rolesValidos.has(item.rol), true, `Rol inválido: ${item.rol}`);

    // Comprueba que etiquetas sea un arreglo y que tenga al menos una etiqueta.
    assert.equal(Array.isArray(item.etiquetas) && item.etiquetas.length > 0, true);
  }
});

// Segunda prueba: comprueba que filtrarTopComandos()
// filtre correctamente según el rol y devuelva todos los comandos por defecto.
test('filtrarTopComandos filtra correctamente por rol y devuelve todos por defecto', () => {

  // Comprueba que al seleccionar "todos" se devuelvan los diez comandos.
  assert.equal(filtrarTopComandos(comandosTop10, 'todos').length, 10);

  // Obtiene únicamente los comandos correspondientes al rol Junior.
  const junior = filtrarTopComandos(comandosTop10, 'junior');

  // Obtiene únicamente los comandos correspondientes al rol Senior.
  const senior = filtrarTopComandos(comandosTop10, 'senior');

  // Obtiene únicamente los comandos correspondientes al rol Lead.
  const lead = filtrarTopComandos(comandosTop10, 'lead');

  // Comprueba que existan comandos para cada uno de los tres roles.
  assert.equal(junior.length > 0, true);
  assert.equal(senior.length > 0, true);
  assert.equal(lead.length > 0, true);

  // Comprueba que todos los elementos del resultado Junior tengan ese rol.
  assert.equal(junior.every((c) => c.rol === 'junior'), true);

  // Comprueba que todos los elementos del resultado Senior tengan ese rol.
  assert.equal(senior.every((c) => c.rol === 'senior'), true);

  // Comprueba que todos los elementos del resultado Lead tengan ese rol.
  assert.equal(lead.every((c) => c.rol === 'lead'), true);

  // Comprueba que la suma de los tres grupos sea igual a los diez comandos originales.
  assert.equal(junior.length + senior.length + lead.length, 10);
});

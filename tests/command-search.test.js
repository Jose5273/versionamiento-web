
import test from 'node:test'; // Importa el módulo de pruebas integrado de Node.js.
import assert from 'node:assert/strict'; // Importa las funciones para verificar los resultados.
import { readFileSync } from 'node:fs'; // Permite leer archivos del proyecto.
import { resolve } from 'node:path'; // Permite construir rutas de archivos.

// Importa las tres funciones del componente CommandSearch.js que serán evaluadas.
import {
  buscarComandos, // Busca comandos según el texto y las etiquetas seleccionadas.
  resaltarCoincidencia, // Resalta dentro del texto la coincidencia encontrada.
  crearDebounce, // Retrasa la ejecución de una función para agrupar llamadas consecutivas.
} from '../src/components/CommandSearch.js';

// Obtiene la ruta raíz del proyecto.
const RAIZ = resolve(import.meta.dirname, '..');

// Lee el archivo JSON con todos los comandos Git.
// JSON.parse transforma el contenido de texto en un arreglo de objetos JavaScript.
const todosComandos = JSON.parse(
  readFileSync(resolve(RAIZ, 'src/data/commands-all.json'), 'utf8')
);


// Primera prueba: comprueba que el JSON tenga exactamente 40 comandos,
// que sus identificadores y comandos sean únicos y que existan etiquetas principales.
test('commands-all.json contiene 40 comandos únicos y cubre etiquetas principales', () => {

  // Comprueba que todosComandos sea un arreglo.
  assert.equal(Array.isArray(todosComandos), true);

  // Comprueba que el arreglo contenga exactamente 40 comandos.
  assert.equal(todosComandos.length, 40);

  // Crea un conjunto vacío para almacenar los identificadores encontrados.
  const ids = new Set();

  // Crea un conjunto vacío para almacenar los comandos encontrados.
  const cmds = new Set();

  // Crea un conjunto vacío para almacenar todas las etiquetas encontradas.
  const todasEtiquetas = new Set();

  // Recorre cada objeto del arreglo de comandos.
  for (const item of todosComandos) {

    // Comprueba que el identificador del comando no esté repetido.
    assert.equal(ids.has(item.id), false, `ID duplicado: ${item.id}`);

    // Agrega el identificador al conjunto para registrar que ya fue encontrado.
    ids.add(item.id);

    // Comprueba que el texto del comando no esté repetido.
    assert.equal(cmds.has(item.comando), false, `Comando duplicado: ${item.comando}`);

    // Agrega el comando al conjunto de comandos registrados.
    cmds.add(item.comando);

    // Comprueba que etiquetas sea un arreglo y que contenga al menos una etiqueta.
    assert.equal(Array.isArray(item.etiquetas) && item.etiquetas.length > 0, true);

    // Recorre las etiquetas del comando y las agrega al conjunto general.
    // Set evita almacenar varias veces una misma etiqueta.
    item.etiquetas.forEach((e) => todasEtiquetas.add(e));
  }

  // Comprueba que existan las cuatro etiquetas principales requeridas.
  for (const req of ['#rama', '#conflicto', '#deshacer', '#tag']) {

    // Verifica que cada etiqueta requerida esté presente.
    // Si falta alguna, muestra cuál es la etiqueta que no se encontró.
    assert.equal(todasEtiquetas.has(req), true, `Falta etiqueta requerida ${req}`);
  }
});


// Segunda prueba: comprueba que el buscador permita filtrar comandos
// por texto, por varias etiquetas simultáneamente y que controle búsquedas sin resultados.
test('buscarComandos soporta búsqueda por texto, multiselección de etiquetas y estado vacío', () => {

  // Busca los comandos que coincidan con el término "rebase".
  const porTexto = buscarComandos(todosComandos, { termino: 'rebase' });

  // Comprueba que la búsqueda encuentre al menos cuatro resultados.
  assert.equal(porTexto.length >= 4, true);

  // Busca comandos que tengan simultáneamente las etiquetas
  // #conflicto y #deshacer.
  const multiTag = buscarComandos(todosComandos, {
    etiquetasActivas: ['#conflicto', '#deshacer'],
  });

  // Comprueba que existan al menos dos resultados.
  assert.equal(multiTag.length >= 2, true);

  // Comprueba que todos los resultados tengan las dos etiquetas seleccionadas.
  assert.equal(
    multiTag.every((c) => c.etiquetas.includes('#conflicto') && c.etiquetas.includes('#deshacer')),
    true
  );

  // Realiza una búsqueda con un texto que no debería existir en el catálogo.
  const vacio = buscarComandos(todosComandos, { termino: 'comando_inexistente_xyz' });

  // Comprueba que la búsqueda no devuelva ningún resultado.
  assert.equal(vacio.length, 0);
});


// Tercera prueba: comprueba que el resaltado de coincidencias
// escape los caracteres HTML y utilice la etiqueta <mark>.
test('resaltarCoincidencia escapa HTML y envuelve coincidencias con <mark>', () => {

  // Busca la palabra "switch" dentro del comando.
  // El texto también contiene <rama>, que debe escaparse para no interpretarse como HTML.
  const res = resaltarCoincidencia('git switch -c <rama>', 'switch');

  // Comprueba que la palabra encontrada esté envuelta
  // dentro de una etiqueta mark con la clase resaltado.
  assert.match(res, /<mark class="resaltado">switch<\/mark>/);

  // Comprueba que los caracteres de <rama> se conviertan en entidades HTML.
  assert.match(res, /&lt;rama&gt;/);
});


// Cuarta prueba: comprueba que crearDebounce agrupe llamadas consecutivas
// y ejecute la función una sola vez después del tiempo establecido.
test('crearDebounce agrupa llamadas consecutivas dentro de la ventana de 200ms', async () => {

  // Inicializa un contador para registrar cuántas veces se ejecuta la función.
  let conteo = 0;

  // Crea una función con debounce.
  // La función que incrementa el contador se ejecutará después de 50 milisegundos
  // desde la última llamada consecutiva.
  const debounced = crearDebounce(() => {
    conteo += 1;
  }, 50);

  // Realiza la primera llamada.
  debounced();

  // Realiza una segunda llamada antes de que transcurran 50 milisegundos.
  debounced();

  // Realiza una tercera llamada antes de que transcurran 50 milisegundos.
  debounced();

  // Comprueba que la función todavía no se haya ejecutado.
  assert.equal(conteo, 0);

  // Espera 90 milisegundos para permitir que termine el tiempo de debounce.
  // Promise y setTimeout permiten esperar sin bloquear la ejecución del programa.
  await new Promise((r) => setTimeout(r, 90));

  // Comprueba que las tres llamadas consecutivas hayan producido
  // una sola ejecución de la función.
  assert.equal(conteo, 1);
});

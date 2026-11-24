
import test from 'node:test'; // Importa el módulo de pruebas integrado de Node.js.
import assert from 'node:assert/strict'; // Importa las funciones para comprobar resultados.
import { readFileSync, existsSync } from 'node:fs'; // Importa funciones para leer archivos y comprobar si existen.
import { resolve } from 'node:path'; // Importa la función para construir rutas de archivos.

// Obtiene la ruta raíz del proyecto para localizar los archivos que se van a comprobar.
const RAIZ = resolve(import.meta.dirname, '..');

// Lee el archivo JSON que contiene todos los comandos Git del proyecto.
// JSON.parse convierte el contenido de texto en una estructura de datos JavaScript.
const todosComandos = JSON.parse(
  readFileSync(resolve(RAIZ, 'src/data/commands-all.json'), 'utf8')
);


// Primera prueba: comprueba que exista la documentación de la taxonomía
// y que incluya los tres niveles de clasificación de comandos.
test('docs/taxonomia-comandos.md existe y documenta los 3 niveles', () => {

  // Construye la ruta del archivo de documentación.
  const ruta = resolve(RAIZ, 'docs/taxonomia-comandos.md');

  // Comprueba que el archivo exista.
  assert.equal(existsSync(ruta), true);

  // Lee el contenido del documento en formato UTF-8.
  const doc = readFileSync(ruta, 'utf8');

  // Comprueba que el documento incluya el nivel Esencial.
  assert.match(doc, /Esencial/);

  // Comprueba que el documento incluya el nivel Frecuente.
  assert.match(doc, /Frecuente/);

  // Comprueba que el documento incluya el nivel Ocasional.
  assert.match(doc, /Ocasional/);
});


// Segunda prueba: comprueba que los comandos originales definidos en recursos.js
// también estén incluidos en el archivo commands-all.json.
test('Todos los comandos originales de COMANDOS_GIT están migrados en commands-all.json sin pérdidas', () => {

  // Lee el código fuente de recursos.js como texto.
  const recursosSrc = readFileSync(resolve(RAIZ, 'src/recursos.js'), 'utf8');

  // Crea un Set con los nombres de los comandos que aparecen en el JSON.
  // Set almacena valores únicos y permite comprobar rápidamente si uno existe.
  const setMigrados = new Set(todosComandos.map((c) => c.comando));

  // Define una lista con los 15 comandos originales que deben conservarse.
  const originales = [
    'git clone <url>',
    'git switch -c <rama>',
    'git status -s',
    'git add .',
    'git commit -m "feat: mensaje"',
    'git push -u origin <rama>',
    'git fetch --all',
    'git pull --rebase origin develop',
    'git diff',
    'git log --oneline --graph -n 10',
    'git stash',
    'git revert <hash>',
    'git tag -a v1.0.0 -m "Release"',
    'git push origin v1.0.0',
    'git branch -d <rama>',
  ];

  // Recorre cada comando original para verificar que se encuentre
  // dentro del conjunto de comandos migrados.
  for (const cmd of originales) {

    // Comprueba que el comando esté presente.
    // Si falta, muestra un mensaje indicando cuál no se migró.
    assert.equal(setMigrados.has(cmd), true, `Falta comando migrado: ${cmd}`);
  }

  // Comprueba que recursos.js todavía contenga la declaración
  // de la constante COMANDOS_GIT.
  assert.match(recursosSrc, /export const COMANDOS_GIT/);
});


// Tercera prueba: comprueba que la función agruparPorNivel()
// distribuya los 40 comandos entre los tres niveles sin duplicarlos.
test('agruparPorNivel particiona los 40 comandos en Esencial, Frecuente y Ocasional sin duplicados', () => {

  // Ejecuta la función de clasificación con todos los comandos del JSON.
  const grupos = agruparPorNivel(todosComandos);

  // Comprueba que el grupo Esencial tenga al menos un comando.
  assert.equal(grupos.esencial.length > 0, true);

  // Comprueba que el grupo Frecuente tenga al menos un comando.
  assert.equal(grupos.frecuente.length > 0, true);

  // Comprueba que el grupo Ocasional tenga al menos un comando.
  assert.equal(grupos.ocasional.length > 0, true);

  // Suma los elementos de los tres grupos y comprueba que sean 40.
  assert.equal(grupos.esencial.length + grupos.frecuente.length + grupos.ocasional.length, 40);

  // Verifica deduplicación explícita:
  // crea una nueva lista agregando una segunda copia del primer comando.
  const conDuplicado = agruparPorNivel([...todosComandos, todosComandos[0]]);

  // Comprueba que, aunque se haya agregado un comando repetido,
  // el resultado final siga teniendo 40 elementos.
  assert.equal(
    conDuplicado.esencial.length + conDuplicado.frecuente.length + conDuplicado.ocasional.length,
    40
  );

  // Comprueba que los iconos definidos para cada nivel
  // mantengan exactamente el orden esperado.
  assert.deepEqual(
    NIVELES_CONFIG.map((n) => n.icono),
    ['🔥', '⚡', '🧊']
  );
});

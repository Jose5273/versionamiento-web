
import test from 'node:test'; // Importa el módulo de pruebas integrado de Node.js.
import assert from 'node:assert/strict'; // Importa las funciones para comprobar los resultados.
import { readFileSync, existsSync } from 'node:fs'; // Importa funciones para leer archivos y comprobar si existen.
import { resolve } from 'node:path'; // Importa la función para construir rutas de archivos.

// Obtiene la ruta raíz del proyecto.
// Se utiliza como referencia para localizar los archivos que se van a comprobar.
const RAIZ = resolve(import.meta.dirname, '..');

// Define una prueba para comprobar que los archivos principales de Recursos
// existan y que el módulo JavaScript tenga las importaciones y llamadas esperadas.
test('recursos.js y recursos.css existen y estan enlazados', () => {

  // Comprueba que el archivo JavaScript de la página Recursos exista.
  assert.equal(existsSync(resolve(RAIZ, 'src/recursos.js')), true);

  // Comprueba que la hoja de estilos específica de Recursos exista.
  assert.equal(existsSync(resolve(RAIZ, 'src/styles/recursos.css')), true);

  // Lee el contenido del archivo recursos.js como texto UTF-8.
  const codigo = readFileSync(resolve(RAIZ, 'src/recursos.js'), 'utf8');

  // Comprueba que el código contenga una referencia a recursos.css.
  assert.match(codigo, /recursos\.css/);

  // Comprueba que el módulo invoque la función que genera la barra de navegación.
  assert.match(codigo, /renderizarNavbar\(\)/);

  // Comprueba que el módulo invoque la función que genera el pie de página.
  assert.match(codigo, /renderizarFooter\(\)/);
});

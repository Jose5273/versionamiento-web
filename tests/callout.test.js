
// Importa el módulo de pruebas de Node.js.
// Permite definir pruebas automatizadas mediante test().
import test from 'node:test';

// Importa las funciones de comprobación.
// Permite verificar si los resultados cumplen las condiciones esperadas.
import assert from 'node:assert/strict';

// Importa la función para leer archivos del sistema.
import { readFileSync } from 'node:fs';

// Importa la función para construir rutas de archivos.
import { resolve } from 'node:path';

// Importa el componente que genera avisos informativos en HTML.
import { renderCallout } from '../src/components/Callout.js';

// Obtiene la ruta raíz del proyecto.
// Se utiliza como referencia para localizar los archivos que se van a comprobar.
const RAIZ = resolve(import.meta.dirname, '..');

// Primera prueba automatizada.
// Comprueba que renderCallout() genere correctamente las tres variantes
// de avisos y que escape caracteres HTML para evitar interpretaciones no deseadas.
test('renderCallout genera las 3 variantes (warning, danger, info) y escapa HTML', () => {

  // Genera un aviso de advertencia.
  // El título contiene etiquetas HTML como texto de prueba para comprobar
  // que el componente escape esos caracteres antes de insertarlos.
  const warn = renderCallout({ tipo: 'warning', titulo: 'Aviso <test>', texto: 'Contenido seguro' });

  // Comprueba que el HTML generado tenga las clases correspondientes
  // a la variante warning.
  assert.match(warn, /class="callout callout-warning"/);

  // Comprueba que el aviso utilice role="note".
  assert.match(warn, /role="note"/);

  // Comprueba que los símbolos < y > del título se conviertan
  // en entidades HTML para que se interpreten como texto.
  assert.match(warn, /Aviso &lt;test&gt;/);

  // Genera un aviso de tipo danger, destinado a información crítica.
  const danger = renderCallout({ tipo: 'danger', titulo: 'Crítico', texto: 'Riesgo' });

  // Comprueba que el HTML generado tenga las clases correspondientes
  // a la variante danger.
  assert.match(danger, /class="callout callout-danger"/);

  // Comprueba que el aviso crítico utilice role="alert".
  assert.match(danger, /role="alert"/);

  // Genera un aviso informativo de tipo info.
  const info = renderCallout({ tipo: 'info', titulo: 'Dato', texto: 'Nota' });

  // Comprueba que el HTML generado tenga las clases correspondientes
  // a la variante info.
  assert.match(info, /class="callout callout-info"/);

  // Comprueba que el aviso informativo utilice role="note".
  assert.match(info, /role="note"/);
});

// Segunda prueba automatizada.
// Comprueba que cinco advertencias importantes estén presentes
// en los archivos de las páginas Informe, Investigación y Recursos.
test('Las 5 advertencias críticas están integradas en informe.js, investigacion.js y recursos.js', () => {

  // Lee el contenido completo del archivo informe.js como texto UTF-8.
  const informe = readFileSync(resolve(RAIZ, 'src/informe.js'), 'utf8');

  // Lee el contenido completo del archivo investigacion.js como texto UTF-8.
  const investigacion = readFileSync(resolve(RAIZ, 'src/investigacion.js'), 'utf8');

  // Lee el contenido completo del archivo recursos.js como texto UTF-8.
  const recursos = readFileSync(resolve(RAIZ, 'src/recursos.js'), 'utf8');

  // Comprueba que Investigación incluya la advertencia sobre GitHub Free
  // y el uso de repositorios privados.
  assert.match(investigacion, /GitHub Free \+ repositorio privado/);

  // Comprueba que Investigación incluya una advertencia sobre git reset --hard.
  assert.match(investigacion, /git reset --hard/);

  // Comprueba que Informe incluya la advertencia relacionada
  // con el cambio de visibilidad de un repositorio de público a privado.
  assert.match(informe, /Público → privado/);

  // Comprueba que Informe incluya una referencia a pull_request_target.
  assert.match(informe, /pull_request_target/);

  // Comprueba que Recursos incluya la advertencia sobre runners grandes.
  assert.match(recursos, /Runners grandes/);
});

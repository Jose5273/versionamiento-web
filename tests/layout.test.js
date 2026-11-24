
import test from 'node:test'; // Importa el módulo de pruebas integrado de Node.js.
import assert from 'node:assert/strict'; // Importa las funciones para comprobar los resultados.
import { renderizarNavbar, renderizarFooter } from '../src/components/layout.js'; // Importa las funciones que generan la barra de navegación y el pie de página.


// Crea un elemento HTML simulado para utilizarlo en las pruebas.
// No crea elementos reales del navegador, sino objetos JavaScript
// que imitan algunas propiedades y métodos de los elementos HTML.
function crearElementoMock(tagName) {

  // Crea un conjunto para almacenar las clases CSS asignadas al elemento.
  const clases = new Set();

  // Devuelve un objeto que representa un elemento HTML simulado.
  return {
    // Guarda el nombre de la etiqueta en mayúsculas.
    tagName: tagName.toUpperCase(),

    // Propiedad que representa las clases CSS del elemento.
    className: '',

    // Propiedad que representa el contenido de texto del elemento.
    textContent: '',

    // Propiedad que representa la dirección de un enlace.
    href: '',

    // Arreglo que almacena los elementos hijos.
    children: [],

    // Simula algunas funciones de classList, utilizadas para administrar clases CSS.
    classList: {

      // Agrega una o varias clases al conjunto.
      add: (...items) => items.forEach((c) => clases.add(c)),

      // Comprueba si una clase está presente en el conjunto.
      contains: (c) => clases.has(c),
    },

    // Simula el método appendChild() del DOM.
    // Agrega un elemento hijo al arreglo children y lo devuelve.
    appendChild(hijo) {
      this.children.push(hijo);
      return hijo;
    },
  };
}


// Configura un entorno DOM simulado para ejecutar las pruebas.
// Recibe la ruta de la página que se quiere representar.
function configurarEntornoDom(pathname) {

  // Arreglo que almacenará los elementos agregados al principio del body.
  const prepended = [];

  // Arreglo que almacenará los elementos agregados al final del body.
  const appended = [];

  // Simula el objeto window del navegador.
  globalThis.window = {

    // Simula la ubicación actual del navegador.
    // pathname representa la ruta de la página abierta.
    location: { pathname },
  };

  // Simula algunas funciones y propiedades del objeto document.
  globalThis.document = {

    // Simula document.createElement().
    // Devuelve un elemento creado mediante crearElementoMock().
    createElement: (tag) => crearElementoMock(tag),

    // Simula el elemento body del documento.
    body: {

      // Simula la función prepend().
      // Registra los elementos que se agregan al principio del body.
      prepend: (el) => prepended.push(el),

      // Simula la función appendChild().
      // Registra los elementos que se agregan al final del body.
      appendChild: (el) => appended.push(el),
    },
  };

  // Devuelve los dos arreglos para que las pruebas
  // puedan comprobar qué elementos fueron agregados.
  return { prepended, appended };
}


// Primera prueba: comprueba que renderizarNavbar()
// genere los cinco enlaces de navegación y marque como activo
// el enlace correspondiente a la página actual.
test('renderizarNavbar genera los 5 enlaces y marca como activo el de la página actual', () => {

  // Configura el entorno simulado para representar la página Investigación.
  const { prepended } = configurarEntornoDom('/investigacion.html');

  // Ejecuta la función que genera la barra de navegación.
  renderizarNavbar();

  // Comprueba que se haya agregado un solo elemento al principio del body.
  assert.equal(prepended.length, 1);

  // Obtiene el elemento de navegación generado.
  const nav = prepended[0];

  // Comprueba que el elemento generado sea una etiqueta NAV.
  assert.equal(nav.tagName, 'NAV');

  // Comprueba que tenga asignada la clase CSS navbar.
  assert.equal(nav.className, 'navbar');

  // Obtiene el primer elemento hijo de NAV, que representa la lista de enlaces.
  const lista = nav.children[0];

  // Comprueba que la lista sea una etiqueta UL.
  assert.equal(lista.tagName, 'UL');

  // Comprueba que la lista contenga exactamente cinco elementos.
  assert.equal(lista.children.length, 5);

  // Recorre los elementos LI y obtiene el enlace A de cada uno.
  const enlaces = lista.children.map((li) => li.children[0]);

  // Compara los enlaces generados con los cinco resultados esperados.
  // Comprueba la dirección, el texto y si cada enlace tiene la clase activo.
  assert.deepEqual(
    enlaces.map((a) => ({ href: a.href, texto: a.textContent, activo: a.classList.contains('activo') })),
    [
      { href: 'index.html', texto: 'Inicio', activo: false },
      { href: 'informe.html', texto: 'Informe', activo: false },
      { href: 'investigacion.html', texto: 'Investigación', activo: true },
      { href: 'presentacion.html', texto: 'Presentación', activo: false },
      { href: 'recursos.html', texto: 'Recursos', activo: false },
    ]
  );
});


// Segunda prueba: comprueba que la página Inicio
// se marque como activa cuando el usuario accede mediante la ruta raíz "/".
test('renderizarNavbar marca index.html como activo cuando la ruta es la raíz "/"', () => {

  // Configura el entorno simulado para representar la ruta principal del sitio.
  const { prepended } = configurarEntornoDom('/');

  // Ejecuta la función que genera la barra de navegación.
  renderizarNavbar();

  // Obtiene los cinco enlaces de la lista de navegación.
  const enlaces = prepended[0].children[0].children.map((li) => li.children[0]);

  // Comprueba que el primer enlace corresponda a index.html.
  assert.equal(enlaces[0].href, 'index.html');

  // Comprueba que el enlace de Inicio tenga la clase activo.
  assert.equal(enlaces[0].classList.contains('activo'), true);
});


// Tercera prueba: comprueba que renderizarFooter()
// genere el pie institucional y lo agregue al final del body.
test('renderizarFooter agrega el pie institucional al body', () => {

  // Configura el entorno simulado para representar la página Inicio.
  const { appended } = configurarEntornoDom('/index.html');

  // Ejecuta la función que genera el pie de página.
  renderizarFooter();

  // Comprueba que se haya agregado exactamente un elemento al final del body.
  assert.equal(appended.length, 1);

  // Obtiene el elemento FOOTER generado.
  const footer = appended[0];

  // Comprueba que el elemento sea una etiqueta FOOTER.
  assert.equal(footer.tagName, 'FOOTER');

  // Comprueba que tenga asignada la clase CSS footer.
  assert.equal(footer.className, 'footer');

  // Comprueba que el texto institucional sea exactamente el esperado.
  assert.equal(footer.textContent, 'Universidad Central del Ecuador - Grupo 2');
});

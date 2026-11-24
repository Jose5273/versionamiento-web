
import test from 'node:test'; // Importa el módulo de pruebas integrado de Node.js.
import assert from 'node:assert/strict'; // Importa las funciones para verificar condiciones.
import { readFileSync, existsSync } from 'node:fs'; // Importa funciones para leer archivos y comprobar su existencia.
import { resolve } from 'node:path'; // Importa la función para construir rutas de archivos.

// Obtiene la ruta raíz del proyecto.
// Se utiliza como referencia para localizar las páginas, módulos y configuraciones.
const RAIZ = resolve(import.meta.dirname, '..');

// Define las cinco páginas HTML que se esperan encontrar en el proyecto.
// Cada objeto contiene el nombre del HTML, su módulo JavaScript de entrada y su título.
const PAGINAS_ESPERADAS = [
  { html: 'index.html', script: '/src/main.js', titulo: 'Inicio' },
  { html: 'informe.html', script: '/src/informe.js', titulo: 'Informe' },
  { html: 'investigacion.html', script: '/src/investigacion.js', titulo: 'Investigación' },
  { html: 'presentacion.html', script: '/src/presentacion.js', titulo: 'Presentación' },
  { html: 'recursos.html', script: '/src/recursos.js', titulo: 'Recursos' },
];


// Primera prueba: comprueba que existan todos los archivos HTML
// y sus respectivos módulos JavaScript de entrada.
test('Todos los archivos HTML y scripts de entrada existen', () => {

  // Recorre cada una de las cinco páginas esperadas.
  // Desestructura cada objeto para obtener su HTML y su script.
  for (const { html, script } of PAGINAS_ESPERADAS) {

    // Construye la ruta completa del archivo HTML.
    const rutaHtml = resolve(RAIZ, html);

    // Construye la ruta completa del módulo JavaScript.
    // slice(1) elimina la primera barra de la ruta del script.
    const rutaScript = resolve(RAIZ, script.slice(1));

    // Comprueba que el archivo HTML exista.
    // Si falta, muestra el nombre del archivo.
    assert.equal(existsSync(rutaHtml), true, `Falta el archivo ${html}`);

    // Comprueba que el módulo JavaScript exista.
    // Si falta, muestra la ruta del módulo.
    assert.equal(existsSync(rutaScript), true, `Falta el módulo ${script}`);
  }
});


// Segunda prueba: comprueba que cada página HTML tenga
// la estructura básica esperada para funcionar como parte de una aplicación MPA.
test('Cada página HTML cumple con la estructura MPA esperada', () => {

  // Recorre todas las páginas definidas en PAGINAS_ESPERADAS.
  // Obtiene el nombre del HTML, su script y el título correspondiente.
  for (const { html, script, titulo } of PAGINAS_ESPERADAS) {

    // Lee todo el contenido del archivo HTML como texto UTF-8.
    const contenido = readFileSync(resolve(RAIZ, html), 'utf8');

    // Comprueba que el documento declare el idioma español.
    // La expresión i permite aceptar diferencias entre mayúsculas y minúsculas.
    assert.match(contenido, /<html lang="es">/i, `${html} debe declarar lang="es"`);

    // Comprueba que exista la etiqueta meta viewport.
    // Esta etiqueta permite configurar la visualización en dispositivos móviles.
    assert.match(contenido, /<meta name="viewport"/i, `${html} debe incluir meta viewport`);

    // Comprueba que el título de la página incluya el nombre esperado.
    // Se construye una expresión regular utilizando el título de cada página.
    assert.match(contenido, new RegExp(`<title>.*${titulo}.*</title>`, 'i'), `${html} debe incluir "${titulo}" en <title>`);

    // Comprueba que exista el elemento principal con la clase container.
    assert.match(contenido, /<main class="container">/i, `${html} debe tener <main class="container">`);

    // Comprueba que exista la etiqueta de cierre del elemento main.
    assert.match(contenido, /<\/main>/i, `${html} debe cerrar </main>`);

    // Comprueba que la página importe el módulo JavaScript correspondiente.
    // La expresión regular se construye utilizando la ruta del script esperada.
    assert.match(
      contenido,
      new RegExp(`<script type="module" src="${script}"><\/script>`),
      `${html} debe importar ${script}`
    );
  }
});


// Tercera prueba: comprueba que Vite tenga registradas
// las cinco páginas HTML en su configuración de entrada.
test('vite.config.js registra las 5 páginas en rollupOptions.input', () => {

  // Lee el contenido del archivo de configuración de Vite.
  const viteConfig = readFileSync(resolve(RAIZ, 'vite.config.js'), 'utf8');

  // Recorre las cinco páginas que deberían estar registradas.
  for (const { html } of PAGINAS_ESPERADAS) {

    // Comprueba que el nombre de cada HTML aparezca en vite.config.js.
    // Esto busca verificar que esté contemplado en rollupOptions.input.
    assert.match(
      viteConfig,
      new RegExp(`['"]${html}['"]`),
      `vite.config.js debe incluir ${html} en rollupOptions.input`
    );
  }
});


// Cuarta prueba: comprueba que determinados módulos JavaScript
// importen sus propias hojas CSS y los estilos compartidos.
// También verifica que utilicen el navbar y el footer comunes.
test('Los módulos implementados importan su CSS propio y el layout compartido', () => {

  // Define los tres módulos que se van a comprobar.
  // Cada objeto indica la ruta del módulo y su hoja de estilos específica.
  const modulosImplementados = [
    { ruta: 'src/main.js', css: './styles/inicio.css' },
    { ruta: 'src/informe.js', css: './styles/informe.css' },
    { ruta: 'src/investigacion.js', css: './styles/investigacion.css' },
  ];

  // Recorre los módulos definidos en la lista anterior.
  for (const { ruta, css } of modulosImplementados) {

    // Lee el contenido del módulo JavaScript.
    const codigo = readFileSync(resolve(RAIZ, ruta), 'utf8');

    // Construye la ruta de la hoja CSS correspondiente.
    // replace('./', '') elimina el prefijo ./ para construir la ruta.
    const rutaCss = resolve(RAIZ, 'src', css.replace('./', ''));

    // Comprueba que el archivo CSS específico exista.
    assert.equal(existsSync(rutaCss), true, `Falta la hoja de estilos ${css}`);

    // Comprueba que el módulo importe la hoja de estilos global style.css.
    assert.match(codigo, /import '\.\/styles\/style\.css';/, `${ruta} debe importar style.css`);

    // Comprueba que el módulo importe su propia hoja de estilos.
    // Se construye una expresión regular a partir de la ruta CSS esperada.
    assert.match(codigo, new RegExp(`import '${css.replace('.', '\\.')}';`), `${ruta} debe importar ${css}`);

    // Comprueba que el módulo invoque la función que genera la barra de navegación.
    assert.match(codigo, /renderizarNavbar\(\)/, `${ruta} debe llamar a renderizarNavbar()`);

    // Comprueba que el módulo invoque la función que genera el pie de página.
    assert.match(codigo, /renderizarFooter\(\)/, `${ruta} debe llamar a renderizarFooter()`);
  }
});

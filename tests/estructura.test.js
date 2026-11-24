import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const RAIZ = resolve(import.meta.dirname, '..');

const PAGINAS_ESPERADAS = [
  { html: 'index.html', script: '/src/main.js', titulo: 'Inicio' },
  { html: 'informe.html', script: '/src/informe.js', titulo: 'Informe' },
  { html: 'investigacion.html', script: '/src/investigacion.js', titulo: 'Investigación' },
  { html: 'presentacion.html', script: '/src/presentacion.js', titulo: 'Presentación' },
  { html: 'recursos.html', script: '/src/recursos.js', titulo: 'Recursos' },
];

test('Todos los archivos HTML y scripts de entrada existen', () => {
  for (const { html, script } of PAGINAS_ESPERADAS) {
    const rutaHtml = resolve(RAIZ, html);
    const rutaScript = resolve(RAIZ, script.slice(1));

    assert.equal(existsSync(rutaHtml), true, `Falta el archivo ${html}`);
    assert.equal(existsSync(rutaScript), true, `Falta el módulo ${script}`);
  }
});

test('Cada página HTML cumple con la estructura MPA esperada', () => {
  for (const { html, script, titulo } of PAGINAS_ESPERADAS) {
    const contenido = readFileSync(resolve(RAIZ, html), 'utf8');

    assert.match(contenido, /<html lang="es">/i, `${html} debe declarar lang="es"`);
    assert.match(contenido, /<meta name="viewport"/i, `${html} debe incluir meta viewport`);
    assert.match(contenido, new RegExp(`<title>.*${titulo}.*</title>`, 'i'), `${html} debe incluir "${titulo}" en <title>`);
    assert.match(contenido, /<main class="container">/i, `${html} debe tener <main class="container">`);
    assert.match(contenido, /<\/main>/i, `${html} debe cerrar </main>`);
    assert.match(
      contenido,
      new RegExp(`<script type="module" src="${script}"><\/script>`),
      `${html} debe importar ${script}`
    );
  }
});

test('vite.config.js registra las 5 páginas en rollupOptions.input', () => {
  const viteConfig = readFileSync(resolve(RAIZ, 'vite.config.js'), 'utf8');

  for (const { html } of PAGINAS_ESPERADAS) {
    assert.match(
      viteConfig,
      new RegExp(`['"]${html}['"]`),
      `vite.config.js debe incluir ${html} en rollupOptions.input`
    );
  }
});

test('Los módulos implementados importan su CSS propio y el layout compartido', () => {
  const modulosImplementados = [
    { ruta: 'src/main.js', css: './styles/inicio.css' },
    { ruta: 'src/informe.js', css: './styles/informe.css' },
    { ruta: 'src/investigacion.js', css: './styles/investigacion.css' },
  ];

  for (const { ruta, css } of modulosImplementados) {
    const codigo = readFileSync(resolve(RAIZ, ruta), 'utf8');
    const rutaCss = resolve(RAIZ, 'src', css.replace('./', ''));

    assert.equal(existsSync(rutaCss), true, `Falta la hoja de estilos ${css}`);
    assert.match(codigo, /import '\.\/styles\/style\.css';/, `${ruta} debe importar style.css`);
    assert.match(codigo, new RegExp(`import '${css.replace('.', '\\.')}';`), `${ruta} debe importar ${css}`);
    assert.match(codigo, /renderizarNavbar\(\)/, `${ruta} debe llamar a renderizarNavbar()`);
    assert.match(codigo, /renderizarFooter\(\)/, `${ruta} debe llamar a renderizarFooter()`);
  }
});

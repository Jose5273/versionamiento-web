import './styles/style.css';
import './styles/presentacion.css';
import { renderizarNavbar, renderizarFooter } from './components/layout.js';

// num: número de sección · seccion: nombre corto · clase: estilo especial · html: contenido
const LAMINAS = [
  {
    num: 'G2', seccion: 'Arquitectura de Software', clase: 'portada',
    html: `
      <h1>Gestión de versionamiento</h1>
      <p class="destacada">GitHub y GitLab en un proyecto real, construido en equipo.</p>
      <div class="integrantes">
        <span>Jhon Ávila</span><span>Alexander Chicango</span><span>José Cuadro</span><span>Bruno Sampedro</span>
      </div>`,
  },
  {
    num: '00', seccion: 'Contenido',
    html: `
      <h2>Lo que vamos a ver</h2>
      <div class="dos">
        <ol>
          <li>Contexto y caso práctico</li>
          <li>Diferencias de modelo</li>
          <li>Despliegue en cada plataforma</li>
          <li>Reglas y demostración</li>
        </ol>
        <ol start="5">
          <li>Variables y comandos</li>
          <li>Cuentas educativas</li>
          <li>Resultados y conclusiones</li>
        </ol>
      </div>`,
  },
  {
    num: '01', seccion: 'Contexto',
    html: `
      <h2>Git es el estándar</h2>
      <div class="cifras">
        <div><strong>93 %</strong><span>de los desarrolladores usa Git</span></div>
        <div><strong>180 M+</strong><span>desarrolladores en GitHub</span></div>
        <div><strong>2</strong><span>plataformas, un mismo proyecto</span></div>
      </div>`,
  },
  {
    num: '01', seccion: 'Caso práctico',
    html: `
      <h2>Este sitio es el ejemplo</h2>
      <div class="flujo"><span>feature/…</span><i>→</i><span>develop</span><i>→</i><span>test</span><i>→</i><span>main</span></div>
      <ul>
        <li>Cada integrante trabajó una página en su propia rama.</li>
        <li>Todo cambio entra por pull request y lo revisa otro integrante.</li>
        <li>GitHub es el repositorio principal; GitLab, su réplica.</li>
      </ul>`,
  },
  {
    num: '02', seccion: 'Diferencias',
    html: `
      <h2>Mismo Git, distinto modelo</h2>
      <table>
        <thead><tr><th></th><th><span class="gh">GitHub</span></th><th><span class="gl">GitLab</span></th></tr></thead>
        <tbody>
          <tr><td>CI/CD</td><td>Eventos y acciones</td><td>Etapas y plantillas</td></tr>
          <tr><td>Ejecución</td><td>Máquina virtual</td><td>Contenedor</td></tr>
          <tr><td>Organización</td><td>Organizaciones</td><td>Grupos con herencia</td></tr>
          <tr><td>Instalación propia</td><td>De pago</td><td>Gratuita</td></tr>
        </tbody>
      </table>`,
  },
  {
    num: '03', seccion: 'Despliegue',
    html: `
      <h2>Réplica automática en GitLab</h2>
      <pre><code>on:
  push:
    branches: [main, develop, test]
jobs:
  sync:
    steps:
      - uses: actions/checkout@v4
      - run: git push gitlab --force --prune ...</code></pre>`,
  },
  {
    num: '03', seccion: 'Despliegue',
    html: `
      <h2><span class="gh">GitHub</span> Actions hacia Pages</h2>
      <pre><code>jobs:
  validate:
    steps:
      - run: npx html-validate "public/**/*.html"
  deploy:
    needs: validate
    environment: github-pages
    steps:
      - uses: actions/deploy-pages@v4</code></pre>`,
  },
  {
    num: '03', seccion: 'Despliegue',
    html: `
      <h2><span class="gl">GitLab</span> CI hacia Pages</h2>
      <pre><code>stages: [validate, deploy]
pages:
  stage: deploy
  artifacts:
    paths: [public]
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH</code></pre>`,
  },
  {
    num: '04', seccion: 'Reglas',
    html: `
      <h2>Nadie fusiona solo</h2>
      <table>
        <thead><tr><th>Rama</th><th>Regla</th></tr></thead>
        <tbody>
          <tr><td><code>main</code></td><td>Pull request con dos aprobaciones</td></tr>
          <tr><td><code>test</code></td><td>Pull request con una aprobación</td></tr>
          <tr><td><code>develop</code></td><td>Pull request con una aprobación</td></tr>
        </tbody>
      </table>`,
  },
  {
    num: '04', seccion: 'Demostración',
    html: `
      <h2>Un cambio roto no entra</h2>
      <div class="bloqueado">
        <ul>
          <li>Quitamos el texto alternativo de una imagen.</li>
          <li>La validación falló.</li>
          <li>GitHub bloqueó la fusión.</li>
        </ul>
        <div class="sello">Merge bloqueado</div>
      </div>`,
  },
  {
    num: '05', seccion: 'Variables',
    html: `
      <h2>La configuración vive fuera del código</h2>
      <table>
        <thead><tr><th></th><th><span class="gh">GitHub</span></th><th><span class="gl">GitLab</span></th></tr></thead>
        <tbody>
          <tr><td>Datos sensibles</td><td>Secrets</td><td>Masked</td></tr>
          <tr><td>Producción</td><td>Entornos con revisores</td><td>Variables protegidas</td></tr>
          <tr><td>Predefinidas</td><td><code>GITHUB_SHA</code></td><td><code>CI_COMMIT_SHORT_SHA</code></td></tr>
        </tbody>
      </table>`,
  },
  {
    num: '05', seccion: 'Comandos',
    html: `
      <h2>El día a día en Git</h2>
      <pre><code>git switch -c feature/informe
git commit -m "feat(informe): agrega contenido"
git push -u origin feature/informe
git pull origin develop
git revert HEAD
git tag -a v1.0.0 -m "entrega"</code></pre>`,
  },
  {
    num: '06', seccion: 'Cuentas educativas',
    html: `
      <h2>El correo institucional pesa distinto</h2>
      <div class="dos">
        <div class="bloque gh-borde">
          <h3>GitHub Education</h3>
          <ul><li>Lo solicita el estudiante</li><li>Reglas en repositorios privados</li><li>Copilot premium y Codespaces</li></ul>
        </div>
        <div class="bloque gl-borde">
          <h3>GitLab for Education</h3>
          <ul><li>Lo solicita la universidad</li><li>Ultimate con usuarios ilimitados</li><li>50 000 minutos de CI al mes</li></ul>
        </div>
      </div>`,
  },
  {
    num: '07', seccion: 'Resultados',
    html: `
      <h2>Tiempo hasta ver el cambio publicado</h2>
      <div class="dos">
        <div class="bloque gh-borde"><div class="cifras"><div><strong>49 s</strong><span>GitHub Pages</span></div></div></div>
        <div class="bloque gl-borde"><div class="cifras"><div><strong>60 s</strong><span>GitLab Pages</span></div></div></div>
      </div>`,
  },
  {
    num: '07', seccion: 'Hallazgos',
    html: `
      <h2>Lo que aprendimos en el camino</h2>
      <ul>
        <li>Una validación puede pasar por alto errores hasta que se prueba.</li>
        <li>GitHub Pages y GitLab Pages usan rutas base distintas.</li>
        <li>GitLab Pages tarda unos segundos en mostrar la misma versión en todos sus servidores.</li>
        <li>El código se replica con un push; los pipelines no.</li>
      </ul>`,
  },
  {
    num: '07', seccion: 'Decisión',
    html: `
      <h2>¿Cuál elegir?</h2>
      <div class="dos">
        <div class="bloque gh-borde">
          <h3>GitHub</h3>
          <ul><li>Proyectos académicos y portafolio</li><li>Comunidad e integraciones</li></ul>
        </div>
        <div class="bloque gl-borde">
          <h3>GitLab</h3>
          <ul><li>Servidores propios</li><li>Todo el ciclo en una herramienta</li></ul>
        </div>
      </div>`,
  },
  {
    num: '07', seccion: 'Conclusiones',
    html: `
      <h2>Para llevar</h2>
      <ol>
        <li>Las dos plataformas resuelven lo mismo con modelos distintos.</li>
        <li>Las reglas hacen que la revisión sea obligatoria.</li>
        <li>Una regla solo protege si se prueba.</li>
      </ol>`,
  },
  {
    num: '—', seccion: 'Referencias',
    html: `
      <h2>Referencias</h2>
      <ul>
        <li>Forsgren, Humble y Kim (2018). <em>Accelerate</em>.</li>
        <li>GitHub Docs y GitLab Docs.</li>
        <li>GitHub (2025). <em>Octoverse</em>. Stack Overflow (2022). <em>Developer Survey</em>.</li>
      </ul>`,
  },
  {
    num: 'G2', seccion: 'Gracias', clase: 'portada cierre',
    html: `
      <h2>¿Preguntas?</h2>
      <p class="destacada">Grupo 2 · Gestión de versionamiento</p>`,
  },
];

document.addEventListener('DOMContentLoaded', () => {
  renderizarNavbar();
  renderizarFooter();

  const contenedor = document.querySelector('main.container');
  contenedor.classList.add('presentacion');

  contenedor.innerHTML = `
    ${LAMINAS.map((lamina, i) => `
      <section class="lamina ${lamina.clase || ''}" id="lamina-${i + 1}" aria-label="Lámina ${i + 1} de ${LAMINAS.length}" hidden>
        <p class="marca"><b>${lamina.num}</b>${lamina.seccion}</p>
        ${lamina.html}
        <span class="pagina">${i + 1} / ${LAMINAS.length}</span>
      </section>`).join('')}
    <div class="controles">
      <button type="button" id="anterior" aria-label="Lámina anterior">←</button>
      <output id="contador" aria-live="polite"></output>
      <button type="button" id="siguiente" aria-label="Lámina siguiente">→</button>
      <button type="button" class="texto" id="completa">Pantalla completa</button>
    </div>`;

  const laminas = contenedor.querySelectorAll('.lamina');
  const contador = contenedor.querySelector('#contador');
  let actual = 0;

  function mostrar(n) {
    actual = Math.max(0, Math.min(laminas.length - 1, n));
    laminas.forEach((lamina, i) => { lamina.hidden = i !== actual; });
    contador.textContent = `${actual + 1} / ${laminas.length}`;
  }

  function pantallaCompleta() {
    if (document.fullscreenElement) document.exitFullscreen();
    else contenedor.requestFullscreen();
  }

  contenedor.querySelector('#anterior').addEventListener('click', () => mostrar(actual - 1));
  contenedor.querySelector('#siguiente').addEventListener('click', () => mostrar(actual + 1));
  contenedor.querySelector('#completa').addEventListener('click', pantallaCompleta);

  document.addEventListener('keydown', (e) => {
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); mostrar(actual + 1); }
    if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); mostrar(actual - 1); }
    if (e.key === 'Home') mostrar(0);
    if (e.key === 'End') mostrar(laminas.length - 1);
    if (e.key === 'f' || e.key === 'F') pantallaCompleta();
  });

  mostrar(0);
});

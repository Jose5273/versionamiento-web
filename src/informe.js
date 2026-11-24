import './styles/style.css';
import './styles/informe.css';
import './styles/branch-models.css';
import './styles/conventional-chart.css';
import './styles/callout.css';
import { renderizarNavbar, renderizarFooter } from './components/layout.js';
import branchModelsData from './data/branch-models.json';
import conventionalData from './data/conventional-commits.json';
import { renderBranchModelBadges } from './components/BranchModelBadges.js';
import { renderConventionalChart } from './components/ConventionalChart.js';
import { renderCallout } from './components/Callout.js';

// Enlaces usados en la página (se definen una sola vez para no repetirlos)
const REPO_GRUPO = 'https://github.com/sampedro2002/versionamiento-web';
const SITIO_GH = 'https://versionamiento-web-github.pages.dev/';
const SITIO_GL = 'https://versionamiento-web-gitlab.pages.dev/';
const PROTOTIPO = 'https://github.com/jhon-avila135/investigacion-versionamiento';
const PROTOTIPO_SITIO_GH = 'https://jhon-avila135.github.io/investigacion-versionamiento/';
const PROTOTIPO_SITIO_GL = 'https://grupo2-versionamiento-uce.gitlab.io/investigacion-versionamiento/';

document.addEventListener('DOMContentLoaded', () => {
  renderizarNavbar();
  renderizarFooter();

  const contenedor = document.querySelector('main.container');
  contenedor.classList.add('informe');

  contenedor.innerHTML = `
    <header class="encabezado-informe">
      <h1>Informe del proyecto</h1>
      <p>Gestión de versionamiento con GitHub y GitLab · Arquitectura de Software · Grupo 2</p>
    </header>

    <nav class="indice" aria-label="Contenido del informe">
      <p>Contenido</p>
      <ol>
        <li><a href="#resumen">Resumen</a></li>
        <li><a href="#objetivos">Objetivos</a></li>
        <li><a href="#arquitectura">Arquitectura del despliegue</a></li>
        <li><a href="#flujo">Flujo de trabajo en Git</a></li>
        <li><a href="#reglas">Reglas de protección</a></li>
        <li><a href="#variables">Variables y secretos</a></li>
        <li><a href="#mediciones">Mediciones</a></li>
        <li><a href="#hallazgos">Hallazgos</a></li>
        <li><a href="#enlaces">Enlaces</a></li>
      </ol>
    </nav>

    <section id="resumen">
      <h2><span class="num">1.</span>Resumen</h2>
      <p>El proyecto compara GitHub y GitLab desde la práctica. El grupo construye un sitio web en un repositorio compartido: cada integrante desarrolla una página en su propia rama y la integra mediante pull requests. El repositorio se replica en GitLab y cada plataforma publica su versión del sitio.</p>
      <p>Como antecedente, se desarrolló un prototipo individual en el que se configuraron pipelines de validación y despliegue, reglas de protección de rama y mediciones del tiempo de publicación. Sus resultados se incluyen en este informe como evidencia.</p>
    </section>

    <section id="objetivos">
      <h2><span class="num">2.</span>Objetivos</h2>
      <h3>Objetivo general</h3>
      <p>Comparar la gestión de versiones y el despliegue continuo en GitHub y GitLab mediante un proyecto desarrollado en equipo.</p>
      <h3>Objetivos específicos</h3>
      <ul>
        <li>Aplicar una estrategia de ramas con integración por pull requests.</li>
        <li>Replicar el repositorio en GitLab y publicar el sitio desde ambas plataformas.</li>
        <li>Proteger las ramas principales y verificar que la protección bloquea cambios inválidos.</li>
        <li>Medir el tiempo de publicación en cada plataforma.</li>
      </ul>
    </section>

    <section id="arquitectura">
      <h2><span class="num">3.</span>Arquitectura del despliegue</h2>
      <p>GitHub es el repositorio principal. Cada aporte pasa de una rama de trabajo a <code>develop</code>, luego a <code>test</code> y finalmente a <code>main</code>. Un workflow de GitHub Actions replica las ramas en GitLab, y Cloudflare Pages publica el sitio a partir de cada repositorio.</p>
      <figure>
        <svg viewBox="0 0 760 240" role="img" aria-labelledby="fig-flujo">
          <title id="fig-flujo">Recorrido de un cambio desde la rama de trabajo hasta los sitios publicados</title>
          <defs>
            <marker id="punta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" fill="#1a1d23"></path>
            </marker>
          </defs>
          <g font-family="system-ui, Segoe UI, sans-serif" font-size="13" fill="#1a1d23">
            <rect x="15" y="90" width="115" height="54" rx="4" fill="#fff" stroke="#1a1d23"></rect>
            <text x="72" y="113" text-anchor="middle">feature/…</text>
            <text x="72" y="131" text-anchor="middle" fill="#5b6470">rama de trabajo</text>

            <rect x="160" y="90" width="95" height="54" rx="4" fill="#eef3fe" stroke="#2563eb"></rect>
            <text x="207" y="113" text-anchor="middle">develop</text>
            <text x="207" y="131" text-anchor="middle" fill="#5b6470">integración</text>

            <rect x="285" y="90" width="95" height="54" rx="4" fill="#eef3fe" stroke="#2563eb"></rect>
            <text x="332" y="113" text-anchor="middle">test</text>
            <text x="332" y="131" text-anchor="middle" fill="#5b6470">pruebas</text>

            <rect x="410" y="90" width="95" height="54" rx="4" fill="#eef3fe" stroke="#2563eb"></rect>
            <text x="457" y="113" text-anchor="middle">main</text>
            <text x="457" y="131" text-anchor="middle" fill="#5b6470">producción</text>

            <rect x="560" y="20" width="185" height="54" rx="4" fill="#fff" stroke="#1a1d23"></rect>
            <text x="652" y="43" text-anchor="middle">Cloudflare Pages</text>
            <text x="652" y="61" text-anchor="middle" fill="#5b6470">sitio desde GitHub</text>

            <rect x="560" y="160" width="185" height="54" rx="4" fill="#fff" stroke="#1a1d23"></rect>
            <text x="652" y="183" text-anchor="middle">GitLab (réplica)</text>
            <text x="652" y="201" text-anchor="middle" fill="#5b6470">Cloudflare Pages</text>

            <g stroke="#1a1d23" fill="none" marker-end="url(#punta)">
              <line x1="130" y1="117" x2="158" y2="117"></line>
              <line x1="255" y1="117" x2="283" y2="117"></line>
              <line x1="380" y1="117" x2="408" y2="117"></line>
              <path d="M505 105 L530 105 L530 47 L558 47"></path>
              <path d="M505 129 L530 129 L530 187 L558 187"></path>
            </g>
            <text x="145" y="80" font-size="11" fill="#5b6470">pull request</text>
            <text x="536" y="150" font-size="11" fill="#5b6470">sync-gitlab.yml</text>
          </g>
        </svg>
        <figcaption>Figura 1. Recorrido de un cambio. Cada paso entre ramas se realiza mediante pull request.</figcaption>
      </figure>
    </section>

    <section id="flujo">
      <h2><span class="num">4.</span>Flujo de trabajo en Git</h2>
      <p>El grupo aplica una versión simplificada de GitFlow. Cada integrante crea su rama desde <code>develop</code>, registra sus cambios con mensajes de Conventional Commits y solicita la integración mediante un pull request.</p>
      <div id="slot-badges-ramas"></div>
      <div class="tabla">
        <table>
          <caption>Tabla 1. Ramas del repositorio y su función.</caption>
          <thead>
            <tr><th scope="col">Rama</th><th scope="col">Función</th><th scope="col">Recibe cambios de</th></tr>
          </thead>
          <tbody>
            <tr><td><code>feature/…</code></td><td>Desarrollo de una página o función</td><td>El integrante responsable</td></tr>
            <tr><td><code>develop</code></td><td>Integración de los aportes del equipo</td><td>Ramas de trabajo, por pull request</td></tr>
            <tr><td><code>test</code></td><td>Revisión del sitio completo</td><td><code>develop</code></td></tr>
            <tr><td><code>main</code></td><td>Versión publicada</td><td><code>test</code></td></tr>
          </tbody>
        </table>
      </div>
      <div class="tabla">
        <table>
          <caption>Tabla 2. Tipos de commit utilizados (Conventional Commits).</caption>
          <thead>
            <tr><th scope="col">Tipo</th><th scope="col">Uso</th><th scope="col">Ejemplo</th></tr>
          </thead>
          <tbody>
            <tr id="cc-feat"><td><code>feat</code></td><td>Nueva funcionalidad o contenido</td><td><code>feat(informe): agrega el flujo de ramas</code></td></tr>
            <tr id="cc-fix"><td><code>fix</code></td><td>Corrección de un error</td><td><code>fix(informe): corrige un enlace</code></td></tr>
            <tr id="cc-docs"><td><code>docs</code></td><td>Documentación</td><td><code>docs: actualiza el README</code></td></tr>
            <tr id="cc-style"><td><code>style</code></td><td>Estilos sin cambio de lógica</td><td><code>style(informe): ajusta las tablas</code></td></tr>
            <tr id="cc-ci"><td><code>ci</code></td><td>Pipelines y automatización</td><td><code>ci: agrega validación en pull requests</code></td></tr>
            <tr id="cc-test"><td><code>test</code></td><td>Pruebas automatizadas</td><td><code>test(web): agrega pruebas unitarias</code></td></tr>
            <tr id="cc-chore"><td><code>chore</code></td><td>Tareas de mantenimiento</td><td><code>chore: actualiza .gitignore</code></td></tr>
          </tbody>
        </table>
      </div>
      <div id="slot-conventional-chart"></div>
    </section>

    <section id="reglas">
      <h2><span class="num">5.</span>Reglas de protección</h2>
      <p>Las reglas de protección impiden que un cambio llegue a una rama importante sin revisión. El repositorio tiene configurados dos rulesets: uno para <code>main</code> y otro para <code>test</code> y <code>develop</code>.</p>
      <div class="tabla">
        <table>
          <caption>Tabla 3. Reglas configuradas por rama.</caption>
          <thead>
            <tr><th scope="col">Rama</th><th scope="col">Regla</th><th scope="col">Estado</th></tr>
          </thead>
          <tbody>
            <tr><td><code>main</code></td><td>Pull request con dos aprobaciones; las aprobaciones se invalidan si llegan nuevos commits; sin force push ni borrado</td><td><span class="estado hecho">Activa</span></td></tr>
            <tr><td><code>test</code></td><td>Pull request con una aprobación; sin force push ni borrado</td><td><span class="estado hecho">Activa</span></td></tr>
            <tr><td><code>develop</code></td><td>Pull request con una aprobación; sin force push ni borrado</td><td><span class="estado hecho">Activa</span></td></tr>
            <tr><td>Todas</td><td>Compilación del sitio aprobada antes de fusionar (check obligatorio)</td><td><span class="estado propuesta">En incorporación</span></td></tr>
          </tbody>
        </table>
      </div>
      <p>Con estas reglas ningún integrante puede integrar su propio cambio sin la revisión de otro, y la rama de producción exige el acuerdo de dos personas.</p>
      <div class="destacado">
        <p><strong>Evidencia del prototipo.</strong> En el <a href="${PROTOTIPO}/pull/3" target="_blank" rel="noopener">PR #3</a> se eliminó a propósito el texto alternativo de una imagen: la validación falló y GitHub bloqueó la fusión. El mismo mecanismo de check obligatorio se incorpora a este repositorio.</p>
      </div>
      ${renderCallout({
        tipo: 'danger',
        titulo: 'Público → privado desactiva protección sin avisar',
        texto:
          'Si cambias un repositorio público a privado en GitHub Free, las reglas de protección de ramas se desactivan silenciosamente hasta contar con GitHub Pro o GitHub Education.',
      })}
    </section>

    <section id="variables">
      <h2><span class="num">6.</span>Variables y secretos</h2>
      <p>La configuración del despliegue se guarda en la plataforma, no en el código.</p>
      <dl>
        <dt>Secreto GITLAB_TOKEN (repositorio del grupo)</dt>
        <dd>Lo usa el workflow <code>sync-gitlab.yml</code> para autenticarse en GitLab y replicar las ramas. Está guardado como secreto de GitHub Actions: se cifra y no aparece en los registros.</dd>
        <dt>Variable ENTORNO (prototipo)</dt>
        <dd>El pipeline la escribe en el pie de página junto con el commit publicado. En GitLab se configuró como protegida, por lo que solo existe en ramas protegidas.</dd>
        <dt>Variables predefinidas</dt>
        <dd>Cada plataforma ofrece datos del pipeline sin configuración: <code>GITHUB_SHA</code> en GitHub y <code>CI_COMMIT_SHORT_SHA</code> en GitLab.</dd>
      </dl>
      ${renderCallout({
        tipo: 'danger',
        titulo: 'Riesgo crítico con pull_request_target',
        texto:
          'El evento pull_request_target se ejecuta con permisos de escritura y acceso a secretos del repositorio base; nunca hagas checkout ni ejecutes código no verificado de un fork dentro de ese trigger.',
      })}
    </section>

    <section id="mediciones">
      <h2><span class="num">7.</span>Mediciones</h2>
      <p>En el prototipo se midió el tiempo de entrega: desde que se aprueba un cambio hasta que el sitio publicado muestra la nueva versión. Es una de las métricas DORA (Forsgren, Humble y Kim, 2018).</p>
      <div class="tabla">
        <table>
          <caption>Tabla 4. Tiempos medidos en el prototipo.</caption>
          <thead>
            <tr><th scope="col">Plataforma</th><th scope="col" class="cifra">Duración del pipeline</th><th scope="col" class="cifra">Tiempo de entrega</th></tr>
          </thead>
          <tbody>
            <tr><td>GitHub Pages</td><td class="cifra">35,5 s (n = 6)</td><td class="cifra">49,4 s (n = 7)</td></tr>
            <tr><td>GitLab Pages</td><td class="cifra">47,5 s (n = 2)</td><td class="cifra">60 s (n = 1)</td></tr>
          </tbody>
        </table>
      </div>
      <p class="nota">La muestra todavía es pequeña. La meta es reunir 20 mediciones por plataforma con los aportes de todo el grupo.</p>
    </section>

    <section id="hallazgos">
      <h2><span class="num">8.</span>Hallazgos</h2>
      <dl>
        <dt>Validación incompleta</dt>
        <dd>El preset estándar de html-validate no revisa accesibilidad; una imagen sin texto alternativo aprobaba la validación hasta que se probó la regla.</dd>
        <dt>Propagación de GitLab Pages</dt>
        <dd>Durante algunos segundos después de publicar, el sitio respondió con la versión nueva o la anterior según el servidor.</dd>
        <dt>Visibilidad heredada en GitLab</dt>
        <dd>Un proyecto público no puede pertenecer a un grupo privado.</dd>
        <dt>Pipelines no portables</dt>
        <dd>El código se replica con un push, pero cada plataforma necesita su propio archivo de pipeline.</dd>
      </dl>
    </section>

    <section id="enlaces">
      <h2><span class="num">9.</span>Enlaces</h2>
      <div class="tabla">
        <table>
          <caption>Tabla 5. Recursos del proyecto.</caption>
          <thead>
            <tr><th scope="col">Recurso</th><th scope="col">Enlace</th></tr>
          </thead>
          <tbody>
            <tr><td>Repositorio del grupo</td><td><a href="${REPO_GRUPO}" target="_blank" rel="noopener">GitHub</a></td></tr>
            <tr><td>Sitio publicado desde GitHub</td><td><a href="${SITIO_GH}" target="_blank" rel="noopener">Cloudflare Pages</a></td></tr>
            <tr><td>Sitio publicado desde GitLab</td><td><a href="${SITIO_GL}" target="_blank" rel="noopener">Cloudflare Pages</a></td></tr>
            <tr><td>Prototipo: repositorio</td><td><a href="${PROTOTIPO}" target="_blank" rel="noopener">GitHub</a></td></tr>
            <tr><td>Prototipo: sitio en GitHub Pages</td><td><a href="${PROTOTIPO_SITIO_GH}" target="_blank" rel="noopener">github.io</a></td></tr>
            <tr><td>Prototipo: sitio en GitLab Pages</td><td><a href="${PROTOTIPO_SITIO_GL}" target="_blank" rel="noopener">gitlab.io</a></td></tr>
            <tr><td>Prototipo: mediciones</td><td><a href="${PROTOTIPO}/blob/main/mediciones.csv" target="_blank" rel="noopener">mediciones.csv</a></td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `;

  renderBranchModelBadges(document.getElementById('slot-badges-ramas'), branchModelsData);
  renderConventionalChart(document.getElementById('slot-conventional-chart'), conventionalData);
});

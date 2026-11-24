
// Importa los estilos generales del sitio web.
import './styles/style.css';

// Importa los estilos específicos de la página de investigación.
import './styles/investigacion.css';

// Importa los estilos del buscador interactivo de comandos Git.
import './styles/command-search.css';

// Importa los estilos de los cuadros informativos y advertencias.
import './styles/callout.css';

// Importa las funciones que construyen la barra de navegación y el pie de página.
import { renderizarNavbar, renderizarFooter } from './components/layout.js';

// Importa el archivo JSON que contiene todos los comandos Git.
import commandsAll from './data/commands-all.json';

// Importa la función que genera el buscador interactivo de comandos.
import { renderCommandSearch } from './components/CommandSearch.js';

// Importa la función que genera cuadros informativos y advertencias.
import { renderCallout } from './components/Callout.js';

// Define la dirección del repositorio principal del grupo.
const REPO_GITHUB = 'https://github.com/sampedro2002/versionamiento-web';

// Construye el enlace directo al archivo que sincroniza GitHub con GitLab.
const WORKFLOW_SYNC = `${REPO_GITHUB}/blob/main/.github/workflows/sync-gitlab.yml`;

// Define el enlace al repositorio del prototipo desarrollado anteriormente.
const PROTOTIPO_GH = 'https://github.com/jhon-avila135/investigacion-versionamiento';

// Define el enlace al proyecto del prototipo alojado en GitLab.
const PROTOTIPO_GL = 'https://gitlab.com/grupo2-versionamiento-uce/investigacion-versionamiento';

// Espera a que el documento HTML esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {

  // Construye la barra de navegación y el pie de página.
  renderizarNavbar();
  renderizarFooter();

  // Busca el elemento principal del documento que tiene la clase container.
  const contenedor = document.querySelector('main.container');

  // Agrega la clase investigacion para aplicar los estilos CSS de esta página.
  contenedor.classList.add('investigacion');

  // Construye dinámicamente todo el contenido HTML de la investigación.
  contenedor.innerHTML = `

    <!-- Encabezado principal de la investigación. -->
    <header class="encabezado-investigacion">
      <h1>GitHub y GitLab: análisis comparativo</h1>
      <p>Diferencias de modelo, despliegue continuo, reglas de protección, gestión de variables, comandos y cuentas educativas · Arquitectura de Software · Grupo 2</p>
    </header>

    <!-- Índice con enlaces internos para desplazarse a las secciones del documento. -->
    <nav class="indice" aria-label="Contenido de la investigación">
      <p>Contenido</p>
      <ol>
        <li><a href="#diferencias">Diferencias de modelo</a></li>
        <li><a href="#despliegue">Despliegue en cada plataforma</a></li>
        <li><a href="#reglas">Reglas de protección</a></li>
        <li><a href="#variables">Variables y gestión de despliegues</a></li>
        <li><a href="#comandos">Comandos principales</a></li>
        <li><a href="#educacion">Cuentas educativas</a></li>
        <li><a href="#hallazgos">Hallazgos de la implementación</a></li>
        <li><a href="#seleccion">Criterios de selección</a></li>
        <li><a href="#conclusiones">Conclusiones</a></li>
        <li><a href="#referencias">Referencias</a></li>
      </ol>
    </nav>

    <!-- SECCIÓN 1: compara las características generales de GitHub y GitLab. -->
    <section id="diferencias">
      <h2><span class="num">1.</span>Diferencias de modelo</h2>
      <p>Ambas plataformas alojan repositorios Git, pero parten de enfoques distintos. GitHub se organiza alrededor de una comunidad y de un ecosistema de integraciones reutilizables (Actions y Marketplace). GitLab se plantea como una aplicación única para todo el ciclo DevSecOps y ofrece una edición comunitaria instalable en servidores propios.</p>

      <!-- Tabla comparativa de las características técnicas de ambas plataformas. -->
      <div class="tabla">
        <table>
          <caption><strong>Tabla 1.</strong> Diferencias técnicas relevantes entre GitHub y GitLab.</caption>
          <thead>
            <tr>
              <th scope="col">Aspecto</th>
              <th scope="col">GitHub</th>
              <th scope="col">GitLab</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Modelo de CI/CD</td>
              <td>Basado en eventos (<code>push</code>, <code>pull_request</code>, horario o ejecución manual). Los pasos se reutilizan como acciones.</td>
              <td>Basado en etapas (<code>stages</code>) que se ejecutan en orden. La reutilización se hace con <code>include</code>, <code>extends</code> y plantillas.</td>
            </tr>
            <tr>
              <td>Entorno de ejecución</td>
              <td>Se elige la máquina virtual (<code>runs-on</code>, por ejemplo <code>ubuntu-latest</code>).</td>
              <td>Se elige la imagen del contenedor Docker (<code>image</code>).</td>
            </tr>
            <tr>
              <td>Publicación de sitios estáticos</td>
              <td>Pasos explícitos con acciones oficiales o integración externa (como Cloudflare Pages).</td>
              <td>Convención nativa con un job <code>pages</code> hacia <code>public/</code>, o integración con Cloudflare Pages.</td>
            </tr>
            <tr>
              <td>Organización</td>
              <td>Organizaciones y equipos, sin niveles intermedios.</td>
              <td>Grupos y subgrupos; los permisos y variables se heredan.</td>
            </tr>
            <tr>
              <td>Instalación propia</td>
              <td>Enterprise Server, con licencia comercial.</td>
              <td>Community Edition, gratuita y de código abierto.</td>
            </tr>
            <tr>
              <td>Primer uso de CI</td>
              <td>Disponible al crear la cuenta.</td>
              <td>Requiere verificar la identidad para usar los runners compartidos.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECCIÓN 2: explica las alternativas de despliegue utilizadas en el proyecto. -->
    <section id="despliegue">
      <h2><span class="num">2.</span>Despliegue en cada plataforma</h2>

      <!-- Subapartado 2.1: explica la integración entre GitHub Actions y Cloudflare Pages. -->
      <h3><span class="num">2.1</span>Flujo del proyecto: GitHub Actions y Cloudflare Pages</h3>
      <p>En este proyecto (<code>versionamiento-web</code>), construido como aplicación multipágina con <strong>Vite</strong> y <strong>pnpm</strong> (<code>index.html</code>, <code>informe.html</code>, <code>investigacion.html</code>, <code>presentacion.html</code> y <code>recursos.html</code>), GitHub actúa como repositorio principal. Cada aporte sigue el flujo <code>feature/*</code> &rarr; <code>develop</code> &rarr; <code>test</code> &rarr; <code>main</code>.</p>

      <!-- Enlace al workflow responsable de sincronizar los repositorios. -->
      <p>Un workflow de GitHub Actions (<a href="${WORKFLOW_SYNC}" target="_blank" rel="noopener"><code>sync-gitlab.yml</code></a>) se dispara ante cada <code>push</code> a <code>main</code>, <code>develop</code> o <code>test</code> y replica en GitLab todas las ramas disponibles en <code>origin</code> (eliminando con <code>--prune</code> las que ya no existan), utilizando el secreto <code>GITLAB_TOKEN</code>:</p>

      <!-- Ejemplo de configuración YAML del workflow de sincronización. -->
      <pre><code>on:
  push:
    branches: [main, develop, test]

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: |
          git remote add gitlab https://oauth2:\${{ secrets.GITLAB_TOKEN }}@gitlab.com/sampedro2002/versionamiento-web.git
          git push gitlab --force --prune "refs/remotes/origin/*:refs/heads/*"</code></pre>

      <!-- Explica cómo Cloudflare compila y publica las dos réplicas del proyecto. -->
      <p>A partir de ambas réplicas, <strong>Cloudflare Pages</strong> ejecuta <code>pnpm run build</code> (que compila el sitio con Vite en <code>dist/</code>) y publica de forma independiente la versión conectada a GitHub y la conectada a GitLab.</p>

      <!-- Subapartado 2.2: compara el despliegue externo con los servicios nativos de cada plataforma. -->
      <h3><span class="num">2.2</span>Comparación con despliegue nativo (Pages de cada plataforma)</h3>
      <p>En el prototipo previo del equipo (<a href="${PROTOTIPO_GH}" target="_blank" rel="noopener">GitHub</a> y <a href="${PROTOTIPO_GL}" target="_blank" rel="noopener">GitLab</a>), se evaluó el despliegue nativo sin proveedor externo: GitHub Actions usó <code>actions/upload-pages-artifact@v3</code> y <code>actions/deploy-pages@v4</code> con token OIDC temporal (<code>id-token: write</code>), mientras que GitLab CI empleó un job <code>pages</code> restringido por <code>rules: if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH</code>.</p>

      <!-- Recuadro destacado para resaltar la diferencia principal entre las alternativas. -->
      <div class="destacado">
        <p><strong>Diferencia clave:</strong> mientras GitHub Pages y GitLab Pages requieren definir pipelines propios en cada plataforma, Cloudflare Pages unifica la compilación de Vite (<code>pnpm run build</code> &rarr; <code>dist</code>) y ofrece entornos de vista previa por rama y producción en <code>main</code>.</p>
      </div>
    </section>

    <!-- SECCIÓN 3: compara los mecanismos de protección de ramas. -->
    <section id="reglas">
      <h2><span class="num">3.</span>Reglas de protección</h2>
      <p>Para evitar cambios directos sin revisión sobre las ramas de integración y producción (<code>develop</code>, <code>test</code> y <code>main</code>), ambas plataformas ofrecen controles equivalentes con distinto nivel de licencia:</p>

      <!-- Tabla que compara los mecanismos de protección disponibles en cada plataforma. -->
      <div class="tabla">
        <table>
          <caption><strong>Tabla 2.</strong> Mecanismos de protección de ramas en GitHub y GitLab.</caption>
          <thead>
            <tr>
              <th scope="col">Mecanismo</th>
              <th scope="col">GitHub</th>
              <th scope="col">GitLab</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Configuración</td>
              <td>Rulesets (acumulables; prevalece la regla más estricta)</td>
              <td>Protected branches</td>
            </tr>
            <tr>
              <td>Pull o merge request obligatorio</td>
              <td>Sí</td>
              <td>Sí, restringiendo permisos de push por rol</td>
            </tr>
            <tr>
              <td>Exigir CI aprobado</td>
              <td>Required status checks</td>
              <td>Pipelines must succeed</td>
            </tr>
            <tr>
              <td>Aprobaciones obligatorias</td>
              <td>Incluidas en Rulesets</td>
              <td>Plan Premium</td>
            </tr>
            <tr>
              <td>CODEOWNERS</td>
              <td>Incluido</td>
              <td>Plan Premium</td>
            </tr>
            <tr>
              <td>Bloqueo de force push</td>
              <td>Sí</td>
              <td>Sí, por defecto</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>En GitHub Free, las reglas de protección aplican a repositorios públicos; en repositorios privados requieren GitHub Pro, incluido en GitHub Education.</p>

      <!-- Genera una advertencia sobre las limitaciones de GitHub Free en repositorios privados. -->
      ${renderCallout({
        tipo: 'warning',
        titulo: 'GitHub Free + repositorio privado',
        texto:
          'En cuentas GitHub Free, la protección de ramas en repositorios privados requiere GitHub Pro (incluido gratis con GitHub Education).',
      })}
    </section>

    <!-- SECCIÓN 4: compara cómo se administran las variables y los secretos. -->
    <section id="variables">
      <h2><span class="num">4.</span>Variables y gestión de despliegues</h2>

      <!-- Tabla comparativa de variables, secretos y control de ejecuciones simultáneas. -->
      <div class="tabla">
        <table>
          <caption><strong>Tabla 3.</strong> Gestión de variables, secretos y concurrencia.</caption>
          <thead>
            <tr>
              <th scope="col">Aspecto</th>
              <th scope="col">GitHub</th>
              <th scope="col">GitLab</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Niveles</td>
              <td>Organización, repositorio y entorno</td>
              <td>Instancia, grupo (heredable) y proyecto</td>
            </tr>
            <tr>
              <td>Datos sensibles</td>
              <td><code>secrets</code> (cifrados y ocultos en logs)</td>
              <td>Variables <em>masked</em> o <em>masked and hidden</em></td>
            </tr>
            <tr>
              <td>Configuración no sensible</td>
              <td><code>vars</code></td>
              <td>Variables visibles o de tipo archivo</td>
            </tr>
            <tr>
              <td>Protección de producción</td>
              <td>Entornos con revisores y ramas permitidas</td>
              <td>Variables protegidas (solo en ramas o tags protegidos)</td>
            </tr>
            <tr>
              <td>Variables predefinidas</td>
              <td><code>GITHUB_SHA</code>, <code>GITHUB_REF</code></td>
              <td><code>CI_COMMIT_SHORT_SHA</code>, <code>CI_DEFAULT_BRANCH</code></td>
            </tr>
            <tr>
              <td>Despliegues simultáneos</td>
              <td><code>concurrency</code></td>
              <td><code>resource_group</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Explica el uso del secreto de autenticación y el procedimiento de reversión. -->
      <p>En este proyecto, el token de acceso hacia GitLab se almacena como secreto (<code>secrets.GITLAB_TOKEN</code>) en GitHub, de modo que nunca queda expuesto en el código fuente ni en los registros de ejecución. Ante un fallo publicado en producción, la reversión segura se realiza con <code>git revert</code> (o la opción <em>Revert</em> del Pull Request en GitHub), generando un nuevo commit sin reescribir el historial de <code>main</code>.</p>
    </section>

    <!-- SECCIÓN 5: presenta los comandos Git utilizados durante el trabajo colaborativo. -->
    <section id="comandos">
      <h2><span class="num">5.</span>Comandos principales</h2>
      <p>El trabajo colaborativo por ramas, la integración hacia <code>develop</code> / <code>test</code> / <code>main</code> y la sincronización entre remotos se apoya en los siguientes comandos:</p>

      <!-- Tabla que explica la utilidad de cada comando Git. -->
      <div class="tabla">
        <table>
          <caption><strong>Tabla 4.</strong> Comandos Git utilizados en el flujo del proyecto.</caption>
          <thead>
            <tr>
              <th scope="col">Comando</th>
              <th scope="col">Propósito</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>git switch -c feature/nombre</code></td>
              <td>Crear una rama de trabajo a partir de <code>develop</code> para cada tarea.</td>
            </tr>
            <tr>
              <td><code>git rebase develop</code></td>
              <td>Actualizar la rama propia con los últimos cambios integrados antes del Pull Request.</td>
            </tr>
            <tr>
              <td><code>git push --force-with-lease</code></td>
              <td>Actualizar la rama propia tras un rebase sin sobrescribir aportes de otros compañeros.</td>
            </tr>
            <tr>
              <td><code>git remote add gitlab URL</code></td>
              <td>Registrar el repositorio de GitLab como segundo remoto junto a <code>origin</code>.</td>
            </tr>
            <tr>
              <td><code>git push gitlab main</code></td>
              <td>Empujar cambios manualmente hacia GitLab cuando no se usa el workflow automático.</td>
            </tr>
            <tr>
              <td><code>git revert HEAD</code></td>
              <td>Deshacer un cambio publicado generando un commit inverso sin alterar el historial.</td>
            </tr>
            <tr>
              <td><code>git tag -a v1.0.0 -m "mensaje"</code></td>
              <td>Etiquetar versiones de entrega en ambos repositorios.</td>
            </tr>
            <tr>
              <td><code>git log --oneline --graph</code></td>
              <td>Inspeccionar gráficamente el historial de ramas y fusiones.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Espacio reservado para insertar el buscador interactivo de comandos Git. -->
      <div id="slot-buscador-comandos"></div>

      <!-- Genera una advertencia sobre el uso del comando git reset --hard. -->
      ${renderCallout({
        tipo: 'warning',
        titulo: 'Precaución antes de ejecutar git reset --hard',
        texto:
          'Nunca ejecutes git reset --hard sin respaldar primero tus cambios pendientes con git stash; de lo contrario, el trabajo no confirmado se perderá de forma irreversible.',
      })}
    </section>

    <!-- SECCIÓN 6: compara los beneficios de las cuentas educativas. -->
    <section id="educacion">
      <h2><span class="num">6.</span>Cuentas educativas</h2>
      <p>El uso de cuentas con correo institucional presenta una diferencia estructural: GitHub otorga los beneficios directamente al estudiante, mientras que GitLab los otorga a través de la institución.</p>

      <!-- Primera tabla: comparación de GitHub Free y GitHub Education. -->
      <div class="tabla">
        <table>
          <caption><strong>Tabla 5.</strong> GitHub Free frente a GitHub Education.</caption>
          <thead>
            <tr>
              <th scope="col">Aspecto</th>
              <th scope="col">GitHub Free</th>
              <th scope="col">GitHub Education</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Solicitante</td>
              <td>Cualquier usuario</td>
              <td>Estudiante con correo académico verificado y comprobante de matrícula</td>
            </tr>
            <tr>
              <td>Plan</td>
              <td>Free</td>
              <td>Beneficios de GitHub Pro vigentes mientras se mantenga la verificación</td>
            </tr>
            <tr>
              <td>Reglas en repositorios privados</td>
              <td>No disponibles</td>
              <td>Ramas protegidas, revisores obligatorios, CODEOWNERS y wikis</td>
            </tr>
            <tr>
              <td>Codespaces</td>
              <td>120 horas-núcleo al mes</td>
              <td>180 horas-núcleo al mes</td>
            </tr>
            <tr>
              <td>Copilot</td>
              <td>Plan gratuito con límites</td>
              <td>Funciones premium sin costo</td>
            </tr>
            <tr>
              <td>Beneficios adicionales</td>
              <td>Ninguno</td>
              <td>Student Developer Pack</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Segunda tabla: comparación de GitLab Free y GitLab for Education. -->
      <div class="tabla">
        <table>
          <caption><strong>Tabla 6.</strong> GitLab Free frente a GitLab for Education.</caption>
          <thead>
            <tr>
              <th scope="col">Aspecto</th>
              <th scope="col">GitLab Free</th>
              <th scope="col">GitLab for Education</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Solicitante</td>
              <td>Cualquier usuario</td>
              <td>Docentes o personal de la institución (no se emite directamente a estudiantes)</td>
            </tr>
            <tr>
              <td>Plan</td>
              <td>Free</td>
              <td>Ultimate con usuarios ilimitados, renovable anualmente</td>
            </tr>
            <tr>
              <td>Minutos de CI</td>
              <td>400 al mes por grupo</td>
              <td>50 000 al mes</td>
            </tr>
            <tr>
              <td>Almacenamiento</td>
              <td>10 GiB por proyecto</td>
              <td>Según la licencia institucional</td>
            </tr>
            <tr>
              <td>Uso permitido</td>
              <td>Sin restricción</td>
              <td>Docencia e investigación no comercial</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Conclusión sobre las diferencias de acceso a beneficios educativos. -->
      <p>En consecuencia, el correo universitario mejora de inmediato las capacidades en GitHub, mientras que en GitLab la cuenta individual opera bajo el plan Free salvo que la universidad gestione la licencia institucional.</p>
    </section>

    <!-- SECCIÓN 7: documenta los problemas y observaciones encontrados durante la implementación. -->
    <section id="hallazgos">
      <h2><span class="num">7.</span>Hallazgos de la implementación</h2>

      <!-- Lista de hallazgos técnicos y sus explicaciones. -->
      <dl>
        <dt>Separación entre Workers y Pages en Cloudflare</dt>
        <dd>El asistente inicial de Cloudflare orienta el flujo hacia <em>Workers</em> (<code>npx wrangler deploy</code>). Para un sitio estático compilado con Vite, fue necesario seleccionar explícitamente el flujo de <strong>Cloudflare Pages</strong> con <code>pnpm run build</code> y directorio de salida <code>dist</code>.</dd>

        <dt>Triggers residuales en integraciones Git</dt>
        <dd>Si se crea y elimina un proyecto de Workers vinculado a GitHub, la GitHub App puede conservar un check fallido (<em>Workers Builds</em>) en commits previos hasta desvincularlo por completo, aunque el despliegue paralelo de Pages funcione correctamente.</dd>

        <dt>Promoción por ramas hasta producción</dt>
        <dd>Al trabajar con <code>feature/*</code> &rarr; <code>develop</code> &rarr; <code>test</code> &rarr; <code>main</code>, fusionar Pull Requests en <code>develop</code> integra el código del equipo pero no actualiza el sitio de producción en Cloudflare Pages hasta promover los cambios hacia <code>main</code>.</dd>

        <dt>Sincronización automatizada GitHub &rarr; GitLab</dt>
        <dd>El workflow <code>sync-gitlab.yml</code> evita tener que ejecutar <code>git push</code> manual a dos remotos y asegura que tanto el proyecto de Cloudflare Pages conectado a GitHub como el conectado a GitLab compilen exactamente el mismo código.</dd>

        <dt>Evidencias del prototipo previo</dt>
        <dd>En el prototipo inicial se detectó que <code>html-validate:standard</code> omitía reglas de accesibilidad (corregido con el preset <code>a11y</code>), que GitHub genera un commit de merge distinto al local y que GitLab Pages presenta breves segundos de propagación tras cada despliegue.</dd>
      </dl>
    </section>

    <!-- SECCIÓN 8: presenta recomendaciones según las necesidades de cada proyecto. -->
    <section id="seleccion">
      <h2><span class="num">8.</span>Criterios de selección</h2>

      <!-- Tabla de escenarios y plataforma recomendada. -->
      <div class="tabla">
        <table>
          <caption><strong>Tabla 7.</strong> Escenarios recomendados para cada plataforma.</caption>
          <thead>
            <tr>
              <th scope="col">Escenario</th>
              <th scope="col">Plataforma sugerida</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Proyectos académicos, código abierto y portafolio</td>
              <td>GitHub</td>
            </tr>
            <tr>
              <td>Aprovechamiento de beneficios individuales para estudiantes</td>
              <td>GitHub</td>
            </tr>
            <tr>
              <td>Ecosistema amplio de acciones e integraciones (como Cloudflare Pages)</td>
              <td>GitHub</td>
            </tr>
            <tr>
              <td>Instalación en servidores propios (banca, salud, sector público)</td>
              <td>GitLab</td>
            </tr>
            <tr>
              <td>Ciclo DevSecOps completo en una sola herramienta</td>
              <td>GitLab</td>
            </tr>
            <tr>
              <td>Estructura jerárquica de grupos con herencia de permisos y variables</td>
              <td>GitLab</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Explica que ambas plataformas pueden utilizarse de manera complementaria. -->
      <p>Ambas plataformas no son excluyentes: en este proyecto GitHub funciona como repositorio principal de colaboración y GitLab como réplica sincronizada, permitiendo comparar el despliegue continuo desde ambos orígenes.</p>
    </section>

    <!-- SECCIÓN 9: resume los resultados obtenidos en la investigación. -->
    <section id="conclusiones">
      <h2><span class="num">9.</span>Conclusiones</h2>

      <!-- Lista ordenada con las conclusiones principales del trabajo. -->
      <ol>
        <li>GitHub y GitLab resuelven las mismas necesidades de versionamiento e integración continua con modelos distintos: eventos y ecosistema de acciones frente a etapas secuenciales y plataforma integrada.</li>
        <li>Adoptar una estrategia de ramas (<code>feature/*</code> &rarr; <code>develop</code> &rarr; <code>test</code> &rarr; <code>main</code>) junto con despliegue automático en Cloudflare Pages permite validar integraciones antes de publicarlas en producción.</li>
        <li>El correo institucional tiene impacto directo e individual en GitHub Education, mientras que en GitLab los beneficios avanzados dependen de una licencia gestionada por la institución.</li>
      </ol>
    </section>

    <!-- SECCIÓN 10: contiene las fuentes bibliográficas utilizadas en la investigación. -->
    <section id="referencias">
      <h2><span class="num">10.</span>Referencias</h2>

      <!-- Lista de libros, documentación oficial, normas y encuestas consultadas. -->
      <ul>
        <li>Forsgren, N., Humble, J. y Kim, G. (2018). <em>Accelerate: The Science of Lean Software and DevOps</em>. IT Revolution.</li>
        <li>GitHub. (2025). <em>Octoverse 2025</em>. https://github.blog/news-insights/octoverse/</li>
        <li>GitHub Docs. (s. f.). <em>GitHub's plans</em>; <em>About rulesets</em>; <em>Using secrets in GitHub Actions</em>; <em>About GitHub Education for students</em>. https://docs.github.com</li>
        <li>GitLab Docs. (s. f.). <em>CI/CD variables</em>; <em>Protected branches</em>; <em>Compute minutes</em>; <em>GitLab for Education Program</em>. https://docs.gitlab.com</li>
        <li>Cloudflare Docs. (s. f.). <em>Cloudflare Pages: Git integration &amp; Vite</em>. https://developers.cloudflare.com/pages/</li>
        <li>ISO/IEC/IEEE. (2018). <em>ISO/IEC/IEEE 29148:2018. Systems and software engineering — Requirements engineering</em>.</li>
        <li>Stack Overflow. (2022). <em>Developer Survey 2022</em>. https://survey.stackoverflow.co/2022</li>
      </ul>

      <!-- Indica la fecha de referencia de los planes y beneficios mencionados. -->
      <p class="nota">Los planes, cuotas y beneficios citados corresponden a noviembre de 2026 y pueden cambiar.</p>
    </section>
  `;

  // Busca el elemento HTML reservado para el buscador de comandos.
  // Luego llama a renderCommandSearch y le entrega:
  // 1. El elemento donde debe aparecer el buscador.
  // 2. Los datos importados desde commands-all.json.
  renderCommandSearch(document.getElementById('slot-buscador-comandos'), commandsAll);
});

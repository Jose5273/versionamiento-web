import './styles/style.css';
import './styles/inicio.css';
import { renderizarNavbar, renderizarFooter } from './components/layout.js';

const REPO_GITHUB = 'https://github.com/sampedro2002/versionamiento-web';
const SITIO_GITHUB = 'https://versionamiento-web-github.pages.dev/';
const SITIO_GITLAB = 'https://versionamiento-web-gitlab.pages.dev/';

const ETAPAS_FLUJO = [
  {
    id: 'feature',
    paso: 'Paso 1',
    titulo: 'feature/*',
    encabezado: 'Rama de trabajo por funcionalidad',
    descripcion:
      'Cada integrante crea su propia rama desde develop para construir una sección aislada sin interferir con el trabajo del resto del equipo.',
    comando: 'git switch -c feature/nombre',
    meta: 'Integración mediante Pull Request hacia develop.',
  },
  {
    id: 'develop',
    paso: 'Paso 2',
    titulo: 'develop',
    encabezado: 'Rama de integración del equipo',
    descripcion:
      'Reúne los Pull Requests aprobados de todas las páginas del sitio (Inicio, Informe, Investigación, Presentación y Recursos) y se replica automáticamente en GitLab.',
    comando: 'git pull origin develop',
    meta: 'Dispara sincronización hacia GitLab mediante sync-gitlab.yml.',
  },
  {
    id: 'test',
    paso: 'Paso 3',
    titulo: 'test',
    encabezado: 'Validación previa a producción',
    descripcion:
      'Recibe los cambios integrados desde develop para verificar compilación, navegación entre páginas y diseño antes de liberar la versión final.',
    comando: 'pnpm run build',
    meta: 'Control intermedio previo a la rama principal.',
  },
  {
    id: 'main',
    paso: 'Paso 4',
    titulo: 'main',
    encabezado: 'Rama principal de producción',
    descripcion:
      'Contiene únicamente código revisado y estable. Cada merge a main dispara el despliegue automático hacia ambos sitios publicados.',
    comando: 'git merge --no-ff test',
    meta: 'Protegida contra cambios directos sin revisión.',
  },
  {
    id: 'deploy',
    paso: 'Paso 5',
    titulo: 'Cloudflare Pages',
    encabezado: 'Publicación dual (GitHub y GitLab)',
    descripcion:
      'GitHub Actions replica main en GitLab usando GITLAB_TOKEN, y Cloudflare Pages compila dist/ para publicar el sitio desde ambos repositorios.',
    comando: 'pnpm run build → dist/',
    meta: 'Disponible públicamente con HTTPS en GitHub Pages/Cloudflare y GitLab/Cloudflare.',
  },
];

const SECCIONES = [
  {
    tag: 'Documentación',
    titulo: 'Informe del proyecto',
    descripcion:
      'Resumen ejecutivo, objetivos, arquitectura del despliegue, mediciones del prototipo y hallazgos del equipo.',
    href: 'informe.html',
  },
  {
    tag: 'Comparativa',
    titulo: 'Investigación',
    descripcion:
      'Análisis detallado de GitHub vs. GitLab: modelos CI/CD, reglas de protección, variables y cuentas educativas.',
    href: 'investigacion.html',
  },
  {
    tag: 'Exposición',
    titulo: 'Presentación',
    descripcion:
      'Material de apoyo y diapositivas preparadas para la sustentación del proyecto en clase.',
    href: 'presentacion.html',
  },
  {
    tag: 'Práctica',
    titulo: 'Recursos y comandos',
    descripcion:
      'Guía interactiva de comandos Git esenciales y comparativa de cuotas gratuitas de CI/CD.',
    href: 'recursos.html',
  },
];

document.addEventListener('DOMContentLoaded', () => {
  renderizarNavbar();
  renderizarFooter();

  const contenedor = document.querySelector('main.container');
  contenedor.classList.add('inicio');

  contenedor.innerHTML = `
    <section class="hero" aria-labelledby="hero-titulo">
      <span class="hero-badge">Universidad Central del Ecuador · Arquitectura de Software · Grupo 2</span>
      <h1 id="hero-titulo">Gestión de Versionamiento y Despliegue Continuo</h1>
      <p class="hero-subtitulo">
        Plataforma web multipágina desarrollada en equipo para comparar <strong>GitHub</strong> y <strong>GitLab</strong> en un flujo real con ramas protegidas, sincronización automatizada y publicación en <strong>Cloudflare Pages</strong>.
      </p>
      <div class="hero-acciones">
        <a class="btn btn-primario" href="informe.html">Explorar Informe</a>
        <a class="btn btn-secundario" href="investigacion.html">Ver Investigación</a>
      </div>
    </section>

    <section class="bloque" aria-labelledby="flujo-titulo">
      <h2 id="flujo-titulo">Flujo de trabajo del proyecto</h2>
      <p class="bloque-desc">Selecciona una etapa para ver cómo viaja cada cambio desde la rama de trabajo hasta producción:</p>
      <div class="flujo-pasos" role="tablist" aria-label="Etapas del flujo Git">
        ${ETAPAS_FLUJO.map(
          (etapa, idx) => `
          <button
            type="button"
            class="flujo-paso ${idx === 0 ? 'activo' : ''}"
            role="tab"
            aria-selected="${idx === 0 ? 'true' : 'false'}"
            data-etapa="${etapa.id}"
          >
            <span class="flujo-paso-num">${etapa.paso}</span>
            <span class="flujo-paso-titulo">${etapa.titulo}</span>
          </button>
        `
        ).join('')}
      </div>
      <div class="flujo-detalle" id="flujo-detalle" role="tabpanel"></div>
    </section>

    <section class="bloque" aria-labelledby="secciones-titulo">
      <h2 id="secciones-titulo">Secciones del sitio</h2>
      <p class="bloque-desc">Accede directamente a cada módulo construido por el Grupo 2:</p>
      <div class="grid-secciones">
        ${SECCIONES.map(
          (sec) => `
          <a class="tarjeta" href="${sec.href}">
            <div>
              <span class="tarjeta-tag">${sec.tag}</span>
              <h3>${sec.titulo}</h3>
              <p>${sec.descripcion}</p>
            </div>
            <span class="tarjeta-ir">Abrir sección &rarr;</span>
          </a>
        `
        ).join('')}
      </div>
    </section>

    <section class="bloque" aria-labelledby="entorno-titulo">
      <h2 id="entorno-titulo">Arquitectura y enlaces activos</h2>
      <div class="panel-info">
        <div>
          <h3>Stack técnico</h3>
          <ul>
            <li><strong>Empaquetador:</strong> Vite (aplicación multipágina)</li>
            <li><strong>Lenguajes:</strong> HTML5, CSS3 y JavaScript (ES Modules)</li>
            <li><strong>Gestor de paquetes:</strong> pnpm</li>
            <li><strong>Automatización:</strong> GitHub Actions (<code>sync-gitlab.yml</code>)</li>
          </ul>
        </div>
        <div>
          <h3>Repositorios y despliegues</h3>
          <ul>
            <li><span class="estado-linea"></span><a href="${REPO_GITHUB}" target="_blank" rel="noopener">Repositorio principal en GitHub</a></li>
            <li><span class="estado-linea"></span><a href="${SITIO_GITHUB}" target="_blank" rel="noopener">Sitio publicado desde GitHub (Cloudflare Pages)</a></li>
            <li><span class="estado-linea"></span><a href="${SITIO_GITLAB}" target="_blank" rel="noopener">Sitio publicado desde GitLab (Cloudflare Pages)</a></li>
          </ul>
        </div>
      </div>
    </section>
  `;

  const panelDetalle = document.getElementById('flujo-detalle');
  const botones = contenedor.querySelectorAll('.flujo-paso');

  function mostrarEtapa(id) {
    const etapa = ETAPAS_FLUJO.find((e) => e.id === id) || ETAPAS_FLUJO[0];
    panelDetalle.innerHTML = `
      <h3>${etapa.encabezado}</h3>
      <p>${etapa.descripcion}</p>
      <p><strong>Referencia:</strong> <code>${etapa.comando}</code></p>
      <p class="flujo-meta">${etapa.meta}</p>
    `;
  }

  botones.forEach((btn) => {
    btn.addEventListener('click', () => {
      botones.forEach((b) => {
        b.classList.remove('activo');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('activo');
      btn.setAttribute('aria-selected', 'true');
      mostrarEtapa(btn.dataset.etapa);
    });
  });

  mostrarEtapa(ETAPAS_FLUJO[0].id);
});

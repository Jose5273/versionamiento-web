
// Importa los estilos generales utilizados en todo el sitio.
import './styles/style.css';

// Importa los estilos específicos de la página de inicio.
import './styles/inicio.css';

// Importa las funciones encargadas de generar la barra de navegación y el pie de página.
import { renderizarNavbar, renderizarFooter } from './components/layout.js';

// Define la dirección del repositorio principal del proyecto en GitHub.
const REPO_GITHUB = 'https://github.com/sampedro2002/versionamiento-web';

// Define la dirección del sitio publicado desde la conexión con GitHub.
const SITIO_GITHUB = 'https://versionamiento-web-github.pages.dev/';

// Define la dirección del sitio publicado desde la conexión con GitLab.
const SITIO_GITLAB = 'https://versionamiento-web-gitlab.pages.dev/';

// Array que almacena las cinco etapas del flujo de trabajo del proyecto.
// Cada objeto representa una etapa y contiene la información que se mostrará al seleccionarla.
const ETAPAS_FLUJO = [
  {
    // Identificador único de la etapa.
    id: 'feature',

    // Número que identifica el orden de esta etapa.
    paso: 'Paso 1',

    // Nombre de la rama o servicio correspondiente.
    titulo: 'feature/*',

    // Título descriptivo que aparecerá en el panel de información.
    encabezado: 'Rama de trabajo por funcionalidad',

    // Explica qué se realiza durante esta etapa.
    descripcion:
      'Cada integrante crea su propia rama desde develop para construir una sección aislada sin interferir con el trabajo del resto del equipo.',

    // Comando Git relacionado con esta etapa.
    comando: 'git switch -c feature/nombre',

    // Información adicional sobre cómo se integra el trabajo.
    meta: 'Integración mediante Pull Request hacia develop.',
  },
  {
    // Segunda etapa: integración de las ramas de trabajo.
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
    // Tercera etapa: validación del proyecto antes de producción.
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
    // Cuarta etapa: rama principal que contiene la versión estable.
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
    // Quinta etapa: publicación del proyecto en los servicios de alojamiento.
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

// Array que contiene las tarjetas de navegación hacia las otras páginas del sitio.
// Cada objeto define una etiqueta, un título, una descripción y el enlace de destino.
const SECCIONES = [
  {
    // Categoría que identifica el contenido de la tarjeta.
    tag: 'Documentación',

    // Título principal de la tarjeta.
    titulo: 'Informe del proyecto',

    // Explicación breve del contenido de la página.
    descripcion:
      'Resumen ejecutivo, objetivos, arquitectura del despliegue, mediciones del prototipo y hallazgos del equipo.',

    // Archivo HTML que se abrirá al seleccionar la tarjeta.
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

// Espera a que el documento HTML esté completamente cargado antes de ejecutar el código.
document.addEventListener('DOMContentLoaded', () => {

  // Genera la barra de navegación superior y el pie de página.
  renderizarNavbar();
  renderizarFooter();

  // Busca el contenedor principal de la página.
  const contenedor = document.querySelector('main.container');

  // Agrega la clase inicio para aplicar los estilos CSS correspondientes a esta página.
  contenedor.classList.add('inicio');

  // Construye dinámicamente el contenido HTML de la página de inicio.
  contenedor.innerHTML = `

    <!-- SECCIÓN PRINCIPAL: presentación del proyecto. -->
    <section class="hero" aria-labelledby="hero-titulo">
      <span class="hero-badge">Universidad Central del Ecuador · Arquitectura de Software · Grupo 2</span>
      <h1 id="hero-titulo">Gestión de Versionamiento y Despliegue Continuo</h1>
      <p class="hero-subtitulo">
        Plataforma web multipágina desarrollada en equipo para comparar <strong>GitHub</strong> y <strong>GitLab</strong> en un flujo real con ramas protegidas, sincronización automatizada y publicación en <strong>Cloudflare Pages</strong>.
      </p>

      <!-- Botones que permiten acceder directamente al informe y a la investigación. -->
      <div class="hero-acciones">
        <a class="btn btn-primario" href="informe.html">Explorar Informe</a>
        <a class="btn btn-secundario" href="investigacion.html">Ver Investigación</a>
      </div>
    </section>

    <!-- SECCIÓN INTERACTIVA: muestra las etapas del flujo de trabajo Git. -->
    <section class="bloque" aria-labelledby="flujo-titulo">
      <h2 id="flujo-titulo">Flujo de trabajo del proyecto</h2>
      <p class="bloque-desc">Selecciona una etapa para ver cómo viaja cada cambio desde la rama de trabajo hasta producción:</p>

      <!-- Contenedor donde se generan los botones de las cinco etapas. -->
      <div class="flujo-pasos" role="tablist" aria-label="Etapas del flujo Git">

        <!-- Recorre el array ETAPAS_FLUJO y genera un botón por cada etapa. -->
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

      <!-- Espacio donde se mostrará la información de la etapa seleccionada. -->
      <div class="flujo-detalle" id="flujo-detalle" role="tabpanel"></div>
    </section>

    <!-- SECCIÓN DE NAVEGACIÓN: presenta las tarjetas de las demás páginas. -->
    <section class="bloque" aria-labelledby="secciones-titulo">
      <h2 id="secciones-titulo">Secciones del sitio</h2>
      <p class="bloque-desc">Accede directamente a cada módulo construido por el Grupo 2:</p>

      <!-- Contenedor donde se generan dinámicamente las tarjetas de navegación. -->
      <div class="grid-secciones">

        <!-- Recorre el array SECCIONES y construye una tarjeta para cada página. -->
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

    <!-- SECCIÓN INFORMATIVA: muestra las tecnologías y los enlaces del proyecto. -->
    <section class="bloque" aria-labelledby="entorno-titulo">
      <h2 id="entorno-titulo">Arquitectura y enlaces activos</h2>

      <!-- Panel que organiza la información en dos bloques. -->
      <div class="panel-info">

        <!-- Primer bloque: tecnologías utilizadas para desarrollar el sitio. -->
        <div>
          <h3>Stack técnico</h3>
          <ul>
            <li><strong>Empaquetador:</strong> Vite (aplicación multipágina)</li>
            <li><strong>Lenguajes:</strong> HTML5, CSS3 y JavaScript (ES Modules)</li>
            <li><strong>Gestor de paquetes:</strong> pnpm</li>
            <li><strong>Automatización:</strong> GitHub Actions (<code>sync-gitlab.yml</code>)</li>
          </ul>
        </div>

        <!-- Segundo bloque: enlaces a repositorios y sitios publicados. -->
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

  // Busca el espacio reservado para mostrar los detalles de cada etapa del flujo.
  const panelDetalle = document.getElementById('flujo-detalle');

  // Busca todos los botones generados dentro del contenedor principal
  // que tienen la clase flujo-paso.
  const botones = contenedor.querySelectorAll('.flujo-paso');

  // Función encargada de mostrar la información correspondiente a una etapa.
  // Recibe como parámetro el identificador de la etapa que se desea mostrar.
  function mostrarEtapa(id) {

    // Busca dentro de ETAPAS_FLUJO el objeto cuyo identificador coincide con el recibido.
    // Si no encuentra coincidencia, utiliza la primera etapa como alternativa.
    const etapa = ETAPAS_FLUJO.find((e) => e.id === id) || ETAPAS_FLUJO[0];

    // Construye el contenido HTML del panel de detalles usando los datos de la etapa.
    panelDetalle.innerHTML = `
      <h3>${etapa.encabezado}</h3>
      <p>${etapa.descripcion}</p>
      <p><strong>Referencia:</strong> <code>${etapa.comando}</code></p>
      <p class="flujo-meta">${etapa.meta}</p>
    `;
  }

  // Recorre todos los botones de las etapas para asignarles un evento de clic.
  botones.forEach((btn) => {

    // Cuando se selecciona un botón, ejecuta la siguiente función.
    btn.addEventListener('click', () => {

      // Recorre todos los botones y elimina el estado visual de selección.
      botones.forEach((b) => {
        b.classList.remove('activo');

        // Actualiza el atributo de accesibilidad para indicar que no están seleccionados.
        b.setAttribute('aria-selected', 'false');
      });

      // Agrega la clase activo al botón que acaba de seleccionarse.
      btn.classList.add('activo');

      // Actualiza el atributo de accesibilidad del botón seleccionado.
      btn.setAttribute('aria-selected', 'true');

      // Muestra en el panel la información correspondiente al botón seleccionado.
      // dataset.etapa obtiene el valor del atributo data-etapa del botón.
      mostrarEtapa(btn.dataset.etapa);
    });
  });

  // Muestra inicialmente la información de la primera etapa del flujo.
  // Esto permite que el panel no aparezca vacío cuando se carga la página.
  mostrarEtapa(ETAPAS_FLUJO[0].id);
});

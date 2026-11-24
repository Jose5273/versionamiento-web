
// Importa la función que permite copiar texto al portapapeles
// desde otro módulo del proyecto.
import { copiarAlPortapapeles } from './TopCommands.js';

// Convierte caracteres especiales en entidades HTML.
// Esto ayuda a evitar que los textos recibidos se interpreten como código HTML.
function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Configuración de los tres niveles de clasificación de los comandos.
// Cada nivel contiene un identificador, un ancla de navegación,
// un icono, un título y una descripción.
export const NIVELES_CONFIG = [
  {
    id: 'esencial',
    ancla: 'nivel-esencial',
    icono: '🔥',
    titulo: 'Esencial (uso diario)',
    subtitulo: 'Base mínima para trabajar cada día en tu rama feature/*.',
  },
  {
    id: 'frecuente',
    ancla: 'nivel-frecuente',
    icono: '⚡',
    titulo: 'Frecuente (integración y control)',
    subtitulo: 'Resolución de conflictos, limpieza de ramas y versiones.',
  },
  {
    id: 'ocasional',
    ancla: 'nivel-ocasional',
    icono: '🧊',
    titulo: 'Ocasional (mantenimiento y rescate)',
    subtitulo: 'Operaciones puntuales, múltiples remotos y ajustes avanzados.',
  },
];

/**
 * Organiza los comandos en tres grupos según su nivel de uso.
 * También elimina los comandos duplicados.
 *
 * @param {Array} comandos - Lista de comandos que se van a clasificar.
 * @returns {Object} Objeto con los comandos separados por nivel.
 */
export function agruparPorNivel(comandos) {

  // Crea un objeto con tres listas vacías, una para cada nivel.
  const grupos = {
    esencial: [],
    frecuente: [],
    ocasional: [],
  };

  // Set permite almacenar valores únicos y detectar duplicados.
  const vistos = new Set();

  // Recorre todos los comandos recibidos.
  for (const item of comandos) {

    // Ignora elementos sin comando o que ya hayan sido registrados.
    if (!item?.comando || vistos.has(item.comando)) continue;

    // Registra el comando para evitar que se agregue nuevamente.
    vistos.add(item.comando);

    // Comprueba si el nivel indicado existe.
    // Si no existe, clasifica el comando como ocasional.
    const nivel = Object.hasOwn(grupos, item.nivel) ? item.nivel : 'ocasional';

    // Agrega el comando a la lista correspondiente.
    grupos[nivel].push(item);
  }

  // Devuelve los tres grupos organizados.
  return grupos;
}

/**
 * Construye una interfaz para mostrar los comandos de Git organizados
 * en tres niveles: esencial, frecuente y ocasional.
 * Incluye navegación con desplazamiento suave y botones para copiar comandos.
 *
 * @param {HTMLElement} contenedor - Elemento HTML donde se mostrará la interfaz.
 * @param {Array} comandos - Lista de comandos que se mostrarán.
 */
export function renderCommandLevel(contenedor, comandos) {

  // Comprueba que exista el contenedor y que los comandos sean una lista.
  if (!contenedor || !Array.isArray(comandos)) return;

  // Clasifica los comandos en sus respectivos niveles y elimina duplicados.
  const grupos = agruparPorNivel(comandos);

  // Inserta toda la estructura HTML dentro del contenedor.
  contenedor.innerHTML = `
    <div class="cmd-levels" aria-label="Comandos organizados por nivel de uso">

      <!-- Barra de navegación para acceder directamente a cada nivel. -->
      <nav class="cl-tabs" aria-label="Saltar a nivel de comando">

        <!-- Genera un enlace de navegación por cada nivel configurado. -->
        ${NIVELES_CONFIG.map(
          (n) => `
          <a class="cl-tab cl-tab-${n.id}" href="#${n.ancla}" data-target="${n.ancla}">

            <!-- Icono representativo del nivel. -->
            <span aria-hidden="true">${n.icono}</span>

            <!-- Muestra la primera palabra del título del nivel. -->
            <span>${n.titulo.split(' ')[0]}</span>

            <!-- Indica cuántos comandos pertenecen a ese nivel. -->
            <span class="cl-count">${grupos[n.id].length}</span>
          </a>
        `
        ).join('')}
      </nav>

      <!-- Contenedor que agrupa las tres secciones de comandos. -->
      <div class="cl-bloques">

        <!-- Recorre la configuración para generar una sección por nivel. -->
        ${NIVELES_CONFIG.map((n) => {

          // Obtiene los comandos correspondientes al nivel actual.
          const items = grupos[n.id];

          return `
            <!-- Sección individual de cada nivel de comandos. -->
            <section id="${n.ancla}" class="cl-bloque cl-bloque-${n.id}" aria-labelledby="titulo-${n.ancla}">

              <!-- Encabezado con el título, descripción y cantidad de comandos. -->
              <header class="cl-bloque-head">
                <div>

                  <!-- Título del nivel acompañado de su icono. -->
                  <h3 id="titulo-${n.ancla}">
                    <span aria-hidden="true">${n.icono}</span> ${escaparHtml(n.titulo)}
                  </h3>

                  <!-- Descripción de los comandos que pertenecen a este nivel. -->
                  <p class="cl-subtitulo">${escaparHtml(n.subtitulo)}</p>
                </div>

                <!-- Muestra la cantidad de comandos de la sección. -->
                <span class="cl-badge">${items.length} comandos</span>
              </header>

              <!-- Cuadrícula donde se mostrarán las tarjetas de comandos. -->
              <div class="cl-grid">

                <!-- Genera una tarjeta para cada comando del nivel actual. -->
                ${items
                  .map(
                    (item) => `
                  <article class="cl-item">

                    <!-- Parte superior de la tarjeta: comando y botón para copiar. -->
                    <div class="cl-item-top">

                      <!-- Muestra el comando de Git dentro de una etiqueta de código. -->
                      <code class="cl-cmd">${escaparHtml(item.comando)}</code>

                      <!-- Botón que permite copiar el comando al portapapeles. -->
                      <button
                        type="button"
                        class="cl-copiar"
                        data-cmd="${escaparHtml(item.comando)}"
                        aria-label="Copiar comando ${escaparHtml(item.comando)}"
                      >Copiar</button>
                    </div>

                    <!-- Explicación de la utilidad del comando. -->
                    <p class="cl-item-desc">${escaparHtml(item.descripcion)}</p>

                    <!-- Contenedor de etiquetas adicionales del comando. -->
                    <div class="cl-tags">

                      <!-- Genera una etiqueta visual por cada elemento del arreglo etiquetas. -->
                      ${(item.etiquetas || [])
                        .map((t) => `<span class="cl-tag">${escaparHtml(t)}</span>`)
                        .join('')}
                    </div>
                  </article>
                `
                  )
                  // Une todas las tarjetas en una sola cadena HTML.
                  .join('')}
              </div>
            </section>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Busca todos los enlaces de navegación que permiten cambiar de nivel.
  contenedor.querySelectorAll('.cl-tab').forEach((enlace) => {

    // Agrega un evento para detectar cuando el usuario selecciona un nivel.
    enlace.addEventListener('click', (ev) => {

      // Obtiene el identificador de la sección de destino.
      const targetId = enlace.dataset.target;

      // Busca en el documento el elemento que corresponde a ese identificador.
      const destino = targetId ? document.getElementById(targetId) : null;

      // Comprueba que el elemento exista y permita desplazamiento.
      if (destino?.scrollIntoView) {

        // Evita el desplazamiento instantáneo predeterminado del enlace.
        ev.preventDefault();

        // Desplaza suavemente la página hasta la sección seleccionada.
        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Busca todos los botones que permiten copiar los comandos.
  contenedor.querySelectorAll('.cl-copiar').forEach((btn) => {

    // Agrega un evento asíncrono para gestionar la copia del comando.
    btn.addEventListener('click', async () => {

      // Envía el comando al portapapeles mediante la función importada.
      // Espera el resultado para comprobar si la copia fue exitosa.
      const ok = await copiarAlPortapapeles(btn.dataset.cmd);

      // Guarda el texto original del botón para restaurarlo posteriormente.
      const orig = btn.textContent;

      // Cambia el texto del botón según el resultado de la operación.
      btn.textContent = ok ? 'Copiado' : 'No disponible';

      // Si la copia fue exitosa, agrega una clase CSS para mostrar el estado.
      if (ok) btn.classList.add('copiado');

      // Después de 1200 milisegundos, restaura el botón a su estado original.
      setTimeout(() => {
        btn.textContent = orig;
        btn.classList.remove('copiado');
      }, 1200);
    });
  });
}

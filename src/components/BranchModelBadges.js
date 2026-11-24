
// Convierte caracteres especiales en entidades HTML para evitar que el texto introducido por los datos se interprete como código HTML.
function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Genera un gráfico de barras horizontal utilizando SVG.
 * No necesita librerías externas y permite representar
 * el porcentaje de adopción de cada modelo de ramas.
 *
 * @param {Array} modelos - Lista de modelos con nombre, adopción y color.
 * @returns {string} Código SVG del gráfico generado.
 */
export function generarSvgAdopcion(modelos) {
  // Altura asignada a cada fila del gráfico.
  const altoFila = 46;

  // Calcula la altura total según la cantidad de modelos.
  const altoTotal = Math.max(1, modelos.length) * altoFila + 28;

  // Define el ancho máximo que puede alcanzar cada barra.
  const anchoBarraMax = 300;

  // Establece la posición horizontal donde comienzan las barras.
  const xInicio = 190;

  // Recorre los modelos y genera una fila del gráfico para cada uno.
  const filas = modelos
    .map((m, idx) => {
      // Calcula la posición vertical de la fila actual.
      const y = 20 + idx * altoFila;

      // Obtiene el porcentaje de adopción y lo limita entre 0 y 100.
      const porcentaje = Math.max(0, Math.min(100, Number(m.adopcion) || 0));

      // Calcula el ancho de la barra según el porcentaje obtenido.
      const ancho = Math.round((porcentaje / 100) * anchoBarraMax);

      // Construye los elementos SVG correspondientes a esta fila.
      return `
        <g>
          <!-- Nombre del modelo de ramas. -->
          <text x="10" y="${y + 18}" font-size="13" font-weight="600" fill="#1a1d23">${escaparHtml(m.nombre)}</text>

          <!-- Fondo de la barra que representa el 100 %. -->
          <rect x="${xInicio}" y="${y + 4}" width="${anchoBarraMax}" height="20" rx="4" fill="#e5e7eb"></rect>

          <!-- Barra de color que representa el porcentaje de adopción. -->
          <rect x="${xInicio}" y="${y + 4}" width="${ancho}" height="20" rx="4" fill="${escaparHtml(m.color || '#2563eb')}"></rect>

          <!-- Porcentaje numérico de adopción. -->
          <text x="${xInicio + anchoBarraMax + 12}" y="${y + 18}" font-size="13" font-weight="700" fill="#1a1d23">${porcentaje}%</text>
        </g>
      `;
    })
    // Une todas las filas en una sola cadena de texto.
    .join('');

  // Devuelve el gráfico SVG completo.
  return `
    <svg viewBox="0 0 560 ${altoTotal}" role="img" aria-labelledby="titulo-svg-adopcion">
      <title id="titulo-svg-adopcion">Gráfico de adopción estimada por modelo de ramas</title>
      <g font-family="system-ui, -apple-system, Segoe UI, sans-serif">
        ${filas}
      </g>
    </svg>
  `.trim();
}

/**
 * Inserta en un contenedor los modelos de ramas, sus etiquetas,
 * tooltips interactivos y el gráfico SVG de adopción.
 *
 * @param {HTMLElement} contenedor - Elemento HTML donde se mostrará el contenido.
 * @param {Object} datos - Información de los modelos y nota de la fuente.
 */
export function renderBranchModelBadges(contenedor, datos) {
  // Comprueba que exista el contenedor y que se hayan recibido los modelos.
  if (!contenedor || !datos?.modelos) return;

  // Genera el gráfico SVG utilizando los datos recibidos.
  const svg = generarSvgAdopcion(datos.modelos);

  // Inserta la estructura HTML de los modelos y el gráfico en el contenedor.
  contenedor.innerHTML = `
    <div class="branch-models" aria-label="Modelos de ramificación y adopción">

      <!-- Sección que contiene las etiquetas de cada modelo de ramas. -->
      <div class="bm-badges">
        ${datos.modelos
          .map(
            (m) => `
          <div class="bm-item">

            <!-- Encabezado con el nombre y la etiqueta del modelo. -->
            <div class="bm-header">
              <span class="bm-nombre">${escaparHtml(m.nombre)}</span>

              <!-- Aplica una clase especial si el modelo es el más utilizado. -->
              <span class="bm-pill ${m.esMasUsado ? 'bm-pill-top' : ''}">${escaparHtml(m.badge)}</span>
            </div>

            <!-- Contenedor del botón y su descripción emergente. -->
            <div class="bm-tooltip-wrap">

              <!-- Botón que permite mostrar u ocultar la descripción. -->
              <button
                type="button"
                class="bm-trigger"
                aria-expanded="false"
                aria-describedby="tip-${escaparHtml(m.id)}"
              >
                ¿Cuándo elegirlo?
              </button>

              <!-- Descripción que aparece al interactuar con el botón. -->
              <div id="tip-${escaparHtml(m.id)}" class="bm-tooltip" role="tooltip">
                ${escaparHtml(m.cuandoElegirlo)}
              </div>
            </div>
          </div>
        `
          )
          // Une los elementos HTML generados para cada modelo.
          .join('')}
      </div>

      <!-- Sección que presenta el gráfico y la nota de su fuente. -->
      <figure class="bm-chart">
        ${svg}
        <figcaption class="bm-nota">${escaparHtml(datos.notaFuente)}</figcaption>
      </figure>
    </div>
  `;

  // Busca todos los botones que permiten abrir los tooltips.
  const triggers = contenedor.querySelectorAll('.bm-trigger');

  // Agrega los eventos necesarios a cada botón.
  triggers.forEach((btn) => {
    // Obtiene el elemento que contiene el botón y su tooltip.
    const item = btn.closest('.bm-item');

    // Función para abrir el tooltip.
    const abrir = () => {
      item.classList.add('tooltip-abierto');
      btn.setAttribute('aria-expanded', 'true');
    };

    // Función para cerrar el tooltip.
    const cerrar = () => {
      item.classList.remove('tooltip-abierto');
      btn.setAttribute('aria-expanded', 'false');
    };

    // Evento de clic: abre o cierra el tooltip seleccionado.
    btn.addEventListener('click', () => {
      // Comprueba si el tooltip actual ya está abierto.
      const abierto = item.classList.contains('tooltip-abierto');

      // Cierra todos los demás tooltips antes de abrir uno nuevo.
      triggers.forEach((other) => {
        other.closest('.bm-item')?.classList.remove('tooltip-abierto');
        other.setAttribute('aria-expanded', 'false');
      });

      // Si estaba cerrado, lo abre.
      if (!abierto) abrir();
    });

    // Evento de teclado: permite cerrar el tooltip con Escape.
    btn.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        cerrar();

        // Devuelve el foco al botón para facilitar la navegación.
        btn.focus();
      }
    });

    // Evento blur: cierra el tooltip cuando el botón pierde el foco.
    btn.addEventListener('blur', () => {
      setTimeout(() => {
        // Comprueba que el elemento activo ya no sea el botón.
        if (typeof document !== 'undefined' && document.activeElement !== btn) {
          cerrar();
        }
      }, 120);
    });
  });
}

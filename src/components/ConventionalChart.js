
/**
 * Metodología de estimación de Conventional Commits:
 * Los porcentajes representan una distribución típica de repositorios web públicos
 * que adoptan Conventional Commits v1.0.0:
 * - feat (34%) y fix (28%) concentran la mayor parte de los aportes funcionales.
 * - chore (14%) y docs (10%) agrupan mantenimiento de dependencias y documentación.
 * - style (6%), ci (5%) y test (3%) completan el ciclo de calidad y despliegue.
 */

// Función auxiliar que convierte caracteres especiales en entidades HTML.
// Esto evita que los textos insertados en el HTML puedan interpretarse como etiquetas.
function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')  // Reemplaza el símbolo &.
    .replace(/</g, '&lt;')   // Reemplaza el símbolo <.
    .replace(/>/g, '&gt;')   // Reemplaza el símbolo >.
    .replace(/"/g, '&quot;'); // Reemplaza las comillas dobles.
}

/**
 * Genera un gráfico donut puro en SVG usando stroke-dasharray y stroke-dashoffset.
 */
export function generarDonutSvg(tipos) {
  // Define el radio de la circunferencia del gráfico.
  const radio = 64;

  // Calcula la longitud total de la circunferencia utilizando 2 × π × radio.
  const circunferencia = 2 * Math.PI * radio;

  // Almacena la longitud acumulada de los segmentos anteriores.
  let acumulado = 0;

  // Recorre cada tipo de Conventional Commit para crear un segmento del gráfico.
  const segmentos = tipos
    .map((item) => {
      // Convierte el porcentaje en una fracción entre 0 y 1.
      // Math.max evita valores negativos y Number convierte el dato a número.
      const fraccion = Math.max(0, Number(item.porcentaje) || 0) / 100;

      // Calcula qué longitud de la circunferencia corresponde a este porcentaje.
      const longitud = fraccion * circunferencia;

      // Determina el desplazamiento del segmento para colocarlo después del anterior.
      const offset = -acumulado;

      // Actualiza la longitud acumulada para posicionar el siguiente segmento.
      acumulado += longitud;

      // Devuelve el elemento SVG que representa una parte del gráfico.
      return `
        <circle
          cx="90"
          cy="90"
          r="${radio}"
          fill="transparent"
          stroke="${escaparHtml(item.color)}"
          stroke-width="26"
          stroke-dasharray="${longitud.toFixed(2)} ${(circunferencia - longitud).toFixed(2)}"
          stroke-dashoffset="${offset.toFixed(2)}"
          transform="rotate(-90 90 90)"
        ></circle>
      `;
    })
    // Une todos los elementos circle en una sola cadena de texto.
    .join('');

  // Devuelve el SVG completo del gráfico donut.
  return `
    <svg viewBox="0 0 180 180" role="img" aria-labelledby="titulo-donut-cc">
      <title id="titulo-donut-cc">Distribución estimada de tipos de Conventional Commits</title>

      <!-- Circunferencia de fondo que sirve como base del gráfico. -->
      <circle cx="90" cy="90" r="${radio}" fill="transparent" stroke="#e5e7eb" stroke-width="26"></circle>

      <!-- Inserta todos los segmentos calculados anteriormente. -->
      ${segmentos}

      <!-- Texto central que muestra el porcentaje total. -->
      <text x="90" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#1a1d23">100%</text>

      <!-- Texto complementario ubicado debajo del porcentaje. -->
      <text x="90" y="104" text-anchor="middle" font-size="10" fill="#5b6470">commits</text>
    </svg>
  `.trim();
}

/**
 * Renderiza el gráfico donut de Conventional Commits, su leyenda y anclas hacia la guía.
 */
export function renderConventionalChart(contenedor, datos) {
  // Comprueba que exista un contenedor y que los datos incluyan la propiedad tipos.
  // Si alguna condición no se cumple, termina la función.
  if (!contenedor || !datos?.tipos) return;

  // Genera el gráfico SVG utilizando los tipos de commits recibidos.
  const svg = generarDonutSvg(datos.tipos);

  // Inserta dentro del contenedor toda la estructura HTML del gráfico.
  contenedor.innerHTML = `
    <div class="conventional-chart" aria-label="Frecuencia de tipos de Conventional Commits">

      <!-- Título principal del gráfico. -->
      <h3>Frecuencia estimada de tipos de commit</h3>

      <div class="cc-layout">

        <!-- Contenedor donde se muestra el gráfico SVG. -->
        <div class="cc-donut">
          ${svg}
        </div>

        <!-- Leyenda que explica el significado de cada segmento del gráfico. -->
        <ul class="cc-leyenda">
          ${datos.tipos
            .map(
              (t) => `
            <li class="cc-leyenda-item">

              <!-- Muestra un pequeño recuadro con el color del tipo de commit. -->
              <span class="cc-swatch" style="background: ${escaparHtml(t.color)};" aria-hidden="true"></span>

              <!-- Enlace hacia la sección de la guía correspondiente a ese tipo. -->
              <a class="cc-enlace" href="${escaparHtml(t.ancla)}">

                <!-- Nombre del tipo de commit. -->
                <code>${escaparHtml(t.tipo)}</code>

                <!-- Descripción del significado de ese tipo de commit. -->
                <span class="cc-desc">${escaparHtml(t.descripcion)}</span>
              </a>

              <!-- Porcentaje que representa ese tipo dentro de la distribución. -->
              <span class="cc-pct">${t.porcentaje}%</span>
            </li>
          `
            )
            // Une todos los elementos de la leyenda en una sola cadena HTML.
            .join('')}
        </ul>
      </div>

      <!-- Nota que explica la procedencia o las limitaciones de los porcentajes. -->
      <p class="cc-nota">${escaparHtml(datos.notaTransparencia)}</p>
    </div>
  `;
}

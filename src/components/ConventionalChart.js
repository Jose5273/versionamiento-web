/**
 * Metodología de estimación de Conventional Commits:
 * Los porcentajes representan una distribución típica de repositorios web públicos
 * que adoptan Conventional Commits v1.0.0:
 * - feat (34%) y fix (28%) concentran la mayor parte de los aportes funcionales.
 * - chore (14%) y docs (10%) agrupan mantenimiento de dependencias y documentación.
 * - style (6%), ci (5%) y test (3%) completan el ciclo de calidad y despliegue.
 */

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Genera un gráfico donut puro en SVG usando stroke-dasharray y stroke-dashoffset.
 */
export function generarDonutSvg(tipos) {
  const radio = 64;
  const circunferencia = 2 * Math.PI * radio;
  let acumulado = 0;

  const segmentos = tipos
    .map((item) => {
      const fraccion = Math.max(0, Number(item.porcentaje) || 0) / 100;
      const longitud = fraccion * circunferencia;
      const offset = -acumulado;
      acumulado += longitud;

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
    .join('');

  return `
    <svg viewBox="0 0 180 180" role="img" aria-labelledby="titulo-donut-cc">
      <title id="titulo-donut-cc">Distribución estimada de tipos de Conventional Commits</title>
      <circle cx="90" cy="90" r="${radio}" fill="transparent" stroke="#e5e7eb" stroke-width="26"></circle>
      ${segmentos}
      <text x="90" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#1a1d23">100%</text>
      <text x="90" y="104" text-anchor="middle" font-size="10" fill="#5b6470">commits</text>
    </svg>
  `.trim();
}

/**
 * Renderiza el gráfico donut de Conventional Commits, su leyenda y anclas hacia la guía.
 */
export function renderConventionalChart(contenedor, datos) {
  if (!contenedor || !datos?.tipos) return;

  const svg = generarDonutSvg(datos.tipos);

  contenedor.innerHTML = `
    <div class="conventional-chart" aria-label="Frecuencia de tipos de Conventional Commits">
      <h3>Frecuencia estimada de tipos de commit</h3>
      <div class="cc-layout">
        <div class="cc-donut">
          ${svg}
        </div>
        <ul class="cc-leyenda">
          ${datos.tipos
            .map(
              (t) => `
            <li class="cc-leyenda-item">
              <span class="cc-swatch" style="background: ${escaparHtml(t.color)};" aria-hidden="true"></span>
              <a class="cc-enlace" href="${escaparHtml(t.ancla)}">
                <code>${escaparHtml(t.tipo)}</code>
                <span class="cc-desc">${escaparHtml(t.descripcion)}</span>
              </a>
              <span class="cc-pct">${t.porcentaje}%</span>
            </li>
          `
            )
            .join('')}
        </ul>
      </div>
      <p class="cc-nota">${escaparHtml(datos.notaTransparencia)}</p>
    </div>
  `;
}

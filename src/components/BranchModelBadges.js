function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Genera un gráfico de barras horizontal ligero en SVG (< 20 KB) sin dependencias externas.
 */
export function generarSvgAdopcion(modelos) {
  const altoFila = 46;
  const altoTotal = Math.max(1, modelos.length) * altoFila + 28;
  const anchoBarraMax = 300;
  const xInicio = 190;

  const filas = modelos
    .map((m, idx) => {
      const y = 20 + idx * altoFila;
      const porcentaje = Math.max(0, Math.min(100, Number(m.adopcion) || 0));
      const ancho = Math.round((porcentaje / 100) * anchoBarraMax);
      return `
        <g>
          <text x="10" y="${y + 18}" font-size="13" font-weight="600" fill="#1a1d23">${escaparHtml(m.nombre)}</text>
          <rect x="${xInicio}" y="${y + 4}" width="${anchoBarraMax}" height="20" rx="4" fill="#e5e7eb"></rect>
          <rect x="${xInicio}" y="${y + 4}" width="${ancho}" height="20" rx="4" fill="${escaparHtml(m.color || '#2563eb')}"></rect>
          <text x="${xInicio + anchoBarraMax + 12}" y="${y + 18}" font-size="13" font-weight="700" fill="#1a1d23">${porcentaje}%</text>
        </g>
      `;
    })
    .join('');

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
 * Renderiza los badges de modelos de ramas, tooltips accesibles con teclado y gráfico SVG de adopción.
 */
export function renderBranchModelBadges(contenedor, datos) {
  if (!contenedor || !datos?.modelos) return;

  const svg = generarSvgAdopcion(datos.modelos);

  contenedor.innerHTML = `
    <div class="branch-models" aria-label="Modelos de ramificación y adopción">
      <div class="bm-badges">
        ${datos.modelos
          .map(
            (m) => `
          <div class="bm-item">
            <div class="bm-header">
              <span class="bm-nombre">${escaparHtml(m.nombre)}</span>
              <span class="bm-pill ${m.esMasUsado ? 'bm-pill-top' : ''}">${escaparHtml(m.badge)}</span>
            </div>
            <div class="bm-tooltip-wrap">
              <button
                type="button"
                class="bm-trigger"
                aria-expanded="false"
                aria-describedby="tip-${escaparHtml(m.id)}"
              >
                ¿Cuándo elegirlo?
              </button>
              <div id="tip-${escaparHtml(m.id)}" class="bm-tooltip" role="tooltip">
                ${escaparHtml(m.cuandoElegirlo)}
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      <figure class="bm-chart">
        ${svg}
        <figcaption class="bm-nota">${escaparHtml(datos.notaFuente)}</figcaption>
      </figure>
    </div>
  `;

  const triggers = contenedor.querySelectorAll('.bm-trigger');
  triggers.forEach((btn) => {
    const item = btn.closest('.bm-item');

    const abrir = () => {
      item.classList.add('tooltip-abierto');
      btn.setAttribute('aria-expanded', 'true');
    };

    const cerrar = () => {
      item.classList.remove('tooltip-abierto');
      btn.setAttribute('aria-expanded', 'false');
    };

    btn.addEventListener('click', () => {
      const abierto = item.classList.contains('tooltip-abierto');
      triggers.forEach((other) => {
        other.closest('.bm-item')?.classList.remove('tooltip-abierto');
        other.setAttribute('aria-expanded', 'false');
      });
      if (!abierto) abrir();
    });

    btn.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        cerrar();
        btn.focus();
      }
    });

    btn.addEventListener('blur', () => {
      setTimeout(() => {
        if (typeof document !== 'undefined' && document.activeElement !== btn) {
          cerrar();
        }
      }, 120);
    });
  });
}

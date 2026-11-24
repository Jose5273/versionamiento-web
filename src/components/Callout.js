function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const ETIQUETA_TIPO = {
  warning: 'Advertencia',
  danger: 'Peligro crítico',
  info: 'Información',
};

/**
 * Renderiza un banner Callout reutilizable con variantes warning, danger o info.
 */
export function renderCallout({ tipo = 'info', titulo, texto }) {
  const variante = Object.hasOwn(ETIQUETA_TIPO, tipo) ? tipo : 'info';
  const role = variante === 'danger' ? 'alert' : 'note';
  const etiqueta = ETIQUETA_TIPO[variante];

  return `
    <aside class="callout callout-${variante}" role="${role}" aria-label="${escaparHtml(etiqueta)}: ${escaparHtml(titulo)}">
      <div class="callout-head">
        <span class="callout-badge">${escaparHtml(etiqueta)}</span>
        <strong class="callout-titulo">${escaparHtml(titulo)}</strong>
      </div>
      <p class="callout-texto">${escaparHtml(texto)}</p>
    </aside>
  `.trim();
}

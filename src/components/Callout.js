
// Función que convierte caracteres especiales en entidades HTML.
// Esto evita que los textos recibidos se interpreten como etiquetas o código HTML.
function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Diccionario que relaciona cada tipo de Callout con su etiqueta visible.
const ETIQUETA_TIPO = {
  warning: 'Advertencia',
  danger: 'Peligro crítico',
  info: 'Información',
};

/**
 * Genera un banner informativo reutilizable (Callout).
 * Permite mostrar mensajes de advertencia, peligro crítico o información.
 *
 * @param {Object} parametros - Datos necesarios para construir el Callout.
 * @param {string} parametros.tipo - Tipo de mensaje: warning, danger o info.
 * @param {string} parametros.titulo - Título que aparecerá en el banner.
 * @param {string} parametros.texto - Contenido descriptivo del mensaje.
 * @returns {string} Estructura HTML del banner generado.
 */
export function renderCallout({ tipo = 'info', titulo, texto }) {

  // Comprueba si el tipo recibido existe en el diccionario.
  // Si no existe, utiliza el tipo info como valor predeterminado.
  const variante = Object.hasOwn(ETIQUETA_TIPO, tipo) ? tipo : 'info';

  // Asigna el rol de accesibilidad según la importancia del mensaje.
  // Los mensajes críticos utilizan alert para informar a tecnologías asistivas.
  // Los demás utilizan note para identificarlos como contenido complementario.
  const role = variante === 'danger' ? 'alert' : 'note';

  // Obtiene el texto que corresponde al tipo de mensaje seleccionado.
  const etiqueta = ETIQUETA_TIPO[variante];

  // Construye y devuelve el HTML del banner.
  return `
    <!-- Contenedor principal del Callout.
         La clase CSS cambia según la variante seleccionada. -->
    <aside class="callout callout-${variante}" role="${role}" aria-label="${escaparHtml(etiqueta)}: ${escaparHtml(titulo)}">

      <!-- Encabezado que contiene la etiqueta y el título del mensaje. -->
      <div class="callout-head">

        <!-- Etiqueta visual que identifica el tipo de mensaje. -->
        <span class="callout-badge">${escaparHtml(etiqueta)}</span>

        <!-- Título principal del Callout. -->
        <strong class="callout-titulo">${escaparHtml(titulo)}</strong>
      </div>

      <!-- Texto descriptivo que explica el mensaje. -->
      <p class="callout-texto">${escaparHtml(texto)}</p>
    </aside>
  `.trim();
}

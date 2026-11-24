
// Importa la función que permite copiar comandos al portapapeles
// desde el módulo TopCommands.js.
import { copiarAlPortapapeles } from './TopCommands.js';

// Convierte caracteres especiales en entidades HTML para evitar
// que el contenido recibido se interprete como código HTML.
function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Escapa los caracteres especiales de una expresión regular.
// Esto permite buscar textos que contienen símbolos como *, +, ?, [, etc.
// sin que estos sean interpretados como operadores de expresión regular.
function escaparRegex(texto) {
  return String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Crea una función debounced que pospone la ejecución hasta transcurrida la espera.
 */
export function crearDebounce(fn, esperaMs = 200) {
  // Variable que almacenará el identificador del temporizador.
  let temporizador;

  // Devuelve una nueva función que recibe los mismos argumentos.
  return (...args) => {

    // Cancela el temporizador anterior si todavía estaba pendiente.
    clearTimeout(temporizador);

    // Programa la ejecución de la función después del tiempo establecido.
    // Si vuelve a ejecutarse antes de terminar la espera, el temporizador se reinicia.
    temporizador = setTimeout(() => fn(...args), esperaMs);
  };
}

/**
 * Escapa HTML del texto y resalta todas las coincidencias del término buscado.
 */
export function resaltarCoincidencia(texto, termino) {

  // Primero convierte el texto en una versión segura para insertar en HTML.
  const seguro = escaparHtml(texto);

  // Convierte el término de búsqueda a texto y elimina espacios sobrantes.
  const q = String(termino || '').trim();

  // Si no existe un término de búsqueda, devuelve el texto sin resaltados.
  if (!q) return seguro;

  // Construye una expresión regular para encontrar todas las coincidencias.
  // Se utiliza gi para buscar sin distinguir mayúsculas y minúsculas
  // y encontrar todas las coincidencias dentro del texto.
  const regex = new RegExp(`(${escaparRegex(escaparHtml(q))})`, 'gi');

  // Reemplaza cada coincidencia por una etiqueta mark que permite resaltarla con CSS.
  return seguro.replace(regex, '<mark class="resaltado">$1</mark>');
}

/**
 * Filtra comandos por término de búsqueda y por múltiples etiquetas activas (AND).
 */
export function buscarComandos(comandos, { termino = '', etiquetasActivas = [] } = {}) {

  // Convierte el término de búsqueda a minúsculas y elimina espacios sobrantes.
  const q = String(termino || '').trim().toLowerCase();

  // Comprueba que las etiquetas activas sean un arreglo.
  // Si no lo son, utiliza una lista vacía.
  const tags = Array.isArray(etiquetasActivas) ? etiquetasActivas : [];

  // Filtra la lista original y conserva únicamente los comandos que coinciden.
  return comandos.filter((item) => {

    // Comprueba que el comando contenga TODAS las etiquetas seleccionadas.
    // every() devuelve true solamente si todos los elementos cumplen la condición.
    const coincideTags = tags.every((tag) => item.etiquetas.includes(tag));

    // Si no coinciden todas las etiquetas, descarta el comando.
    if (!coincideTags) return false;

    // Si no hay texto de búsqueda, conserva el comando si pasó el filtro de etiquetas.
    if (!q) return true;

    // Comprueba si el término aparece en el comando, su descripción
    // o alguna de sus etiquetas.
    return (
      item.comando.toLowerCase().includes(q) ||
      item.descripcion.toLowerCase().includes(q) ||
      item.etiquetas.some((t) => t.toLowerCase().includes(q))
    );
  });
}

/**
 * Renderiza el buscador interactivo de comandos con filtros multiselección por etiqueta.
 */
export function renderCommandSearch(contenedor, comandos) {

  // Comprueba que exista el contenedor y que los comandos sean un arreglo.
  if (!contenedor || !Array.isArray(comandos)) return;

  // Define las etiquetas disponibles para filtrar los comandos.
  const etiquetasDisponibles = ['#rama', '#conflicto', '#deshacer', '#tag', '#remoto', '#historial', '#staging', '#config'];

  // Set almacena las etiquetas que el usuario ha seleccionado.
  // Evita que una misma etiqueta se agregue varias veces.
  const activas = new Set();

  // Construye e inserta la estructura HTML del buscador.
  contenedor.innerHTML = `
    <div id="buscador-completo" class="cmd-search" aria-labelledby="titulo-buscador-all">

      <!-- Título del buscador y cantidad total de comandos disponibles. -->
      <h3 id="titulo-buscador-all">Buscador general de comandos (${comandos.length} comandos)</h3>

      <!-- Explicación del funcionamiento de la búsqueda y los filtros. -->
      <p class="cs-desc">Busca por comando o descripción y combina etiquetas (multiselección) para filtrar casos de uso.</p>

      <!-- Contenedor de los controles de búsqueda. -->
      <div class="cs-controles">

        <!-- Etiqueta descriptiva del campo de búsqueda. -->
        <label class="cs-label-input" for="cs-input">Buscar comando Git</label>

        <!-- Campo de búsqueda y botón para limpiar los filtros. -->
        <div class="cs-fila-input">
          <input
            type="search"
            id="cs-input"
            class="cs-input"
            placeholder="Ej. rebase, conflict, reset, tag..."
            aria-label="Buscar comando Git por texto o etiqueta"
          />

          <!-- Botón que restablece la búsqueda y las etiquetas seleccionadas. -->
          <button type="button" id="cs-limpiar" class="cs-limpiar">Limpiar</button>
        </div>

        <!-- Grupo de botones que representan las etiquetas disponibles. -->
        <div class="cs-tags" role="group" aria-label="Filtrar por etiquetas">

          <!-- Genera un botón para cada etiqueta disponible. -->
          ${etiquetasDisponibles
            .map(
              (tag) =>
                `<button type="button" class="cs-tag-btn" data-tag="${tag}" aria-pressed="false">${tag}</button>`
            )
            .join('')}
        </div>
      </div>

      <!-- Muestra cuántos comandos coinciden con los filtros actuales. -->
      <p class="cs-contador" id="cs-contador" aria-live="polite"></p>

      <!-- Contenedor donde aparecerán los resultados de la búsqueda. -->
      <div class="cs-resultados" id="cs-resultados"></div>
    </div>
  `;

  // Obtiene los elementos HTML para poder interactuar con ellos desde JavaScript.
  const input = contenedor.querySelector('#cs-input');
  const btnLimpiar = contenedor.querySelector('#cs-limpiar');
  const btnsTag = contenedor.querySelectorAll('.cs-tag-btn');
  const elContador = contenedor.querySelector('#cs-contador');
  const elResultados = contenedor.querySelector('#cs-resultados');

  // Función que realiza la búsqueda y actualiza visualmente los resultados.
  function pintar() {

    // Obtiene el texto escrito por el usuario.
    const termino = input.value;

    // Filtra los comandos utilizando el texto y las etiquetas seleccionadas.
    const lista = buscarComandos(comandos, {
      termino,
      etiquetasActivas: Array.from(activas),
    });

    // Actualiza el contador para informar cuántos resultados se encontraron.
    elContador.textContent = `Mostrando ${lista.length} de ${comandos.length} comandos`;

    // Comprueba si la búsqueda no produjo ningún resultado.
    if (lista.length === 0) {

      // Muestra un mensaje indicando que no existen coincidencias.
      elResultados.innerHTML = `
        <div class="cs-vacio" role="status">
          <p><strong>No hay resultados</strong> para los criterios seleccionados.</p>
          <p>Prueba borrando el texto o desactivando alguna etiqueta.</p>
        </div>
      `;
      return;
    }

    // Recorre los comandos encontrados y genera una tarjeta HTML para cada uno.
    elResultados.innerHTML = lista
      .map(
        (item) => `
      <article class="cs-card">

        <!-- Encabezado de la tarjeta: comando y botón para copiarlo. -->
        <div class="cs-card-head">

          <!-- Muestra el comando y resalta las coincidencias de búsqueda. -->
          <code class="cs-cmd">${resaltarCoincidencia(item.comando, termino)}</code>

          <!-- Botón que permite copiar el comando al portapapeles. -->
          <button
            type="button"
            class="cs-copiar"
            data-cmd="${escaparHtml(item.comando)}"
            aria-label="Copiar comando ${escaparHtml(item.comando)}"
          >Copiar</button>
        </div>

        <!-- Muestra la descripción del comando resaltando las coincidencias. -->
        <p class="cs-card-desc">${resaltarCoincidencia(item.descripcion, termino)}</p>

        <!-- Contenedor de las etiquetas asociadas al comando. -->
        <div class="cs-card-tags">

          <!-- Genera una etiqueta visual por cada categoría del comando. -->
          ${item.etiquetas.map((t) => `<span class="cs-chip">${escaparHtml(t)}</span>`).join('')}
        </div>
      </article>
    `
      )
      // Une todas las tarjetas generadas en una sola cadena HTML.
      .join('');

    // Busca los botones de copiar que se acaban de generar en los resultados.
    elResultados.querySelectorAll('.cs-copiar').forEach((btn) => {

      // Agrega un evento asíncrono para ejecutar la acción de copiar.
      btn.addEventListener('click', async () => {

        // Copia el comando almacenado en el atributo data-cmd.
        // Espera el resultado para saber si la operación fue exitosa.
        const ok = await copiarAlPortapapeles(btn.dataset.cmd);

        // Guarda el texto original del botón.
        const orig = btn.textContent;

        // Cambia el texto según el resultado de la copia.
        btn.textContent = ok ? 'Copiado' : 'No disponible';

        // Si la copia fue exitosa, agrega una clase CSS de confirmación.
        if (ok) btn.classList.add('copiado');

        // Después de 1200 milisegundos, restaura el botón a su estado original.
        setTimeout(() => {
          btn.textContent = orig;
          btn.classList.remove('copiado');
        }, 1200);
      });
    });
  }

  // Crea una versión de la función pintar con debounce de 200 milisegundos.
  // Evita actualizar los resultados inmediatamente por cada pulsación del teclado.
  const pintarDebounced = crearDebounce(pintar, 200);

  // Detecta los cambios en el campo de búsqueda.
  // Ejecuta la búsqueda después del tiempo de espera establecido por debounce.
  input.addEventListener('input', pintarDebounced);

  // Recorre todos los botones de etiquetas para asignarles eventos de clic.
  btnsTag.forEach((btn) => {

    // Detecta cuando el usuario selecciona o deselecciona una etiqueta.
    btn.addEventListener('click', () => {

      // Obtiene el nombre de la etiqueta desde el atributo data-tag del botón.
      const tag = btn.dataset.tag;

      // Comprueba si la etiqueta ya se encuentra seleccionada.
      if (activas.has(tag)) {

        // Si ya estaba seleccionada, la elimina del conjunto de etiquetas activas.
        activas.delete(tag);

        // Quita la clase CSS que indica que el botón está seleccionado.
        btn.classList.remove('activo');

        // Actualiza el estado de accesibilidad del botón.
        btn.setAttribute('aria-pressed', 'false');
      } else {

        // Si no estaba seleccionada, la agrega al conjunto de etiquetas activas.
        activas.add(tag);

        // Agrega la clase CSS para representar visualmente la selección.
        btn.classList.add('activo');

        // Actualiza el estado de accesibilidad del botón.
        btn.setAttribute('aria-pressed', 'true');
      }

      // Actualiza los resultados inmediatamente después de cambiar una etiqueta.
      pintar();
    });
  });

  // Agrega el evento de clic al botón Limpiar.
  btnLimpiar.addEventListener('click', () => {

    // Borra el texto que se encuentra en el campo de búsqueda.
    input.value = '';

    // Elimina todas las etiquetas seleccionadas.
    activas.clear();

    // Recorre los botones de etiquetas para restablecer su apariencia y estado.
    btnsTag.forEach((btn) => {
      btn.classList.remove('activo');
      btn.setAttribute('aria-pressed', 'false');
    });

    // Vuelve a mostrar todos los comandos sin filtros.
    pintar();

    // Devuelve el cursor al campo de búsqueda para facilitar una nueva consulta.
    input.focus();
  });

  // Ejecuta la primera búsqueda al cargar el buscador.
  // Como no existen filtros activos, muestra todos los comandos disponibles.
  pintar();
}

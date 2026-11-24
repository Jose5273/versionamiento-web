import { copiarAlPortapapeles } from './TopCommands.js';

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escaparRegex(texto) {
  return String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Crea una función debounced que pospone la ejecución hasta transcurrida la espera.
 */
export function crearDebounce(fn, esperaMs = 200) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn(...args), esperaMs);
  };
}

/**
 * Escapa HTML del texto y resalta todas las coincidencias del término buscado.
 */
export function resaltarCoincidencia(texto, termino) {
  const seguro = escaparHtml(texto);
  const q = String(termino || '').trim();
  if (!q) return seguro;

  const regex = new RegExp(`(${escaparRegex(escaparHtml(q))})`, 'gi');
  return seguro.replace(regex, '<mark class="resaltado">$1</mark>');
}

/**
 * Filtra comandos por término de búsqueda y por múltiples etiquetas activas (AND).
 */
export function buscarComandos(comandos, { termino = '', etiquetasActivas = [] } = {}) {
  const q = String(termino || '').trim().toLowerCase();
  const tags = Array.isArray(etiquetasActivas) ? etiquetasActivas : [];

  return comandos.filter((item) => {
    const coincideTags = tags.every((tag) => item.etiquetas.includes(tag));
    if (!coincideTags) return false;
    if (!q) return true;

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
  if (!contenedor || !Array.isArray(comandos)) return;

  const etiquetasDisponibles = ['#rama', '#conflicto', '#deshacer', '#tag', '#remoto', '#historial', '#staging', '#config'];
  const activas = new Set();

  contenedor.innerHTML = `
    <div id="buscador-completo" class="cmd-search" aria-labelledby="titulo-buscador-all">
      <h3 id="titulo-buscador-all">Buscador general de comandos (${comandos.length} comandos)</h3>
      <p class="cs-desc">Busca por comando o descripción y combina etiquetas (multiselección) para filtrar casos de uso.</p>

      <div class="cs-controles">
        <label class="cs-label-input" for="cs-input">Buscar comando Git</label>
        <div class="cs-fila-input">
          <input
            type="search"
            id="cs-input"
            class="cs-input"
            placeholder="Ej. rebase, conflict, reset, tag..."
            aria-label="Buscar comando Git por texto o etiqueta"
          />
          <button type="button" id="cs-limpiar" class="cs-limpiar">Limpiar</button>
        </div>

        <div class="cs-tags" role="group" aria-label="Filtrar por etiquetas">
          ${etiquetasDisponibles
            .map(
              (tag) =>
                `<button type="button" class="cs-tag-btn" data-tag="${tag}" aria-pressed="false">${tag}</button>`
            )
            .join('')}
        </div>
      </div>

      <p class="cs-contador" id="cs-contador" aria-live="polite"></p>
      <div class="cs-resultados" id="cs-resultados"></div>
    </div>
  `;

  const input = contenedor.querySelector('#cs-input');
  const btnLimpiar = contenedor.querySelector('#cs-limpiar');
  const btnsTag = contenedor.querySelectorAll('.cs-tag-btn');
  const elContador = contenedor.querySelector('#cs-contador');
  const elResultados = contenedor.querySelector('#cs-resultados');

  function pintar() {
    const termino = input.value;
    const lista = buscarComandos(comandos, {
      termino,
      etiquetasActivas: Array.from(activas),
    });

    elContador.textContent = `Mostrando ${lista.length} de ${comandos.length} comandos`;

    if (lista.length === 0) {
      elResultados.innerHTML = `
        <div class="cs-vacio" role="status">
          <p><strong>No hay resultados</strong> para los criterios seleccionados.</p>
          <p>Prueba borrando el texto o desactivando alguna etiqueta.</p>
        </div>
      `;
      return;
    }

    elResultados.innerHTML = lista
      .map(
        (item) => `
      <article class="cs-card">
        <div class="cs-card-head">
          <code class="cs-cmd">${resaltarCoincidencia(item.comando, termino)}</code>
          <button
            type="button"
            class="cs-copiar"
            data-cmd="${escaparHtml(item.comando)}"
            aria-label="Copiar comando ${escaparHtml(item.comando)}"
          >Copiar</button>
        </div>
        <p class="cs-card-desc">${resaltarCoincidencia(item.descripcion, termino)}</p>
        <div class="cs-card-tags">
          ${item.etiquetas.map((t) => `<span class="cs-chip">${escaparHtml(t)}</span>`).join('')}
        </div>
      </article>
    `
      )
      .join('');

    elResultados.querySelectorAll('.cs-copiar').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const ok = await copiarAlPortapapeles(btn.dataset.cmd);
        const orig = btn.textContent;
        btn.textContent = ok ? 'Copiado' : 'No disponible';
        if (ok) btn.classList.add('copiado');
        setTimeout(() => {
          btn.textContent = orig;
          btn.classList.remove('copiado');
        }, 1200);
      });
    });
  }

  const pintarDebounced = crearDebounce(pintar, 200);

  input.addEventListener('input', pintarDebounced);

  btnsTag.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      if (activas.has(tag)) {
        activas.delete(tag);
        btn.classList.remove('activo');
        btn.setAttribute('aria-pressed', 'false');
      } else {
        activas.add(tag);
        btn.classList.add('activo');
        btn.setAttribute('aria-pressed', 'true');
      }
      pintar();
    });
  });

  btnLimpiar.addEventListener('click', () => {
    input.value = '';
    activas.clear();
    btnsTag.forEach((btn) => {
      btn.classList.remove('activo');
      btn.setAttribute('aria-pressed', 'false');
    });
    pintar();
    input.focus();
  });

  pintar();
}

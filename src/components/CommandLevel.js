import { copiarAlPortapapeles } from './TopCommands.js';

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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
 * Agrupa los comandos en los 3 niveles (esencial, frecuente, ocasional) eliminando duplicados.
 */
export function agruparPorNivel(comandos) {
  const grupos = {
    esencial: [],
    frecuente: [],
    ocasional: [],
  };
  const vistos = new Set();

  for (const item of comandos) {
    if (!item?.comando || vistos.has(item.comando)) continue;
    vistos.add(item.comando);
    const nivel = Object.hasOwn(grupos, item.nivel) ? item.nivel : 'ocasional';
    grupos[nivel].push(item);
  }

  return grupos;
}

/**
 * Renderiza navegación por niveles con scroll suave y los 3 bloques organizados (🔥, ⚡, 🧊).
 */
export function renderCommandLevel(contenedor, comandos) {
  if (!contenedor || !Array.isArray(comandos)) return;

  const grupos = agruparPorNivel(comandos);

  contenedor.innerHTML = `
    <div class="cmd-levels" aria-label="Comandos organizados por nivel de uso">
      <nav class="cl-tabs" aria-label="Saltar a nivel de comando">
        ${NIVELES_CONFIG.map(
          (n) => `
          <a class="cl-tab cl-tab-${n.id}" href="#${n.ancla}" data-target="${n.ancla}">
            <span aria-hidden="true">${n.icono}</span>
            <span>${n.titulo.split(' ')[0]}</span>
            <span class="cl-count">${grupos[n.id].length}</span>
          </a>
        `
        ).join('')}
      </nav>

      <div class="cl-bloques">
        ${NIVELES_CONFIG.map((n) => {
          const items = grupos[n.id];
          return `
            <section id="${n.ancla}" class="cl-bloque cl-bloque-${n.id}" aria-labelledby="titulo-${n.ancla}">
              <header class="cl-bloque-head">
                <div>
                  <h3 id="titulo-${n.ancla}">
                    <span aria-hidden="true">${n.icono}</span> ${escaparHtml(n.titulo)}
                  </h3>
                  <p class="cl-subtitulo">${escaparHtml(n.subtitulo)}</p>
                </div>
                <span class="cl-badge">${items.length} comandos</span>
              </header>

              <div class="cl-grid">
                ${items
                  .map(
                    (item) => `
                  <article class="cl-item">
                    <div class="cl-item-top">
                      <code class="cl-cmd">${escaparHtml(item.comando)}</code>
                      <button
                        type="button"
                        class="cl-copiar"
                        data-cmd="${escaparHtml(item.comando)}"
                        aria-label="Copiar comando ${escaparHtml(item.comando)}"
                      >Copiar</button>
                    </div>
                    <p class="cl-item-desc">${escaparHtml(item.descripcion)}</p>
                    <div class="cl-tags">
                      ${(item.etiquetas || [])
                        .map((t) => `<span class="cl-tag">${escaparHtml(t)}</span>`)
                        .join('')}
                    </div>
                  </article>
                `
                  )
                  .join('')}
              </div>
            </section>
          `;
        }).join('')}
      </div>
    </div>
  `;

  contenedor.querySelectorAll('.cl-tab').forEach((enlace) => {
    enlace.addEventListener('click', (ev) => {
      const targetId = enlace.dataset.target;
      const destino = targetId ? document.getElementById(targetId) : null;
      if (destino?.scrollIntoView) {
        ev.preventDefault();
        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  contenedor.querySelectorAll('.cl-copiar').forEach((btn) => {
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

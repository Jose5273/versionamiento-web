/**
 * Escapa caracteres HTML especiales para evitar inyección en plantillas.
 */
function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Copia texto al portapapeles usando navigator.clipboard con fallback vía textarea.
 */
export async function copiarAlPortapapeles(texto) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch {
      // Continúa al fallback clásico si la API moderna falla o no está permitida.
    }
  }

  if (typeof document === 'undefined' || !document.createElement || !document.body) {
    return false;
  }

  const area = document.createElement('textarea');
  area.value = texto;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();

  let copiado = false;
  try {
    copiado = typeof document.execCommand === 'function' && document.execCommand('copy');
  } catch {
    copiado = false;
  } finally {
    area.remove();
  }
  return copiado;
}

/**
 * Filtra la lista de comandos top 10 por rol (todos, junior, senior, lead).
 */
export function filtrarTopComandos(comandos, rol = 'todos') {
  const rolNormalizado = String(rol).trim().toLowerCase();
  if (!rolNormalizado || rolNormalizado === 'todos') {
    return [...comandos];
  }
  return comandos.filter((item) => item.rol.toLowerCase() === rolNormalizado);
}

/**
 * Renderiza la sección interactiva "Top 10 comandos Git" con ranking, filtro por rol y copiado.
 */
export function renderTopCommands(contenedor, comandos) {
  if (!contenedor) return;

  const roles = [
    { id: 'todos', etiqueta: 'Todos' },
    { id: 'junior', etiqueta: 'Junior' },
    { id: 'senior', etiqueta: 'Senior' },
    { id: 'lead', etiqueta: 'Lead' },
  ];

  contenedor.innerHTML = `
    <section id="top-comandos" class="top-commands" aria-labelledby="titulo-top-comandos">
      <h2 id="titulo-top-comandos">Top 10 comandos Git</h2>
      <p>Ranking de los comandos más utilizados en el flujo colaborativo del equipo. Filtra por perfil y copia cualquier comando al instante.</p>

      <div class="top-filtros" role="tablist" aria-label="Filtrar top 10 comandos por rol">
        ${roles
          .map(
            (r, idx) =>
              `<button type="button" class="top-btn-rol ${idx === 0 ? 'activo' : ''}" role="tab" aria-selected="${
                idx === 0 ? 'true' : 'false'
              }" data-rol="${r.id}">${r.etiqueta}</button>`
          )
          .join('')}
      </div>

      <div class="top-tabla-wrap">
        <table class="top-tabla">
          <caption><strong>Ranking.</strong> Comandos ordenados por frecuencia de uso y rol recomendado.</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Comando</th>
              <th scope="col">Descripción</th>
              <th scope="col">Frecuencia</th>
              <th scope="col">Rol</th>
              <th scope="col">Acción</th>
            </tr>
          </thead>
          <tbody id="top-comandos-body"></tbody>
        </table>
      </div>
    </section>
  `;

  const tbody = contenedor.querySelector('#top-comandos-body');
  const botonesRol = contenedor.querySelectorAll('.top-btn-rol');

  function pintarFilas(rolActivo) {
    const lista = filtrarTopComandos(comandos, rolActivo);
    if (lista.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No hay comandos registrados para este rol.</td></tr>';
      return;
    }

    tbody.innerHTML = lista
      .map(
        (item) => `
      <tr class="top-fila">
        <td data-label="Ranking"><span class="top-rank">#${item.ranking}</span></td>
        <td data-label="Comando">
          <code class="top-cmd">${escaparHtml(item.comando)}</code>
          <div class="top-tags">${item.etiquetas.map((t) => `<span class="top-tag">${escaparHtml(t)}</span>`).join('')}</div>
        </td>
        <td data-label="Descripción">${escaparHtml(item.descripcion)}</td>
        <td data-label="Frecuencia"><span class="top-freq">${escaparHtml(item.frecuencia)}</span></td>
        <td data-label="Rol"><span class="top-rol top-rol-${escaparHtml(item.rol)}">${escaparHtml(item.rol)}</span></td>
        <td data-label="Acción">
          <button type="button" class="top-btn-copiar" data-cmd="${escaparHtml(item.comando)}" aria-label="Copiar comando ${escaparHtml(item.comando)}">Copiar</button>
        </td>
      </tr>
    `
      )
      .join('');

    tbody.querySelectorAll('.top-btn-copiar').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const ok = await copiarAlPortapapeles(btn.dataset.cmd);
        const textoOriginal = btn.textContent;
        btn.textContent = ok ? 'Copiado' : 'No disponible';
        if (ok) btn.classList.add('copiado');
        setTimeout(() => {
          btn.textContent = textoOriginal;
          btn.classList.remove('copiado');
        }, 1200);
      });
    });
  }

  botonesRol.forEach((btn) => {
    btn.addEventListener('click', () => {
      botonesRol.forEach((b) => {
        b.classList.remove('activo');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('activo');
      btn.setAttribute('aria-selected', 'true');
      pintarFilas(btn.dataset.rol);
    });
  });

  pintarFilas('todos');
}

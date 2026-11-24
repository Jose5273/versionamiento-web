
/**
 * Escapa caracteres HTML especiales para evitar inyección en plantillas.
 */
function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')   // Convierte el carácter & en una entidad HTML.
    .replace(/</g, '&lt;')    // Evita que se interprete como el inicio de una etiqueta HTML.
    .replace(/>/g, '&gt;')    // Evita que se interprete como el cierre de una etiqueta HTML.
    .replace(/"/g, '&quot;'); // Convierte las comillas dobles en entidades HTML.
}

/**
 * Copia texto al portapapeles usando navigator.clipboard con fallback vía textarea.
 */
export async function copiarAlPortapapeles(texto) {
  // Comprueba que navigator exista y que el navegador tenga disponible
  // la API moderna para escribir texto en el portapapeles.
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      // Intenta copiar el texto utilizando la API moderna del navegador.
      // await espera a que termine la operación de copiado.
      await navigator.clipboard.writeText(texto);

      // Si la copia funciona, devuelve true y termina la función.
      return true;
    } catch {
      // Continúa al fallback clásico si la API moderna falla o no está permitida.
    }
  }

  // Comprueba que exista document y que se puedan crear elementos HTML
  // y acceder al body de la página.
  // Si no se cumplen estas condiciones, no es posible utilizar el fallback.
  if (typeof document === 'undefined' || !document.createElement || !document.body) {
    return false;
  }

  // Crea un elemento textarea temporal para almacenar el texto que se copiará.
  const area = document.createElement('textarea');

  // Coloca dentro del textarea el texto que se desea copiar.
  area.value = texto;

  // Establece el atributo readonly para evitar que el usuario lo modifique.
  area.setAttribute('readonly', '');

  // Fija el textarea en la pantalla para que no altere el diseño de la página.
  area.style.position = 'fixed';

  // Hace invisible el textarea.
  area.style.opacity = '0';

  // Añade temporalmente el textarea al documento HTML.
  document.body.appendChild(area);

  // Selecciona el texto contenido en el textarea para prepararlo para la copia.
  area.select();

  // Variable que almacenará si la operación de copiado tuvo éxito.
  let copiado = false;

  try {
    // Comprueba si execCommand está disponible y ejecuta la instrucción copy.
    // El resultado será true si el navegador logra copiar el texto.
    copiado = typeof document.execCommand === 'function' && document.execCommand('copy');
  } catch {
    // Si ocurre un error durante la copia, registra el resultado como falso.
    copiado = false;
  } finally {
    // Elimina el textarea temporal tanto si la copia funciona como si falla.
    area.remove();
  }

  // Devuelve el resultado final de la operación de copiado.
  return copiado;
}

/**
 * Filtra la lista de comandos top 10 por rol (todos, junior, senior, lead).
 */
export function filtrarTopComandos(comandos, rol = 'todos') {
  // Convierte el rol recibido a texto, elimina espacios al inicio y al final
  // y transforma todas las letras a minúsculas.
  const rolNormalizado = String(rol).trim().toLowerCase();

  // Si no se especificó un rol o se seleccionó todos,
  // devuelve una copia del arreglo completo de comandos.
  if (!rolNormalizado || rolNormalizado === 'todos') {
    return [...comandos];
  }

  // Recorre los comandos y conserva únicamente aquellos
  // cuyo rol coincida con el rol seleccionado.
  return comandos.filter((item) => item.rol.toLowerCase() === rolNormalizado);
}

/**
 * Renderiza la sección interactiva "Top 10 comandos Git" con ranking, filtro por rol y copiado.
 */
export function renderTopCommands(contenedor, comandos) {
  // Comprueba que exista el elemento HTML donde se mostrará la sección.
  // Si no existe, termina la función.
  if (!contenedor) return;

  // Define los roles disponibles para filtrar los comandos.
  // Cada objeto contiene un identificador y una etiqueta visible.
  const roles = [
    { id: 'todos', etiqueta: 'Todos' },
    { id: 'junior', etiqueta: 'Junior' },
    { id: 'senior', etiqueta: 'Senior' },
    { id: 'lead', etiqueta: 'Lead' },
  ];

  // Construye la estructura HTML principal de la sección.
  // innerHTML reemplaza el contenido anterior del contenedor.
  contenedor.innerHTML = `
    <section id="top-comandos" class="top-commands" aria-labelledby="titulo-top-comandos">

      <!-- Título de la sección. -->
      <h2 id="titulo-top-comandos">Top 10 comandos Git</h2>

      <!-- Explicación del propósito de la tabla y sus filtros. -->
      <p>Ranking de los comandos más utilizados en el flujo colaborativo del equipo. Filtra por perfil y copia cualquier comando al instante.</p>

      <!-- Contenedor de botones para seleccionar el rol. -->
      <div class="top-filtros" role="tablist" aria-label="Filtrar top 10 comandos por rol">

        <!-- Recorre los roles y genera un botón para cada uno. -->
        ${roles
          .map(
            (r, idx) =>
              `<button type="button" class="top-btn-rol ${idx === 0 ? 'activo' : ''}" role="tab" aria-selected="${
                idx === 0 ? 'true' : 'false'
              }" data-rol="${r.id}">${r.etiqueta}</button>`
          )
          .join('')}
      </div>

      <!-- Contenedor de la tabla de comandos. -->
      <div class="top-tabla-wrap">
        <table class="top-tabla">

          <!-- Explicación del contenido de la tabla. -->
          <caption><strong>Ranking.</strong> Comandos ordenados por frecuencia de uso y rol recomendado.</caption>

          <!-- Encabezados de las columnas. -->
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

          <!-- Aquí se insertarán dinámicamente las filas de comandos. -->
          <tbody id="top-comandos-body"></tbody>
        </table>
      </div>
    </section>
  `;

  // Busca dentro del contenedor el tbody donde se mostrarán los comandos.
  const tbody = contenedor.querySelector('#top-comandos-body');

  // Busca todos los botones que permiten seleccionar un rol.
  const botonesRol = contenedor.querySelectorAll('.top-btn-rol');

  // Función interna encargada de generar las filas de la tabla
  // según el rol que se encuentre seleccionado.
  function pintarFilas(rolActivo) {

    // Obtiene la lista de comandos filtrada por el rol seleccionado.
    const lista = filtrarTopComandos(comandos, rolActivo);

    // Comprueba si existen comandos para el rol seleccionado.
    if (lista.length === 0) {

      // Si no existen resultados, muestra un mensaje en la tabla.
      tbody.innerHTML = '<tr><td colspan="6">No hay comandos registrados para este rol.</td></tr>';

      // Termina la ejecución de esta función.
      return;
    }

    // Recorre la lista filtrada y construye una fila HTML por cada comando.
    tbody.innerHTML = lista
      .map(
        (item) => `
      <tr class="top-fila">

        <!-- Muestra la posición del comando en el ranking. -->
        <td data-label="Ranking"><span class="top-rank">#${item.ranking}</span></td>

        <!-- Muestra el comando y sus etiquetas. -->
        <td data-label="Comando">
          <code class="top-cmd">${escaparHtml(item.comando)}</code>

          <!-- Recorre las etiquetas del comando y genera una etiqueta visual por cada una. -->
          <div class="top-tags">${item.etiquetas.map((t) => `<span class="top-tag">${escaparHtml(t)}</span>`).join('')}</div>
        </td>

        <!-- Muestra la descripción del comando. -->
        <td data-label="Descripción">${escaparHtml(item.descripcion)}</td>

        <!-- Muestra la frecuencia de uso del comando. -->
        <td data-label="Frecuencia"><span class="top-freq">${escaparHtml(item.frecuencia)}</span></td>

        <!-- Muestra el rol recomendado para utilizar el comando. -->
        <td data-label="Rol"><span class="top-rol top-rol-${escaparHtml(item.rol)}">${escaparHtml(item.rol)}</span></td>

        <!-- Muestra el botón que permite copiar el comando. -->
        <td data-label="Acción">
          <button type="button" class="top-btn-copiar" data-cmd="${escaparHtml(item.comando)}" aria-label="Copiar comando ${escaparHtml(item.comando)}">Copiar</button>
        </td>
      </tr>
    `
      )
      // Une todas las filas generadas en una sola cadena HTML.
      .join('');

    // Busca todos los botones de copiado que se acaban de crear.
    tbody.querySelectorAll('.top-btn-copiar').forEach((btn) => {

      // Añade un evento click a cada botón de copiado.
      btn.addEventListener('click', async () => {

        // Obtiene el comando almacenado en el atributo data-cmd del botón
        // y llama a la función encargada de copiarlo al portapapeles.
        const ok = await copiarAlPortapapeles(btn.dataset.cmd);

        // Guarda el texto original del botón antes de modificarlo.
        const textoOriginal = btn.textContent;

        // Cambia el texto dependiendo del resultado de la copia.
        const textoOriginal = btn.textContent;
        btn.textContent = ok ? 'Copiado' : 'No disponible';

        // Si la copia tuvo éxito, añade la clase CSS 'copiado'.
        if (ok) btn.classList.add('copiado');

        // Espera 1200 milisegundos antes de restaurar el botón.
        setTimeout(() => {
          // Recupera el texto original del botón.
          btn.textContent = textoOriginal;

          // Elimina la clase CSS que indicaba que se había copiado.
          btn.classList.remove('copiado');
        }, 1200);
      });
    });
  }

  // Recorre todos los botones de selección de rol.
  botonesRol.forEach((btn) => {

    // Añade un evento click a cada botón.
    btn.addEventListener('click', () => {

      // Recorre todos los botones para quitarles el estado activo
      // y establecer aria-selected en false.
      botonesRol.forEach((b) => {
        b.classList.remove('activo');
        b.setAttribute('aria-selected', 'false');
      });

      // Marca como activo el botón que recibió el clic.
      btn.classList.add('activo');

      // Actualiza su estado de accesibilidad para indicar que está seleccionado.
      btn.setAttribute('aria-selected', 'true');

      // Vuelve a generar las filas de la tabla utilizando el rol del botón.
      btn.dataset.rol && pintarFilas(btn.dataset.rol);
    });
  });

  // Al cargar la sección, muestra inicialmente todos los comandos.
  pintarFilas('todos');
}

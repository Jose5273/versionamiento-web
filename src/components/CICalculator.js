
// Multiplicadores de consumo de minutos de CI/CD según el sistema operativo.
// Linux consume 1 minuto por minuto ejecutado, Windows 2 y macOS 10.
export const MULTIPLICADORES_SO = {
  linux: 1,
  windows: 2,
  macos: 10,
};

// Cuotas mensuales de minutos disponibles según los planes de GitHub y GitLab.
export const CUOTAS_PLANES = [
  { id: 'gitlab-free', nombre: 'GitLab Free', cuota: 400 },
  { id: 'github-free', nombre: 'GitHub Free (privados)', cuota: 2000 },
  { id: 'github-pro', nombre: 'GitHub Pro / Education', cuota: 3000 },
  { id: 'gitlab-premium', nombre: 'GitLab Premium', cuota: 10000 },
];

// Convierte un valor a número y comprueba que sea válido y positivo.
// Si el valor no es válido o es negativo, devuelve 0.
function sanitizarPositivo(valor) {
  const num = Number(valor);
  if (!Number.isFinite(num) || num < 0) return 0;
  return num;
}

/**
 * Calcula los minutos base y los minutos facturados de CI/CD.
 * También compara el consumo con las cuotas de los diferentes planes.
 *
 * @param {Object} parametros - Datos necesarios para realizar el cálculo.
 * @returns {Object} Resultado del consumo, comparación y recomendación.
 */
export function calcularMinutosCI({ jobsDia, duracionMin, diasMes, so = 'linux' }) {

  // Valida y convierte los datos recibidos para evitar valores incorrectos.
  const jobs = sanitizarPositivo(jobsDia);
  const duracion = sanitizarPositivo(duracionMin);
  const dias = sanitizarPositivo(diasMes);

  // Comprueba que el sistema operativo exista en la lista de multiplicadores.
  // Si no existe, utiliza Linux como sistema predeterminado.
  const claveSo = Object.hasOwn(MULTIPLICADORES_SO, so) ? so : 'linux';

  // Obtiene el multiplicador correspondiente al sistema operativo seleccionado.
  const multiplicador = MULTIPLICADORES_SO[claveSo];

  // Calcula los minutos reales de ejecución durante el mes.
  const minutosBase = Math.round(jobs * duracion * dias);

  // Calcula los minutos facturados aplicando el multiplicador del sistema operativo.
  const minutosFacturados = Math.round(jobs * duracion * dias * multiplicador);

  // Recorre los planes y compara el consumo calculado con sus cuotas mensuales.
  const comparacion = CUOTAS_PLANES.map((plan) => {

    // Comprueba si el consumo supera la cuota disponible del plan.
    const excede = minutosFacturados > plan.cuota;

    // Calcula qué porcentaje de la cuota mensual se ha utilizado.
    // El resultado se limita a un máximo de 999 %.
    const porcentaje = Math.min(999, Math.round((minutosFacturados / plan.cuota) * 100));

    // Calcula los minutos que quedan disponibles.
    // Si el resultado es negativo, significa que se superó la cuota.
    const restante = plan.cuota - minutosFacturados;

    // Devuelve los datos originales del plan junto con los resultados calculados.
    return {
      ...plan,
      excede,
      porcentaje,
      restante,
    };
  });

  // Variable donde se almacenará la recomendación según el consumo mensual.
  let recomendacion = '';

  // Evalúa el consumo y determina qué plan podría cubrirlo.
  if (minutosFacturados === 0) {
    recomendacion = 'Sin consumo registrado: cualquier plan gratuito cubre la ejecución.';
  } else if (minutosFacturados <= 400) {
    recomendacion = 'Tanto GitLab Free (400 min) como GitHub Free (2.000 min) cubren tu consumo mensual.';
  } else if (minutosFacturados <= 2000) {
    recomendacion = 'Superas GitLab Free (400 min); GitHub Free (2.000 min) o un runner propio en GitLab cubren la carga.';
  } else if (minutosFacturados <= 3000) {
    recomendacion = 'Superas GitHub Free; GitHub Pro / Student Pack (3.000 min) o GitLab Premium (10.000 min) cubren este volumen.';
  } else if (minutosFacturados <= 10000) {
    recomendacion = 'Superas GitHub Pro (3.000 min); conviene GitLab Premium (10.000 min) o runners self-hosted.';
  } else {
    recomendacion = 'Consumo superior a 10.000 min/mes: se recomienda usar runners propios (self-hosted) o migrar jobs pesados a Linux (×1).';
  }

  // Devuelve toda la información calculada para utilizarla en la interfaz.
  return {
    minutosBase,
    multiplicador,
    so: claveSo,
    minutosFacturados,
    comparacion,
    recomendacion,
  };
}

/**
 * Construye y muestra la calculadora interactiva de minutos CI/CD.
 * Permite modificar los valores y actualizar los resultados automáticamente.
 *
 * @param {HTMLElement} contenedor - Elemento HTML donde se mostrará la calculadora.
 */
export function renderCICalculator(contenedor) {

  // Comprueba que exista el contenedor antes de continuar.
  if (!contenedor) return;

  // Inserta la estructura HTML de la calculadora dentro del contenedor.
  contenedor.innerHTML = `
    <div id="calculadora-ci" class="ci-calc" aria-labelledby="titulo-calc-ci">

      <!-- Título principal de la calculadora. -->
      <h3 id="titulo-calc-ci">Calculadora interactiva de minutos CI/CD</h3>

      <!-- Explicación de la fórmula utilizada para calcular el consumo mensual. -->
      <p class="ci-desc">Estima tu consumo mensual (<code>jobs/día &times; duración &times; días/mes &times; multiplicador SO</code>) y compáralo con las cuotas de GitHub y GitLab.</p>

      <!-- Formulario con los datos que el usuario puede modificar. -->
      <div class="ci-form">

        <!-- Campo para indicar cuántos trabajos CI/CD se ejecutan diariamente. -->
        <label class="ci-campo">
          <span>Jobs por día</span>
          <input type="number" id="ci-jobs" min="0" step="1" value="6" />
        </label>

        <!-- Campo para establecer la duración promedio de cada trabajo. -->
        <label class="ci-campo">
          <span>Duración media (min)</span>
          <input type="number" id="ci-duracion" min="0" step="0.5" value="3" />
        </label>

        <!-- Campo para indicar cuántos días al mes se ejecutan los trabajos. -->
        <label class="ci-campo">
          <span>Días al mes</span>
          <input type="number" id="ci-dias" min="0" max="31" step="1" value="22" />
        </label>

        <!-- Selector para elegir el sistema operativo utilizado por los runners. -->
        <label class="ci-campo">
          <span>Sistema operativo</span>
          <select id="ci-so">
            <option value="linux">Linux (&times;1)</option>
            <option value="windows">Windows (&times;2)</option>
            <option value="macos">macOS (&times;10)</option>
          </select>
        </label>
      </div>

      <!-- Espacio donde se mostrarán los minutos reales y facturados. -->
      <div class="ci-resumen" id="ci-resumen" aria-live="polite"></div>

      <!-- Espacio donde aparecerá la comparación de los diferentes planes. -->
      <div class="ci-cuotas" id="ci-cuotas"></div>

      <!-- Espacio destinado a mostrar la recomendación final. -->
      <p class="ci-recomendacion" id="ci-recomendacion"></p>

      <!-- Aviso que indica que los valores son estimaciones orientativas. -->
      <p class="ci-disclaimer">Estimación orientativa; confirma precios y cuotas oficiales vigentes en GitHub y GitLab.</p>
    </div>
  `;

  // Obtiene los elementos HTML mediante sus identificadores.
  // Estos elementos permitirán leer los datos y actualizar los resultados.
  const inputJobs = contenedor.querySelector('#ci-jobs');
  const inputDuracion = contenedor.querySelector('#ci-duracion');
  const inputDias = contenedor.querySelector('#ci-dias');
  const selectSo = contenedor.querySelector('#ci-so');

  // Obtiene los espacios donde se mostrarán los resultados.
  const elResumen = contenedor.querySelector('#ci-resumen');
  const elCuotas = contenedor.querySelector('#ci-cuotas');
  const elRecomendacion = contenedor.querySelector('#ci-recomendacion');

  // Función encargada de recalcular y actualizar toda la información.
  function actualizar() {

    // Obtiene los valores actuales de los campos y ejecuta la función de cálculo.
    const resultado = calcularMinutosCI({
      jobsDia: inputJobs.value,
      duracionMin: inputDuracion.value,
      diasMes: inputDias.value,
      so: selectSo.value,
    });

    // Muestra los minutos reales, el multiplicador y el consumo facturable.
    elResumen.innerHTML = `
      <div><strong>Minutos reales:</strong> ${resultado.minutosBase.toLocaleString('es-EC')} min/mes</div>
      <div><strong>Multiplicador (${resultado.so}):</strong> &times;${resultado.multiplicador}</div>
      <div><strong>Consumo facturable estimado:</strong> <span class="ci-total">${resultado.minutosFacturados.toLocaleString('es-EC')} min/mes</span></div>
    `;

    // Genera un elemento visual para cada plan y muestra su estado.
    elCuotas.innerHTML = resultado.comparacion
      .map(
        (plan) => `
      <!-- La clase CSS cambia dependiendo de si se supera la cuota. -->
      <div class="ci-plan ${plan.excede ? 'excede' : 'ok'}">

        <!-- Nombre del plan evaluado. -->
        <div class="ci-plan-nombre">${plan.nombre}</div>

        <!-- Cantidad de minutos disponibles en el plan. -->
        <div class="ci-plan-cuota">Cuota: ${plan.cuota.toLocaleString('es-EC')} min/mes</div>

        <!-- Muestra si el consumo está cubierto o supera la cuota. -->
        <div class="ci-plan-estado">
          ${
            plan.excede
              ? `Excede por ${Math.abs(plan.restante).toLocaleString('es-EC')} min`
              : `Cubierto (${plan.porcentaje}% usado)`
          }
        </div>
      </div>
    `
      )
      // Une todos los elementos de comparación en una sola cadena HTML.
      .join('');

    // Muestra la recomendación generada según el consumo mensual.
    elRecomendacion.textContent = resultado.recomendacion;
  }

  // Agrega eventos a todos los campos de la calculadora.
  [inputJobs, inputDuracion, inputDias, selectSo].forEach((el) => {

    // El evento input actualiza los resultados mientras se modifican los valores.
    el.addEventListener('input', actualizar);

    // El evento change actualiza los resultados cuando cambia el valor del campo.
    el.addEventListener('change', actualizar);
  });

  // Ejecuta el cálculo inicial para mostrar resultados desde que se carga la calculadora.
  actualizar();
}

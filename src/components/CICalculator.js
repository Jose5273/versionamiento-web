export const MULTIPLICADORES_SO = {
  linux: 1,
  windows: 2,
  macos: 10,
};

export const CUOTAS_PLANES = [
  { id: 'gitlab-free', nombre: 'GitLab Free', cuota: 400 },
  { id: 'github-free', nombre: 'GitHub Free (privados)', cuota: 2000 },
  { id: 'github-pro', nombre: 'GitHub Pro / Education', cuota: 3000 },
  { id: 'gitlab-premium', nombre: 'GitLab Premium', cuota: 10000 },
];

function sanitizarPositivo(valor) {
  const num = Number(valor);
  if (!Number.isFinite(num) || num < 0) return 0;
  return num;
}

/**
 * Calcula los minutos base y facturados según el SO y compara frente a las cuotas oficiales.
 */
export function calcularMinutosCI({ jobsDia, duracionMin, diasMes, so = 'linux' }) {
  const jobs = sanitizarPositivo(jobsDia);
  const duracion = sanitizarPositivo(duracionMin);
  const dias = sanitizarPositivo(diasMes);
  const claveSo = Object.hasOwn(MULTIPLICADORES_SO, so) ? so : 'linux';
  const multiplicador = MULTIPLICADORES_SO[claveSo];

  const minutosBase = Math.round(jobs * duracion * dias);
  const minutosFacturados = Math.round(jobs * duracion * dias * multiplicador);

  const comparacion = CUOTAS_PLANES.map((plan) => {
    const excede = minutosFacturados > plan.cuota;
    const porcentaje = Math.min(999, Math.round((minutosFacturados / plan.cuota) * 100));
    const restante = plan.cuota - minutosFacturados;
    return {
      ...plan,
      excede,
      porcentaje,
      restante,
    };
  });

  let recomendacion = '';
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
 * Renderiza la calculadora interactiva de minutos CI/CD.
 */
export function renderCICalculator(contenedor) {
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div id="calculadora-ci" class="ci-calc" aria-labelledby="titulo-calc-ci">
      <h3 id="titulo-calc-ci">Calculadora interactiva de minutos CI/CD</h3>
      <p class="ci-desc">Estima tu consumo mensual (<code>jobs/día &times; duración &times; días/mes &times; multiplicador SO</code>) y compáralo con las cuotas de GitHub y GitLab.</p>

      <div class="ci-form">
        <label class="ci-campo">
          <span>Jobs por día</span>
          <input type="number" id="ci-jobs" min="0" step="1" value="6" />
        </label>
        <label class="ci-campo">
          <span>Duración media (min)</span>
          <input type="number" id="ci-duracion" min="0" step="0.5" value="3" />
        </label>
        <label class="ci-campo">
          <span>Días al mes</span>
          <input type="number" id="ci-dias" min="0" max="31" step="1" value="22" />
        </label>
        <label class="ci-campo">
          <span>Sistema operativo</span>
          <select id="ci-so">
            <option value="linux">Linux (&times;1)</option>
            <option value="windows">Windows (&times;2)</option>
            <option value="macos">macOS (&times;10)</option>
          </select>
        </label>
      </div>

      <div class="ci-resumen" id="ci-resumen" aria-live="polite"></div>
      <div class="ci-cuotas" id="ci-cuotas"></div>
      <p class="ci-recomendacion" id="ci-recomendacion"></p>
      <p class="ci-disclaimer">Estimación orientativa; confirma precios y cuotas oficiales vigentes en GitHub y GitLab.</p>
    </div>
  `;

  const inputJobs = contenedor.querySelector('#ci-jobs');
  const inputDuracion = contenedor.querySelector('#ci-duracion');
  const inputDias = contenedor.querySelector('#ci-dias');
  const selectSo = contenedor.querySelector('#ci-so');
  const elResumen = contenedor.querySelector('#ci-resumen');
  const elCuotas = contenedor.querySelector('#ci-cuotas');
  const elRecomendacion = contenedor.querySelector('#ci-recomendacion');

  function actualizar() {
    const resultado = calcularMinutosCI({
      jobsDia: inputJobs.value,
      duracionMin: inputDuracion.value,
      diasMes: inputDias.value,
      so: selectSo.value,
    });

    elResumen.innerHTML = `
      <div><strong>Minutos reales:</strong> ${resultado.minutosBase.toLocaleString('es-EC')} min/mes</div>
      <div><strong>Multiplicador (${resultado.so}):</strong> &times;${resultado.multiplicador}</div>
      <div><strong>Consumo facturable estimado:</strong> <span class="ci-total">${resultado.minutosFacturados.toLocaleString('es-EC')} min/mes</span></div>
    `;

    elCuotas.innerHTML = resultado.comparacion
      .map(
        (plan) => `
      <div class="ci-plan ${plan.excede ? 'excede' : 'ok'}">
        <div class="ci-plan-nombre">${plan.nombre}</div>
        <div class="ci-plan-cuota">Cuota: ${plan.cuota.toLocaleString('es-EC')} min/mes</div>
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
      .join('');

    elRecomendacion.textContent = resultado.recomendacion;
  }

  [inputJobs, inputDuracion, inputDias, selectSo].forEach((el) => {
    el.addEventListener('input', actualizar);
    el.addEventListener('change', actualizar);
  });

  actualizar();
}

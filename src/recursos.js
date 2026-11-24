
// Importa los estilos generales del sitio web.
import './styles/style.css';

// Importa los estilos específicos de la página de recursos.
import './styles/recursos.css';

// Importa los estilos del componente que muestra los comandos principales.
import './styles/top-commands.css';

// Importa los estilos de la calculadora de minutos CI/CD.
import './styles/ci-calculator.css';

// Importa los estilos de los avisos informativos.
import './styles/callout.css';

// Importa los estilos de los niveles de comandos Git.
import './styles/command-level.css';

// Importa las funciones que generan la barra de navegación y el pie de página.
import { renderizarNavbar, renderizarFooter } from './components/layout.js';

// Importa los datos JSON de los diez comandos principales.
import commandsTop10 from './data/commands-top10.json';

// Importa el listado completo de comandos Git.
import commandsAll from './data/commands-all.json';

// Importa la función que construye el componente de los diez comandos principales.
import { renderTopCommands } from './components/TopCommands.js';

// Importa la función que genera la calculadora de minutos CI/CD.
import { renderCICalculator } from './components/CICalculator.js';

// Importa la función que genera avisos informativos.
import { renderCallout } from './components/Callout.js';

// Importa la función que organiza los comandos según su nivel de uso.
import { renderCommandLevel } from './components/CommandLevel.js';

// Array que contiene una colección de comandos Git con su categoría y descripción.
// Cada objeto representa un comando que puede consultarse o filtrarse.
export const COMANDOS_GIT = [
  { cmd: 'git clone <url>', categoria: 'Remotos', desc: 'Clona el repositorio remoto completo con su historial.' },
  { cmd: 'git switch -c <rama>', categoria: 'Ramas', desc: 'Crea y cambia a una rama aislada de trabajo.' },
  { cmd: 'git status -s', categoria: 'Cambios', desc: 'Muestra en formato corto los archivos modificados o sin seguimiento.' },
  { cmd: 'git add .', categoria: 'Cambios', desc: 'Envía todos los cambios al área de preparación (Staging).' },
  { cmd: 'git commit -m "feat: mensaje"', categoria: 'Cambios', desc: 'Registra una instantánea usando Conventional Commits.' },
  { cmd: 'git push -u origin <rama>', categoria: 'Remotos', desc: 'Publica la rama local en el repositorio remoto.' },
  { cmd: 'git fetch --all', categoria: 'Remotos', desc: 'Descarga referencias y ramas remotas sin alterar el código local.' },
  { cmd: 'git pull --rebase origin develop', categoria: 'Ramas', desc: 'Actualiza la rama actual manteniendo un historial limpio y lineal.' },
  { cmd: 'git diff', categoria: 'Cambios', desc: 'Muestra línea por línea los cambios aún no confirmados.' },
  { cmd: 'git log --oneline --graph -n 10', categoria: 'Historial', desc: 'Visualiza el árbol de commits y fusiones recientes.' },
  { cmd: 'git stash', categoria: 'Cambios', desc: 'Guarda temporalmente cambios sin confirmar para cambiar de rama.' },
  { cmd: 'git revert <hash>', categoria: 'Historial', desc: 'Revierte un commit previo creando uno nuevo sin reescribir historial.' },
  { cmd: 'git tag -a v1.0.0 -m "Release"', categoria: 'Historial', desc: 'Crea una etiqueta anotada bajo Semantic Versioning.' },
  { cmd: 'git push origin v1.0.0', categoria: 'Remotos', desc: 'Publica la etiqueta de versión en el remoto.' },
  { cmd: 'git branch -d <rama>', categoria: 'Ramas', desc: 'Elimina localmente una rama ya fusionada.' },
];

// Función que recibe una lista de comandos y devuelve únicamente
// aquellos que cumplen con la categoría y el texto de búsqueda.
// Los parámetros categoría y término tienen valores predeterminados.
export function filtrarComandos(lista, categoria = 'Todos', termino = '') {

  // Elimina espacios al principio y al final del texto de búsqueda
  // y convierte el texto a minúsculas para facilitar las comparaciones.
  const q = termino.trim().toLowerCase();

  // filter() recorre la lista y conserva los elementos que cumplen las condiciones.
  return lista.filter((item) => {

    // Comprueba si el comando pertenece a la categoría seleccionada.
    // Si la categoría es Todos, acepta cualquier categoría.
    const coincideCat = categoria === 'Todos' || item.categoria === categoria;

    // Comprueba si el texto buscado aparece en el comando o en su descripción.
    // Si no existe un término de búsqueda, acepta todos los textos.
    const coincideTexto =
      !q || item.cmd.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);

    // El comando se conserva solamente si coincide con la categoría y el texto.
    return coincideCat && coincideTexto;
  });
}

// Espera a que el documento HTML esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {

  // Genera la barra de navegación y el pie de página.
  renderizarNavbar();
  renderizarFooter();

  // Busca el contenedor principal de la página.
  const contenedor = document.querySelector('main.container');

  // Agrega la clase recursos para aplicar los estilos específicos de esta página.
  contenedor.classList.add('recursos');

  // Construye dinámicamente el contenido HTML de la página de recursos.
  // Aquí se definen las secciones, tablas, enlaces internos y espacios
  // donde posteriormente se insertarán los componentes interactivos.
  contenedor.innerHTML = `
    <!-- Encabezado principal de la página de recursos. -->
    <header class="encabezado-recursos">
      <h1>Recursos técnicos del proyecto</h1>
      <p>Comandos Git del flujo colaborativo, cuotas de CI/CD, estándares y solución de errores · Arquitectura de Software · Grupo 2</p>
    </header>

    <!-- Índice que permite navegar directamente a cada sección. -->
    <nav class="indice" aria-label="Contenido de recursos">
      <p>Contenido</p>
      <ol>
        <li><a href="#top-comandos">Top 10 comandos Git</a></li>
        <li><a href="#comandos">Comandos Git por nivel de uso</a></li>
        <li><a href="#nivel-esencial">Nivel Esencial (🔥)</a></li>
        <li><a href="#nivel-frecuente">Nivel Frecuente (⚡)</a></li>
        <li><a href="#nivel-ocasional">Nivel Ocasional (🧊)</a></li>
        <li><a href="#cuotas">Cuotas de ejecución CI/CD</a></li>
        <li><a href="#calculadora-ci">Calculadora de minutos CI/CD</a></li>
        <li><a href="#estandares">Estándares del repositorio</a></li>
        <li><a href="#errores">Problemas frecuentes y solución</a></li>
      </ol>
    </nav>

    <!-- Espacio reservado para insertar el componente de los diez comandos principales. -->
    <div id="slot-top-comandos"></div>

    <!-- Sección que contiene los comandos Git clasificados por nivel de uso. -->
    <section id="comandos">
      <h2><span class="num">1.</span>Comandos Git organizados por nivel de uso</h2>
      <p>Todos los comandos del flujo <code>feature/*</code> &rarr; <code>develop</code> &rarr; <code>test</code> &rarr; <code>main</code> clasificados en tres niveles según su frecuencia operativa.</p>

      <!-- Espacio donde se insertarán los comandos organizados por niveles. -->
      <div id="slot-niveles-comandos"></div>
    </section>

    <!-- Sección que compara las cuotas gratuitas de ejecución CI/CD. -->
    <section id="cuotas">
      <h2><span class="num">2.</span>Cuotas de ejecución CI/CD</h2>
      <p>Límites gratuitos de cómputo para ejecutar pipelines de validación y despliegue en cada plataforma:</p>

      <!-- Tabla comparativa de minutos gratuitos y reglas de consumo. -->
      <div class="tabla">
        <table>
          <caption><strong>Tabla 2.</strong> Minutos gratuitos y multiplicadores por sistema operativo.</caption>
          <thead>
            <tr>
              <th scope="col">Plataforma / Plan</th>
              <th scope="col">Minutos gratis incluidos</th>
              <th scope="col">Regla de consumo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>GitHub Actions (Free)</td>
              <td>2.000 min/mes en privados · Ilimitado en públicos</td>
              <td>Linux ×1, Windows ×2, macOS ×10 (redondeo al minuto superior)</td>
            </tr>
            <tr>
              <td>GitHub Pro (Student Pack)</td>
              <td>3.000 min/mes en privados · Ilimitado en públicos</td>
              <td>Incluye protección de ramas en repositorios privados</td>
            </tr>
            <tr>
              <td>GitLab CI/CD (Free)</td>
              <td>400 min/mes compartidos (públicos y privados)</td>
              <td>Runners compartidos ×1; runners propios consumen 0 min</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Espacio reservado para insertar la calculadora interactiva de minutos CI/CD. -->
      <div id="slot-calculadora-ci"></div>

      <!-- Inserta un aviso informativo mediante el componente Callout. -->
      ${renderCallout({
        tipo: 'info',
        titulo: 'Runners grandes (larger runners)',
        texto:
          'Los runners grandes de GitHub Actions nunca consumen minutos gratuitos incluidos en tu cuota mensual: siempre se facturan por minuto desde el primer uso.',
      })}
    </section>

    <!-- Sección que documenta las convenciones y reglas utilizadas en el repositorio. -->
    <section id="estandares">
      <h2><span class="num">3.</span>Estándares del repositorio</h2>
      <ul>
        <li><strong>Conventional Commits:</strong> <code>feat:</code> (nueva función), <code>fix:</code> (corrección), <code>docs:</code> (documentación), <code>style:</code> (estilos), <code>test:</code> (pruebas), <code>ci:</code> (pipelines) y <code>chore:</code> (mantenimiento).</li>
        <li><strong>Semantic Versioning (SemVer):</strong> etiquetas anotadas con formato <code>vMAYOR.MENOR.PARCHE</code> (por ejemplo, <code>v1.0.0</code> para la primera entrega estable en <code>main</code>).</li>
        <li><strong>Integración por Pull Request:</strong> ninguna rama protegida recibe commits directos; todo aporte pasa por revisión de pares y checks automáticos en verde.</li>
      </ul>

      <!-- Recuadro destacado con una recomendación relacionada con las fusiones. -->
      <div class="destacado">
        <p><strong>Nota de integración:</strong> Al fusionar un Pull Request con varias tareas en GitHub, seleccionar <em>Create a merge commit</em> conserva en el historial cada commit atómico realizado en la rama de trabajo.</p>
      </div>
    </section>

    <!-- Sección que explica problemas habituales durante el uso de Git y sus soluciones. -->
    <section id="errores">
      <h2><span class="num">4.</span>Problemas frecuentes y solución</h2>

      <!-- Lista descriptiva: cada término representa un problema
           y su descripción contiene la solución correspondiente. -->
      <dl>
        <dt>Push rechazado en rama protegida</dt>
        <dd>Ocurre al intentar subir cambios directamente a <code>main</code>, <code>test</code> o <code>develop</code>. Crea una rama de trabajo con <code>git switch -c feature/nombre</code> y abre un Pull Request.</dd>

        <dt>Rama local desactualizada frente a develop</dt>
        <dd>Antes de abrir un Pull Request, sincroniza los últimos cambios integrados por el equipo mediante <code>git pull --rebase origin develop</code>.</dd>

        <dt>Deshacer un commit ya publicado sin alterar el historial</dt>
        <dd>En ramas compartidas evita <code>git reset --hard</code>; utiliza <code>git revert HEAD</code> para registrar un commit inverso seguro.</dd>

        <dt>Cambiar de rama con modificaciones sin terminar</dt>
        <dd>Guarda temporalmente tus cambios en la pila con <code>git stash</code> y recupéralos al volver mediante <code>git stash pop</code>.</dd>
      </dl>
    </section>
  `;

  // Inserta los diez comandos principales dentro del espacio reservado.
  // Utiliza los datos importados desde commands-top10.json.
  renderTopCommands(document.getElementById('slot-top-comandos'), commandsTop10);

  // Inserta los comandos clasificados por nivel de uso.
  // Utiliza el listado completo importado desde commands-all.json.
  renderCommandLevel(document.getElementById('slot-niveles-comandos'), commandsAll);

  // Inserta la calculadora interactiva de minutos CI/CD.
  renderCICalculator(document.getElementById('slot-calculadora-ci'));
});


// Arreglo constante que almacena los enlaces de navegación del sitio web.
// Cada objeto contiene la dirección de la página (href)
// y el texto que aparecerá visible para el usuario.
const ENLACES = [
  { href: 'index.html', texto: 'Inicio' },
  { href: 'informe.html', texto: 'Informe' },
  { href: 'investigacion.html', texto: 'Investigación' },
  { href: 'presentacion.html', texto: 'Presentación' },
  { href: 'recursos.html', texto: 'Recursos' },
];

// Función que construye dinámicamente la barra de navegación.
export function renderizarNavbar() {

  // Crea un elemento HTML nav, que representa una sección de navegación.
  const nav = document.createElement('nav');

  // Asigna la clase CSS navbar para aplicar los estilos correspondientes.
  nav.className = 'navbar';

  // Crea una lista desordenada HTML (ul) que contendrá los enlaces.
  const lista = document.createElement('ul');

  // Asigna la clase CSS navbar-links para dar formato a la lista.
  lista.className = 'navbar-links';

  // Obtiene la dirección de la página actual.
  // window.location.pathname devuelve la ruta de la página.
  // split('/') divide esa ruta en partes utilizando las barras.
  // pop() obtiene el último elemento, que normalmente es el nombre del archivo.
  // Si no se obtiene ningún nombre, utiliza index.html como valor predeterminado.
  const paginaActual = window.location.pathname.split('/').pop() || 'index.html';

  // Recorre el arreglo ENLACES utilizando forEach.
  // En cada iteración extrae href y texto mediante desestructuración.
  ENLACES.forEach(({ href, texto }) => {

    // Crea un elemento li que representará un elemento de la lista.
    const li = document.createElement('li');

    // Crea un elemento a, que representa un enlace HTML.
    const a = document.createElement('a');

    // Asigna al enlace la dirección de destino correspondiente.
    a.href = href;

    // Establece el texto que verá el usuario en el enlace.
    a.textContent = texto;

    // Comprueba si el enlace corresponde a la página actual.
    // Si coincide, agrega la clase CSS activo para resaltarlo visualmente.
    if (href === paginaActual) a.classList.add('activo');

    // Inserta el enlace dentro del elemento li.
    li.appendChild(a);

    // Inserta el elemento li dentro de la lista ul.
    lista.appendChild(li);
  });

  // Inserta la lista completa dentro del elemento nav.
  nav.appendChild(lista);

  // Inserta la barra de navegación al principio del body.
  document.body.prepend(nav);
}

// Función que construye dinámicamente el pie de página del sitio web.
export function renderizarFooter() {

  // Crea un elemento HTML footer.
  const footer = document.createElement('footer');

  // Asigna la clase CSS footer para aplicar los estilos correspondientes.
  footer.className = 'footer';

  // Define el texto que aparecerá dentro del pie de página.
  footer.textContent = 'Universidad Central del Ecuador - Grupo 2';

  // Inserta el footer al final del contenido del body.
  document.body.appendChild(footer);
}

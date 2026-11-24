const ENLACES = [
  { href: 'index.html', texto: 'Inicio' },
  { href: 'informe.html', texto: 'Informe' },
  { href: 'investigacion.html', texto: 'Investigación' },
  { href: 'presentacion.html', texto: 'Presentación' },
  { href: 'recursos.html', texto: 'Recursos' },
];

export function renderizarNavbar() {
  const nav = document.createElement('nav');
  nav.className = 'navbar';

  const lista = document.createElement('ul');
  lista.className = 'navbar-links';

  const paginaActual = window.location.pathname.split('/').pop() || 'index.html';

  ENLACES.forEach(({ href, texto }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = texto;
    if (href === paginaActual) a.classList.add('activo');
    li.appendChild(a);
    lista.appendChild(li);
  });

  nav.appendChild(lista);
  document.body.prepend(nav);
}

export function renderizarFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.textContent = 'Universidad Central del Ecuador - Grupo 2';
  document.body.appendChild(footer);
}

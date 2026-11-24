
export function setupCounter(element) {
  // Inicializa la variable del contador en cero.
  let counter = 0

  // Define una función que recibe un número y actualiza el contador.
  const setCounter = (count) => {
    // Guarda el nuevo valor recibido en la variable counter.
    counter = count

    // Actualiza el contenido HTML del elemento mostrando el valor actual.
    element.innerHTML = `Count is ${counter}`
  }

  // Agrega un evento de clic al elemento HTML.
  // Cada vez que se hace clic, aumenta el contador en una unidad.
  element.addEventListener('click', () => setCounter(counter + 1))

  // Inicializa el contador y muestra Count is 0 en el elemento HTML.
  setCounter(0)
}

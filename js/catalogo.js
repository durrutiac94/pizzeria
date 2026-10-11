/**
 * Filtrado del catálogo de pizzas por categoría.
 *
 * Toda la lógica de estado se obtiene del DOM mediante atributos `data-*`
 * y las actualizaciones visuales se realizan exclusivamente alternando
 * clases CSS (Bootstrap 5). Sin estilos en línea ni frameworks.
 */

document.addEventListener('DOMContentLoaded', () => {
  const catalogoGrid = document.getElementById('catalogoGrid');
  const contenedorFiltros = document.querySelector('[aria-label="Filtros de categoría"]');

  if (!catalogoGrid || !contenedorFiltros) return;

  /**
   * Aplica el filtro seleccionado sobre las tarjetas del catálogo.
   *
   * @param {string} categoria - Categoría a mostrar (`all` para todas).
   * @returns {void}
   */
  const filtrarCatalogo = (categoria) => {
    try {
      const tarjetas = catalogoGrid.querySelectorAll('[data-category]');

      tarjetas.forEach((tarjeta) => {
        const coincide = categoria === 'all' || tarjeta.dataset.category === categoria;
        tarjeta.classList.toggle('d-none', !coincide);
      });
    } catch (error) {
      console.error('Error al filtrar el catálogo:', error);
    }
  };

  /**
   * Actualiza el estado visual de los botones de filtro.
   *
   * @param {HTMLButtonElement} botonActivo - Botón que queda seleccionado.
   * @returns {void}
   */
  const actualizarBotones = (botonActivo) => {
    const botones = contenedorFiltros.querySelectorAll('button[data-category]');

    botones.forEach((boton) => {
      const esActivo = boton === botonActivo;
      boton.classList.toggle('active', esActivo);
      boton.setAttribute('aria-pressed', String(esActivo));
    });
  };

  /**
   * Maneja el clic sobre los filtros mediante delegación de eventos.
   *
   * @param {MouseEvent} event - Evento de clic disparado en el contenedor.
   * @returns {void}
   */
  contenedorFiltros.addEventListener('click', (event) => {
    const boton = event.target.closest('button[data-category]');
    if (!boton || !contenedorFiltros.contains(boton)) return;

    const categoria = boton.dataset.category;
    if (!categoria) return;

    actualizarBotones(boton);
    filtrarCatalogo(categoria);
  });
});

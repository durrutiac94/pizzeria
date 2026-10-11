/**
 * Lógica de validación y envío simulado del formulario de contacto.
 *
 * Toda la retroalimentación visual se realiza exclusivamente mediante
 * clases de Bootstrap 5 (`is-valid`, `is-invalid`, `d-none`). Sin estilos
 * en línea ni frameworks.
 */

document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('contactoForm');
  const btnEnviar = document.getElementById('btnEnviar');
  const alertaExito = document.getElementById('alertaExito');

  if (!formulario || !btnEnviar || !alertaExito) return;

  const spinner = btnEnviar.querySelector('.spinner-border');

  const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Reglas de validación de cada campo del formulario.
   * Cada regla recibe el valor y devuelve un mensaje de error o `null`.
   */
  const reglas = {
    nombre: (valor) =>
      valor.trim().length >= 3 ? null : 'Ingresa al menos 3 caracteres.',
    email: (valor) =>
      REGEX_EMAIL.test(valor.trim()) ? null : 'Ingresa un correo electrónico válido.',
    asunto: (valor) =>
      valor.trim() !== '' ? null : 'Selecciona un asunto.',
    mensaje: (valor) =>
      valor.trim().length >= 10 ? null : 'El mensaje debe tener al menos 10 caracteres.'
  };

  /**
   * Actualiza el estado visual de un campo según su validez.
   *
   * @param {HTMLElement} campo - Input, select o textarea a evaluar.
   * @param {string|null} error - Mensaje de error o `null` si es válido.
   * @returns {void}
   */
  const marcarCampo = (campo, error) => {
    const feedback = campo.parentElement.querySelector('.invalid-feedback');

    campo.classList.toggle('is-invalid', Boolean(error));
    campo.classList.toggle('is-valid', !error);

    if (feedback) feedback.textContent = error || '';
  };

  /**
   * Valida todos los campos del formulario.
   *
   * @returns {boolean} `true` si el formulario es válido por completo.
   */
  const validarFormulario = () => {
    let esValido = true;

    Object.keys(reglas).forEach((name) => {
      const campo = formulario.elements.namedItem(name);
      if (!campo) return;

      const error = reglas[name](campo.value);
      if (error) esValido = false;

      marcarCampo(campo, error);
    });

    return esValido;
  };

  /**
   * Restablece el formulario y su estado visual tras un envío correcto.
   *
   * @returns {void}
   */
  const restablecerFormulario = () => {
    formulario.reset();

    formulario.querySelectorAll('.is-valid, .is-invalid').forEach((campo) => {
      campo.classList.remove('is-valid', 'is-invalid');
    });

    formulario.querySelectorAll('.invalid-feedback').forEach((feedback) => {
      feedback.textContent = '';
    });

    btnEnviar.disabled = false;
    if (spinner) spinner.classList.add('d-none');
    alertaExito.classList.remove('d-none');
  };

  /**
   * Restaura el estado de carga del botón tras un error de envío.
   *
   * @returns {void}
   */
  const restaurarBoton = () => {
    btnEnviar.disabled = false;
    if (spinner) spinner.classList.add('d-none');
  };

  /**
   * Envía los datos del formulario a Formspree mediante fetch.
   * Mantiene el botón deshabilitado y el spinner visible durante la petición.
   *
   * @returns {Promise<void>}
   */
  const enviarFormulario = async () => {
    btnEnviar.disabled = true;
    if (spinner) spinner.classList.remove('d-none');
    alertaExito.classList.add('d-none');

    try {
      const response = await fetch(formulario.action, {
        method: formulario.method || 'POST',
        body: new FormData(formulario),
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Formspree respondió con estado ${response.status}`);
      }

      restablecerFormulario();
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      window.alert('Hubo un error al enviar el mensaje.');
      restaurarBoton();
    }
  };

  formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validarFormulario()) return;

    enviarFormulario();
  });
});

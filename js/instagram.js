/**
 * Integración de publicaciones de Instagram mediante el uso de los embeds
 * oficiales proporcionados por Instagram (script embed.js).
 *
 * Los bloques `<blockquote class="instagram-media">` son procesados y
 * sustituidos por sus iframes correspondientes. Una vez el script oficial
 * ha sido cargado, se invoca `window.instgrm.Embeds.process()` para
 * renderizar los embeds ya presentes en el DOM sin necesidad de recargar
 * la página.
 *
 * Nota de privacidad: los embeds de Instagram cargan iframes y cookies de
 * terceros (tracking gestionado por la propia plataforma).
 */

document.addEventListener('DOMContentLoaded', () => {
  const bloquesInstagram = document.querySelectorAll('blockquote.instagram-media');

  if (!bloquesInstagram.length) return;

  const cargarEmbedsInstagram = () => {
    try {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        try {
          if (window.instgrm) window.instgrm.Embeds.process();
        } catch (error) {
          console.error('Error al procesar los embeds de Instagram:', error);
        }
      };

      script.onerror = () => {
        console.error('No se pudo cargar el script de embeds de Instagram.');
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error('Error al configurar el embeds de Instagram:', error);
    }
  };

  cargarEmbedsInstagram();
});
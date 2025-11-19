# UNYX - Red Social (Prototipo)

Este proyecto es un prototipo de una red social llamada **UNYX**, diseñada para ser una plataforma segura y ética para mayores de 21 años.

## Estructura del Proyecto

El proyecto se organiza de la siguiente manera:

### Archivos en la Raíz
- **`registro.html`**: Página de registro de usuarios. Incluye:
  - Formulario de registro (Nombre, Apellido, Fecha de Nacimiento, DNI, Email, Contraseña).
  - Validación de edad (mínimo 21 años).
  - Modal de "Términos y Condiciones".
- **`script.js`**: Archivo principal de JavaScript. Maneja:
  - Validación del formulario de registro.
  - Lógica del modal de términos y condiciones.
  - Funcionalidad del visor de historias (Stories) con barra de progreso y navegación.
- **`styles.css`**: Estilos específicos para la página de registro (`registro.html`), incluyendo el diseño del formulario y el modal.

### Directorios
- **`feed/`**: Contiene la página principal de la red social (el "feed").
  - **`index.html`**: Estructura del feed de noticias, barra de búsqueda, sugerencias de usuarios y barra de historias.
  - **`styles.css`**: Estilos específicos para el feed, incluyendo el diseño de paneles (izquierdo/derecho), publicaciones y la barra de historias.
- **`img/`**: Carpeta de recursos gráficos (imágenes de perfil, logo, publicaciones).

## Funcionalidades Principales

### 1. Registro de Usuarios
- Validación estricta de edad (mayores de 21 años).
- Verificación de coincidencia de contraseñas.
- Checkbox obligatorio de aceptación de términos.

### 2. Feed de Noticias
- Diseño de tres columnas (Panel Sugerencias, Feed Central, Panel de Navegación).
- Barra de búsqueda de usuarios.
- Visualización de publicaciones con cabecera (foto y nombre) y contenido.

### 3. Historias (Stories)
- Barra de historias en la parte inferior del feed (según `feed/index.html`) o lógica de visor en pantalla completa (según `script.js`).
- El `script.js` contiene una lógica avanzada para un visor de historias tipo "carrusel" con:
  - Avance automático (barra de progreso).
  - Navegación manual (clic izquierda/derecha).
  - Pausa al mantener presionado.

## Tecnologías
- **HTML5**: Estructura semántica.
- **CSS3**: Diseño responsivo, animaciones (shimmer, fade, slide), y uso de variables de color (Dorado/Negro).
- **JavaScript (Vanilla)**: Lógica de interacción sin dependencias externas.

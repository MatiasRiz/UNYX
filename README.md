# UNYX - Red Social Premium (Prototipo)

**UNYX** es un prototipo de red social exclusiva, diseñada con una estética **Hyper-Premium** y enfocada en una experiencia de usuario segura y ética para mayores de 21 años.

## 🚀 Estado Actual del Proyecto

El proyecto ha evolucionado de una estructura estática a una aplicación web dinámica basada en **Flask (Python)**, con un rediseño visual completo.

### ✨ Novedades (Versión Actual)
*   **Estética Hyper-Premium**: Implementación de un diseño "Glassmorphism" avanzado con paleta de colores Negro Profundo (`#000000`) y Oro (`#D4AF37`). Incluye fondos animados, efectos de brillo (glow) y tipografía moderna (`Outfit`).
*   **Estructura Flask**: Reorganización completa del código siguiendo el patrón MVC de Flask.
*   **Navegación Fluida**: Sistema de rutas optimizado para navegación sin recargas perceptibles.
*   **Nueva Página de Perfil**: Diseño completo del perfil de usuario con cabecera inmersiva, estadísticas y grilla de contenido.

---

## 📂 Estructura del Proyecto

La estructura de carpetas se ha estandarizado para Flask:

```
UNYX/
├── app.py                # Aplicación principal Flask (Rutas y configuración)
├── static/               # Archivos estáticos (CSS, JS, Imágenes)
│   ├── css/
│   │   ├── auth.css      # Estilos para Login y Registro (Hyper-Premium)
│   │   ├── feed.css      # Estilos para el Feed Principal
│   │   └── profile.css   # Estilos para el Perfil de Usuario
│   ├── js/
│   │   ├── login.js      # Lógica de inicio de sesión
│   │   └── registro.js   # Lógica de registro y validaciones
│   └── img/              # Recursos gráficos (Logos, avatares, iconos)
├── templates/            # Plantillas HTML (Jinja2)
│   ├── auth/
│   │   ├── login.html    # Página de Inicio de Sesión
│   │   └── registro.html # Página de Registro
│   ├── feed/
│   │   └── index.html    # Feed Principal (Home)
│   └── profile/
│   │   └── profile.html  # Perfil de Usuario
└── README.md             # Documentación del proyecto
```

---

## 🛠️ Tecnologías Utilizadas

*   **Backend**: Python, Flask.
*   **Frontend**: HTML5, CSS3 (Variables, Flexbox, Grid, Animaciones CSS), JavaScript (Vanilla).
*   **Diseño**: Estilo "Hyper-Premium" personalizado, Fuentes de Google Fonts (`Outfit`, `Montserrat`).

---

## 📋 Funcionalidades Implementadas

### 1. Autenticación (Auth)
*   **Login y Registro**: Interfaces con diseño de alto impacto visual.
*   **Validaciones**: Verificación de edad (+21), coincidencia de contraseñas y campos obligatorios.
*   **Feedback Visual**: Animaciones de entrada, efectos hover metálicos y modales estilizados.

### 2. Feed Principal
*   **Layout Moderno**: Diseño de 3 columnas (Navegación, Feed Central, Sugerencias).
*   **Barra de Historias**: Carrusel de historias con efectos de brillo dorado.
*   **Publicaciones**: Tarjetas de contenido con diseño flotante y sombras suaves.

### 3. Perfil de Usuario
*   **Cabecera Inmersiva**: Foto de portada y avatar con bordes dorados.
*   **Estadísticas**: Contadores de seguidores, seguidos y publicaciones.
*   **Grilla de Contenido**: Pestañas de navegación (Publicaciones, Videos, Guardados) y grilla responsiva.

---

## 🔜 Próximos Pasos (Roadmap)

1.  **Base de Datos**: Configuración de SQLAlchemy y diseño del modelo de usuario.
2.  **Backend de Registro**: Implementar la lógica real de creación de usuarios y hash de contraseñas.
3.  **Sesiones**: Manejo de sesiones de usuario persistentes.
4.  **Interactividad**: Dar funcionalidad real a los botones de "Seguir", "Like" y "Comentar".

---

*Desarrollado por MatiasRiz - 2025*

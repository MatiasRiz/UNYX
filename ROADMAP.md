# �️ Roadmap Maestro - UNYX

Este documento centraliza todas las mejoras, funcionalidades y tareas técnicas necesarias para llevar a UNYX a su versión final.

## 🏗️ Arquitectura y Backend (Cimientos)
- [ ] **Base de Datos**: Diseñar esquema relacional completo (Usuarios, Posts, Historias, Comentarios, Likes, Mensajes).
- [ ] **API RESTful**: Desarrollar endpoints para todas las entidades (CRUD).
- [ ] **Seguridad Global**: Implementar Rate Limiting, CORS, y protección contra inyecciones SQL/XSS.
- [ ] **Almacenamiento**: Configurar servicio de almacenamiento de objetos (AWS S3 o similar) para imágenes/videos.
- [ ] **WebSockets**: Implementar para mensajería en tiempo real y notificaciones instantáneas.

## 🔐 Autenticación y Usuarios
- [ ] **Registro Seguro**: Validación backend, email de confirmación, verificación de edad (RENAPER/ID).
- [ ] **Login/Sesión**: JWT (JSON Web Tokens) o sesiones seguras con manejo de expiración.
- [ ] **Recuperación de Cuenta**: Flujo de "Olvidé mi contraseña".
- [ ] **Perfil de Usuario**: Edición de avatar, bio, portada y preferencias de privacidad.

## 📱 Funcionalidades Principales (Core)
### Feed y Contenido
- [ ] **Feed Algorítmico**: Lógica para ordenar posts por relevancia/fecha.
- [ ] **Historias (Stories)**: Subida, visualización temporal (24h) y archivado.
- [ ] **Interacciones**: Likes, Comentarios anidados, Compartir.
- [ ] **Buscador**: Búsqueda de usuarios, hashtags y contenido.

### Social
- [ ] **Seguidores/Seguidos**: Sistema de grafos de relaciones.
- [ ] **Mensajería Directa (DM)**: Chat privado 1 a 1 y grupos.
- [ ] **Notificaciones**: Centro de notificaciones (likes, nuevos seguidores, menciones).

## 💰 Monetización y Creadores
- [ ] **Suscripciones**: Sistema de pagos recurrentes para contenido exclusivo.
- [ ] **Billetera Virtual**: Visualización de ingresos y solicitud de retiros.
- [ ] **Analíticas**: Dashboard para creadores (vistas, engagement).

## �️ Moderación y Seguridad
- [ ] **Reportes**: Sistema para que usuarios reporten contenido inapropiado.
- [ ] **Panel de Admin**: Interfaz para moderadores (banear usuarios, borrar posts).
- [ ] **Filtros Automáticos**: Detección básica de palabras prohibidas o spam.

## 🎨 Frontend y UX/UI
- [ ] **Diseño Responsivo**: Asegurar funcionamiento perfecto en Móvil, Tablet y Desktop.
- [ ] **Modo Oscuro/Claro**: Toggle de tema.
- [ ] **Accesibilidad (a11y)**: Cumplir estándares WCAG (lectores de pantalla, contraste).
- [ ] **PWA (Progressive Web App)**: Permitir instalación en móviles como app nativa.
- [ ] **Optimización**: Lazy loading de imágenes, minificación de CSS/JS.

## 🚀 DevOps y Despliegue
- [ ] **Entornos**: Configurar Desarrollo, Staging y Producción.
- [ ] **CI/CD**: Pipelines automáticos para testing y despliegue.
- [ ] **Monitoreo**: Logs de errores y métricas de servidor.

document.getElementById("registroForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const fechaNacimiento = new Date(document.getElementById("fechaNacimiento").value);
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  if (edad < 21) {
    alert("Debés ser mayor de 21 años para registrarte.");
    return;
  }

  alert("Registro exitoso. Bienvenido a UNYX.");
  // Aquí podrías enviar los datos al backend para validación con RENAPER
});
// ====== Lógica del Modal de Términos y Condiciones ======

// Elementos clave
const modal = document.getElementById("modal-terminos");
const linkTerminos = document.getElementById("link-terminos");
const closeBtn = document.querySelector(".close");
const registroForm = document.getElementById("registroForm");
const checkboxTerminos = document.getElementById("terms");

// Abrir modal al hacer clic en el enlace
linkTerminos.addEventListener("click", function(e) {
  e.preventDefault();
  modal.style.display = "block";
});

// Cerrar modal al hacer clic en la X
closeBtn.addEventListener("click", function() {
  modal.style.display = "none";
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", function(e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// ====== Validación del formulario ======
registroForm.addEventListener("submit", function(e) {
  e.preventDefault();

  // Validar aceptación de términos
  if (!checkboxTerminos.checked) {
    alert("Debes aceptar los Términos y Condiciones para registrarte.");
    return;
  }

  // Validar contraseñas
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  // Validar edad mínima (21 años)
  const fechaNacimiento = new Date(document.getElementById("fechaNacimiento").value);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }
  if (edad < 21) {
    alert("Debes ser mayor de 21 años para registrarte.");
    return;
  }

  // Si todo está correcto
  alert("Registro exitoso. Bienvenido a UNYX.");
  window.location.href = "/"; // Redirige al login (ruta raíz)
});



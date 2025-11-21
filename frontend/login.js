// Manejo del formulario de login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (email === "" || password === "") {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Simulación de login exitoso
  alert("Bienvenido a UNYX");

  // Redirige al feed
  window.location.href = "../feed/index.html";
});

// Manejo del enlace "regístrate"
const linkRegistro = document.querySelector('a[href*="registro"]');
if (linkRegistro) {
  linkRegistro.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "../registro/registro.html";
  });
}

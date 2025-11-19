
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Aquí iría la lógica de autenticación (simulada)
  if (email === "" || password === "") {
    alert("Por favor, completa todos los campos.");
    return;
  }
  // Simulación de login exitoso
  alert("Bienvenido a UNYX");
  // Redirigir o mostrar panel de usuario
});

// Redirigir al registro al hacer clic en el enlace
document.querySelector('a[href="registro.html"]').addEventListener('click', function(e) {
  e.preventDefault();
  window.location.href = 'registro/registro.html';
});

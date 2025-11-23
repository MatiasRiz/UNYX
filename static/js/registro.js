document.addEventListener("DOMContentLoaded", () => {
  const registroForm = document.getElementById("registroForm");
  const modal = document.getElementById("modal-terminos");
  const linkTerminos = document.getElementById("link-terminos");
  const closeBtn = document.querySelector(".close");
  const checkboxTerminos = document.getElementById("terms");

  if (!registroForm) return;

  // ------ Modal Términos ------
  if (linkTerminos && modal && closeBtn) {
    linkTerminos.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  // ------ Envío del formulario ------
  registroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const fechaNacimiento = document
      .getElementById("fechaNacimiento")
      .value.trim();
    const documento = document.getElementById("documento").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    // Validaciones lado cliente
    if (!checkboxTerminos.checked) {
      alert("Debes aceptar los Términos y Condiciones para registrarte.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Validar edad ≥ 21
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    if (isNaN(edad) || edad < 21) {
      alert("Debes ser mayor de 21 años para registrarte.");
      return;
    }

    try {
      const resp = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          password,
          fecha_nacimiento: fechaNacimiento, // formato AAAA-MM-DD
          dni: documento,
        }),
      });

      const data = await resp.json();
      console.log("RESP REGISTRO:", data);

      if (!resp.ok || !data.ok) {
        alert(
          data.error ||
          "No se pudo completar el registro. Verificá que el email y el DNI no estén ya registrados."
        );
        return;
      }

      alert("Registro exitoso. Bienvenido a UNYX.");
      // redirige al login (ruta raíz)
      window.location.href = "/";
    } catch (err) {
      console.error("ERROR FETCH REGISTRO:", err);
      alert("Error de conexión con el servidor.");
    }
  });
});

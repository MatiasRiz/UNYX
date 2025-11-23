document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const resp = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();
      console.log("RESP LOGIN:", data);

      if (!resp.ok || !data.ok) {
        alert(data.error || "No se pudo iniciar sesión.");
        return;
      }

      // Login OK → ir al feed
      const redirectUrl = data.redirect || "/feed";
      window.location.href = redirectUrl;
    } catch (err) {
      console.error("ERROR FETCH LOGIN:", err);
      alert("Error de conexión con el servidor.");
    }
  });
});

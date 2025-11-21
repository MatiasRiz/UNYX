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
  window.location.href = "../frontend/login.html"; // Redirige al login
});
// Datos de ejemplo de historias
const stories = [
  { username: "Usuario 1", image: "..img/historia1.jpg" },
  { username: "Usuario 2", image: "..img/historia2.jpg" },
  { username: "Usuario 3", image: "..img/historia3.jpg" }
];

let currentStoryIndex = 0;
let storyTimer = null;
let progressInterval = null;
const STORY_DURATION = 15000; // 15s
const PROGRESS_STEP = 50;     // ms

// Elementos del visor (se asignan al cargar el DOM)
let storyViewer, storyImage, storyUsername, closeStoryBtn, prevStoryBtn, nextStoryBtn, progressBar;

document.addEventListener("DOMContentLoaded", () => {
  // Cachear elementos del visor
  storyViewer   = document.getElementById("story-viewer");
  storyImage    = document.getElementById("story-image");
  storyUsername = document.getElementById("story-username");
  closeStoryBtn = document.querySelector(".close-story");
  prevStoryBtn  = document.getElementById("prev-story");
  nextStoryBtn  = document.getElementById("next-story");
  progressBar   = document.getElementById("story-progress-bar");

  // Abrir visor al hacer clic en una historia (corazón)
  document.querySelectorAll(".story img").forEach((storyEl, index) => {
    storyEl.addEventListener("click", () => {
      currentStoryIndex = index;
      showStory("fade");
    });
  });

  // Controles
  if (closeStoryBtn) closeStoryBtn.addEventListener("click", closeStoryViewer);
  if (prevStoryBtn)  prevStoryBtn.addEventListener("click", () => prevStory());
  if (nextStoryBtn)  nextStoryBtn.addEventListener("click", () => nextStory());

  // Cerrar si se hace clic en el fondo oscuro
  if (storyViewer) {
    storyViewer.addEventListener("click", (e) => {
      if (e.target === storyViewer) closeStoryViewer();
    });
  }

  // Evitar cierre al interactuar dentro del contenido
  const storyContent = document.querySelector(".story-content");
  if (storyContent) {
    storyContent.addEventListener("click", (e) => e.stopPropagation());
  }

  // Teclado: flechas y ESC
  document.addEventListener("keydown", (e) => {
    if (!isViewerOpen()) return;
    if (e.key === "ArrowRight") nextStory();
    if (e.key === "ArrowLeft")  prevStory();
    if (e.key === "Escape")     closeStoryViewer();
  });

  // Pausa y reanuda al mantener pulsado (press-to-hold)
  if (storyViewer) {
    storyViewer.addEventListener("mousedown", pauseProgress);
    storyViewer.addEventListener("mouseup", resumeProgress);
    storyViewer.addEventListener("mouseleave", resumeProgress);
    // En móvil: tocar y sostener
    storyViewer.addEventListener("touchstart", pauseProgress, { passive: true });
    storyViewer.addEventListener("touchend", resumeProgress);
    storyViewer.addEventListener("touchcancel", resumeProgress);
  }
});

function isViewerOpen() {
  return storyViewer && storyViewer.style.display === "flex";
}

function showStory(animationType = "fade") {
  if (!storyViewer || !storyImage || !storyUsername) return;

  const story = stories[currentStoryIndex];
  // Reset animación
  storyImage.style.animation = "none";
  void storyImage.offsetWidth; // reflow

  // Asignar contenido
  storyImage.src = story.image;
  storyUsername.textContent = story.username;

  // Elegir animación
  if (animationType === "slideLeft") {
    storyImage.style.animation = "slideLeft 0.5s ease forwards";
  } else if (animationType === "slideRight") {
    storyImage.style.animation = "slideRight 0.5s ease forwards";
  } else {
    storyImage.style.animation = "zoomFadeIn 0.6s ease forwards";
  }

  // Mostrar visor
  storyViewer.style.display = "flex";

  // Reiniciar timers y barra
  startProgress();
}

function startProgress() {
  clearTimers();

  if (progressBar) progressBar.style.width = "0%";

  let elapsed = 0;

  progressInterval = setInterval(() => {
    elapsed += PROGRESS_STEP;
    const percent = Math.min((elapsed / STORY_DURATION) * 100, 100);
    if (progressBar) progressBar.style.width = percent + "%";
  }, PROGRESS_STEP);

  storyTimer = setTimeout(() => {
    nextStory();
  }, STORY_DURATION);
}

function pauseProgress() {
  // Congela el avance eliminando timers, pero conserva el ancho actual
  clearTimers(true);
}

function resumeProgress() {
  if (!isViewerOpen()) return;

  // Obtener porcentaje actual para recalcular tiempo restante
  const currentWidth = progressBar ? parseFloat(progressBar.style.width) || 0 : 0;
  const remaining = STORY_DURATION * (1 - currentWidth / 100);

  clearTimers();

  // Reanudar barra desde el ancho actual hasta 100% en el tiempo restante
  const start = performance.now();
  const startWidth = currentWidth;

  function animateProgress(now) {
    const delta = now - start;
    const newPercent = Math.min(startWidth + (delta / remaining) * (100 - startWidth), 100);
    if (progressBar) progressBar.style.width = newPercent + "%";

    if (newPercent < 100) {
      progressInterval = requestAnimationFrame(animateProgress);
    }
  }
  progressInterval = requestAnimationFrame(animateProgress);

  storyTimer = setTimeout(() => {
    nextStory();
  }, remaining);
}

function clearTimers(preserveBar = false) {
  if (storyTimer) {
    clearTimeout(storyTimer);
    storyTimer = null;
  }
  if (progressInterval) {
    // Puede ser setInterval o requestAnimationFrame
    if (typeof progressInterval === "number") {
      clearInterval(progressInterval);
    } else {
      cancelAnimationFrame(progressInterval);
    }
    progressInterval = null;
  }
  // Si no preservamos la barra, reiniciamos a 0
  if (!preserveBar && progressBar) {
    progressBar.style.width = "0%";
  }
}

function closeStoryViewer() {
  if (!storyViewer) return;
  storyViewer.style.display = "none";
  clearTimers();
}

function prevStory() {
  currentStoryIndex = (currentStoryIndex - 1 + stories.length) % stories.length;
  showStory("slideRight");
}

function nextStory() {
  currentStoryIndex = (currentStoryIndex + 1) % stories.length;
  showStory("slideLeft");
}



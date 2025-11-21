// UNYX Profile Edit Modal - JavaScript
let currentAvatarSrc = "";
let currentZoom = 1;
let posX = 50; // Porcentaje
let posY = 50; // Porcentaje
let isDragging = false;
let startX, startY;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    // Obtener la imagen actual del perfil
    const profileAvatar = document.querySelector('.profile-avatar');
    if (profileAvatar) {
        currentAvatarSrc = profileAvatar.src;
    }

    // Abrir modal de edición
    const btnEditProfile = document.querySelector('.btn-edit-profile');
    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', function () {
            document.getElementById('editProfileModal').style.display = 'flex';
            const currentAvatar = document.querySelector('.profile-avatar');
            document.getElementById('previewAvatar').src = currentAvatar.src;

            // Copiar estilos actuales si existen
            const currentTransform = currentAvatar.style.transform;
            const currentObjPos = currentAvatar.style.objectPosition;
            if (currentTransform) {
                document.getElementById('previewAvatar').style.transform = currentTransform;
            }
            if (currentObjPos) {
                document.getElementById('previewAvatar').style.objectPosition = currentObjPos;
            }
        });
    }

    // Cambiar foto de perfil con preview
    const avatarUpload = document.getElementById('avatar-upload');
    if (avatarUpload) {
        avatarUpload.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    currentAvatarSrc = event.target.result;
                    const preview = document.getElementById('previewAvatar');
                    preview.src = currentAvatarSrc;
                    document.getElementById('zoomControl').style.display = 'block';
                    currentZoom = 1;
                    posX = 50;
                    posY = 50;
                    applyTransform();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Control de zoom
    const zoomSlider = document.getElementById('zoomSlider');
    if (zoomSlider) {
        zoomSlider.addEventListener('input', function (e) {
            currentZoom = e.target.value / 100;
            applyTransform();
        });
    }

    // Drag para reposicionar la foto
    const previewContainer = document.getElementById('avatarPreviewContainer');
    const preview = document.getElementById('previewAvatar');

    if (preview) {
        preview.addEventListener('mousedown', function (e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            preview.style.cursor = 'grabbing';
            e.preventDefault();
        });

        // Touch events para móviles
        preview.addEventListener('touchstart', function (e) {
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            e.preventDefault();
        });
    }

    document.addEventListener('mousemove', function (e) {
        if (isDragging && previewContainer) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            // Convertir píxeles a porcentaje basado en el tamaño del contenedor
            const rect = previewContainer.getBoundingClientRect();
            const percentDeltaX = (deltaX / rect.width) * 100;
            const percentDeltaY = (deltaY / rect.height) * 100;

            posX += percentDeltaX;
            posY += percentDeltaY;

            // Limitar entre 0 y 100
            posX = Math.max(0, Math.min(100, posX));
            posY = Math.max(0, Math.min(100, posY));

            startX = e.clientX;
            startY = e.clientY;

            applyTransform();
        }
    });

    document.addEventListener('touchmove', function (e) {
        if (isDragging && previewContainer) {
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            const rect = previewContainer.getBoundingClientRect();
            const percentDeltaX = (deltaX / rect.width) * 100;
            const percentDeltaY = (deltaY / rect.height) * 100;

            posX += percentDeltaX;
            posY += percentDeltaY;

            posX = Math.max(0, Math.min(100, posX));
            posY = Math.max(0, Math.min(100, posY));

            startX = touch.clientX;
            startY = touch.clientY;

            applyTransform();
        }
    });

    document.addEventListener('mouseup', function () {
        if (isDragging && preview) {
            isDragging = false;
            preview.style.cursor = 'grab';
        }
    });

    document.addEventListener('touchend', function () {
        isDragging = false;
    });

    // Script para ampliar la foto de perfil
    if (profileAvatar) {
        profileAvatar.addEventListener('click', function (e) {
            e.stopPropagation();
            const modal = document.getElementById('avatarModal');
            const modalImg = document.getElementById('modalAvatar');
            if (modal && modalImg) {
                modal.style.display = 'flex';
                modalImg.src = this.src;
            }
        });
    }

    // Cerrar modal de ampliación
    const avatarModal = document.getElementById('avatarModal');
    if (avatarModal) {
        avatarModal.addEventListener('click', function () {
            this.style.display = 'none';
        });
    }
});

// Aplicar transformaciones
function applyTransform() {
    const preview = document.getElementById('previewAvatar');
    if (preview) {
        preview.style.transform = `scale(${currentZoom})`;
        preview.style.objectPosition = `${posX}% ${posY}%`;
    }
}

// Cerrar modal de edición
function closeEditModal() {
    document.getElementById('editProfileModal').style.display = 'none';
    document.getElementById('zoomControl').style.display = 'none';
    currentZoom = 1;
    posX = 50;
    posY = 50;
}

// Guardar cambios del perfil
function saveProfile() {
    const name = document.getElementById('editName').value;
    const username = document.getElementById('editUsername').value;
    const bio = document.getElementById('editBio').value;

    const profileName = document.querySelector('.profile-name');
    const profileHandle = document.querySelector('.profile-handle');
    const profileBio = document.querySelector('.profile-bio');

    if (profileName) {
        profileName.innerHTML = name + ' <span class="verified-badge">✔</span>';
    }
    if (profileHandle) {
        profileHandle.textContent = '@' + username;
    }
    if (profileBio) {
        profileBio.textContent = bio;
    }

    if (currentAvatarSrc) {
        const profileAvatar = document.querySelector('.profile-avatar');
        if (profileAvatar) {
            profileAvatar.src = currentAvatarSrc;
            profileAvatar.style.transform = `scale(${currentZoom})`;
            profileAvatar.style.objectPosition = `${posX}% ${posY}%`;
        }

        // Actualizar mini-profile cards
        document.querySelectorAll('.mini-profile-info img').forEach(img => {
            img.src = currentAvatarSrc;
            img.style.transform = `scale(${currentZoom})`;
            img.style.objectPosition = `${posX}% ${posY}%`;
        });
    }

    // Actualizar mini-profile info
    document.querySelectorAll('.mini-profile-info strong').forEach(el => el.textContent = name.split(' ')[0]);
    document.querySelectorAll('.mini-profile-info .texts span').forEach(el => el.textContent = '@' + username);

    closeEditModal();
}

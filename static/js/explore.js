document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header Effect ---
    const header = document.querySelector('.explore-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Filter Chips Interaction ---
    const filters = document.querySelectorAll('.filter-chip');

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Remove active class from all
            filters.forEach(f => f.classList.remove('active'));
            // Add active class to clicked
            filter.classList.add('active');

            // Optional: Add filtering logic here (e.g., show/hide masonry items)
            console.log(`Filtro seleccionado: ${filter.textContent}`);
        });
    });

    // --- Lightbox Functionality ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');
    const masonryItems = document.querySelectorAll('.masonry-item img'); // Select images inside items

    if (lightbox && lightboxImg) {
        masonryItems.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering parent click if any
                lightbox.style.display = 'flex';
                lightboxImg.src = img.src;
                document.body.style.overflow = 'hidden'; // Disable scroll
            });
        });

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scroll
        };

        closeBtn.addEventListener('click', closeLightbox);

        // Close on click outside image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                closeLightbox();
            }
        });
    }

    // --- Horizontal Scroll for Filters (Drag to Scroll) ---
    const slider = document.getElementById('filtersBar');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (slider) {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. ГОЛОВНА КАРУСЕЛЬ (якщо ми на головній сторінці) ---
    const slides = document.querySelectorAll(".slide");
    if (slides.length > 0) {
        let currentSlide = 0;
        const nextBtn = document.querySelector(".carousel-btn.next");
        const prevBtn = document.querySelector(".carousel-btn.prev");

        function showSlide(index) {
            slides.forEach(s => s.classList.remove("active"));
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add("active");
        }

        nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
        prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
        
        // Автоперегортання кожні 5 секунд
        setInterval(() => showSlide(currentSlide + 1), 5000);
    }

    // --- 2. ДИНАМІЧНИЙ ЗАГОЛОВОК КАТЕГОРІЇ ---
    const titleEl = document.getElementById("category-title");
    if (titleEl) {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type') || 'mebli';
        titleEl.textContent = "Каталог: " + type.replace('-', ' ').toUpperCase();
    }

    // --- 3. ГАЛЕРЕЯ / ЛАЙТБОКС СВАЙПИ ТА ЗУМ ---
    const triggers = document.querySelectorAll(".gallery-trigger");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".close-lightbox");
    const leftArrow = document.querySelector(".arrow-left");
    const rightArrow = document.querySelector(".arrow-right");

    let imgArray = Array.from(triggers).map(img => img.src);
    let currentIndex = 0;
    
    // Зум та Свайп змінні
    let scale = 1;
    let startX = 0;
    let endX = 0;

    if (triggers.length > 0) {
        triggers.forEach((trigger, idx) => {
            trigger.addEventListener("click", () => {
                currentIndex = idx;
                openLightbox(imgArray[currentIndex]);
            });
        });
    }

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.style.display = "flex";
        scale = 1;
        lightboxImg.style.transform = `scale(${scale})`;
    }

    function closeLightbox() {
        lightbox.style.display = "none";
    }

    function changeImage(dir) {
        currentIndex = (currentIndex + dir + imgArray.length) % imgArray.length;
        lightboxImg.src = imgArray[currentIndex];
        scale = 1;
        lightboxImg.style.transform = `scale(${scale})`;
    }

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (leftArrow) leftArrow.addEventListener("click", () => changeImage(-1));
    if (rightArrow) rightArrow.addEventListener("click", () => changeImage(1));

    // Клік поза фото закриває вікно
    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
    }

    // --- СВАЙПИ ДЛЯ СМАРТФОНІВ ---
    if (lightbox) {
        lightbox.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        }, {passive: true});

        lightbox.addEventListener("touchend", (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        }, {passive: true});
    }

    function handleSwipe() {
        let threshold = 50; // мінімальна відстань для розпізнавання свайпу
        if (startX - endX > threshold) {
            // Свайп вліво -> Наступне фото
            changeImage(1);
        } else if (endX - startX > threshold) {
            // Свайп вправо -> Попереднє фото
            changeImage(-1);
        }
    }

    // --- КЛІК/ТАП ДЛЯ ЗУМУ ---
    if (lightboxImg) {
        lightboxImg.addEventListener("click", (e) => {
            e.stopPropagation(); // щоб не закривався лайтбокс
            if (scale === 1) {
                scale = 2; // Збільшення
            } else {
                scale = 1; // Повернення до норми
            }
            lightboxImg.style.transform = `scale(${scale})`;
        });
    }
});

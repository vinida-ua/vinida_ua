document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. ГОЛОВНА КАРУСЕЛЬ (для index.html)
    // ==========================================================================
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

        if (nextBtn) nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
        if (prevBtn) prevBtn.addEventListener("click", () => showSlide(currentSlide - -1));
        
        setInterval(() => showSlide(currentSlide + 1), 5000);
    }

    // ==========================================================================
    // 2. СЛОВНИК НАЗВ КАТЕГОРІЙ (Для заголовків сторінок)
    // ==========================================================================
    const categoryNames = {
        'komody-vsi': 'Всі комоди',
        'komody-dveri': 'Комоди з дверцятами',
        'shafy-standart': 'Звичайні шафи',
        'shafy-kupe': 'Шафи-купе',
        'kuhni-vsi': 'Кухні',
        'kuhni-tumby': 'Кухонні тумби',
        'lizhka': 'Ліжка',
        'stoly': 'Столи',
        'pryhozhi': 'Прихожі',
        'vishalky': 'Вішалки',
        'obuvnyci': 'Обувниці',
        'polyci': 'Полиці',
        'tumby-tv': 'Тумби TV',
        'rizne': 'Різне'
    };

    // ==========================================================================
    // 3. КОНФІГУРАТОР АВТОМАТИЧНИХ ФОТОГАЛЕРЕЙ
    //    Сюди додаєш назву папки та кількість фото для кожної категорії
    // ==========================================================================
    const categoryConfig = {
        'shafy': { folder: 'Shafu', total: 22, ext: 'png' },
        // Коли створиш папки для інших категорій — просто розкоментуй або додай рядки нижче:
        // 'komody-vsi': { folder: 'Komody', total: 10, ext: 'jpg' },
        // 'shafy-kupe': { folder: 'Kupe', total: 15, ext: 'png' }
    };

    // ==========================================================================
    // 4. АВТОМАТИЧНЕ ВИВЕДЕННЯ ЧИСТИХ ФОТОГРАФІЙ (category.html)
    // ==========================================================================
    const titleEl = document.getElementById("category-title");
    const containerEl = document.getElementById("products-container");

    if (titleEl && containerEl) {
        // Отримуємо поточний тип категорії з посилання URL
        const urlParams = new URLSearchParams(window.location.search);
        const currentCat = urlParams.get('type') || 'shafy-standart';

        // Ставимо назву у заголовок сторінки
        titleEl.textContent = categoryNames[currentCat] || "Каталог меблів";

        // Беремо налаштування фото для цієї категорії (якщо немає — ставимо порожньо)
        const config = categoryConfig[currentCat];

        if (config) {
            // Цикл створення фото-карток
            for (let i = 1; i <= config.total; i++) {
                // Додаємо нуль для чисел 1-9 (01, 02... 10)
                const photoNumber = i < 10 ? "0" + i : i;
                const imgSrc = `images/${config.folder}/${photoNumber}.${config.ext}`;

                // Генеруємо HTML картки (Тільки чисте фото + класи для роботи Лайтбоксу)
                const productHTML = `
                    <div class="product-item">
                        <div class="product-img-wrapper">
                            <img src="${imgSrc}" 
                                 alt="Фото ${photoNumber}" 
                                 class="gallery-trigger" 
                                 data-index="${i - 1}" 
                                 onerror="this.onerror=null;this.src='https://placehold.co/600x450?text=Відсутнє+фото';">
                        </div>
                    </div>
                `;
                containerEl.insertAdjacentHTML('beforeend', productHTML);
            }
        } else {
            // Якщо для категорії ще не створена папка конфігурації
            containerEl.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px 0;">Галерея фотографій оновлюється...</p>`;
        }
    }

    // ==========================================================================
    // 5. МОДАЛЬНЕ ВІКНО (ЛАЙТБОКС) ДЛЯ ФОТОГРАФІЙ
    // ==========================================================================
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".close-lightbox");
    const leftArrow = document.querySelector(".arrow-left");
    const rightArrow = document.querySelector(".arrow-right");

    let activeImages = [];
    let currentIndex = 0;
    let scale = 1;
    let startX = 0;
    let endX = 0;

    if (containerEl) {
        containerEl.addEventListener("click", (e) => {
            if (e.target.classList.contains("gallery-trigger")) {
                const allTriggers = containerEl.querySelectorAll(".gallery-trigger");
                activeImages = Array.from(allTriggers).map(img => img.src);
                currentIndex = parseInt(e.target.getAttribute("data-index"));
                openLightbox(activeImages[currentIndex]);
            }
        });
    }

    function openLightbox(src) {
        if (!lightboxImg || !lightbox) return;
        lightboxImg.src = src;
        lightbox.style.display = "flex";
        scale = 1;
        lightboxImg.style.transform = `scale(${scale})`;
    }

    function closeLightbox() {
        if (lightbox) lightbox.style.display = "none";
    }

    function changeImage(dir) {
        if (activeImages.length === 0 || !lightboxImg) return;
        currentIndex = (currentIndex + dir + activeImages.length) % activeImages.length;
        lightboxImg.src = activeImages[currentIndex];
        scale = 1;
        lightboxImg.style.transform = `scale(${scale})`;
    }

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (leftArrow) leftArrow.addEventListener("click", () => changeImage(-1));
    if (rightArrow) rightArrow.addEventListener("click", () => changeImage(1));

    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });

        lightbox.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        }, {passive: true});

        lightbox.addEventListener("touchend", (e) => {
            endX = e.changedTouches[0].clientX;
            let threshold = 60;
            if (startX - endX > threshold) changeImage(1);
            if (endX - startX > threshold) changeImage(-1);
        }, {passive: true});
    }

    if (lightboxImg) {
        lightboxImg.addEventListener("click", (e) => {
            e.stopPropagation();
            scale = scale === 1 ? 2.2 : 1;
            lightboxImg.style.transform = `scale(${scale})`;
        });
    }
});

// ==========================================================================
// 6. РОЗГОРТАННЯ КАТЕГОРІЙ В МЕНЮ (АКОРДЕОН НА ГОЛОВНІЙ)
// ==========================================================================
document.addEventListener("DOMContentLoaded", function() {
    const menuRows = document.querySelectorAll(".menu-item .menu-row");

    menuRows.forEach(row => {
        row.addEventListener("click", function() {
            const parentItem = this.parentElement;
            const isActive = parentItem.classList.contains("active");
            const indicator = this.querySelector(".menu-plus, .menu-arrow");

            document.querySelectorAll(".menu-item").forEach(item => {
                item.classList.remove("active");
                const itemPlus = item.querySelector(".menu-plus");
                if (itemPlus) itemPlus.textContent = "+";
            });

            if (!isActive) {
                parentItem.classList.add("active");
                if (indicator && indicator.classList.contains("menu-plus")) {
                    indicator.textContent = "−";
                }
            }
        });
    });
});

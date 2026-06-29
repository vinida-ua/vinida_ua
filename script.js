document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. ГОЛОВНА КАРУСЕЛЬ (для index.html) ---
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
        if (prevBtn) prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
        
        setInterval(() => showSlide(currentSlide + 1), 5000);
    }

    // --- 2. БАЗА ДАНИХ ТОВАРІВ (Каталог) ---
    // Словник для гарних назв категорій
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

    // Створюємо об'єкт, де для кожної категорії буде по 10 товарів
    const productsData = {};

    // Автоматично генеруємо по 10 товарів для кожної категорії з реальними даними
    Object.keys(categoryNames).forEach(catKey => {
        productsData[catKey] = [];
        
        // Визначимо базові фото для різних типів меблів, щоб вони виглядали реалістично
        let imgUrl = "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600"; // дефолт (комод)
        if (catKey.includes('shafy')) imgUrl = "https://images.unsplash.com/photo-1558882224-cca166733360?q=80&w=600"; // шафа
        if (catKey.includes('kuhni')) imgUrl = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600"; // кухня
        if (catKey === 'lizhka') imgUrl = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600"; // ліжко
        if (catKey === 'stoly') imgUrl = "https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=600"; // стіл

        for (let i = 1; i <= 10; i++) {
            productsData[catKey].push({
                model: `№ ${catKey.slice(0,3).toUpperCase()}-${100 + i}`,
                size: `${800 + (i*50)} х ${1000 + (i*20)} х 450 мм`,
                color: i % 2 === 0 ? "Дуб Венге / Білий глянець" : "Дуб Сонома / Графіт",
                desc: `Елегантний та надійний виріб з категорії "${categoryNames[catKey]}". Позиція №${i} у нашому каталозі. Висока якість збірки та сучасні матеріали.`,
                img: imgUrl
            });
        }
    });

    // --- 3. ВІДОБРАЖЕННЯ ТОВАРІВ НА СТОРІНЦІ КАТЕГОРІЇ ---
    const titleEl = document.getElementById("category-title");
    const containerEl = document.getElementById("products-container");

    if (titleEl && containerEl) {
        const urlParams = new URLSearchParams(window.location.search);
        const currentCat = urlParams.get('type') || 'komody-vsi';

        // Ставимо правильний заголовок підрозділу
        titleEl.textContent = categoryNames[currentCat] || "Каталог меблів";

        // Беремо масив з 10 товарів для цієї категорії
        const currentProducts = productsData[currentCat] || [];

        // Генеруємо HTML-код для кожного з 10 товарів
        currentProducts.forEach((prod, index) => {
            const productHTML = `
                <div class="product-item">
                    <div class="product-img-wrapper">
                        <img src="${prod.img}" alt="${prod.model}" class="gallery-trigger" data-index="${index}">
                    </div>
                    <div class="product-info">
                        <h3>Модель: <span class="model-number">${prod.model}</span></h3>
                        <p><strong>Розмір:</strong> ${prod.size}</p>
                        <p><strong>Колір:</strong> ${prod.color}</p>
                        <p class="description">${prod.desc}</p>
                    </div>
                </div>
            `;
            containerEl.insertAdjacentHTML('beforeend', productHTML);
        });
    }

    // --- 4. МОДАЛЬНЕ ВІКНО (ЛАЙТБОКС) ДЛЯ ФОТО ---
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

    // Слухаємо кліки на картинки товарів (вони створюються динамічно, тому слухаємо через container)
    if (containerEl) {
        containerEl.addEventListener("click", (e) => {
            if (e.target.classList.contains("gallery-trigger")) {
                // Збираємо всі картинки, які зараз є на сторінці (всі 10 шт)
                const allTriggers = containerEl.querySelectorAll(".gallery-trigger");
                activeImages = Array.from(allTriggers).map(img => img.src);
                
                currentIndex = parseInt(e.target.getAttribute("data-index"));
                openLightbox(activeImages[currentIndex]);
            }
        });
    }

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.style.display = "flex";
        scale = 1;
        lightboxImg.style.transform = `scale(${scale})`;
    }

    function closeLightbox() {
        if (lightbox) lightbox.style.display = "none";
    }

    function changeImage(dir) {
        if (activeImages.length === 0) return;
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

        // Мобільні свайпи
        lightbox.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        }, {passive: true});

        lightbox.addEventListener("touchend", (e) => {
            endX = e.changedTouches[0].clientX;
            let threshold = 60;
            if (startX - endX > threshold) changeImage(1);  // свайп вліво
            if (endX - startX > threshold) changeImage(-1); // свайп вправо
        }, {passive: true});
    }

    // Зум по кліку/тапу на велике фото
    if (lightboxImg) {
        lightboxImg.addEventListener("click", (e) => {
            e.stopPropagation();
            scale = scale === 1 ? 2.2 : 1;
            lightboxImg.style.transform = `scale(${scale})`;
        });
    }
});

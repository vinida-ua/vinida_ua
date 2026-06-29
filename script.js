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

    // --- 2. СЛОВНИК НАЗВ КАТЕГОРІЙ ---
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

    document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("products-container");
    if (!container) return;

    // ВКАЖИ ТУТ КІЛЬКІСТЬ ФОТОГРАФІЙ У ПАПЦІ
    const totalPhotos = 22; 
    const folderName = "Shafu"; // Назва твоєї папки з великої літери

    // Цикл, який автоматично створює картки для кожного фото
    for (let i = 1; i <= totalPhotos; i++) {
        // Додаємо нуль попереду для чисел від 1 до 9 (щоб вийшло 01, 02... 10)
        const photoNumber = i < 10 ? "0" + i : i; 
        
        // Створюємо HTML-структуру картки (тільки фото, без тексту, як ми домовлялися)
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");

        productItem.innerHTML = `
            <div class="product-img-wrapper">
                <img src="images/${folderName}/${photoNumber}.png" alt="Фото ${photoNumber}">
            </div>
        `;

        container.appendChild(productItem);
    }
});

    // Функція-помічник для швидкого заповнення масиву товарів
    function generateCategoryProducts(catKey, prefix, imgPrefix, extension = 'jpg') {
        let list = [];
        for (let i = 1; i <= 10; i++) {
            list.push({
                model: `№ ${prefix}-${100 + i}`,
                size: `${800 + (i * 30)} х ${1000 + (i * 10)} х 450 мм`,
                color: i % 2 === 0 ? "Дуб Венге / Білий глянець" : "Дуб Сонома / Графіт",
                desc: `Якісні та сучасні меблі з секції "${categoryNames[catKey]}". Модель розроблена з урахуванням ергономіки та сучасних трендів дизайну. Позиція №${i}.`,
                // ТУТ ФОРМУЄТЬСЯ НАЗВА ФОТО: наприклад, komod1.jpg, komod2.jpg... або shafa_kupe1.jpg
                img: `${imgPrefix}${i}.${extension}` 
            });
        }
        return list;
    }

    // Заповнюємо кожну категорію. 
    // Ти можеш міняти префікси назв файлів, як тобі зручно (наприклад, 'komod', 'shafa')
    productsData['komody-vsi'] = generateCategoryProducts('komody-vsi', 'KOM', 'komod');
    productsData['komody-dveri'] = generateCategoryProducts('komody-dveri', 'KMD', 'komod_dveri');
    
    productsData['shafy-standart'] = generateCategoryProducts('shafy-standart', 'SHF', 'shafa_standart');
    productsData['shafy-kupe'] = generateCategoryProducts('shafy-kupe', 'SHK', 'shafa_kupe');
    
    productsData['kuhni-vsi'] = generateCategoryProducts('kuhni-vsi', 'KHN', 'kuhnya');
    productsData['kuhni-tumby'] = generateCategoryProducts('kuhni-tumby', 'KHT', 'kuhnya_tumba');
    
    productsData['lizhka'] = generateCategoryProducts('lizhka', 'LZH', 'lizhko');
    productsData['stoly'] = generateCategoryProducts('stoly', 'STL', 'stil');
    productsData['pryhozhi'] = generateCategoryProducts('pryhozhi', 'PRH', 'pryhozha');
    productsData['vishalky'] = generateCategoryProducts('vishalky', 'VSH', 'vishalka');
    productsData['obuvnyci'] = generateCategoryProducts('obuvnyci', 'OBV', 'obuvnycia');
    productsData['polyci'] = generateCategoryProducts('polyci', 'PLC', 'polycia');
    productsData['tumby-tv'] = generateCategoryProducts('tumby-tv', 'TTV', 'tumba_tv');
    productsData['rizne'] = generateCategoryProducts('rizne', 'RZN', 'rizne');


    // --- 4. ВІДОБРАЖЕННЯ ТОВАРІВ НА СТОРІНЦІ КАТЕГОРІЇ ---
    const titleEl = document.getElementById("category-title");
    const containerEl = document.getElementById("products-container");

    if (titleEl && containerEl) {
        const urlParams = new URLSearchParams(window.location.search);
        const currentCat = urlParams.get('type') || 'komody-vsi';

        titleEl.textContent = categoryNames[currentCat] || "Каталог меблів";
        const currentProducts = productsData[currentCat] || [];

        currentProducts.forEach((prod, index) => {
            const productHTML = `
                <div class="product-item">
                    <div class="product-img-wrapper">
                        <img src="${prod.img}" alt="${prod.model}" class="gallery-trigger" data-index="${index}" onerror="this.onerror=null;this.src='https://placehold.co/600x450?text=Відсутнє+фото';">
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

    // --- 5. МОДАЛЬНЕ ВІКНО (ЛАЙТБОКС) ДЛЯ ФОТО ---
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
// Розгортання категорій при натисканні (Акордеон)
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

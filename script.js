
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // 1. ГОЛОВНА КАРУСЕЛЬ
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

        if (nextBtn) {
            nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
        }

        setInterval(() => showSlide(currentSlide + 1), 5000);
    }

    // ==========================================================================
    // 2. НАЗВИ КАТЕГОРІЙ
    // ==========================================================================
    const categoryNames = {
        'komody-vsi': 'Звичайні комоди',
        'komody-dveri': 'Комоди з дверцятами',
        'shafy': 'Шафи',
        'kuhni-vsi': 'Кухні',
        'lizhka': 'Ліжка',
        'dyvany': 'Дивани',
        'stoly': 'Столи',
        'pryhozhi': 'Прихожі',
        'vishalky': 'Вішалки',
        'obuvnyci': 'Обувниці',
        'polyci': 'Полиці',
        'tumby-tv': 'Тумби TV',
        'kuhni-tumby': 'Кухонні тумби',
        'rizne': 'Різне'
    };

    // ==========================================================================
    // 3. НАЛАШТУВАННЯ ФОТОГАЛЕРЕЙ
    // ==========================================================================
    const categoryConfig = {
        'shafy': { folder: 'Shafu', total: 22, ext: 'png' },
        'komody-vsi': { folder: 'Komody_Zbychayni', total: 71, ext: 'png' },
        'komody-dveri': { folder: 'Komody_Dveri', total: 24, ext: 'png' },
        'kuhni-vsi': { folder: 'Kuhni', total: 24, ext: 'png' },
        'lizhka': { folder: 'Lizhka', total: 10, ext: 'png' },
        'dyvany': { folder: 'Dyvany', total: 8, ext: 'png' },
        'stoly': { folder: 'Stoly', total: 4, ext: 'png' },
        'pryhozhi': { folder: 'Pryhozhi', total: 8, ext: 'png' },
        'vishalky': { folder: 'Vishalky', total: 3, ext: 'png' },
        'obuvnyci': { folder: 'Obuvnyci', total: 6, ext: 'png' },
        'polyci': { folder: 'Polyci', total: 7, ext: 'png' },
        'tumby-tv': { folder: 'Tumby_TV', total: 9, ext: 'png' },
        'kuhni-tumby': { folder: 'Kuhni_Tumby', total: 0, ext: 'png' },
        'rizne': { folder: 'Rizne', total: 0, ext: 'png' }
    };

    // ==========================================================================
    // 4. АВТОМАТИЧНЕ ЗАВАНТАЖЕННЯ ФОТО ПОРЦІЯМИ ПО 6
    // Наступна порція починається після завантаження поточної.
    // Прокручувати сторінку для цього НЕ потрібно.
    // ==========================================================================
    const titleEl = document.getElementById("category-title");
    const containerEl = document.getElementById("products-container");

    if (titleEl && containerEl) {
        const urlParams = new URLSearchParams(window.location.search);
        const currentCat = urlParams.get("type") || "shafy";

        titleEl.textContent = categoryNames[currentCat] || "Каталог меблів";

        const config = categoryConfig[currentCat];

        if (config && config.total > 0) {
            containerEl.innerHTML = "";

            const photosPerLoad = 6;
            let loadedCount = 0;
            let isLoadingBatch = false;

            function loadNextPhotos() {
                if (isLoadingBatch || loadedCount >= config.total) return;

                isLoadingBatch = true;

                const start = loadedCount + 1;
                const end = Math.min(
                    loadedCount + photosPerLoad,
                    config.total
                );

                const batchImages = [];
                const fragment = document.createDocumentFragment();

                for (let i = start; i <= end; i++) {
                    const photoNumber = i < 10 ? "0" + i : String(i);
                    const imgSrc =
                        `images/${config.folder}/${photoNumber}.${config.ext}`;

                    const item = document.createElement("div");
                    item.className = "product-item";

                    const wrapper = document.createElement("div");
                    wrapper.className = "product-img-wrapper";

                    const img = document.createElement("img");
                    img.src = imgSrc;
                    img.alt = `Фото ${photoNumber}`;
                    img.className = "gallery-trigger";
                    img.dataset.index = String(i - 1);

                    // Завантажуємо фото відразу, а не лише при прокручуванні.
                    img.loading = "eager";
                    img.decoding = "async";

                    img.onerror = function () {
                        this.onerror = null;
                        this.src =
                            "https://placehold.co/600x450?text=Відсутнє+фото";
                    };

                    wrapper.appendChild(img);
                    item.appendChild(wrapper);
                    fragment.appendChild(item);
                    batchImages.push(img);
                }

                containerEl.appendChild(fragment);
                loadedCount = end;

                // Чекаємо, поки кожне фото завантажиться або завершиться помилкою.
                const waitForImage = (img) => {
                    if (img.complete) {
                        return Promise.resolve();
                    }

                    return new Promise(resolve => {
                        img.addEventListener("load", resolve, { once: true });
                        img.addEventListener("error", resolve, { once: true });
                    });
                };

                Promise.all(batchImages.map(waitForImage)).then(() => {
                    isLoadingBatch = false;

                    if (loadedCount < config.total) {
                        // Автоматично запускаємо наступну порцію.
                        setTimeout(loadNextPhotos, 0);
                    }
                });
            }

            // Запускаємо автоматичне завантаження з першої шістки.
            loadNextPhotos();

        } else {
            containerEl.innerHTML = `
                <p style="
                    grid-column: 1/-1;
                    text-align: center;
                    color: #888;
                    padding: 40px 0;
                    font-weight: 500;
                ">
                    Галерея фотографій оновлюється...
                </p>
            `;
        }
    }

    // ==========================================================================
    // 5. ПЕРЕГЛЯД ФОТО ТА TELEGRAM
    // ==========================================================================
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".close-lightbox");
    const leftArrow = document.querySelector(".arrow-left");
    const rightArrow = document.querySelector(".arrow-right");

    const telegramProductBtn =
        document.getElementById("telegram-product-btn");

    const telegramStatus =
        document.getElementById("telegram-status");

    const TELEGRAM_WORKER_URL =
        "https://vinida-telegram.dananignik27.workers.dev";

    const managerUsername = "vitospsn";

    let activeImages = [];
    let currentIndex = 0;
    let scale = 1;
    let startX = 0;
    let endX = 0;

    // Відкриття фотографії
    if (containerEl) {
        containerEl.addEventListener("click", (e) => {
            if (e.target.classList.contains("gallery-trigger")) {
                const allTriggers =
                    Array.from(containerEl.querySelectorAll(".gallery-trigger"));

                activeImages = allTriggers.map(img => ({
                    src: img.src,
                    index: Number(img.dataset.index)
                }));

                const clickedIndex = Number(e.target.dataset.index);

                currentIndex = activeImages.findIndex(
                    img => img.index === clickedIndex
                );

                if (currentIndex < 0) currentIndex = 0;

                openLightbox(activeImages[currentIndex].src);
            }
        });
    }

    function openLightbox(src) {
        if (!lightboxImg || !lightbox) return;

        lightboxImg.src = src;
        lightbox.style.display = "flex";
        document.body.style.overflow = "hidden";

        scale = 1;
        lightboxImg.style.transform = `scale(${scale})`;

        if (telegramStatus) {
            telegramStatus.textContent = "";
        }

        if (telegramProductBtn) {
            telegramProductBtn.disabled = false;
            telegramProductBtn.textContent =
                "💬 Дізнатися про цей товар";
        }
    }

    // Надсилання фото менеджеру та перехід у його Telegram
    async function sendProductToTelegram() {
        if (!lightboxImg || !telegramProductBtn) return;

        telegramProductBtn.disabled = true;
        telegramProductBtn.textContent = "⏳ Відправляємо...";

        if (telegramStatus) {
            telegramStatus.textContent = "";
        }

        try {
            const imageUrl = new URL(
                lightboxImg.src,
                window.location.href
            ).href;

            const urlParams = new URLSearchParams(
                window.location.search
            );

            const currentCat = urlParams.get("type") || "shafy";
            const category =
                categoryNames[currentCat] || "Каталог меблів";

            const photoNumberValue = activeImages[currentIndex]
                ? activeImages[currentIndex].index + 1
                : currentIndex + 1;

            const photoNumber = photoNumberValue < 10
                ? "0" + photoNumberValue
                : String(photoNumberValue);

            const response = await fetch(TELEGRAM_WORKER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    imageUrl: imageUrl,
                    category: category,
                    photoNumber: photoNumber
                })
            });

            const result = await response.json();

            if (!response.ok || !result.ok) {
                throw new Error(
                    result.error || "Не вдалося відправити фото"
                );
            }

            telegramProductBtn.textContent = "✅ Фото надіслано";

            if (telegramStatus) {
                telegramStatus.textContent =
                    "Фото надіслано менеджеру! Відкриваємо Telegram...";
            }

            const clientMessage =
                `Добрий день! 👋\n\n` +
                `Хочу дізнатися більше про цей товар.\n\n` +
                `🛋️ Категорія: ${category}\n` +
                `📷 Фото №${photoNumber}\n\n` +
                `Підкажіть, будь ласка, ціну та деталі.`;

            const telegramChatUrl =
                `https://t.me/${managerUsername}?text=${encodeURIComponent(clientMessage)}`;

            // Відкриваємо чат менеджера з підготовленим повідомленням.
            window.location.href = telegramChatUrl;

        } catch (error) {
            console.error("Помилка відправки:", error);

            telegramProductBtn.disabled = false;
            telegramProductBtn.textContent =
                "💬 Дізнатися про цей товар";

            if (telegramStatus) {
                telegramStatus.textContent =
                    "Не вдалося відправити. Спробуйте ще раз.";
            }
        }
    }

    function closeLightbox() {
    if (lightbox) {
        lightbox.style.display = "none";
    }

    document.body.style.overflow = "";
}

    function changeImage(dir) {
        if (activeImages.length === 0 || !lightboxImg) return;

        currentIndex =
            (currentIndex + dir + activeImages.length) % activeImages.length;

        lightboxImg.src = activeImages[currentIndex].src;

        scale = 1;
        lightboxImg.style.transform = `scale(${scale})`;
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeLightbox);
    }

    if (leftArrow) {
        leftArrow.addEventListener("click", () => changeImage(-1));
    }

    if (rightArrow) {
        rightArrow.addEventListener("click", () => changeImage(1));
    }

    if (telegramProductBtn) {
        telegramProductBtn.addEventListener(
            "click",
            sendProductToTelegram
        );
    }

    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (
                e.target === lightbox ||
                e.target.classList.contains("lightbox-content")
            ) {
                closeLightbox();
            }
        });

        lightbox.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        lightbox.addEventListener("touchend", (e) => {
            endX = e.changedTouches[0].clientX;
            const threshold = 60;

            if (startX - endX > threshold) changeImage(1);
            if (endX - startX > threshold) changeImage(-1);
        }, { passive: true });
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
// 6. РОЗГОРТАННЯ КАТЕГОРІЙ У МЕНЮ
// ==========================================================================
document.addEventListener("DOMContentLoaded", function() {
    const menuRows = document.querySelectorAll(".menu-item .menu-row");

    menuRows.forEach(row => {
        row.addEventListener("click", function() {
            const parentItem = this.parentElement;

            if (parentItem.querySelector(".menu-single")) return;

            const isActive = parentItem.classList.contains("active");
            const indicator = this.querySelector(".menu-plus");

            document.querySelectorAll(".menu-item").forEach(item => {
                item.classList.remove("active");

                const itemPlus = item.querySelector(".menu-plus");

                if (itemPlus) {
                    itemPlus.textContent = "+";
                }
            });

            if (!isActive) {
                parentItem.classList.add("active");

                if (indicator) {
                    indicator.textContent = "−";
                }
            }
        });
    });
});

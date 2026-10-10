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
        'tumby-tv': { folder: 'Tumby_TV', total: 0, ext: 'png' },
        'kuhni-tumby': { folder: 'Kuhni_Tumby', total: 0, ext: 'png' },
        'rizne': { folder: 'Rizne', total: 0, ext: 'png' }
    };

    // ==========================================================================
    // 4. АВТОМАТИЧНЕ ЗАВАНТАЖЕННЯ ФОТОГРАФІЙ
    // Телефон — по 3 фото, ПК — по 6 фото
    // ==========================================================================
    const titleEl = document.getElementById("category-title");
    const containerEl = document.getElementById("products-container");

    if (titleEl && containerEl) {
        const urlParams = new URLSearchParams(window.location.search);
        const currentCat = urlParams.get('type') || 'shafy';

        titleEl.textContent = categoryNames[currentCat] || "Каталог меблів";

        const config = categoryConfig[currentCat];

        if (config && config.total > 0) {
            containerEl.innerHTML = "";

            const photosPerLoad = window.innerWidth <= 768 ? 3 : 6;
            let loadedCount = 0;

            function loadNextPhotos() {
                if (loadedCount >= config.total) return;

                const start = loadedCount + 1;
                const end = Math.min(
                    loadedCount + photosPerLoad,
                    config.total
                );

                for (let i = start; i <= end; i++) {
                    const photoNumber = i < 10 ? "0" + i : i;

                    const imgSrc =
                        `images/${config.folder}/${photoNumber}.${config.ext}`;

                    const productHTML = `
                        <div class="product-item">
                            <div class="product-img-wrapper">
                                <img
                                    src="${imgSrc}"
                                    alt="Фото ${photoNumber}"
                                    class="gallery-trigger"
                                    data-index="${i - 1}"
                                    loading="lazy"
                                    onerror="this.onerror=null;this.src='https://placehold.co/600x450?text=Відсутнє+фото';"
                                >
                            </div>
                        </div>
                    `;

                    containerEl.insertAdjacentHTML('beforeend', productHTML);
                }

                loadedCount = end;
            }

            loadNextPhotos();

            window.addEventListener("scroll", () => {
                const scrollPosition = window.innerHeight + window.scrollY;
                const pageHeight = document.documentElement.scrollHeight;

                if (
                    scrollPosition >= pageHeight - 800 &&
                    loadedCount < config.total
                ) {
                    loadNextPhotos();
                }
            });

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
    // 5. ПЕРЕГЛЯД ФОТО ТА ЗАПИТ У TELEGRAM
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

    // ==========================================================================
    // ВІДПРАВЛЕННЯ ФОТО МЕНЕДЖЕРУ ТА ПЕРЕХІД У TELEGRAM
    // ==========================================================================
    async function sendProductToTelegram() {
        if (!lightboxImg || !telegramProductBtn) return;

        telegramProductBtn.disabled = true;
        telegramProductBtn.textContent = "⏳ Відправляємо...";

        if (telegramStatus) {
            telegramStatus.textContent = "";
        }

        try {
            // Адреса поточного фото
            const imageUrl = new URL(
                lightboxImg.src,
                window.location.href
            ).href;

            // Поточна категорія
            const urlParams = new URLSearchParams(
                window.location.search
            );

            const currentCat = urlParams.get("type") || "shafy";

            const category =
                categoryNames[currentCat] || "Каталог меблів";

            // Номер фотографії з урахуванням її номера в галереї
            const photoNumberValue = activeImages[currentIndex]
                ? activeImages[currentIndex].index + 1
                : currentIndex + 1;

            const photoNumber = photoNumberValue < 10
                ? "0" + photoNumberValue
                : String(photoNumberValue);

            // Спочатку надсилаємо фото менеджеру через Worker
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

            // Текст, який клієнт зможе надіслати менеджеру
            const clientMessage =
                `Добрий день! 👋\n\n` +
                `Хочу дізнатися більше про цей товар.\n\n` +
                `🛋️ Категорія: ${category}\n` +
                `📷 Фото №${photoNumber}\n\n` +
                `Підкажіть, будь ласка, ціну та деталі.`;

            // Відкриваємо особистий чат менеджера з підготовленим текстом
            const telegramChatUrl =
                `https://t.me/${managerUsername}?text=${encodeURIComponent(clientMessage)}`;

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

    // Закриття вікна з фото
    function closeLightbox() {
        if (lightbox) {
            lightbox.style.display = "none";
        }
    }

    // Перемикання фотографій
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

    // Закриття вікна та гортання фото на телефоні
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

    // Збільшення фото натисканням
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

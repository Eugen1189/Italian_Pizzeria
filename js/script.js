
let currentActiveDish = 0;

// Приховуємо попередження Swiper про loop
const originalWarn = console.warn;
console.warn = function(...args) {
    const message = args.join(' ');
    if (message.includes('Swiper Loop Warning')) {
        return; // Ігноруємо попередження про loop
    }
    originalWarn.apply(console, args);
};

document.addEventListener("DOMContentLoaded", function() {
    // Initialize Hero Swiper
    const swiperHero = new Swiper(".mySwiper", {
        direction: "horizontal", 
        loop: true, 
        autoplay: {
            delay: 5000, 
            disableOnInteraction: false, 
        },
        speed: 800, 
        // Дозволяємо свайп (touch control) - за замовчуванням true, але переконаємось
        allowTouchMove: true,
        grabCursor: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        effect: "fade", 
        fadeEffect: {
            crossFade: true,
        },
    });

    // Initialize Menu Category Swiper (if exists)
    const swiperMenuElement = document.querySelector(".myMenuSwiper");
    if (swiperMenuElement) {
        new Swiper(".myMenuSwiper", {
            direction: "horizontal",
            loop: false,
            autoHeight: true,
            speed: 500,
            allowTouchMove: true, 
            // Збільшуємо простір, щоб страви не торкалися одна одної
            spaceBetween: 50, // Збільшено до 50px
            breakpoints: {
                320: {
                    spaceBetween: 30,
                },
                768: {
                    spaceBetween: 40,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 50, // Також збільшено тут
                    centeredSlides: false,
                }
            }
        });
    }

    // Initialize Mobile Menu Swiper (тільки для мобільних)
    let mobileMenuSwiper = null;
    
    function initMobileMenuSwiper() {
        const mobileMenuSwiperElement = document.querySelector(".mobileMenuSwiper");
        if (mobileMenuSwiperElement && window.innerWidth <= 768 && !mobileMenuSwiper) {
            mobileMenuSwiper = new Swiper(".mobileMenuSwiper", {
                direction: "horizontal",
                loop: true,
                slidesPerView: 1,
                centeredSlides: true,
                spaceBetween: 0,
                speed: 600,
                allowTouchMove: true,
                simulateTouch: true,
                grabCursor: true,
                touchRatio: 1,
                touchAngle: 45,
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                on: {
                    slideChange: function() {
                        // Оновлюємо active клас для анімацій
                        const slides = this.slides;
                        slides.forEach((slide, index) => {
                            const wrapper = slide.querySelector('.popular-item-wrapper');
                            if (wrapper) {
                                wrapper.classList.remove('active');
                                if (index === this.activeIndex) {
                                    wrapper.classList.add('active');
                                }
                            }
                        });
                    }
                }
            });
        }
    }
    
    // Ініціалізуємо при завантаженні
    initMobileMenuSwiper();
    
    // Ініціалізуємо при зміні розміру екрана (опціонально)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth <= 768 && !mobileMenuSwiper) {
                initMobileMenuSwiper();
            } else if (window.innerWidth > 768 && mobileMenuSwiper) {
                mobileMenuSwiper.destroy(true, true);
                mobileMenuSwiper = null;
            }
        }, 250);
    });

    // Initialize Dish Selection (для desktop версії)
    const allDishes = document.querySelectorAll('.desktop-menu-scroll .popular-item-wrapper');
    
    allDishes.forEach((dish, index) => {
        dish.addEventListener('click', () => {
            setActiveDish(index);
        });
        
        // Для мобільних: запускаємо анімацію при торканні
        dish.addEventListener('touchstart', function() {
            const decorativeBg = dish.querySelector('.decorative-bg');
            if (decorativeBg) {
                decorativeBg.style.animation = 'starGlowMobile 1.2s ease-in-out infinite';
            }
        });
    });
    
    if (allDishes.length > 0) {
        currentActiveDish = 1;
        setActiveDish(1);
        
        const scrollContainer = document.getElementById('popular-scroll');
        if (scrollContainer && allDishes[1]) {
            setTimeout(() => {
                allDishes[1].scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
            }, 100);
        }
    }

    // Initialize Highlight Words with Image Animation
    const highlightWords = document.querySelectorAll('.highlight-word');
    const imgLeft = document.getElementById('highlight-img-left');
    const imgRight = document.getElementById('highlight-img-right');
    const containerLeft = document.querySelector('.highlight-image-left');
    const containerRight = document.querySelector('.highlight-image-right');

    const imageMap = [
        { left: 'img/pizza_margherita.jpg.png', right: 'img/antipasto_caprese.jpg.png' },
        { left: 'img/pizza_quattro_formaggi.jpg.png', right: 'img/antipasto_caprese.jpg.png' },
        { left: 'img/pizza_margherita.jpg.png', right: 'img/pizza_quattro_formaggi.jpg.png' },
        { left: 'img/pizza_diavola.jpg.png', right: 'img/pizza_margherita.jpg.png' },
        { left: 'img/pasta_carbonara.jpg.png', right: 'img/dessert_tiramisu.jpg.png' },
        { left: 'img/pizza_quattro_formaggi.jpg.png', right: 'img/pizza_diavola.jpg.png' }
    ];

    highlightWords.forEach((word, index) => {
        word.addEventListener('mouseenter', function() {
            containerLeft?.classList.remove('active');
            containerRight?.classList.remove('active');
            
            const currentImages = imageMap[index];
            
            if (imgLeft && imgRight && currentImages) {
                imgLeft.src = currentImages.left;
                imgRight.src = currentImages.right;
                
                setTimeout(() => {
                    containerLeft?.classList.add('active');
                    containerRight?.classList.add('active');
                }, 50);
            }
        });

        word.addEventListener('mouseleave', function() {
            containerLeft?.classList.remove('active');
            containerRight?.classList.remove('active');
    });
});

    // Philosophy Section Scroll Animation
    const philosophySection = document.querySelector('.philosophy-section');
    const philosophyLeft = document.querySelector('.philosophy-left');
    const philosophyRight = document.querySelector('.philosophy-right');
    
    if (philosophySection && philosophyLeft && philosophyRight) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    philosophyLeft.style.animation = 'slideInUp 0.8s ease-out forwards';
                    philosophyRight.style.animation = 'slideInUp 0.8s ease-out forwards';
                    observer.unobserve(philosophySection);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(philosophySection);
    }

    // Initialize Recipes Slider (з loop анімацією по колу)
    const swiperRecipesElement = document.querySelector('.myRecipesSwiper');
    
    if (swiperRecipesElement) {
        // Перевіряємо кількість слайдів
        const slidesCount = swiperRecipesElement.querySelectorAll('.swiper-slide').length;
        // Для безкінечного loop потрібно хоча б 3 слайда (для плавності)
        // Але якщо менше, все одно увімкнумо loop для плавності
        const enableLoop = slidesCount >= 3;
        
        const swiperRecipesConfig = {
            direction: "horizontal", // ПЕРЕВІРКА: Горизонтальний напрямок
            
            slidesPerView: 'auto',
            spaceBetween: 30,
            
            // --- КЛЮЧОВІ ЗМІНИ ДЛЯ ВИПРАВЛЕННЯ ОБРИВУ ---
            // Додає відступ перед першим слайдом (ліворуч)
            slidesOffsetBefore: 20,
            
            // Додає відступ після останнього слайда (праворуч)
            slidesOffsetAfter: 20,
            
            // Увімкнення loop для безкінечного прокручування
            loop: enableLoop,
            loopAdditionalSlides: enableLoop ? Math.max(3, Math.ceil(slidesCount / 2)) : 0,
            loopPreventsSliding: false,
            loopFillGroupWithBlank: true, // Важливо для плавного loop
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            watchOverflow: false, // Вимкнути для кращої роботи loop
            
            centeredSlides: false,
            speed: 800,
            
            // Autoplay для автоматичного слайд-шоу - завжди включено
            autoplay: enableLoop ? {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
                stopOnLastSlide: false,
                waitForTransition: true,
                reverseDirection: false,
            } : false,
            
            // Додаткові налаштування для надійності
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            
            // Дозволяємо прокрутку мишею та тачем
            allowTouchMove: true,
            grabCursor: true,
            
            navigation: {
                nextEl: ".recipes-arrow-next",
                prevEl: ".recipes-arrow-prev",
            },
            
            // Забезпечуємо, що autoplay стартує та керування z-index
            on: {
                init: function () {
                    // Встановлюємо z-index при ініціалізації
                    this.slides.forEach((slide, index) => {
                        if (index === this.activeIndex) {
                            slide.style.zIndex = 20;
                        } else {
                            slide.style.zIndex = 10;
                        }
                    });
                    
                    // Перезапускаємо autoplay після ініціалізації
                    const startAutoplay = () => {
                        if (this.autoplay) {
                            this.autoplay.start();
                            
                            // Перевіряємо ще раз через невеликий інтервал
                            setTimeout(() => {
                                if (!this.autoplay.running) {
                                    this.autoplay.start();
                                }
                            }, 500);
                        }
                    };
                    
                    setTimeout(startAutoplay, 300);
                    setTimeout(startAutoplay, 1000);
                },
                slideChange: function () {
                    // Перебираємо всі слайди, щоб оновити z-index
                    this.slides.forEach((slide, index) => {
                        // Високий z-index для поточного активного слайда
                        if (index === this.activeIndex) {
                            slide.style.zIndex = 20;
                        } else {
                            // Нижчий z-index для неактивних слайдів
                            slide.style.zIndex = 10;
                        }
                    });
                },
                transitionEnd: function () {
                    // Після завершення переходу оновлюємо z-index для плавного loop
                    this.slides.forEach((slide, index) => {
                        if (index === this.activeIndex) {
                            slide.style.zIndex = 20;
                        } else {
                            slide.style.zIndex = 10;
                        }
                    });
                },
            },
            breakpoints: {
                // --- КЛЮЧОВІ ЗМІНИ У BREAKPOINTS ---
                // Мобільні (до 768px)
                320: {
                    direction: "horizontal",
                    slidesPerView: 1,
                    centeredSlides: false,
                    spaceBetween: 20,
                    slidesOffsetBefore: 20,
                    slidesOffsetAfter: 20,
                    loop: enableLoop,
                    loopAdditionalSlides: enableLoop ? Math.max(2, Math.ceil(slidesCount / 2)) : 0,
                    loopFillGroupWithBlank: true,
                    autoplay: enableLoop ? {
                        delay: 3000,
                        disableOnInteraction: false,
                        stopOnLastSlide: false,
                    } : false,
                },
                // Планшети (768px і вище)
                768: {
                    direction: "horizontal",
                    slidesPerView: 'auto',
                    spaceBetween: 30,
                    centeredSlides: false,
                    slidesOffsetBefore: 20,
                    slidesOffsetAfter: 20,
                    loop: enableLoop,
                    loopAdditionalSlides: enableLoop ? Math.max(3, Math.ceil(slidesCount / 2)) : 0,
                    loopFillGroupWithBlank: true,
                    autoplay: enableLoop ? {
                        delay: 3000,
                        disableOnInteraction: false,
                        stopOnLastSlide: false,
                    } : false,
                },
                // Desktop (1200px і вище)
                1200: {
                    direction: "horizontal",
                    slidesPerView: 'auto',
                    spaceBetween: 30,
                    centeredSlides: false,
                    slidesOffsetBefore: 20,
                    slidesOffsetAfter: 20,
                    loop: enableLoop,
                    loopAdditionalSlides: enableLoop ? Math.max(3, Math.ceil(slidesCount / 2)) : 0,
                    loopFillGroupWithBlank: true,
                    autoplay: enableLoop ? {
                        delay: 3000,
                        disableOnInteraction: false,
                        stopOnLastSlide: false,
                    } : false,
                }
            }
        };
        
        // Створюємо Swiper з обробкою помилок
        try {
            const swiperRecipes = new Swiper(".myRecipesSwiper", swiperRecipesConfig);
        } catch (error) {
            console.error('Error initializing Recipes Swiper:', error);
        }
    }

    // Initialize Instagram Swiper (з loop анімацією по колу та такою ж відстанню як в рецептах)
    const swiperInstagramElement = document.querySelector('.myInstagramSwiper');
    
    if (swiperInstagramElement) {
        // Перевіряємо кількість слайдів
        const instagramSlidesCount = swiperInstagramElement.querySelectorAll('.swiper-slide').length;
        // Для безкінечного loop потрібно хоча б 3 слайда
        const enableInstagramLoop = instagramSlidesCount >= 3;
        
        const swiperInstagramConfig = {
            direction: "horizontal",
            
            slidesPerView: 'auto',
            spaceBetween: 30,
            
            // Увімкнення loop для безкінечного прокручування
            loop: enableInstagramLoop,
            loopAdditionalSlides: enableInstagramLoop ? Math.max(3, Math.ceil(instagramSlidesCount / 2)) : 0,
            loopPreventsSliding: false,
            loopFillGroupWithBlank: true, // Важливо для плавного loop
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            watchOverflow: false, // Вимкнути для кращої роботи loop
            
            centeredSlides: false,
            speed: 800,
            
            // Дозволяємо свайп
            allowTouchMove: true,
            grabCursor: true,
            
            // Autoplay для автоматичного слайд-шоу по колу
            autoplay: enableInstagramLoop ? {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                stopOnLastSlide: false,
                waitForTransition: true,
            } : false,
            
            breakpoints: {
                320: {
                    direction: "horizontal",
                    slidesPerView: 1.1,
                    spaceBetween: 15,
                    centeredSlides: true,
                    loop: enableInstagramLoop,
                    loopAdditionalSlides: enableInstagramLoop ? Math.max(2, Math.ceil(instagramSlidesCount / 2)) : 0,
                    loopFillGroupWithBlank: true,
                },
                768: {
                    direction: "horizontal",
                    slidesPerView: 1.2,
                    spaceBetween: 20,
                    centeredSlides: true,
                    loop: enableInstagramLoop,
                    loopAdditionalSlides: enableInstagramLoop ? Math.max(2, Math.ceil(instagramSlidesCount / 2)) : 0,
                    loopFillGroupWithBlank: true,
                },
                1024: {
                    direction: "horizontal",
                    slidesPerView: 'auto',
                    spaceBetween: 30,
                    centeredSlides: false,
                    loop: enableInstagramLoop,
                    loopAdditionalSlides: enableInstagramLoop ? Math.max(3, Math.ceil(instagramSlidesCount / 2)) : 0,
                    loopFillGroupWithBlank: true,
                },
                1200: {
                    slidesPerView: 'auto',
                    spaceBetween: 30,
                    centeredSlides: false,
                    loop: enableInstagramLoop,
                    loopAdditionalSlides: enableInstagramLoop ? Math.max(3, Math.ceil(instagramSlidesCount / 2)) : 0,
                    loopFillGroupWithBlank: true,
                }
            }
        };
        
        // Створюємо Swiper з обробкою помилок
        try {
            new Swiper(".myInstagramSwiper", swiperInstagramConfig);
        } catch (error) {
            console.error('Error initializing Instagram Swiper:', error);
        }
    }
    
    // Відновлюємо оригінальний console.warn після ініціалізації Swiper
    setTimeout(() => {
        console.warn = originalWarn;
    }, 1000);
    
    // --- НОВИЙ КОД: АВТОМАТИЧНЕ ПРОКРУЧУВАННЯ ДО ЯКОРЯ ---
    
    // Отримуємо посилання на елемент
    const startElement = document.getElementById('top-of-page');
    
    if (startElement) {
        // Використовуємо метод scrollIntoView для плавного прокручування
        // Невелика затримка, щоб переконатися, що сторінка повністю завантажена
        setTimeout(() => {
            startElement.scrollIntoView({
                behavior: 'smooth' // Забезпечує плавний перехід
            });
        }, 100);
    }
});

// Set active dish function (плавний перехід без моргання)
window.setActiveDish = function(index) {
    // Працюємо тільки з desktop версією
    const allDishes = document.querySelectorAll('.desktop-menu-scroll .popular-item-wrapper');
    
    if (allDishes[index]) {
        // Спочатку прибираємо active з усіх
        allDishes.forEach(dish => dish.classList.remove('active'));
        
        // Невелика затримка для плавного переходу
        requestAnimationFrame(() => {
            allDishes[index].classList.add('active');
            currentActiveDish = index;
            
            const scrollContainer = document.getElementById('popular-scroll');
            if (scrollContainer && allDishes[index]) {
                // Плавний скрол з додатковою затримкою
                setTimeout(() => {
                    allDishes[index].scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest', 
                        inline: 'center' 
                    });
                }, 50);
            }
        });
    }
}

// Menu navigation buttons (для desktop)
window.scrollLeftMenu = function() {
    const allDishes = document.querySelectorAll('.desktop-menu-scroll .popular-item-wrapper');
    if (allDishes.length > 0) {
        currentActiveDish = (currentActiveDish - 1 + allDishes.length) % allDishes.length;
        setActiveDish(currentActiveDish);
    }
}

window.scrollRightMenu = function() {
    const allDishes = document.querySelectorAll('.desktop-menu-scroll .popular-item-wrapper');
    if (allDishes.length > 0) {
        currentActiveDish = (currentActiveDish + 1) % allDishes.length;
        setActiveDish(currentActiveDish);
    }
}


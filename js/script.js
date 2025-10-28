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
            // Збільште простір, щоб страви не торкалися одна одної
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

    // Initialize Dish Selection
    const allDishes = document.querySelectorAll('.popular-item-wrapper');
    
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
        // Для slidesPerView: 'auto' та loop потрібно більше слайдів
        // Використовуємо loop тільки якщо достатньо слайдів (8+ для надійності)
        const enableLoop = slidesCount >= 8;
        
        const swiperRecipesConfig = {
            slidesPerView: 'auto',
            spaceBetween: 30,
            
            // Увімкнення loop тільки якщо достатньо слайдів
            loop: enableLoop,
            loopAdditionalSlides: enableLoop ? 2 : 0,
            loopPreventsSliding: false,
            loopFillGroupWithBlank: false,
            watchSlidesProgress: true,
            watchOverflow: true,
            
            centeredSlides: false,
            speed: 800,
            
            // Autoplay для автоматичного слайд-шоу - завжди включено
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
                stopOnLastSlide: false,
                waitForTransition: true,
            },
            
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
                320: {
                    slidesPerView: 'auto',
                    spaceBetween: 15,
                    centeredSlides: false,
                    loop: enableLoop,
                    loopAdditionalSlides: enableLoop ? 1 : 0, // Зменшено для уникнення попереджень
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                        stopOnLastSlide: !enableLoop,
                    },
                },
                768: {
                    slidesPerView: 'auto',
                    spaceBetween: 20,
                    centeredSlides: false,
                    loop: enableLoop,
                    loopAdditionalSlides: enableLoop ? 2 : 0, // Зменшено для уникнення попереджень
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                        stopOnLastSlide: false,
                    },
                },
                1200: {
                    slidesPerView: 'auto',
                    spaceBetween: 30,
                    centeredSlides: false,
                    loop: enableLoop,
                    loopAdditionalSlides: enableLoop ? 2 : 0, // Зменшено для уникнення попереджень
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                        stopOnLastSlide: false,
                    },
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
        // З 8 слайдами loop працюватиме коректно
        const enableInstagramLoop = instagramSlidesCount >= 8;
        
        const swiperInstagramConfig = {
            slidesPerView: 'auto',
            spaceBetween: 30, // Така сама відстань як в рецептах
            
            // Увімкнення loop тільки якщо достатньо слайдів
            loop: enableInstagramLoop,
            loopAdditionalSlides: enableInstagramLoop ? 2 : 0,
            loopPreventsSliding: false,
            loopFillGroupWithBlank: false,
            watchSlidesProgress: true,
            watchOverflow: true,
            
            centeredSlides: false,
            speed: 800,
            
            // Autoplay для автоматичного слайд-шоу по колу (тільки якщо loop увімкнено)
            autoplay: enableInstagramLoop ? {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            } : false,
            
            breakpoints: {
                320: {
                    slidesPerView: 'auto',
                    spaceBetween: 15, // Така сама як в рецептах
                    centeredSlides: false,
                    loop: enableInstagramLoop,
                    loopAdditionalSlides: enableInstagramLoop ? 1 : 0, // Зменшено для уникнення попереджень
                },
                768: {
                    slidesPerView: 'auto',
                    spaceBetween: 20,
                    centeredSlides: false,
                    loop: enableInstagramLoop,
                    loopAdditionalSlides: enableInstagramLoop ? 1 : 0, // Зменшено для уникнення попереджень
                },
                1024: {
                    slidesPerView: 'auto',
                    spaceBetween: 30,
                    centeredSlides: false,
                    loop: enableInstagramLoop,
                    loopAdditionalSlides: enableInstagramLoop ? 2 : 0,
                },
                1200: {
                    slidesPerView: 'auto',
                    spaceBetween: 30,
                    centeredSlides: false,
                    loop: enableInstagramLoop,
                    loopAdditionalSlides: enableInstagramLoop ? 2 : 0,
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
});

// Set active dish function
window.setActiveDish = function(index) {
    const allDishes = document.querySelectorAll('.popular-item-wrapper');
    
    allDishes.forEach(dish => dish.classList.remove('active'));
    if (allDishes[index]) {
        allDishes[index].classList.add('active');
        currentActiveDish = index;
        
        const scrollContainer = document.getElementById('popular-scroll');
        if (scrollContainer && allDishes[index]) {
            allDishes[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
}

// Menu navigation buttons
window.scrollLeftMenu = function() {
    const allDishes = document.querySelectorAll('.popular-item-wrapper');
    currentActiveDish = (currentActiveDish - 1 + allDishes.length) % allDishes.length;
    setActiveDish(currentActiveDish);
}

window.scrollRightMenu = function() {
    const allDishes = document.querySelectorAll('.popular-item-wrapper');
    currentActiveDish = (currentActiveDish + 1) % allDishes.length;
    setActiveDish(currentActiveDish);
}

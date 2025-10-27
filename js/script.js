// Global variable for dish selection
let currentActiveDish = 0;

document.addEventListener("DOMContentLoaded", function() {
    // 1. Initialize the Hero Swiper
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

    // 2. Initialize the Menu Category Swiper (if exists)
    const swiperMenuElement = document.querySelector(".myMenuSwiper");
    let swiperMenu = null;
    
    if (swiperMenuElement) {
        swiperMenu = new Swiper(".myMenuSwiper", {
            direction: "horizontal",
            loop: false, // Do not loop categories
            autoHeight: true, // Adjust height based on current slide content
            speed: 500, // Smooth transition speed
            allowTouchMove: true, 
        });
    }

    // 3. Dish selection logic
    const allDishes = document.querySelectorAll('.popular-item-wrapper');
    
    // Add click handlers to each dish
    allDishes.forEach((dish, index) => {
        dish.addEventListener('click', () => {
            setActiveDish(index);
        });
    });
    
    // Initialize second dish as active on page load
    if (allDishes.length > 0) {
        currentActiveDish = 1; // Start with second dish (index 1)
        setActiveDish(1);
        
        // Scroll to the second dish
        const scrollContainer = document.getElementById('popular-scroll');
        if (scrollContainer && allDishes[1]) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                allDishes[1].scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
            }, 100);
        }
    }
});

// Function to set active dish
window.setActiveDish = function(index) {
    const allDishes = document.querySelectorAll('.popular-item-wrapper');
    
    allDishes.forEach(dish => dish.classList.remove('active'));
    if (allDishes[index]) {
        allDishes[index].classList.add('active');
        currentActiveDish = index;
        
        // Scroll to center the active dish
        const scrollContainer = document.getElementById('popular-scroll');
        if (scrollContainer && allDishes[index]) {
            allDishes[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
}

// Update button functions to switch active dish (circular navigation)
window.scrollLeftMenu = function() {
    const allDishes = document.querySelectorAll('.popular-item-wrapper');
    // Move to previous dish (circular: goes to last dish if at first)
    currentActiveDish = (currentActiveDish - 1 + allDishes.length) % allDishes.length;
    setActiveDish(currentActiveDish);
}

window.scrollRightMenu = function() {
    const allDishes = document.querySelectorAll('.popular-item-wrapper');
    // Move to next dish (circular: goes to first dish if at last)
    currentActiveDish = (currentActiveDish + 1) % allDishes.length;
    setActiveDish(currentActiveDish);
}

// Dynamic Highlighting Logic with Image Animation on Hover
document.addEventListener("DOMContentLoaded", function() {
    const highlightWords = document.querySelectorAll('.highlight-word');
    const imgLeft = document.getElementById('highlight-img-left');
    const imgRight = document.getElementById('highlight-img-right');
    const containerLeft = document.querySelector('.highlight-image-left');
    const containerRight = document.querySelector('.highlight-image-right');

    // Define the images to use for each word
    const imageMap = [
        { left: 'img/pizza_margherita.jpg.png', right: 'img/antipasto_caprese.jpg.png' }, // 0: INGREDIENTI FRESCHI (свіжі інгредієнти)
        { left: 'img/pizza_quattro_formaggi.jpg.png', right: 'img/antipasto_caprese.jpg.png' }, // 1: MOZZARELLA PREMIUM (преміум моцарела)
        { left: 'img/pizza_margherita.jpg.png', right: 'img/pizza_quattro_formaggi.jpg.png' }, // 2: SENZA GLUTINE (без глютену)
        { left: 'img/pizza_diavola.jpg.png', right: 'img/pizza_margherita.jpg.png' }, // 3: FORNO TRADIZIONALE (традиційна піч)
        { left: 'img/pasta_carbonara.jpg.png', right: 'img/dessert_tiramisu.jpg.png' }, // 4: FATTO A MANO (ручна робота)
        { left: 'img/pizza_quattro_formaggi.jpg.png', right: 'img/pizza_diavola.jpg.png' } // 5: CERTIFICAZIONE ITALIANA (італійська сертифікація)
    ];

    // Add hover event listeners to each word
    highlightWords.forEach((word, index) => {
        word.addEventListener('mouseenter', function() {
            // Hide images from previous word
            containerLeft?.classList.remove('active');
            containerRight?.classList.remove('active');
            
            // Get images for current word
            const currentImages = imageMap[index];
            
            if (imgLeft && imgRight && currentImages) {
                // Update image sources
                imgLeft.src = currentImages.left;
                imgRight.src = currentImages.right;
                
                // Show images with animation
                setTimeout(() => {
                    containerLeft?.classList.add('active');
                    containerRight?.classList.add('active');
                }, 50);
            }
        });

        word.addEventListener('mouseleave', function() {
            // Hide images when mouse leaves
            containerLeft?.classList.remove('active');
            containerRight?.classList.remove('active');
        });
    });
});

// Philosophy section scroll animation
document.addEventListener("DOMContentLoaded", function() {
    const philosophySection = document.querySelector('.philosophy-section');
    const philosophyLeft = document.querySelector('.philosophy-left');
    const philosophyRight = document.querySelector('.philosophy-right');
    
    if (philosophySection && philosophyLeft && philosophyRight) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    philosophyLeft.style.animation = 'slideInLeft 0.8s ease-out forwards';
                    philosophyRight.style.animation = 'slideInRight 0.8s ease-out forwards';
                    observer.unobserve(philosophySection);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(philosophySection);
    }
});

// Recipes section scroll functions
let currentRecipeIndex = 0;

window.scrollLeftRecipes = function() {
    const allRecipes = document.querySelectorAll('#recipes-list .recipe-card-slide');
    if (!allRecipes || allRecipes.length === 0) return;
    
    // Move to previous recipe (circular: goes to last recipe if at first)
    currentRecipeIndex = (currentRecipeIndex - 1 + allRecipes.length) % allRecipes.length;
    allRecipes[currentRecipeIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

window.scrollRightRecipes = function() {
    const allRecipes = document.querySelectorAll('#recipes-list .recipe-card-slide');
    if (!allRecipes || allRecipes.length === 0) return;
    
    // Move to next recipe (circular: goes to first recipe if at last)
    currentRecipeIndex = (currentRecipeIndex + 1) % allRecipes.length;
    allRecipes[currentRecipeIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}


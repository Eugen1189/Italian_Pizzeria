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



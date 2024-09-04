let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');

function showSlide(index) {
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    const offset = -currentSlide * 100;
    document.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Automatically change slides every 3 seconds (3000 ms)
setInterval(nextSlide, 3000);


document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    // Your form submission logic here
    window.location.href = '/thank-you.html'; // Redirect to thank you page
});

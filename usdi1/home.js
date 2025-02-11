document.addEventListener('DOMContentLoaded', function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.carousel-dot');
    const counters = document.querySelectorAll('.count');
    let observer = new IntersectionObserver(onIntersection);

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            dots[i].classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function setSlide(index) {
        showSlide(index);
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    setInterval(nextSlide, 3000);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => setSlide(index));
    });

    function onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let counter = entry.target;
                let target = +counter.getAttribute('data-target');
                let count = 0;
                let increment = target / 100;

                function updateCounter() {
                    count += increment;
                    if (count < target) {
                        counter.textContent = Math.ceil(count);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                }

                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }

    counters.forEach(counter => observer.observe(counter));
});


$(document).ready(function(){
    $('#h_id').load("header.html");
    $('.item1').isotope({
        // options
        itemSelector: '.item',
        layoutMode: 'fitRows'
    });

    $('.menu1 ul li').click(function(){
        $('.menu1 ul li').removeClass('active');
        $(this).addClass('active');

        var selector =$(this).attr('data-filter');
        $('.item1').isotope({
            filter:selector
        });
        return false;
    });
    $('#f_id').load("footer.html") 
});


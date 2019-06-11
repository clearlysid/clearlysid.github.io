// const swup = new Swup();

const navTail = document.querySelector('.nav-tail');
const links = document.querySelectorAll(".nav-links li");
const burger = document.querySelector('.burger');

burger.addEventListener('click', () => {
    navTail.classList.toggle("open");
    links.forEach(link => {
        link.classList.toggle("fade");
    });
});
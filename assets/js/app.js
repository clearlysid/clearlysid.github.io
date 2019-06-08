// window.addEventListener('load', () => {
//     const preload = document.querySelector('.preload');
//     setTimeout(function() {
//         preload.classList.add('preload-finish');
//       }, 5000);
// });

const burger = document.querySelector(".burger");
const navlinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");

burger.addEventListener('click', () => {
    navlinks.classList.toggle("open");
    links.forEach(link =>{
        link.classList.toggle("fade");
    })
});
const burger = document.querySelector('.burger');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelector('.nav-links');
const siteLogo = document.querySelector('.logo');
const projectHeader = document.querySelector(".project-header");
const testImage = document.querySelector(".test-image");
const noiseMap = document.querySelector(".noise-map");
var rellax = new Rellax('.rellax');




burger.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  burger.classList.toggle('is-active');
});

if (projectHeader != null) {
    let headBg = window.getComputedStyle(projectHeader).backgroundColor;

    // Substring RGB value of Project Header into segments
    let sep = headBg.indexOf(",") > -1 ? "," : " ";
    headBg = headBg.substr(4).split(")")[0].split(sep);

    for (let R in headBg) {
        let r = headBg[R];
        if (r.indexOf("%") > -1)
        headBg[R] = Math.round(r.substr(0,r.length - 1) / 100 * 255);
    }

    // Calculate Brightness Value
    let r = headBg[0],
        g = headBg[1],
        b = headBg[2],
        l = (Math.min(r,g,b) + Math.max(r,g,b)) / 2;

    // Toggle Nav Colours based on project-header-background
    if (l < 128) {
        burger.classList.add('light');
        navLinks.classList.add('light');
        siteLogo.classList.add('light');
        }

    window.addEventListener('scroll', () => {
        if (window.scrollY > projectHeader.offsetHeight - 50) {
            burger.classList.remove('light');
            navLinks.classList.remove('light');
            siteLogo.classList.remove('light');
        } else if (window.scrollY < projectHeader.offsetHeight){
            burger.classList.add('light');
            navLinks.classList.add('light');
            siteLogo.classList.add('light');
        }
    })    
}

// Wrap every letter in a span
var textWrapper = document.querySelector('.ml3');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml3 .letter',
    opacity: [0,1],
    easing: "easeInOutQuad",
    duration: 5000,
    delay: (el, i) => 150 * (i+1)
  }).add({
    targets: '.ml3',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 2000
  });
console.log("app.js is working!");

const burger = document.querySelector('.burger');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelector('.nav-links');
const siteLogo = document.querySelector('.logo');
const projectHeader = document.querySelector(".project-header");
// const headBg = window.getComputedStyle(projectHeader).backgroundColor;

burger.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  burger.classList.toggle('is-active');
});

// swup.on('clickLink', function() {
//   mainNav.classList.remove('open');
//   burger.classList.remove('is-active');
// });

// Scroll Library

var rellax = new Rellax('.rellax', {
    center: true
});

ScrollOut({
    /* options */
  });
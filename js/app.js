console.log("app.js is working!");

const swup = new Swup();
const burger = document.querySelector('.burger');
const mainNav = document.querySelector('.main-nav');

burger.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  burger.classList.toggle('is-active');
});

swup.on('clickLink', function() {
  mainNav.classList.remove('open');
  burger.classList.remove('is-active');
});

// Scroll Library

window.onload = function() {
	lax.setup() // init

	const updateLax = () => {
		lax.update(window.scrollY)
		window.requestAnimationFrame(updateLax)
	}

	window.requestAnimationFrame(updateLax)
}

// swup




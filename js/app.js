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


  class ShapeOverlays {
    constructor(elm) {
      this.elm = elm; // Parent SVG element.
      this.path = elm.querySelectorAll('path'); // Path elements in parent SVG. These are the layers of the overlay.
      this.numPoints = 18; // Number of control points for Bezier Curve.
      this.duration = 600; // Animation duration of one path element.
      this.delayPointsArray = []; // Array of control points for Bezier Curve.
      this.delayPointsMax = 300; // Max of delay value in all control points.
      this.delayPerPath = 60; // Delay value per path.
      this.timeStart = Date.now();
      this.isOpened = false;
    }
    ...
  }
  const elmOverlay = document.querySelector('.shape-overlays');
  const overlay = new ShapeOverlays(elmOverlay);

  toggle() {
    const range = 4 * Math.random() + 6;
    for (var i = 0; i < this.numPoints; i++) {
      const radian = i / (this.numPoints - 1) * Math.PI;
      this.delayPointsArray[i] = (Math.sin(-radian) + Math.sin(-radian * range) + 2) / 4 * this.delayPointsMax;
    }
    ...
  }
  
  updatePath(time) {
    const points = [];
    for (var i = 0; i < this.numPoints; i++) {
      points[i] = ease.cubicInOut(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1)) * 100
    }
    ...
  }

  ShapeOverlays.toggle();
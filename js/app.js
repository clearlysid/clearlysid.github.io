const burger = document.querySelector('.burger');
const navLinks = document.querySelectorAll('.nav-link');
const overlay = document.querySelector('.overlay');


class ShapeOverlays {
    constructor(elm) {
        this.elm = elm;
        this.path = elm.querySelectorAll('path');
        this.numPoints = 3;
        this.duration = 900;
        this.delayPointsArray = [];
        this.delayPointsMax = 300;
        this.delayPerPath = 250;
        this.timeStart = Date.now();
        this.isOpened = false;
        this.isAnimating = false;
    }
    toggle() {
        this.isAnimating = true;
        for (var i = 0; i < this.numPoints; i++) {
            this.delayPointsArray[i] = Math.random() * this.delayPointsMax;
        }
        if (this.isOpened === false) {
            this.open();
        } else {
            this.close();
        } 
    }
    open() {
        this.isOpened = true;
        this.elm.classList.add('is-opened');
        this.timeStart = Date.now();
        this.renderLoop();
    }
    close() {
        this.isOpened = false;
        this.elm.classList.remove('is-opened');
        this.timeStart = Date.now();
        this.renderLoop();
    }
    
    updatePath(time) {
        const points = [];
        function cubicInOut(t){
            return t < 0.5
                ? 4.0 * t * t * t
                : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
        }
        for (var i = 0; i < this.numPoints; i++) {
            points[i] = (1 - cubicInOut(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1))) * 100
        }
    
        let str = '';
        str += (this.isOpened) ? `M 0 0 V ${points[0]}` : `M 0 ${points[0]}`;
        for (var i = 0; i < this.numPoints - 1; i++) {
            const p = (i + 1) / (this.numPoints - 1) * 100;
            const cp = p - (1 / (this.numPoints - 1) * 100) / 2;
            str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
        }
        str += (this.isOpened) ? `V 100 H 0` : `V 0 H 0`;
        return str;
    }
    render() {
        if (this.isOpened) {
            for (var i = 0; i < this.path.length; i++) {
            this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * i)));
            }
        } else {
            for (var i = 0; i < this.path.length; i++) {
            this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - i - 1))));
            }
        }
    }
    renderLoop() {
        this.render();
        if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax) {
            requestAnimationFrame(() => {
            this.renderLoop();
            });
        }
        else {
            this.isAnimating = false;
        }
    }
}
function initPointer(){
    const ring = document.createElement("div");
    ring.id = "pointer-ring"
    document.body.insertBefore(ring, document.body.children[0]);
    window.addEventListener('touchstart', function() {ring.remove();}); 
    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let isHover = false
    let mouseDown = false
    window.onmousemove = (mouse) => {
        mouseX = mouse.clientX
        mouseY = mouse.clientY
    }
    window.onmousedown = (mouse) => {
        mouseDown = true
    }
    window.onmouseup = (mouse) => {
        mouseDown = false
    }
    const trace = (a, b, n) => {
        return (1 - n) * a + n * b;
    }
    window["trace"] = trace
    const render = () => {
        ringX = trace(ringX, mouseX, 0.2)
        ringY = trace(ringY, mouseY, 0.2)
        if (mouseDown) { ring.style.padding = 22 + "px"} else { ring.style.padding = 24 + "px" }
        ring.style.transform = `translate(${ringX - (mouseDown ? 17 : 19)}px, ${ringY - (mouseDown ? 17 : 19)}px)`
        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}
function colourHeaderByBG() {
    const projectHeaderBG = document.querySelector('.project-background');
    const projectHeader = document.querySelector('.project-header');
    const backButton = document.querySelector('.back-button');
    if (projectHeaderBG != null) {
        let headBg = window.getComputedStyle(projectHeaderBG).backgroundColor;
        let sep = headBg.indexOf(",") > -1 ? "," : " ";
        headBg = headBg.substr(4).split(")")[0].split(sep);
    
        for (let R in headBg) {
            let r = headBg[R];
            if (r.indexOf("%") > -1)
            headBg[R] = Math.round(r.substr(0,r.length - 1) / 100 * 255);
        }
    
        let r = headBg[0],
            g = headBg[1],
            b = headBg[2],
            l = (Math.min(r,g,b) + Math.max(r,g,b)) / 2;
    
        if (l < 128) {
            backButton.classList.add('light');
            burger.classList.add('light');
            projectHeader.style.color = "white";
            window.addEventListener('scroll', () => {
                if (window.scrollY > projectHeaderBG.offsetHeight - 50) {
                    backButton.classList.remove('light');
                    burger.classList.remove('light');
                } else if (window.scrollY < projectHeaderBG.offsetHeight){
                    backButton.classList.add('light');
                    burger.classList.add('light');
                }
            })    
            } else if (l > 128){
                projectHeader.style.color = "black";
                backButton.classList.remove('light');
                burger.classList.remove('light');
            }
    } else {
        burger.classList.remove('light');
    }
}
function burgerToggler(){
    burger.addEventListener('click', () => {
        if (fluidOverlay.isAnimating) {return false;}
        fluidOverlay.toggle();
        if (fluidOverlay.isOpened === true) {
            setTimeout( () => {burger.classList.remove('light')}, 900);
            burger.classList.add('is-active');
            for (var i = 0; i < navLinks.length; i++) {
                navLinks[i].classList.add('is-opened');
            }
        } else {
            setTimeout( () => {colourHeaderByBG()}, 600);
            burger.classList.remove('is-active');
            for (var i = 0; i < navLinks.length; i++) {
                navLinks[i].classList.remove('is-opened');
            }
        }
    });
}

//---------------------------------------------------------------

initPointer();
const fluidOverlay = new ShapeOverlays(overlay);

barba.init({
    transitions: [{
        leave(data) {
            const done = this.async();
            fluidOverlay.toggle();
            burger.style.zIndex = "4"
            setTimeout( done, 1200);
        },
        enter(data){
            window.scrollTo(0, 0);
            fluidOverlay.toggle();
            onPageLoad();
            setTimeout( () => {
                burger.style.zIndex = "1"
            }, 1000);
        }
    }, {
        name: 'home-to-project',
        sync: true,
        from: {
            namespace: 'default'
        },
        to: {
            namespace: 'project'
        },
        leave(data){
            console.log('new transition leave');
            gsap.to("#home",{
                duration: 1,
                opacity: 0,
                onComplete: () => {
                    this.async();
                }
            });

        },
        enter(data){
            onPageLoad();
            var tl = gsap.timeline();
            tl.from(".project-background",{
                duration: 0.6,
                width: 0,
            }).from(".project-title, .project-description, .project-metadata", {
                duration: 0.3,
                opacity: 0,
                y: 10,
                stagger: 0.2
            }).from("article > *", {
                duration: 0.5,
                opacity: 0,
                y: 10,
                stagger: 0.2
            })
        }
    }]
});

function onPageLoad() {

    burgerToggler();
    colourHeaderByBG();

    window.addEventListener('scroll', () => {
        if (window.scrollX > 200) {
            document.getElementById('home').classList.add('fade');
        } else if (window.scrollX < 200){
            document.getElementById('home').classList.remove('fade');
        }
    });
}

onPageLoad();







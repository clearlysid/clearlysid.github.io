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

let winsize;
const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
calcWinsize();
window.addEventListener('resize', calcWinsize);
const MathUtils = {
    lineEq: (y2, y1, x2, x1, currentVal) => {
        // y = mx + b 
        var m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
        return m * currentVal + b;
    },
    lerp: (a, b, n) => (1 - n) * a + n * b,
    getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2)
};



//---------------------------------------------------------------

initPointer();
const fluidOverlay = new ShapeOverlays(overlay);

barba.init({
    transitions: [{
        leave(data) {
            const done = this.async();
            gsap.to(data.current.container, {
                opacity: 0,
                duration: 0.3,
                ease: Power4.easeOut,
                onComplete: done
            });
        },
        enter(data){
            window.scrollTo(0, 0);
            onPageLoad();
            gsap.from(data.next.container, {
                opacity: 0,
                duration: 0.3,
                ease: Power4.easeIn,
                delay: 0.5
            });
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
                duration: 0.2,
                opacity: 0,
                y: 10,
                stagger: 0.1
            }).from("article > *", {
                duration: 0.2,
                opacity: 0,
                y: 10,
                stagger: 0.1
            })
        }
    }]
});

function onPageLoad() {

    burgerToggler();
    colourHeaderByBG();

    const hideHomeHeader = gsap.timeline({paused: true});
    hideHomeHeader.to('#home', {zIndex: 0}, 0.2);
    hideHomeHeader.to( '#home > h1', {x: -80, opacity: 0,}, "<");
    hideHomeHeader.to( '#home > p', {x: -80, opacity: 0,}, "<");
    hideHomeHeader.to( '.avatar', {x: -80, opacity: 0, duration: 0.3}, "<0.3");

    class SliderItem {
        constructor(el) {
            this.DOM = {el: el};
            this.DOM.image = this.DOM.el.querySelector('.img-inner');
            this.DOM.title = this.DOM.el.querySelector('.project-link');
        }
    }

    class DraggableSlider {
        constructor(el) {
            this.DOM = {el: el};
            this.DOM.strip = this.DOM.el.querySelector('.project-list');
            this.items = [];
            [...this.DOM.strip.querySelectorAll('.project-item')].forEach(item => this.items.push(new SliderItem(item)));
            this.DOM.draggable = this.DOM.el.querySelector('.draggable'); // draggable container
            this.draggableWidth = this.DOM.draggable.offsetWidth; // width of draggable & strip container
            this.maxDrag = this.draggableWidth < winsize.width ? 0 : this.draggableWidth - winsize.width; // amount that we can drag
            this.dragPosition = 0; // The current amount (in pixels) that was dragged
            this.draggie = new Draggabilly(this.DOM.draggable, { axis: 'x' }); // Initialize the Draggabilly
            this.init();
            this.initEvents();
        }
        init() {
            this.renderedStyles = {
                position: {previous: 0, current: this.dragPosition},
                scale: {previous: 1, current: 1},
                imgScale: {previous: 1, current: 1},
                opacity: {previous: 1, current: 1},
            };

            this.render = () => {
                this.renderId = undefined;
                for (const key in this.renderedStyles ) {
                    this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, 0.1);
                }
                gsap.set(this.DOM.strip, {x: this.renderedStyles.position.previous});
                for (const item of this.items) {
                    gsap.set(item.DOM.el, {scale: this.renderedStyles.scale.previous, opacity: this.renderedStyles.opacity.previous});
                    gsap.set(item.DOM.image, {scale: this.renderedStyles.imgScale.previous});
                }
                if ( !this.renderId ) {this.renderId = requestAnimationFrame(() => this.render());}
            };
            this.renderId = requestAnimationFrame(() => this.render());
        }

        initEvents() {
            this.onDragStart = () => {
                this.renderedStyles.scale.current = 0.9;
                this.renderedStyles.imgScale.current = 1.2;
                this.renderedStyles.opacity.current = 0.8;
                // cursor.scale = 1.5;
                // cursor.showArrows();
                // cursor effects on drag
            };

            this.onDragMove = (event, pointer, moveVector) => {
                // The possible range for the drag is draggie.position.x = [-maxDrag,0 ]
                if ( this.draggie.position.x >= 0 ) {
                    // the max we will be able to drag is winsize.width/2
                    this.dragPosition = MathUtils.lineEq(0.5*winsize.width,0, winsize.width, 0, this.draggie.position.x);
                }
                else if ( this.draggie.position.x < -1*this.maxDrag ) {
                    // the max we will be able to drag is winsize.width/2
                    this.dragPosition = MathUtils.lineEq(0.5*winsize.width,0, this.maxDrag+winsize.width, this.maxDrag, this.draggie.position.x);
                }
                else {
                    this.dragPosition = this.draggie.position.x;
                }
                this.renderedStyles.position.current = this.dragPosition;
                // mousepos = getMousePos(event);

                hideHomeHeader.progress(window.innerWidth > 800 ? this.draggie.position.x/-400 : 0);
            };

            this.onDragEnd = () => {
                if ( this.draggie.position.x > 0 ) { // reset draggable if out of bounds.
                    this.dragPosition = 0;
                    this.draggie.setPosition(this.dragPosition, this.draggie.position.y);
                }
                else if ( this.draggie.position.x < -1*this.maxDrag ) {
                    this.dragPosition = -1*this.maxDrag;
                    this.draggie.setPosition(this.dragPosition, this.draggie.position.y);
                }
                this.renderedStyles.position.current = this.dragPosition;
                this.renderedStyles.scale.current = 1;
                this.renderedStyles.imgScale.current = 1;
                this.renderedStyles.opacity.current = 1;
                // cursor effects on dragend
                // cursor.scale = 1;
                // cursor.hideArrows();
            };

            this.draggie.on('pointerDown', this.onDragStart);
            this.draggie.on('dragMove', this.onDragMove);
            this.draggie.on('pointerUp', this.onDragEnd);

            // for (const item of this.items) {
            //     item.DOM.title.addEventListener('click', (ev) => {
            //         ev.preventDefault();
            //         // this triggers the content show animation
            //         // this.showItem(item);
            //     });
            // }

            window.addEventListener('resize', () => {
                this.maxDrag = this.draggableWidth < winsize.width ? 0 : this.draggableWidth - winsize.width;
                if ( Math.abs(this.dragPosition) + winsize.width > this.draggableWidth ) {
                    const diff = Math.abs(this.dragPosition) + winsize.width - this.draggableWidth;
                    // reset dragPosition
                    this.dragPosition = this.dragPosition+diff;
                    this.draggie.setPosition(this.dragPosition, this.draggie.position.y);
                }
            });
        }
    }

    // The images strip
    new DraggableSlider(document.querySelector('.portfolio'));



}

onPageLoad();









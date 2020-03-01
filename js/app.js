// Custom Mouse Cursor
const ring = document.createElement("div")
ring.id = "pointer-ring"
document.body.insertBefore(ring, document.body.children[0])
let mouseX = -100
let mouseY = -100
let ringX = -100
let ringY = -100
let isHover = false
let mouseDown = false
// let preloaded = false
// const preloader = document.querySelector(".preloader");

const init_pointer = (options) => {
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
        if (mouseDown) { ring.style.padding = 18 + "px"} else { ring.style.padding = 20 + "px" }
        ring.style.transform = `translate(${ringX - (mouseDown ? 17 : 19)}px, ${ringY - (mouseDown ? 17 : 20)}px)`
        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}

const pageTransitions = [
    
    { // from project to home
        from: '/projects/*',
        to: '/index.html',
        in: function(next) {
            document.querySelector('#swup').style.opacity = 0;
            anime.set('.project-item', {translateY: -1 * window.innerHeight - 50}); // set thumb-grid to above screen
            var showHome = anime.timeline({
                duration: 1000
            });

            showHome
            .add({ 
                targets: '#overlay',
                easing: 'easeOutQuint',
                translateY: 0,
                delay: 600
            })
            .add({ 
                targets: '.project-item',
                easing: 'easeInOutQuint',
                duration: function() { return anime.random(1000, 1500); },
                translateY: 0,
                complete: next
            }, 0);
            anime({ // show main body
                targets: '#swup',
                easing: 'easeOutQuint',
                duration: 1,
                opacity: 1,
            });
        },
        out: (next) => {
            document.querySelector('#swup').style.opacity = 1;
            anime.set('#overlay', {translateY: -2 * window.innerHeight});
            anime.set('#overlay', {display: 'block'});
            var hideProject = anime.timeline({
                duration: 800
            });
            
            hideProject
            .add({ // hide main body
                targets: '#swup',
                easing: 'linear',
                opacity: 0,
                duration: 1,
                delay: 800,
                complete: next
            })
            .add({ // overlay show down
                targets: '#overlay',
                easing: 'easeInOutQuint',
                translateY: -1 * window.innerHeight,
            }, 0);

        }
    },
    { // from home to project
        from: '/',
        to: '/projects/*',
        in: function(next) {
            document.querySelector('#swup').style.opacity = 0;
            var showProject = anime.timeline({
                duration: 1000
            });

            showProject
            .add({ // show main body
                targets: '#swup',
                easing: 'easeOutQuint',
                duration: 1,
                opacity: 1
            })
            .add({ // overlay hide up
                targets: '#overlay',
                easing: 'easeOutQuint',
                translateY: -2 * window.innerHeight,
                delay: 800,
                complete: next
            });
        },
        out: (next) => {
            document.querySelector('#swup').style.opacity = 1;
            anime.set('#overlay', {translateY: 0});
            anime.set('#overlay', {display: 'block'});
            var hideHome = anime.timeline({
                duration: 1000
            });
            
            hideHome
            .add({ // hide main body
                targets: '#swup',
                easing: 'linear',
                opacity: 0,
                duration: 1,
                delay: 999
            })
            .add({ // overlay show up
                targets: '#overlay',
                easing: 'easeInOutQuint',
                translateY: -1 * window.innerHeight,
                complete: next
            }, 0)
            
            .add({ // smooth thumbnails animation
                targets: '.project-item',
                easing: 'easeInOutQuint',
                duration: function() { return anime.random(800, 1200); },
                translateY: -1 * window.innerHeight - 50
            }, 200);
        }
    }
];

function projectHoverFX() {
    const lineEq = (y2, y1, x2, x1, currentVal) => {
        // y = mx + b 
        var m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
        return m * currentVal + b;
    };

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getRandomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

    const setRange = (obj) => {
        for(let k in obj) {
            if( obj[k] == undefined ) {
                obj[k] = [0,0];
            }
            else if( typeof obj[k] === 'number' ) {
                obj[k] = [-1*obj[k],obj[k]];
            }
        }
    };

    const getMousePos = (e) => {
        let posx = 0;
        let posy = 0;
        if (!e) e = window.event;
        if (e.pageX || e.pageY) 	{
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY) 	{
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return { x : posx, y : posy }
    };
    
    class Item {
        constructor(el, options) {
            this.DOM = {el: el};
            this.options = {   
                image: {
                    translation : {x: -10, y: -10, z: 0},
                    rotation : {x: 0, y: 0, z: 0},
                    reverseAnimation : {
                        duration : 1200,
                        easing : 'easeOutElastic',
                        elasticity : 600
                    }
                },
                title: {
                    translation : {x: 20, y: 10, z: 0},
                    reverseAnimation : {
                        duration : 1000,
                        easing : 'easeOutExpo',
                        elasticity : 600
                    }
                },
                container: {
                    translation : {x: 30, y: 20, z: 0},
                    rotation : {x: 0, y: 0, z: -2},
                    reverseAnimation : {
                        duration: 2,
                        easing: 'easeOutElastic'
                    }
                }, 
            };

            Object.assign(this.options, options);
            
            this.DOM.animatable = {};
            this.DOM.animatable.image = this.DOM.el.querySelector('.project-item-img');
            this.DOM.animatable.title = this.DOM.el.querySelector('.project-item-title');
            this.DOM.animatable.container = this.DOM.el.querySelector('.project-item-bg');
            
            this.initEvents();
        }
        
        initEvents() { 
            let enter = false;
            this.mouseenterFn = () => {
                if ( enter ) {
                    enter = false;
                };
                clearTimeout(this.mousetime);
                this.mousetime = setTimeout(() => enter = true, 40);
            };
            this.mousemoveFn = ev => requestAnimationFrame(() => {
                if ( !enter ) return;
                this.tilt(ev);
            });
            this.mouseleaveFn = (ev) => requestAnimationFrame(() => {
                if ( !enter || !allowTilt ) return;
                enter = false;
                clearTimeout(this.mousetime);

                for (let key in this.DOM.animatable ) {
                    if( this.DOM.animatable[key] == undefined || this.options[key] == undefined ) {continue;}
                    anime({
                        targets: this.DOM.animatable[key],
                        duration: this.options[key].reverseAnimation != undefined ? this.options[key].reverseAnimation.duration || 0 : 1.5,
                        easing: this.options.reverseAnimation != undefined ? this.options.movement[key].reverseAnimation.easing || 'linear' : 'linear',
                        elasticity: this.options.reverseAnimation != undefined ? this.options.reverseAnimation.elasticity || null : null,
                        scaleX: 1,
                        scaleY: 1,
                        scaleZ: 1,
                        translateX: 0,
                        translateY: 0,
                        translateZ: 0,
                        rotateX: 0,
                        rotateY: 0,
                        rotateZ: 0
                    });                    
                }
            });
            this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
            this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
            this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
        }
        
        tilt(ev) {
            if ( !allowTilt ) return;
            const mousepos = getMousePos(ev);
            // Document scrolls.
            const docScrolls = {
                left : document.body.scrollLeft + document.documentElement.scrollLeft, 
                top : document.body.scrollTop + document.documentElement.scrollTop
            };
            const bounds = this.DOM.el.getBoundingClientRect();
            // Mouse position relative to the main element (this.DOM.el).
            const relmousepos = { 
                x : mousepos.x - bounds.left - docScrolls.left, 
                y : mousepos.y - bounds.top - docScrolls.top 
            };
            
            // Movement settings for the animatable elements.
            for (let key in this.DOM.animatable) {
                if ( this.DOM.animatable[key] == undefined || this.options[key] == undefined ) {
                    continue;
                }
                
                let t = this.options[key] != undefined ? this.options[key].translation || {x:0,y:0,z:0} : {x:0,y:0,z:0},
                    r = this.options[key] != undefined ? this.options[key].rotation || {x:0,y:0,z:0} : {x:0,y:0,z:0};

                setRange(t);
                setRange(r);
                
                const transforms = {
                    translation : {
                        x: (t.x[1]-t.x[0])/bounds.width*relmousepos.x + t.x[0],
                        y: (t.y[1]-t.y[0])/bounds.height*relmousepos.y + t.y[0],
                        z: (t.z[1]-t.z[0])/bounds.height*relmousepos.y + t.z[0],
                    },
                    rotation : {
                        x: (r.x[1]-r.x[0])/bounds.height*relmousepos.y + r.x[0],
                        y: (r.y[1]-r.y[0])/bounds.width*relmousepos.x + r.y[0],
                        z: (r.z[1]-r.z[0])/bounds.width*relmousepos.x + r.z[0]
                    }
                };

                this.DOM.animatable[key].style.WebkitTransform = this.DOM.animatable[key].style.transform = 'translateX(' + transforms.translation.x + 'px) translateY(' + transforms.translation.y + 'px) translateZ(' + transforms.translation.z + 'px) rotateX(' + transforms.rotation.x + 'deg) rotateY(' + transforms.rotation.y + 'deg) rotateZ(' + transforms.rotation.z + 'deg)';
            }
        }
    }
    
    class Grid {
        constructor(el) {
            this.DOM = {el: el};
            this.items = [];
            Array.from(this.DOM.el.querySelectorAll('a.project-item')).forEach((item) => {
                const itemObj = new Item(item);
                this.items.push(itemObj);
            });
        }
    }
    let allowTilt = true;
    new Grid(document.querySelector('.project-list'));
}






//---------------------------------------------------------------



init_pointer({})

// preloader
// document.addEventListener("load", () => {
//     preloaded = true;
//     console.log("preloaded is now true");
//     setTimeout(function(){
//         preloader.classList.add("preloader-finish");
//     }, 3000);
// });

// if (preloaded){
//     preloader.remove();
//     console.log("preloader has been removed");
// }


const swup = new Swup({
    plugins: [new SwupJsPlugin(pageTransitions)]
  });
swup.on('contentReplaced', onPageLoad);

function onPageLoad() {
    if (document.querySelector('#project-list')) {
        projectHoverFX();
    }

    let allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            ring.classList.add("link-hover");
        })

        link.addEventListener('mouseleave', () => {
            ring.classList.remove("link-hover");
        })
    });
}

onPageLoad();



// this code takes image outside of paragraph
// const imagesInPara = document.querySelector('p > img')
// const actualPara = imagesInPara.parentElement
// actualPara.insertAdjacentElement("afterend", imagesInPara)

// Navigation Menu Flyout

// const primaryNavContainer = document.querySelector('.primary-nav-container');
// primaryNavContainer.addEventListener("mouseenter", function( event ) {
//     const menuFlyout = anime({
//         targets: '.bar',
//         translateX: -48,
//         translateY: (elm, index, t) => 20 + (index * 50),
//         scaleX: 4,
//         scaleY: 8,
//         easing: 'easeInOutSine',
//         delay: (elm, index, t) => index * 20,
//         duration: 200,
//        });
// }, false);

// primaryNavContainer.addEventListener("mouseleave", function( event ) {
//     const menuFlyin = anime({
//         targets: '.bar',
//         translateX: 0,
//         translateY: (elm, index, t) => (index / 50),
//         scaleX: 1,
//         scaleY: 1,
//         easing: 'easeInOutSine',
//         delay: (elm, index, t) => index * 20,
//         duration: 200,
//        });
// }, false);




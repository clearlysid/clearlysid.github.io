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
        if (mouseDown) { ring.style.padding = 22 + "px"} else { ring.style.padding = 24 + "px" }
        ring.style.transform = `translate(${ringX - (mouseDown ? 17 : 21)}px, ${ringY - (mouseDown ? 17 : 21)}px)`
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
                        easing: this.options.reverseAnimation != undefined ? this.options.movement[key].reverseAnimation.easing || 'easeOutBack' : 'easeOutBack',
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

!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.sal=t():e.sal=t()}(this,(function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="dist/",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);n(1);function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var i="Sal was not initialised! Probably it is used in SSR.",a="Your browser does not support IntersectionObserver!\nGet a polyfill from here:\nhttps://github.com/w3c/IntersectionObserver/tree/master/polyfill",s={rootMargin:"0% 50%",threshold:.5,animateClassName:"sal-animate",disabledClassName:"sal-disabled",enterEventName:"sal:in",exitEventName:"sal:out",selector:"[data-sal]",once:!0,disabled:!1},l=[],c=null,u=function(e){e&&e!==s&&(s=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(n,!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},s,{},e))},f=function(e){e.classList.remove(s.animateClassName)},d=function(e,t){var n=new CustomEvent(e,{bubbles:!0,detail:t});t.target.dispatchEvent(n)},b=function(){document.body.classList.add(s.disabledClassName)},p=function(){c.disconnect(),c=null},m=function(){return s.disabled||"function"==typeof s.disabled&&s.disabled()},y=function(e,t){e.forEach((function(e){e.intersectionRatio>=s.threshold?(!function(e){e.target.classList.add(s.animateClassName),d(s.enterEventName,e)}(e),s.once&&t.unobserve(e.target)):s.once||function(e){f(e.target),d(s.exitEventName,e)}(e)}))},v=function(){b(),p()},O=function(){document.body.classList.remove(s.disabledClassName),c=new IntersectionObserver(y,{rootMargin:s.rootMargin,threshold:s.threshold}),(l=[].filter.call(document.querySelectorAll(s.selector),(function(e){return!function(e){return e.classList.contains(s.animateClassName)}(e,s.animateClassName)}))).forEach((function(e){return c.observe(e)}))},g=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};p(),Array.from(document.querySelectorAll(s.selector)).forEach(f),u(e),O()};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s;if(u(e),"undefined"==typeof window)return console.warn(i),{elements:l,disable:v,enable:O,reset:g};if(!window.IntersectionObserver)throw b(),Error(a);return m()?b():O(),{elements:l,disable:v,enable:O,reset:g}}},function(e,t,n){}]).default}));


sal({
    threshold: 0.3,
    once: false,
  });

const swup = new Swup({
    plugins: [new SwupJsPlugin(pageTransitions)]
  });
swup.on('contentReplaced', onPageLoad);


    // lax for scrolling animations
    // window.onload = function() {
    //     lax.setup() // init
    //     const updateLax = () => {
    //         lax.update(window.scrollY)
    //         window.requestAnimationFrame(updateLax)
    //     }
    //     window.requestAnimationFrame(updateLax)
    // }

function onPageLoad() {
    if (document.querySelector('#project-list')) {
        projectHoverFX();
    }


    const projectHeader = document.querySelector('.project-header');
    const backButton = document.querySelector('.back-button');
    if (projectHeader != null) {
        let headBg = window.getComputedStyle(projectHeader).backgroundColor;
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
    
        // Toggle Nav Colours based on project-header-background
        if (l < 128) {
            // ring.classList.add('light');
            backButton.classList.add('light');
            projectHeader.style.color = "white";
            } else if (l > 128){
                projectHeader.style.color = "black";
                backButton.classList.remove('light');
            }
    
        window.addEventListener('scroll', () => {
            if (window.scrollY > projectHeader.offsetHeight - 50) {
                backButton.classList.remove('light');
            } else if (window.scrollY < projectHeader.offsetHeight){
                backButton.classList.add('light');
            }
        })    
    }


}

onPageLoad();
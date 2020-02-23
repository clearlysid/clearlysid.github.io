// Custom Mouse Cursor

const pointer = document.createElement("div")
pointer.id = "pointer-dot"
const ring = document.createElement("div")
ring.id = "pointer-ring"
document.body.insertBefore(pointer, document.body.children[0])
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

    const getOption = (option) => {
        let defaultObj = {
            pointerColor: "#000000",
            ringSize: 20,
            ringClickSize: (options["ringSize"] || 20) - 2,
        }
        if (options[option] == undefined) {
            return defaultObj[option]
        } else {
            return options[option]
        }
    }

    const render = () => {
        ringX = trace(ringX, mouseX, 0.2)
        ringY = trace(ringY, mouseY, 0.2)

        if (document.querySelector(".p-action-click:hover")) {
            pointer.style.borderColor = getOption("pointerColor")
            isHover = true
        } else {
            pointer.style.borderColor = "black"
            isHover = false
        }
        ring.style.borderColor = getOption("pointerColor")
        if (mouseDown) {
            ring.style.padding = getOption("ringClickSize") + "px"
        } else {
            ring.style.padding = getOption("ringSize") + "px"
        }

        pointer.style.transform = `translate(${mouseX}px, ${mouseY}px)`
        ring.style.transform = `translate(${ringX - (mouseDown ? getOption("ringClickSize") : getOption("ringSize"))}px, ${ringY - (mouseDown ? getOption("ringClickSize") : getOption("ringSize"))}px)`

        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}

init_pointer({
            
})


// Navigation Menu Flyout

const primaryNavContainer = document.querySelector('.primary-nav-container');
primaryNavContainer.addEventListener("mouseenter", function( event ) {   
    console.log("menu opens now");
    const menuFlyout = anime({
        targets: '.bar',
        translateX: -48,
        translateY: (elm, index, t) => 20 + (index * 50),
        scaleX: 4,
        scaleY: 8,
        easing: 'easeInOutSine',
        delay: (elm, index, t) => index * 20,
        duration: 200,
       });

}, false);



primaryNavContainer.addEventListener("mouseleave", function( event ) {   
    console.log("menu closes now");
    const menuFlyin = anime({
        targets: '.bar',
        translateX: 0,
        translateY: (elm, index, t) => (index / 50),
        scaleX: 1,
        scaleY: 1,
        easing: 'easeInOutSine',
        delay: (elm, index, t) => index * 20,
        duration: 200,
       });

}, false);
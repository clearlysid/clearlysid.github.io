const userPrefers = getComputedStyle(document.documentElement).getPropertyValue('content');

if (theme === "dark") {
    document.getElementById("theme-toggle").innerHTML = "Light&nbsp;Mode";
} else if (theme === "light") {
    document.getElementById("theme-toggle").innerHTML = "Dark&nbsp;Mode";
} else if (userPrefers === "dark") {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById("theme-toggle").innerHTML = "Light&nbsp;Mode";
    window.localStorage.setItem('theme', 'dark');
} else {
    document.documentElement.setAttribute('data-theme', 'light');
    window.localStorage.setItem('theme', 'light');
    document.getElementById("theme-toggle").innerHTML = "Dark&nbsp;Mode";
}

function modeSwitcher() {
    const currentMode = document.documentElement.getAttribute('data-theme');
    if (currentMode == "dark" || window.matchMedia("(prefers-color-scheme: dark").matches) {
        document.documentElement.classList.add('color-theme-in-transition');
        document.documentElement.setAttribute('data-theme', 'light');
        window.localStorage.setItem('theme', 'light');
        document.getElementById("theme-toggle").innerHTML = "Dark&nbsp;Mode";
        
    } else {
        document.documentElement.classList.add('color-theme-in-transition');
        document.documentElement.setAttribute('data-theme', 'dark');
        window.localStorage.setItem('theme', 'dark');
        document.getElementById("theme-toggle").innerHTML = "Light&nbsp;Mode";
    }
}
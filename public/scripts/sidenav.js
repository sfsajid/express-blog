const submenu = document.getElementsByClassName('submenu');
const sublink = document.getElementsByClassName('sub-link');
const navMenu = document.getElementsByClassName('sidenav-item');
const sideNav = document.querySelector('.sidenav');
const bOpen = document.getElementById('nav-opener');
const bClose = document.getElementById('nav-closer');
const bgOverlay = document.querySelector('.layout-overlay');

for (let i = 0; i < sublink.length; i++) {
    const el = sublink[i];
    el.addEventListener('click', () => {
        el.parentElement.classList.add('active');
        const parent = el.parentElement.parentElement.parentElement.parentElement;
        parent.classList.add('active');
        for (let k = 0; k < navMenu.length; k++) {
            const element = navMenu[k];
            if (element !== parent) {
                element.classList.remove('active');
            }
        }
        let otherElement = [...sublink];
        otherElement.splice(i, 1);
        for (let j = 0; j < otherElement.length; j++) {
            const elem = otherElement[j];
            elem.parentElement.classList.remove('active');
        }
    });
}

for (let i = 0; i < submenu.length; i++) {
    const el = submenu[i];
    el.addEventListener('click', () => {
        const content = el.nextElementSibling;
        el.parentElement.classList.toggle('open');

        let otherElement = [...submenu];
        otherElement.splice(i, 1);
        for (let j = 0; j < otherElement.length; j++) {
            const elem = otherElement[j];
            elem.parentElement.classList.remove('open');
        }
    });
}

bOpen.addEventListener('click', () => {
    sideNav.style.left = 0;
    bgOverlay.classList.add('active');
});

bClose.addEventListener('click', () => {
    sideNav.style.left = '-280px';
    bgOverlay.classList.remove('active');
});

bgOverlay.addEventListener('click', () => {
    bClose.click();
});

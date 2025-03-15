document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('click', () => {
        item.style.transform = 'scale(0.95) rotate(-2deg)';
        item.style.background = 'linear-gradient(45deg, #2980b9, #16a085)';
        setTimeout(() => {
            item.style.transform = 'scale(1) rotate(0deg)';
            item.style.background = 'linear-gradient(45deg, #ecf0f1, #bdc3c7)';
        }, 200);
    });
});

document.querySelectorAll('.nav-menu li a').forEach(link => {
    link.addEventListener('click', () => {
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'scale(1)';
        }, 100);
    });
});

window.addEventListener('load', () => {
    const items = document.querySelectorAll('.contact-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

document.querySelectorAll('.contact-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.5s ease';
});
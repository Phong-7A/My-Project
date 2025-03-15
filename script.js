
document.querySelectorAll('.home-link').forEach(link => {
    link.addEventListener('click', () => {
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'scale(1)';
        }, 100);
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
    const items = document.querySelectorAll('.home-link');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

document.querySelectorAll('.home-link').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.5s ease';
});
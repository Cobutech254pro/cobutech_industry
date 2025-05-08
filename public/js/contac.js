// frontend/public/js/contact.js
document.addEventListener('DOMContentLoaded', function() {
    const followMeButton = document.getElementById('followMeButton');
    const followChannelsButton = document.getElementById('followChannelsButton');
    const contactMeButton = document.getElementById('contactMeButton');

    const followMeSubButtons = document.getElementById('followMeSubButtons');
    const followChannelsSubButtons = document.getElementById('followChannelsSubButtons');
    const contactMeSubButtons = document.getElementById('contactMeSubButtons');

    followMeButton.addEventListener('click', function() {
        followMeSubButtons.classList.toggle('visible');
        followChannelsSubButtons.classList.remove('visible');
        contactMeSubButtons.classList.remove('visible');
    });

    followChannelsButton.addEventListener('click', function() {
        followChannelsSubButtons.classList.toggle('visible');
        followMeSubButtons.classList.remove('visible');
        contactMeSubButtons.classList.remove('visible');
    });

    contactMeButton.addEventListener('click', function() {
        contactMeSubButtons.classList.toggle('visible');
        followMeSubButtons.classList.remove('visible');
        followChannelsSubButtons.classList.remove('visible');
    });

    // Flowing Social Media Logos Background
    const canvas = document.getElementById('socialLogosCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const logos = ['tiktok', 'facebook', 'instagram', 'twitter', 'github', 'telegram', 'whatsapp', 'youtube'];
    const logoSize = 50;
    const numLogos = 50;
    const logoPositions = [];

    for (let i = 0; i < numLogos; i++) {
        logoPositions.push({
            logo: logos[Math.floor(Math.random() * logos.length)],
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
        });
    }

    function drawLogos() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const pos of logoPositions) {
            const img = new Image();
            img.src = `/public/images/${pos.logo}.png`; // Assuming you have logo images in /public/images/
            ctx.drawImage(img, pos.x, pos.y, logoSize, logoSize);

            pos.x += pos.speedX;
            pos.y += pos.speedY;

            // Keep logos within bounds
            if (pos.x < -logoSize) pos.x = canvas.width;
            if (pos.x > canvas.width) pos.x = -logoSize;
            if (pos.y < -logoSize) pos.y = canvas.height;
            if (pos.y > canvas.height) pos.y = -logoSize;
        }
        requestAnimationFrame(drawLogos);
    }

    // Preload images and then start animation
    let imagesLoaded = 0;
    const totalImages = logos.length;
    for (const logo of logos) {
        const img = new Image();
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                drawLogos();
            }
        };
        img.src = `/public/images/${logo}.png`;
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});

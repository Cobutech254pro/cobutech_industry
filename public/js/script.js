// frontend/public/js/script.js
document.addEventListener('DOMContentLoaded', function() {
    const cobuTech = document.getElementById('cobu-tech');
    const industry = document.getElementById('industry');

    setTimeout(() => {
        cobuTech.classList.add('visible');
        setTimeout(() => {
            industry.classList.add('visible');
            setTimeout(() => {
                window.location.href = '/public/waiting.html';
            }, 1000);
        }, 1000);
    }, 100);
});

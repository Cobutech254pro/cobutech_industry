// frontend/public/js/waiting.js
document.addEventListener('DOMContentLoaded', function() {
    const countdownNumber = document.getElementById('countdown-number');
    const loadingProgress = document.getElementById('loading-progress');
    const loadingBar = document.querySelector('.loading-bar');

    let timeLeft = 60;

    const countdownInterval = setInterval(() => {
        countdownNumber.textContent = timeLeft;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(countdownInterval);
            startLoading();
        }
    }, 1000);

    function startLoading() {
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress++;
            loadingProgress.textContent = progress + '%';
            loadingBar.style.width = progress + '%';

            if (progress >= 100) {
                clearInterval(loadingInterval);
                // Redirect to the next page after loading (e.g., main.html)
                window.location.href = '/public/main.html';
            }
        }, 60); // Adjust interval for loading speed
    }
});

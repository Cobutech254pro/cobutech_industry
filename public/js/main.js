// frontend/public/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    const welcomeTextElement = document.getElementById('welcomeText');
    const continueButton = document.getElementById('continueButton');
    const authButtonsDiv = document.querySelector('.auth-buttons');
    const signInButton = document.getElementById('signInButton');
    const loginButton = document.getElementById('loginButton');
    const contactButton = document.getElementById('contactButton'); // Get the contact button element
    const fullText = 'WELCOME TO COBU-TECH INDUSTRY';
    let textIndex = 0;
    let isTyping = true;

    function typeAndErase() {
        if (isTyping) {
            welcomeTextElement.textContent = fullText.substring(0, textIndex);
            textIndex++;
            if (textIndex > fullText.length) {
                isTyping = false;
                setTimeout(eraseText, 1500); // Wait 1.5 seconds before erasing
            } else {
                setTimeout(typeAndErase, 150); // Typing speed
            }
        }
    }

    function eraseText() {
        welcomeTextElement.textContent = fullText.substring(0, textIndex);
        textIndex--;
        if (textIndex < 0) {
            isTyping = true;
            setTimeout(typeAndErase, 500); // Start typing again after 0.5 seconds
        } else {
            setTimeout(eraseText, 100); // Erasing speed
        }
    }

    typeAndErase(); // Start the typing animation

    continueButton.addEventListener('click', function() {
        authButtonsDiv.style.display = 'block';
    });

    function flashButton(button) {
        button.classList.add('flash');
        setTimeout(() => {
            button.classList.remove('flash');
        }, 2000);
    }

    signInButton.addEventListener('click', function() {
        window.location.href = '/public/signin.html'; // Replace with your actual sign-in page URL
        flashButton(this);
    });

    loginButton.addEventListener('click', function() {
        window.location.href = '/public/login.html'; // Replace with your actual login page URL
        flashButton(this);
    });

    // Add event listener for the contact button
    contactButton.addEventListener('click', function() {
        window.location.href = '/public/contact.html'; // Redirect to the contact page
    });

    // Code Rain Background
    const canvas = document.getElementById('codeCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    function drawCodeRain() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff4d4d'; // Shining reddish color
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            drops[i]++;
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
                drops[i] = 0;
            }
        }
    }

    setInterval(drawCodeRain, 30);

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});

// frontend/public/js/signin.js
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('name');
    const passwordFields = document.getElementById('password-fields');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmToggle = document.getElementById('confirmConfirmToggle');
    const signupForm = document.getElementById('signupForm');
    const emailValidationMessage = document.getElementById('email-validation-message');

    let isEmailValid = false;

    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (isValidEmail(email)) {
            isEmailValid = true;
            passwordFields.style.display = 'block';
            emailValidationMessage.textContent = '';
        } else {
            isEmailValid = false;
            passwordFields.style.display = 'none';
            emailValidationMessage.textContent = 'Please enter a valid email address.';
        }
    });

    function isValidEmail(email) {
        // Basic email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? 'Show' : 'Hide';
    });

    confirmToggle.addEventListener('click', function() {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? 'Show' : 'Hide';
    });

    signupForm.addEventListener('submit', function(event) {
        if (!isEmailValid) {
            event.preventDefault(); // Prevent submission if email is not valid
            emailValidationMessage.textContent = 'Please enter a valid email address.';
            return;
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
            event.preventDefault();
            alert("Passwords do not match!");
            return;
        }

        // In a real scenario, you would send the form data to your backend here
        console.log("Form submitted", {
            email: emailInput.value,
            name: nameInput.value,
            password: passwordInput.value,
            terms: document.getElementById('terms').checked
        });
        // You would then handle the backend logic to store the details.
    });
});

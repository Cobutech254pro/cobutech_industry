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
        event.preventDefault(); // Prevent the default form submission

        if (!isEmailValid) {
            emailValidationMessage.textContent = 'Please enter a valid email address.';
            return;
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
            alert("Passwords do not match!");
            return;
        }

        const formData = {
            email: emailInput.value,
            name: nameInput.value,
            password: passwordInput.value
        };

        fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (response.ok) {
                alert(data.message); // Show success message (e.g., "User created successfully...")
                // Optionally, redirect the user to a "check your email" page
            } else {
                alert(data.message); // Show error message from the backend (e.g., "Email already exists", "Failed to create user")
            }
        })
        .catch(error => {
            console.error('Error during signup:', error);
            alert('An unexpected error occurred during signup.');
        });
    });
});

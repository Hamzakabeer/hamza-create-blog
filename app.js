document.addEventListener("DOMContentLoaded", function() {
    // Select DOM elements
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");
    const showSignup = document.getElementById("show-signup");
    const showLogin = document.getElementById("show-login");
    const popupOverlay = document.getElementById("popup-overlay");
    const customPopup = document.getElementById("custom-popup");
    const popupTitle = document.getElementById("popup-title");
    const popupMessage = document.getElementById("popup-message");
    const popupCloseBtn = document.getElementById("popup-close-btn");

    // Show signup and login forms
    showSignup.addEventListener("click", () => {
        document.getElementById("login-container").classList.remove("active");
        document.getElementById("signup-container").classList.add("active");
    });

    showLogin.addEventListener("click", () => {
        document.getElementById("signup-container").classList.remove("active");
        document.getElementById("login-container").classList.add("active");
    });

    // Utility functions
    function showPopup(title, message) {
        popupTitle.textContent = title;
        popupMessage.textContent = message;
        customPopup.classList.add("active");
        popupOverlay.classList.add("active");
    }

    function closePopup() {
        customPopup.classList.remove("active");
        popupOverlay.classList.remove("active");
    }

    popupCloseBtn.addEventListener("click", closePopup);
    popupOverlay.addEventListener("click", closePopup);

    function displayError(inputId, message) {
        const errorSpan = document.getElementById(`${inputId}-error`);
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
        document.getElementById(inputId).classList.add('invalid');
    }

    function clearErrors(formId) {
        const form = document.getElementById(formId);
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(span => {
            span.style.display = 'none';
            span.textContent = '';
        });

        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('invalid');
        });
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    function validatePassword(password) {
        // Password must be at least 8 characters, include one capital letter, one number, and one special character
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return passwordRegex.test(password.trim());
    }

    function validateName(name) {
        const nameRegex = /^[A-Za-z\s]+$/;
        return nameRegex.test(name.trim());
    }

    // Handle signup form submission
    signupForm.addEventListener("submit", function(e) {
        e.preventDefault();
        clearErrors('signup-form');

        let hasError = false;

        const nameInput = document.getElementById("signup-name");
        const emailInput = document.getElementById("signup-email");
        const passwordInput = document.getElementById("signup-password");

        const name = nameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();

        if (!validateName(name)) {
            displayError('signup-name', "Name must contain only letters and spaces.");
            hasError = true;
        }

        if (!validateEmail(email)) {
            displayError('signup-email', "Invalid email format.");
            hasError = true;
        }

        if (!validatePassword(password)) {
            displayError('signup-password', "Password must be at least 8 characters, include one uppercase letter, one number, and one special character.");
            hasError = true;
        }

        // Check if user already exists
        const existingUser = JSON.parse(localStorage.getItem(email));
        if (existingUser) {
            displayError('signup-email', "An account with this email already exists.");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        // Assign random avatar
        const avatarUrl = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;

        const user = { name, email, password, avatarUrl };

        // Save user to local storage
        localStorage.setItem(email, JSON.stringify(user));

        // Proceed to login
        showPopup("Success", "Sign-up successful!");
        setTimeout(() => {
            closePopup();
            showLogin.click();
        }, 2000);
    });

    // Handle login form submission
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        clearErrors('login-form');

        let hasError = false;

        const emailInput = document.getElementById("login-email");
        const passwordInput = document.getElementById("login-password");

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();

        if (!validateEmail(email)) {
            displayError('login-email', "Please enter a valid email.");
            hasError = true;
        }

        if (!password) {
            displayError('login-password', "Please enter your password.");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        const storedUser = JSON.parse(localStorage.getItem(email));

        if (storedUser && storedUser.password === password) {
            // Save login state
            localStorage.setItem("loggedInUser", email);
            window.location.href = "dashboard.html"; // Replace with your dashboard page
        } else {
            displayError('login-password', "Invalid email or password.");
        }
    });

    // Persistent login
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
    if (loggedInUserEmail) {
        // User is already logged in
        window.location.href = "dashboard.html"; // Replace with your dashboard page
    }
});

// Toggle password visibility function
function togglePassword(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}

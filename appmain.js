const showLoginBtn = document.getElementById('show-login');
const showSignupBtn = document.getElementById('show-signup');
const signupContainer = document.getElementById('signup-container');
const loginContainer = document.getElementById('login-container');
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');

showLoginBtn.addEventListener('click', () => {
  signupContainer.classList.remove('active');
  loginContainer.classList.add('active');
});

showSignupBtn.addEventListener('click', () => {
  loginContainer.classList.remove('active');
  signupContainer.classList.add('active');
});

// function togglePassword(inputId) {
//   var passwordInput = document.getElementById(inputId);
//   var icon = passwordInput.parentElement.querySelector('.toggle-password');
//   if (passwordInput.type === "password") {
//     passwordInput.type = "text";
//     icon.classList.remove("fa-eye");
//     icon.classList.add("fa-eye-slash");
//   } else {
//     passwordInput.type = "password";
//     icon.classList.remove("fa-eye-slash");
//     icon.classList.add("fa-eye");
//   }
// }

// ya wala function jo hai agr display show rakhna eye icon ka tu ya wala chala danga

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const type = input.type === "password" ? "text" : "password";
    input.type = type;
  }
  
  document.querySelectorAll('.password-input').forEach((inputField) => {
    const eyeIcon = inputField.nextElementSibling;
  
    // Initially hide the eye icon
    eyeIcon.style.display = "none";
  
    // Show the icon when typing starts
    inputField.addEventListener('input', function () {
      if (inputField.value.length > 0) {
        eyeIcon.style.display = "inline-block";
      } else {
        eyeIcon.style.display = "none";
      }
    });
  });

document.querySelectorAll('.password-input').forEach(input => {
  input.addEventListener('input', function() {
    var icon = this.parentElement.querySelector('.toggle-password');
    if (this.value.length > 0) {
      icon.style.display = 'block';
    } else {
      icon.style.display = 'none';
    }
  });
});

function showPopup(title, message, redirectUrl = null) {
const popup = document.getElementById("custom-popup");
const popupOverlay = document.getElementById("popup-overlay");
const popupTitle = document.getElementById("popup-title");
const popupMessage = document.getElementById("popup-message");
const closeBtn = document.getElementById("popup-close-btn");

popupTitle.innerText = title;
popupMessage.innerText = message;


popup.style.display = "block";
popupOverlay.style.display = "block";


closeBtn.onclick = () => {
  popup.style.display = "none";
  popupOverlay.style.display = "none";


  if (redirectUrl) {
    window.location.href = redirectUrl;
  }
};
}

signupBtn.addEventListener("click", (event) => {
event.preventDefault();
const name = document.getElementById("signup-name").value;
const email = document.getElementById("signup-email").value.toLowerCase();
const password = document.getElementById("signup-password").value;

if (localStorage.getItem(email)) {
  showPopup("Sign-Up Error", "User already signed up. Please log in.");
  return;
}

const user = { name, email, password };
localStorage.setItem(email, JSON.stringify(user));
showPopup("Sign-Up Successful", "Sign-up successful! Please log in.");
signupContainer.classList.remove("active");
loginContainer.classList.add("active");
});

loginBtn.addEventListener("click", (event) => {
event.preventDefault();
const email = document.getElementById("login-email").value.toLowerCase();
const password = document.getElementById("login-password").value;

const user = localStorage.getItem(email);
if (!user) {
  showPopup("Login Error", "Invalid email or password.");
  return;
}

const userData = JSON.parse(user);
if (userData.password === password) {
  showPopup("Login Successful", "Welcome back!", "hamzablog.html");
} else {
  showPopup("Login Error", "Invalid email or password.");
}
});


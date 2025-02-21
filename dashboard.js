document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    document.getElementById('menu-toggle').addEventListener('click', function() {
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.classList.toggle('hidden');
    });

    // Toggle user menu (avatar dropdown)
    document.getElementById('user-avatar').addEventListener('click', function() {
        toggleUserMenu();
    });

    function toggleUserMenu() {
        const userMenu = document.getElementById('user-menu');
        userMenu.classList.toggle('hidden');
    }

    // Close user menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = document.getElementById('user-avatar').contains(event.target) || document.getElementById('user-menu').contains(event.target);
        if (!isClickInside) {
            document.getElementById('user-menu').classList.add('hidden');
        }
    });

    // Handle 'Create Post' nav link click (both desktop and mobile)
    document.getElementById('create-post-nav').addEventListener('click', function(e) {
        e.preventDefault();
        scrollToCreatePost();
    });
    document.getElementById('mobile-create-post-nav').addEventListener('click', function(e) {
        e.preventDefault();
        scrollToCreatePost();
    });

    function scrollToCreatePost() {
        document.getElementById('create-post-section').scrollIntoView({ behavior: 'smooth' });
    }

    // User data
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
    let user = null;

    if (!loggedInUserEmail) {
        window.location.href = "index.html";
    } else {
        user = JSON.parse(localStorage.getItem(loggedInUserEmail));
        document.getElementById("user-name-main").textContent = user.name;
        document.getElementById("user-avatar-main").src = user.avatarUrl;
        document.getElementById("user-avatar").src = user.avatarUrl;
        document.getElementById("user-avatar-mobile").src = user.avatarUrl;
    }

    // Logout functionality
    document.getElementById("logout-btn").addEventListener("click", logout);
    document.getElementById("logout-btn-mobile").addEventListener("click", logout);

    function logout() {
        localStorage.removeItem("loggedInUser");
        window.location.href = "index.html";
    }

    // Settings button functionality
    document.getElementById("settings-option").addEventListener("click", function() {
        openSettingsModal();
        toggleUserMenu(); // Close the user menu
    });
    document.getElementById("settings-option-mobile").addEventListener("click", function() {
        openSettingsModal();
        document.getElementById('mobile-menu').classList.add('hidden'); // Close mobile menu
    });

    function openSettingsModal() {
        document.getElementById('settings-modal').style.display = 'block';
    }

    // Close settings modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('settings-modal');
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Close settings modal when clicking on 'X'
    document.getElementById('settings-modal-close').addEventListener('click', function() {
        document.getElementById('settings-modal').style.display = 'none';
    });

    // Handle avatar upload in settings
    document.getElementById('avatar-upload').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                user.avatarUrl = e.target.result;
                localStorage.setItem(loggedInUserEmail, JSON.stringify(user));

                // Update avatars on the page
                document.getElementById("user-avatar-main").src = user.avatarUrl;
                document.getElementById("user-avatar").src = user.avatarUrl;
                document.getElementById("user-avatar-mobile").src = user.avatarUrl;

                alert('Avatar updated successfully!');
                document.getElementById('settings-modal').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Emoji Picker Toggle
    document.addEventListener('click', function(event) {
        const isEmojiButton = event.target.closest('#emoji-picker') || event.target.closest('[onclick="toggleEmojiPicker()"]');
        if (!isEmojiButton) {
            document.getElementById('emoji-picker').style.display = 'none';
        }
    });

    // Load existing posts
    const savedPosts = JSON.parse(localStorage.getItem('userPosts')) || [];
    savedPosts.forEach(post => addPostToDOM(post));

    // Variables to hold selected inputs
    let selectedPhoto = '';
    let selectedBackground = 'white';

    // Rest of the code...
});

// Function Definitions

function toggleEmojiPicker() {
    const picker = document.getElementById('emoji-picker');
    picker.style.display = picker.style.display === 'block' ? 'none' : 'block';
}

function addEmoji(emoji) {
    const postInput = document.getElementById('post-input');
    postInput.value += emoji;
}

function handlePhotoUpload() {
    const fileInput = document.getElementById('photo-upload');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedPhoto = e.target.result;
            // Show preview
            document.getElementById('photo-preview').innerHTML = `<img src="${selectedPhoto}" alt="Selected Photo" class="rounded">`;
        };
        reader.readAsDataURL(file);
    }
}

function changeBackground(color) {
    selectedBackground = color;
    document.getElementById('post-input').style.background = color;
}

function createPost() {
    const postInput = document.getElementById('post-input');
    const postText = postInput.value.trim();
    const timestamp = new Date();
    const formattedTime = timestamp.toLocaleString();

    // Get current user info
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
    const user = JSON.parse(localStorage.getItem(loggedInUserEmail));

    if (postText || selectedPhoto) {
        const post = {
            id: Date.now(),
            text: postText,
            timestamp: formattedTime,
            photo: selectedPhoto,
            background: selectedBackground,
            userName: user.name,
            userAvatar: user.avatarUrl,
            userEmail: loggedInUserEmail
        };

        addPostToDOM(post);

        const savedPosts = JSON.parse(localStorage.getItem('userPosts')) || [];
        savedPosts.push(post);
        localStorage.setItem('userPosts', JSON.stringify(savedPosts));

        // Reset inputs
        postInput.value = '';
        selectedPhoto = '';
        document.getElementById('photo-preview').innerHTML = '';
        postInput.style.background = 'white';
        selectedBackground = 'white';
    }
}

function addPostToDOM(post) {
    const postContainer = document.getElementById('post-container');

    const postElement = document.createElement('div');
    postElement.className = 'post-card';
    postElement.style.background = post.background;
    postElement.setAttribute('data-id', post.id);

    postElement.innerHTML = `
        <div class="post-header">
            <img src="${post.userAvatar}" alt="User Avatar">
            <div class="post-user-info">
                <h3>${post.userName}</h3>
                <span>${post.timestamp}</span>
            </div>
        </div>
        <div class="post-content">
            <p>${post.text}</p>
            ${post.photo ? `<img src="${post.photo}" alt="Post Image">` : ''}
        </div>
        <div class="post-actions">
            ${canDeletePost(post) ? `<button onclick="deletePost(${post.id})">Delete</button>` : ''}
        </div>
    `;

    postContainer.prepend(postElement);
}

function canDeletePost(post) {
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
    return post.userEmail === loggedInUserEmail;
}

function deletePost(postId) {
    // Remove from DOM
    const postElement = document.querySelector(`.post-card[data-id='${postId}']`);
    if (postElement) {
        postElement.remove();
    }

    // Remove from localStorage
    let savedPosts = JSON.parse(localStorage.getItem('userPosts')) || [];
    savedPosts = savedPosts.filter(post => post.id !== postId);
    localStorage.setItem('userPosts', JSON.stringify(savedPosts));
}

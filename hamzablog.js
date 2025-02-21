document.getElementById('menu-toggle').addEventListener('click', function () {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});

let selectedPhoto = '';
let selectedBackground = 'white';

document.addEventListener('DOMContentLoaded', function () {
    const savedPosts = JSON.parse(localStorage.getItem('userPosts')) || [];
    savedPosts.forEach(post => addPostToDOM(post.text, post.timestamp, post.photo, post.background));
});

function toggleEmojiPicker() {
    const picker = document.getElementById('emoji-picker');
    picker.style.display = picker.style.display === 'none' || picker.style.display === '' ? 'block' : 'none';
}

function addEmoji(emoji) {
    const postInput = document.getElementById('post-input');
    postInput.value += emoji;
    toggleEmojiPicker();
}

function handlePhotoUpload() {
    const fileInput = document.getElementById('photo-upload');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            selectedPhoto = e.target.result;
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
    const timestamp = new Date().toLocaleString();

    if (postText || selectedPhoto) {
        addPostToDOM(postText, timestamp, selectedPhoto, selectedBackground);
        const savedPosts = JSON.parse(localStorage.getItem('userPosts')) || [];
        savedPosts.push({ text: postText, timestamp, photo: selectedPhoto, background: selectedBackground });
        localStorage.setItem('userPosts', JSON.stringify(savedPosts));

        postInput.value = '';
        selectedPhoto = '';
    }
}

function addPostToDOM(text, timestamp, photo, background) {
    const postElement = document.createElement('div');
    postElement.className = 'post-card';
    postElement.style.background = background;
    postElement.innerHTML = `
        <div>${timestamp}</div>
        <p>${text}</p>
        ${photo ? `<img src="${photo}" alt="Uploaded Photo" class="w-full rounded mt-2">` : ''}
        <span class="delete-btn" onclick="deletePost(this)">Delete</span>
        <p class="text-center text-gray-600 text-sm mt-4">Powered by Muhammad Hamza Kabeer</p>
    `;
    document.getElementById('post-container').appendChild(postElement);
}

function deletePost(deleteButton) {
    const postElement = deleteButton.parentElement;
    const postText = postElement.querySelector('p').textContent;
    const timestamp = postElement.querySelector('div').textContent;

    postElement.remove();

    let savedPosts = JSON.parse(localStorage.getItem('userPosts')) || [];
    savedPosts = savedPosts.filter(post => !(post.text === postText && post.timestamp === timestamp));
    localStorage.setItem('userPosts', JSON.stringify(savedPosts));
}

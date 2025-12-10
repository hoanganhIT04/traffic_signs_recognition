// Recognition JavaScript

// Check authentication
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'index.html';
}

// Display user name
document.getElementById('userName').textContent = currentUser.name;

// Elements
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const previewArea = document.getElementById('previewArea');
const previewImage = document.getElementById('previewImage');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultArea = document.getElementById('resultArea');
const resetBtn = document.getElementById('resetBtn');

// Drag and drop handlers
uploadArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', function (e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', function (e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleImageUpload(files[0]);
    }
});

// File input handler
imageInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

// Handle image upload
function handleImageUpload(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh!');
        return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB!');
        return;
    }

    // Read and display image
    const reader = new FileReader();
    reader.onload = function (e) {
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        previewArea.style.display = 'block';

        // Simulate recognition process
        recognizeSign();
    };
    reader.readAsDataURL(file);
}

// Simulate sign recognition (replace with actual CNN model later)
function recognizeSign() {
    loadingSpinner.style.display = 'block';
    resultArea.style.display = 'none';

    // Simulate processing time
    setTimeout(() => {
        // Get random sign from data (replace with actual CNN prediction)
        if (typeof trafficSigns === 'undefined') {
            alert('Dữ liệu biển báo chưa được load!');
            return;
        }

        const randomSign = trafficSigns[Math.floor(Math.random() * trafficSigns.length)];
        const confidence = (Math.random() * 15 + 85).toFixed(2); // Random confidence 85-100%

        displayResult(randomSign, confidence);
    }, 2000);
}

// Display recognition result
function displayResult(sign, confidence) {
    loadingSpinner.style.display = 'none';
    resultArea.style.display = 'block';

    document.getElementById('resultCode').textContent = sign.code;
    document.getElementById('resultName').textContent = sign.name;

    const typeSpan = document.getElementById('resultType');
    typeSpan.textContent = sign.type;
    typeSpan.className = 'badge';

    // Set badge color based on type
    if (sign.type.includes('cấm')) {
        typeSpan.classList.add('bg-danger', 'text-light');
    } else if (sign.type.includes('nguy hiểm', 'text-light')) {
        typeSpan.classList.add('bg-warning', 'text-dark');
    } else if (sign.type.includes('hiệu lệnh')) {
        typeSpan.classList.add('bg-info', 'text-light');
    } else if (sign.type.includes('chỉ dẫn')) {
        typeSpan.classList.add('bg-success', 'text-light');
    }

    // Update confidence bar
    const confidenceBar = document.getElementById('confidenceBar');
    const confidenceText = document.getElementById('confidenceText');

    confidenceBar.style.width = confidence + '%';
    confidenceText.textContent = confidence + '%';

    // Change color based on confidence
    if (confidence >= 90) {
        confidenceBar.className = 'progress-bar bg-success';
    } else if (confidence >= 75) {
        confidenceBar.className = 'progress-bar bg-info';
    } else {
        confidenceBar.className = 'progress-bar bg-warning';
    }
}

// Reset button handler
resetBtn.addEventListener('click', function () {
    previewArea.style.display = 'none';
    uploadArea.style.display = 'block';
    imageInput.value = '';
    previewImage.src = '';
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});
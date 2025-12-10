// Authentication JavaScript

// Check if user is already logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const currentPage = window.location.pathname.split('/').pop();

    if (currentUser && (currentPage === 'index.html' || currentPage === 'register.html' || currentPage === '')) {
        window.location.href = 'Dashboard.html';
    } else if (!currentUser && (currentPage === 'Dashboard.html' || currentPage === 'detect.html')) {
        window.location.href = 'index.html';
    }
}

// Show alert message
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Find user
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Save current user
            localStorage.setItem('currentUser', JSON.stringify(user));
            showAlert('Đăng nhập thành công!', 'success');

            setTimeout(() => {
                window.location.href = 'Dashboard.html';
            }, 1000);
        } else {
            showAlert('Email hoặc mật khẩu không đúng!', 'danger');
        }
    });
}

// Register Form Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate password match
        if (password !== confirmPassword) {
            showAlert('Mật khẩu xác nhận không khớp!', 'danger');
            return;
        }

        // Get existing users
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if email already exists
        if (users.some(u => u.email === email)) {
            showAlert('Email đã được sử dụng!', 'danger');
            return;
        }

        // Add new user
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        showAlert('Đăng ký thành công! Đang chuyển đến trang đăng nhập...', 'success');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}

// Logout Handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        showAlert('Đã đăng xuất!', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });
}

// Display user name in navbar
const userNameSpan = document.getElementById('userName');
if (userNameSpan) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        userNameSpan.textContent = currentUser.name;
    }
}

// Run auth check on page load
checkAuth();
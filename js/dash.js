// Dashboard JavaScript

// Check authentication
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'index.html';
}

// Display user name
document.getElementById('userName').textContent = currentUser.name;

// Pagination variables
let currentPage = 1;
const itemsPerPage = 12;
let filteredSigns = [];

// Initialize dashboard
function initDashboard() {
    if (typeof trafficSigns === 'undefined') {
        console.error('Data.js chưa được load hoặc biến trafficSigns chưa được định nghĩa');
        return;
    }

    filteredSigns = [...trafficSigns];
    updateStatistics();
    displaySigns();
    setupEventListeners();
}

// Update statistics
function updateStatistics() {
    const total = trafficSigns.length;
    const prohibition = trafficSigns.filter(s => s.type === 'Biển báo cấm').length;
    const warning = trafficSigns.filter(s => s.type === 'Biển báo nguy hiểm').length;
    const mandatory = trafficSigns.filter(s => s.type === 'Biển hiệu lệnh').length;
    const guide = trafficSigns.filter(s => s.type === 'Biển chỉ dẫn').length;

    document.getElementById('totalSigns').textContent = total;
    document.getElementById('prohibitionSigns').textContent = prohibition;
    document.getElementById('warningSigns').textContent = warning;
    document.getElementById('mandatorySigns').textContent = mandatory;
    document.getElementById('guideSigns').textContent = guide;
}

// Display signs with pagination
function displaySigns() {
    const container = document.getElementById('signsContainer');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const signsToDisplay = filteredSigns.slice(startIndex, endIndex);

    if (signsToDisplay.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h4>Không tìm thấy biển báo nào</h4>
                    <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = signsToDisplay.map(sign => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="sign-card">
                <img src="image/${sign.code}.png" alt="${sign.name}" class="sign-image" 
                     onerror="this.src='https://via.placeholder.com/200x200?text=${sign.code}'">
                <div class="sign-code">${sign.code}</div>
                <div class="sign-name">${sign.name}</div>
                <span class="sign-type ${getTypeClass(sign.type)}">${sign.type}</span>
            </div>
        </div>
    `).join('');

    updatePagination();
}

// Get type class for styling
function getTypeClass(type) {
    if (type.includes('cấm')) return 'cam';
    if (type.includes('nguy hiểm')) return 'nguy-hiem';
    if (type.includes('hiệu lệnh')) return 'hieu-lenh';
    if (type.includes('chỉ dẫn')) return 'chi-dan';
    return '';
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredSigns.length / itemsPerPage);
    const pagination = document.getElementById('pagination');

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `
                <li class="page-item disabled">
                    <span class="page-link">...</span>
                </li>
            `;
        }
    }

    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;

    pagination.innerHTML = paginationHTML;

    // Add click event to pagination links
    pagination.querySelectorAll('a.page-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = parseInt(this.dataset.page);
            if (page > 0 && page <= totalPages) {
                currentPage = page;
                displaySigns();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function () {
        filterSigns();
    });

    // Filter select
    const filterType = document.getElementById('filterType');
    filterType.addEventListener('change', function () {
        filterSigns();
    });
}

// Filter signs based on search and type
function filterSigns() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterType = document.getElementById('filterType').value;

    filteredSigns = trafficSigns.filter(sign => {
        const matchesSearch = sign.code.toLowerCase().includes(searchTerm) ||
            sign.name.toLowerCase().includes(searchTerm);
        const matchesType = filterType === 'all' || sign.type === filterType;

        return matchesSearch && matchesType;
    });

    currentPage = 1;
    displaySigns();
}

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDashboard);
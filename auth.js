// ========================================
// 統一登入狀態管理
// ========================================

const AuthManager = {
    // 保存登入狀態
    saveLogin(studentId, studentName) {
        const loginData = {
            studentId: studentId,
            studentName: studentName,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(loginData));
        this.updateHeaderUI();
    },

    // 清除登入狀態
    logout() {
        localStorage.removeItem('currentUser');
        this.updateHeaderUI();
        // 如果當前在需要登入的頁面，跳轉到首頁
        const currentPage = window.location.pathname;
        const protectedPages = ['/grades.html', '/reflection.html', '/progress.html', '/feedback.html'];
        if (protectedPages.some(page => currentPage.includes(page))) {
            window.location.href = 'index.html';
        }
    },

    // 獲取當前登入用戶
    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    },

    // 檢查是否已登入
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    },

    // 更新右上角UI
    updateHeaderUI() {
        const loginBtn = document.getElementById('loginBtn');
        const userInfo = document.getElementById('userInfo');

        if (!loginBtn && !userInfo) {
            // 如果頁面沒有這些元素，可能是其他頁面，不需要更新
            return;
        }

        const currentUser = this.getCurrentUser();

        if (currentUser) {
            // 已登入：顯示用戶資訊
            if (loginBtn) {
                loginBtn.style.display = 'none';
            }

            // 創建或更新用戶資訊顯示
            let userInfoElement = document.getElementById('userInfo');
            if (!userInfoElement) {
                userInfoElement = document.createElement('div');
                userInfoElement.id = 'userInfo';
                userInfoElement.className = 'user-info';
                const headerActions = document.querySelector('.header-actions');
                if (headerActions && loginBtn) {
                    headerActions.insertBefore(userInfoElement, loginBtn);
                } else if (headerActions) {
                    headerActions.appendChild(userInfoElement);
                }
            }

            userInfoElement.innerHTML = `
                <div class="user-info-content">
                    <i class="fas fa-user-circle"></i>
                    <span class="user-name">${currentUser.studentName}</span>
                </div>
                <button class="btn btn-outline btn-sm" id="logoutBtn" title="登出">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>登出</span>
                </button>
            `;

            // 綁定登出按鈕
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    this.logout();
                });
            }
        } else {
            // 未登入：顯示登入按鈕
            if (loginBtn) {
                loginBtn.style.display = 'flex';
            }

            // 移除用戶資訊顯示
            const userInfoElement = document.getElementById('userInfo');
            if (userInfoElement) {
                userInfoElement.remove();
            }
        }
    },

    // 初始化（頁面加載時調用）
    init() {
        this.updateHeaderUI();

        // 綁定登入按鈕點擊事件（如果存在）
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn && !loginBtn.hasAttribute('data-listener-attached')) {
            loginBtn.setAttribute('data-listener-attached', 'true');

            // 檢查是否在首頁（有登入模态框）
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                // 在首頁：顯示登入模态框
                loginBtn.addEventListener('click', () => {
                    if (!this.isLoggedIn()) {
                        loginModal.classList.add('active');
                    }
                });
            } else {
                // 在其他頁面：跳轉到成績追蹤頁面進行登入
                loginBtn.addEventListener('click', () => {
                    window.location.href = 'grades.html';
                });
            }
        }
    }
};

// 頁面加載時自動初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AuthManager.init();
    });
} else {
    AuthManager.init();
}

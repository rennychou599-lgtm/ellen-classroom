// ========================================
// 全局變量
// ========================================
let reflections = JSON.parse(localStorage.getItem('reflections')) || [];
let progressData = JSON.parse(localStorage.getItem('progressData')) || {};
let isLoggedIn = false;

// 模擬成績數據
const mockGrades = {
    '1000': [
        { subject: '國文', score: 85, comment: '閱讀理解能力良好，建議多練習作文' },
        { subject: '英文', score: 78, comment: '單字量充足，文法需要加強' },
        { subject: '數學', score: 92, comment: '數學基礎扎實，繼續保持！' },
        { subject: '自然', score: 90, comment: '實驗操作熟練，概念理解深入' },
        { subject: '社會', score: 88, comment: '歷史事件掌握良好，建議加強地理' }
    ]
};

// ========================================
// 初始化
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initCountdown();
    initDailyQuiz();
    initGradesSystem();
    initReflectionSystem();
    initProgressSystem();
    initScrollEffects();
    setDefaultDate();
    initImageCarousel();
});

// ========================================
// 打字機效果
// ========================================
let typewriterInterval = null;

function initTypewriterButton() {
    // 頁面加載時自動開始打字機效果
    startTypewriter();
    // 開始每30秒重複一次
    startTypewriterLoop();
}

// ========================================
// Hero 區域按鈕功能
// ========================================
function initHeroButtons() {
    // 學習地圖按鈕
    const learningMapBtn = document.getElementById('learningMapBtn');
    if (learningMapBtn) {
        learningMapBtn.addEventListener('click', function () {
            const target = document.querySelector('#course');
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // 關於本站按鈕
    const aboutSiteBtn = document.getElementById('aboutSiteBtn');
    if (aboutSiteBtn) {
        aboutSiteBtn.addEventListener('click', function () {
            const target = document.querySelector('#about');
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// ========================================
// 公告欄輪播功能
// ========================================
function initImageCarousel() {
    const carouselContainer = document.querySelector('.noticeboard-container');
    const prevBtn = document.getElementById('noticeboardPrevBtn');
    const nextBtn = document.getElementById('noticeboardNextBtn');
    const indicators = document.getElementById('noticeboardIndicators');

    if (!carouselContainer) return;

    const slides = carouselContainer.querySelectorAll('.noticeboard-slide');
    let currentIndex = 0;

    // 顯示指定索引的公告
    function showSlide(index) {
        slides.forEach((slide, i) => {
            // 清除所有狀態
            slide.classList.remove('active', 'prev', 'next');

            if (i === index) {
                slide.classList.add('active');
            } else if (i === index - 1 || (index === 0 && i === slides.length - 1)) {
                // 左側卡片
                slide.classList.add('prev');
            } else if (i === index + 1 || (index === slides.length - 1 && i === 0)) {
                // 右側卡片
                slide.classList.add('next');
            }
        });

        // 更新指示器
        if (indicators) {
            const indicatorItems = indicators.querySelectorAll('.indicator');
            indicatorItems.forEach((indicator, i) => {
                if (i === index) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        // 更新按鈕狀態
        if (prevBtn) {
            prevBtn.disabled = slides.length <= 1;
        }
        if (nextBtn) {
            nextBtn.disabled = slides.length <= 1;
        }

        currentIndex = index;
    }

    // 切換到指定公告
    function goToSlide(index) {
        if (slides.length <= 1) return; // 如果只有一張公告，不執行切換
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }
        showSlide(index);
    }

    // 創建指示器
    if (indicators && slides.length > 1) {
        slides.forEach((_, index) => {
            const indicator = document.createElement('span');
            indicator.className = 'indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            indicators.appendChild(indicator);
        });
    } else if (indicators) {
        indicators.style.display = 'none';
    }

    // 上一則
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
    }

    // 下一則
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
    }

    // 點擊左右側卡片也可以切換
    slides.forEach((slide, index) => {
        slide.addEventListener('click', (e) => {
            if (slide.classList.contains('prev')) {
                goToSlide(currentIndex - 1);
            } else if (slide.classList.contains('next')) {
                goToSlide(currentIndex + 1);
            }
        });
    });

    // 鍵盤支持
    document.addEventListener('keydown', (e) => {
        if (slides.length <= 1) return; // 如果只有一張公告，不響應鍵盤
        if (e.key === 'ArrowLeft') {
            goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentIndex + 1);
        }
    });

    // 自動輪播（可選，每5秒切換一次）
    let autoPlayInterval = null;
    function startAutoPlay() {
        if (slides.length <= 1) return;
        autoPlayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    // 當滑鼠懸停在公告欄上時暫停自動播放
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // 初始化顯示第一則
    showSlide(0);
    // 開始自動播放
    startAutoPlay();
}

function startTypewriterLoop() {
    // 清除之前的間隔（如果有的話）
    if (typewriterInterval) {
        clearInterval(typewriterInterval);
    }

    // 页面可见性检测：只在页面可见时执行
    function handleVisibilityChange() {
        if (document.hidden) {
            // 页面不可见时暂停
            if (typewriterInterval) {
                clearInterval(typewriterInterval);
                typewriterInterval = null;
            }
        } else {
            // 页面可见时恢复（如果还没有启动）
            if (!typewriterInterval) {
                typewriterInterval = setInterval(() => {
                    startTypewriter();
                }, 30000); // 30000毫秒 = 30秒
            }
        }
    }

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 設置每30秒（30000毫秒）重複一次（仅在页面可见时）
    if (!document.hidden) {
        typewriterInterval = setInterval(() => {
            startTypewriter();
        }, 30000); // 30000毫秒 = 30秒
    }
}

function startTypewriter() {
    const texts = {
        titleLine1: '智慧學習',
        titleLine2: '從現在開始',
        descLine1: '專為國中生打造的學習管理平台',
        descLine2: '讓每一步學習都有跡可循，成績進步看得見',
        signature: ''
    };

    function typeWriter(element, text, speed = 100, callback) {
        if (!element) return;
        element.textContent = '';
        element.classList.remove('typing-complete');
        let i = 0;

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.add('typing-complete');
                if (callback) callback();
            }
        }

        type();
    }

    // 依序顯示文字
    setTimeout(() => {
        typeWriter(document.getElementById('hero-title-line1'), texts.titleLine1, 150, () => {
            setTimeout(() => {
                typeWriter(document.getElementById('hero-title-line2'), texts.titleLine2, 150, () => {
                    setTimeout(() => {
                        typeWriter(document.getElementById('hero-desc-line1'), texts.descLine1, 80, () => {
                            setTimeout(() => {
                                typeWriter(document.getElementById('hero-desc-line2'), texts.descLine2, 80);
                            }, 300);
                        });
                    }, 500);
                });
            }, 300);
        });
    }, 300);
}

// ========================================
// 導航功能
// ========================================
function initNavigation() {
    // 平滑滾動
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // 更新活動狀態
                document.querySelectorAll('.menu-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // 手機版菜單
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-navigation');
    const headerActions = document.querySelector('.header-actions');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            mainNav.classList.toggle('mobile-open');
            headerActions.classList.toggle('mobile-open');
        });
    }
}

// ========================================
// 滾動效果
// ========================================
function initScrollEffects() {
    let lastScroll = 0;
    const header = document.querySelector('.site-header');

    console.log('initScrollEffects called, header found:', !!header);

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
            console.log('Scroll position:', currentScroll, '- Added scrolled class');
        } else {
            header.classList.remove('scrolled');
            console.log('Scroll position:', currentScroll, '- Removed scrolled class');
        }

        lastScroll = currentScroll;
    });
}

// ========================================
// 倒數計時功能
// ========================================
function initCountdown() {
    const targetDate = new Date('2026-05-15T09:00:00');

    function updateCountdown() {
        const now = new Date();
        const timeLeft = targetDate - now;

        if (timeLeft <= 0) {
            const d = document.getElementById('days');
            const h = document.getElementById('hours');
            const m = document.getElementById('minutes');
            const s = document.getElementById('seconds');
            if (d) d.textContent = '0';
            if (h) h.textContent = '0';
            if (m) m.textContent = '0';
            if (s) s.textContent = '0';
            const headerEl = document.getElementById('headerCountdown');
            if (headerEl) headerEl.textContent = '會考倒數 0 天';
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const d = document.getElementById('days');
        const h = document.getElementById('hours');
        const m = document.getElementById('minutes');
        const s = document.getElementById('seconds');
        if (d) d.textContent = days;
        if (h) h.textContent = hours.toString().padStart(2, '0');
        if (m) m.textContent = minutes.toString().padStart(2, '0');
        if (s) s.textContent = seconds.toString().padStart(2, '0');

        const headerEl = document.getElementById('headerCountdown');
        if (headerEl) headerEl.textContent = `會考倒數 ${days} 天`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ========================================
// 每日小問題（簡易檢查）
// ========================================
function initDailyQuiz() {
    const quiz = document.getElementById('dailyQuiz');
    if (!quiz) return;

    const checkBtn = document.getElementById('quizCheckBtn');
    const resetBtn = document.getElementById('quizResetBtn');

    if (checkBtn) {
        checkBtn.addEventListener('click', function () {
            const items = quiz.querySelectorAll('.quiz-item');
            let correctCount = 0;
            items.forEach((item, idx) => {
                const answer = item.getAttribute('data-answer');
                const name = `q${idx + 1}`;
                const checked = quiz.querySelector(`input[name="${name}"]:checked`);
                const result = item.querySelector('.quiz-result');
                if (!result) return;
                if (checked) {
                    if (checked.value === answer) {
                        correctCount++;
                        result.textContent = '答對了！';
                        result.className = 'quiz-result quiz-correct';
                    } else {
                        result.textContent = `答錯了，正確答案是 ${answer}`;
                        result.className = 'quiz-result quiz-wrong';
                    }
                } else {
                    result.textContent = '尚未作答';
                    result.className = 'quiz-result';
                }
            });
            showMessage(`本次得分：${correctCount} / 5`, 'info');
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            quiz.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
            quiz.querySelectorAll('.quiz-result').forEach(r => { r.textContent = ''; r.className = 'quiz-result'; });
        });
    }
}

// ========================================
// 成績系統
// ========================================
function initGradesSystem() {
    const loginForm = document.getElementById('loginForm');
    const loginCard = document.getElementById('loginCard');
    const gradesCard = document.getElementById('gradesCard');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginBtn = document.getElementById('loginBtn');
    const startLearningBtn = document.getElementById('startLearningBtn');

    // 登入表單提交
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const account = document.getElementById('account').value.trim();
            const password = document.getElementById('password').value.trim();

            if (account === '1000' && password === '1000') {
                isLoggedIn = true;
                loginCard.style.display = 'none';
                gradesCard.style.display = 'block';
                displayGrades('1000');
                showMessage('登入成功！', 'success');
            } else {
                showMessage('帳號或密碼錯誤', 'error');
            }
        });
    }

    // 登出
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            isLoggedIn = false;
            loginCard.style.display = 'block';
            gradesCard.style.display = 'none';
            document.getElementById('account').value = '';
            document.getElementById('password').value = '';
            showMessage('已登出', 'success');
        });
    }

    // 頂部登入按鈕
    if (loginBtn) {
        loginBtn.addEventListener('click', function () {
            document.getElementById('grades').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 開始學習按鈕
    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', function () {
            document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function displayGrades(studentId) {
    const gradesContent = document.getElementById('gradesContent');
    const grades = mockGrades[studentId];

    if (!grades) {
        gradesContent.innerHTML = '<p class="empty-state">找不到成績資料</p>';
        return;
    }

    const averageScore = Math.round(grades.reduce((sum, g) => sum + g.score, 0) / grades.length);

    let html = `
        <div class="grades-summary">
            <h3>學號：${studentId}</h3>
            <p class="average-score">平均分數：${averageScore} 分</p>
        </div>
        <div class="grades-list">
    `;

    grades.forEach(grade => {
        html += `
            <div class="grade-item">
                <div class="grade-header">
                    <h4>${grade.subject}</h4>
                    <span class="grade-score">${grade.score} 分</span>
                </div>
                <p class="grade-comment">
                    <i class="fas fa-comment"></i>
                    ${grade.comment}
                </p>
            </div>
        `;
    });

    html += '</div>';
    gradesContent.innerHTML = html;
}

// ========================================
// 學習心得系統
// ========================================
function initReflectionSystem() {
    const reflectionForm = document.getElementById('reflectionForm');

    if (reflectionForm) {
        reflectionForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const date = document.getElementById('reflectionDate').value;
            const subject = document.getElementById('reflectionSubject').value;
            const content = document.getElementById('reflectionContent').value;

            if (!date || !subject || !content) {
                showMessage('請填寫所有欄位', 'error');
                return;
            }

            const reflection = {
                id: Date.now(),
                date: date,
                subject: subject,
                content: content
            };

            reflections.unshift(reflection);
            localStorage.setItem('reflections', JSON.stringify(reflections));

            displayReflections();
            this.reset();
            setDefaultDate();
            showMessage('心得已儲存！', 'success');
        });
    }

    displayReflections();
}

function displayReflections() {
    const reflectionList = document.getElementById('reflectionList');

    if (!reflectionList) {
        console.log('reflectionList element not found, skipping display');
        return;
    }

    if (reflections.length === 0) {
        reflectionList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <p>還沒有心得記錄<br>開始記錄你的學習心得吧！</p>
            </div>
        `;
        return;
    }

    let html = '';
    reflections.forEach(reflection => {
        html += `
            <div class="reflection-item">
                <div class="reflection-item-header">
                    <span class="reflection-date">${formatDate(reflection.date)}</span>
                    <span class="reflection-subject">${reflection.subject}</span>
                </div>
                <p class="reflection-content">${reflection.content}</p>
            </div>
        `;
    });

    reflectionList.innerHTML = html;
}

// ========================================
// 複習進度系統
// ========================================
function initProgressSystem() {
    const subjects = ['國文', '英文', '數學', '自然', '歷史', '地理', '公民'];
    const weeks = 20;

    // 初始化數據
    if (Object.keys(progressData).length === 0) {
        for (let week = 1; week <= weeks; week++) {
            progressData[week] = {};
            subjects.forEach(subject => {
                progressData[week][subject] = 'not-started';
            });
        }
        saveProgressData();
    }

    generateProgressTable();
    updateCompletionRate();

    // 重置按鈕
    const resetBtn = document.getElementById('resetProgress');
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            if (confirm('確定要重置所有進度嗎？')) {
                progressData = {};
                initProgressSystem();
                showMessage('進度已重置', 'success');
            }
        });
    }

    // 匯出按鈕
    const exportBtn = document.getElementById('exportProgress');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportProgress);
    }
}

function generateProgressTable() {
    const tbody = document.getElementById('progressTableBody');
    const subjects = ['國文', '英文', '數學', '自然', '歷史', '地理', '公民'];

    if (!tbody) return;

    tbody.innerHTML = '';

    for (let week = 1; week <= 20; week++) {
        const row = document.createElement('tr');

        // 週次
        const weekCell = document.createElement('td');
        weekCell.textContent = `第${week}週`;
        weekCell.style.fontWeight = '600';
        row.appendChild(weekCell);

        // 各科目
        subjects.forEach(subject => {
            const cell = document.createElement('td');
            const status = progressData[week]?.[subject] || 'not-started';

            const statusDiv = document.createElement('div');
            statusDiv.className = `progress-cell ${status}`;
            statusDiv.textContent = getStatusText(status);
            statusDiv.dataset.week = week;
            statusDiv.dataset.subject = subject;

            statusDiv.addEventListener('click', function () {
                cycleStatus(week, subject, this);
            });

            cell.appendChild(statusDiv);
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    }
}

function cycleStatus(week, subject, element) {
    const statuses = ['not-started', 'in-progress', 'completed', 'reviewed'];
    const currentStatus = progressData[week][subject];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    progressData[week][subject] = nextStatus;
    element.className = `progress-cell ${nextStatus}`;
    element.textContent = getStatusText(nextStatus);

    saveProgressData();
    updateCompletionRate();
}

function getStatusText(status) {
    const texts = {
        'not-started': '未開始',
        'in-progress': '進行中',
        'completed': '已完成',
        'reviewed': '已複習'
    };
    return texts[status] || '未開始';
}

function updateCompletionRate() {
    const subjects = ['國文', '英文', '數學', '自然', '歷史', '地理', '公民'];
    let total = 0;
    let completed = 0;

    for (let week = 1; week <= 20; week++) {
        subjects.forEach(subject => {
            total++;
            const status = progressData[week]?.[subject] || 'not-started';
            if (status === 'completed' || status === 'reviewed') {
                completed++;
            }
        });
    }

    const rate = Math.round((completed / total) * 100);
    const rateElement = document.getElementById('completionRate');
    if (rateElement) {
        rateElement.textContent = `${rate}%`;
    }
}

function exportProgress() {
    const subjects = ['國文', '英文', '數學', '自然', '歷史', '地理', '公民'];
    let csv = '週次,' + subjects.join(',') + '\n';

    for (let week = 1; week <= 20; week++) {
        const row = [`第${week}週`];
        subjects.forEach(subject => {
            const status = progressData[week]?.[subject] || 'not-started';
            row.push(getStatusText(status));
        });
        csv += row.join(',') + '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `複習進度_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showMessage('進度已匯出', 'success');
}

function saveProgressData() {
    localStorage.setItem('progressData', JSON.stringify(progressData));
}

// ========================================
// 輔助函數
// ========================================
function setDefaultDate() {
    const dateInput = document.getElementById('reflectionDate');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `toast toast-${type}`;
    messageEl.textContent = message;

    messageEl.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;

    document.body.appendChild(messageEl);

    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 3000);
}

// 添加動畫樣式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .grades-summary {
        text-align: center;
        padding: 1.5rem;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border-radius: 12px;
        margin-bottom: 2rem;
    }
    
    .grades-summary h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }
    
    .average-score {
        font-size: 1.25rem;
        font-weight: 600;
    }
    
    .grades-list {
        display: grid;
        gap: 1rem;
    }
    
    .grade-item {
        background: var(--bg-light);
        border-left: 4px solid var(--primary-color);
        border-radius: 8px;
        padding: 1.25rem;
    }
    
    .grade-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
    }
    
    .grade-header h4 {
        font-size: 1.25rem;
        color: var(--text-primary);
    }
    
    .grade-score {
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 0.4rem 0.9rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 1.1rem;
    }
    
    .grade-comment {
        color: var(--text-secondary);
        line-height: 1.6;
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .grade-comment i {
        color: var(--primary-color);
        margin-top: 0.25rem;
    }
`;
document.head.appendChild(style);



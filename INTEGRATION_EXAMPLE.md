# 🔌 前端 API 集成示例

本文档展示如何将现有前端代码改为使用后端 API。

## 📝 步骤 1: 引入 API 服务

在所有需要调用 API 的 HTML 文件中，在 `</body>` 标签前添加：

```html
<script src="api.js"></script>
```

## 📝 步骤 2: 修改登录逻辑

### 原代码（使用 localStorage）：

```javascript
if (account === '1000' && password === '1000') {
  isLoggedIn = true;
  // ...
}
```

### 新代码（使用 API）：

```javascript
try {
  const response = await ApiService.login(account, password);
  if (response.success) {
    AuthManager.saveLogin(response.student.studentId, response.student.studentName);
    // 显示成绩等
  }
} catch (error) {
  showMessage('登录失败：' + error.message, 'error');
}
```

## 📝 步骤 3: 修改成绩获取

### 原代码（使用 mock 数据）：

```javascript
const mockGrades = {
  '1000': [
    { subject: '國文', score: 85, comment: '...' }
  ]
};
displayGrades('1000');
```

### 新代码（使用 API）：

```javascript
async function loadGrades(studentId) {
  try {
    const response = await ApiService.getGrades(studentId);
    displayGrades(response.grades);
  } catch (error) {
    showMessage('获取成绩失败：' + error.message, 'error');
  }
}
```

## 📝 步骤 4: 修改学习心得

### 原代码（使用 localStorage）：

```javascript
reflections = JSON.parse(localStorage.getItem('reflections')) || [];
reflections.unshift(reflection);
localStorage.setItem('reflections', JSON.stringify(reflections));
```

### 新代码（使用 API）：

```javascript
// 加载心得
async function loadReflections() {
  try {
    const response = await ApiService.getReflections(studentId);
    reflections = response.reflections;
    displayReflections();
  } catch (error) {
    console.error('加载心得失败:', error);
  }
}

// 保存心得
async function saveReflection(reflection) {
  try {
    await ApiService.addReflection(
      studentId,
      reflection.date,
      reflection.subject,
      reflection.content
    );
    await loadReflections(); // 重新加载
    showMessage('心得已保存！', 'success');
  } catch (error) {
    showMessage('保存失败：' + error.message, 'error');
  }
}
```

## 📝 步骤 5: 修改复习进度

### 原代码（使用 localStorage）：

```javascript
progressData[week][subject] = nextStatus;
localStorage.setItem('progressData', JSON.stringify(progressData));
```

### 新代码（使用 API）：

```javascript
async function updateProgressStatus(week, subject, status) {
  try {
    await ApiService.updateProgress(studentId, week, subject, status);
    // 更新本地显示
    progressData[week][subject] = status;
    updateCompletionRate();
  } catch (error) {
    console.error('更新进度失败:', error);
    showMessage('更新失败，请重试', 'error');
  }
}

// 加载进度
async function loadProgress() {
  try {
    const response = await ApiService.getProgress(studentId);
    progressData = response.progress || {};
    generateProgressTable();
    updateCompletionRate();
  } catch (error) {
    console.error('加载进度失败:', error);
  }
}
```

## 📝 步骤 6: 修改老师反馈

### 原代码（使用 localStorage）：

```javascript
let feedback = JSON.parse(localStorage.getItem('feedback')) || [];
```

### 新代码（使用 API）：

```javascript
// 加载反馈
async function loadFeedback() {
  try {
    const response = await ApiService.getFeedback(studentId);
    feedback = response.feedback || [];
    displayFeedback();
    updateUnreadCount();
  } catch (error) {
    console.error('加载反馈失败:', error);
  }
}

// 标记为已读
async function markAsRead(feedbackId) {
  try {
    await ApiService.markFeedbackAsRead(feedbackId, studentId);
    // 更新本地状态
    const item = feedback.find(f => f.id === feedbackId);
    if (item) {
      item.is_read = true;
      displayFeedback();
      updateUnreadCount();
    }
  } catch (error) {
    console.error('标记已读失败:', error);
  }
}
```

## 🔄 完整示例：reflection.html 集成

```javascript
// 在页面加载时
document.addEventListener('DOMContentLoaded', async function() {
  const currentUser = AuthManager.getCurrentUser();
  if (currentUser) {
    await loadReflections();
  }
});

// 表单提交
reflectionForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const currentUser = AuthManager.getCurrentUser();
  if (!currentUser) {
    showMessage('请先登录', 'error');
    return;
  }
  
  const date = document.getElementById('reflectionDate').value;
  const subject = document.getElementById('reflectionSubject').value;
  const content = document.getElementById('reflectionContent').value;
  
  // 验证（包括不雅文字检查）
  if (!date || !subject || !content) {
    showMessage('请填写所有字段', 'error');
    return;
  }
  
  if (containsInappropriateWords(content)) {
    showMessage('心得内容包含不当文字，请修改后重试', 'error');
    return;
  }
  
  try {
    await ApiService.addReflection(
      currentUser.studentId,
      date,
      subject,
      content
    );
    
    await loadReflections();
    this.reset();
    setDefaultDate();
    showMessage('心得已保存！', 'success');
  } catch (error) {
    showMessage('保存失败：' + error.message, 'error');
  }
});
```

## ⚠️ 注意事项

1. **错误处理**：所有 API 调用都应该用 `try-catch` 包裹
2. **加载状态**：可以添加加载指示器提升用户体验
3. **离线支持**：可以考虑保留 localStorage 作为缓存
4. **数据同步**：保存后记得重新加载数据

## 🎯 迁移策略

建议分步骤迁移：

1. **第一步**：先迁移登录功能
2. **第二步**：迁移成绩查询
3. **第三步**：迁移学习心得
4. **第四步**：迁移复习进度
5. **第五步**：迁移老师反馈

每一步完成后测试，确保功能正常再进行下一步。

// ========================================
// API 服务 - 与后端通信
// ========================================

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

const ApiService = {
  // 通用请求方法
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '请求失败');
      }

      return data;
    } catch (error) {
      console.error('API 请求错误:', error);
      throw error;
    }
  },

  // 登录
  async login(account, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { account, password }
    });
  },

  // 获取成绩
  async getGrades(studentId) {
    return this.request(`/grades?studentId=${studentId}`);
  },

  // 获取学习心得
  async getReflections(studentId) {
    return this.request(`/reflections?studentId=${studentId}`);
  },

  // 添加学习心得
  async addReflection(studentId, date, subject, content) {
    return this.request('/reflections', {
      method: 'POST',
      body: { studentId, date, subject, content }
    });
  },

  // 删除学习心得
  async deleteReflection(id, studentId) {
    return this.request(`/reflections/${id}?studentId=${studentId}`, {
      method: 'DELETE'
    });
  },

  // 获取复习进度
  async getProgress(studentId) {
    return this.request(`/progress?studentId=${studentId}`);
  },

  // 更新复习进度
  async updateProgress(studentId, week, subject, status) {
    return this.request('/progress', {
      method: 'PUT',
      body: { studentId, week, subject, status }
    });
  },

  // 批量更新复习进度
  async updateProgressBatch(studentId, progressData) {
    return this.request('/progress/batch', {
      method: 'PUT',
      body: { studentId, progressData }
    });
  },

  // 获取老师反馈
  async getFeedback(studentId) {
    return this.request(`/feedback?studentId=${studentId}`);
  },

  // 标记反馈为已读
  async markFeedbackAsRead(id, studentId) {
    return this.request(`/feedback/${id}/read`, {
      method: 'PUT',
      body: { studentId }
    });
  }
};

// 如果在浏览器环境，自动检测 API 地址
if (typeof window !== 'undefined') {
  // 检测是否在生产环境
  const isProduction = window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  if (isProduction) {
    // 生产环境：使用相对路径（后端和前端在同一域名）
    // 如果后端和前端在不同域名，需要修改这里
    const originalRequest = ApiService.request.bind(ApiService);
    ApiService.request = async function (endpoint, options = {}) {
      const url = `/api${endpoint}`;
      return originalRequest(url, options);
    };
  } else {
    // 开发环境：使用 localhost:3000
    const originalRequest = ApiService.request.bind(ApiService);
    ApiService.request = async function (endpoint, options = {}) {
      const url = `http://localhost:3000/api${endpoint}`;
      return originalRequest(url, options);
    };
  }
}

# 🌐 生成公开域名步骤

## ✅ 操作步骤

您看到了 "Generate Service Domain" 对话框，按以下步骤操作：

### 1. 输入端口号

在 **"Target port"** 输入框中输入：
```
3000
```

**为什么是 3000？**
- 后端服务器配置为监听端口 3000
- 这是 `backend/server.js` 中设置的默认端口

### 2. 生成域名

点击 **"Generate Domain"** 按钮

### 3. 等待生成

Railway 会自动生成一个公开域名，格式类似：
```
https://ellen-classroom-production.up.railway.app
```

## 📝 生成后的操作

### 1. 复制生成的域名

生成后，会显示您的公开域名，**复制这个网址**

### 2. 更新环境变量

1. 在 Railway 项目页面，进入 **"Variables"** 标签
2. 找到 `FRONTEND_URL` 环境变量
3. 更新为刚才生成的公开域名：
   ```
   FRONTEND_URL=https://您的域名.railway.app
   ```
4. 保存

### 3. 测试网站

1. **访问健康检查**：
   ```
   https://您的域名.railway.app/health
   ```
   应该返回：`{"status":"ok","message":"服务器运行正常"}`

2. **访问网站首页**：
   ```
   https://您的域名.railway.app
   ```

3. **测试登录**：
   - 账号：`1000`
   - 密码：`1000`

## ✅ 验证部署成功

### 检查清单：

- [ ] 域名已生成
- [ ] 可以访问 `/health` 端点
- [ ] 可以访问网站首页
- [ ] 登录功能正常
- [ ] 数据库连接正常（查看 Logs）

---

**输入 3000 并点击 "Generate Domain" 即可！** 🚀

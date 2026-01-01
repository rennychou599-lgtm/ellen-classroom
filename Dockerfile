# 使用 Node.js 官方镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 文件
COPY backend/package*.json ./backend/

# 安装依赖
WORKDIR /app/backend
RUN npm install

# 复制所有文件（包括前端文件）
WORKDIR /app
COPY . .

# 设置工作目录为 backend（用于启动服务器）
WORKDIR /app/backend

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"]

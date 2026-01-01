# 使用 Node.js 官方镜像
FROM node:18-alpine

# 设置工作目录为 backend
WORKDIR /app/backend

# 复制 package.json 文件
COPY backend/package*.json ./

# 安装依赖
RUN npm install

# 复制 backend 目录的所有文件
COPY backend/ .

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"]

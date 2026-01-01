# 🔧 清除 GitHub 认证凭据 - 解决 403 错误

## 问题说明

错误信息显示：
```
remote: Permission to rennychou599-lgtm/ellen-classroom.git denied to Ben-One0708.
```

这是因为系统缓存了 `Ben-One0708` 的凭据，但您要推送到 `rennychou599-lgtm` 的仓库。

## 🚀 快速修复

### 方法 1: 使用修复脚本（推荐）

在终端执行：

```bash
cd /Users/hsienjenchiu/Desktop/IMJH
bash fix-github-auth.sh
```

然后执行推送：

```bash
git push -u origin main
```

当提示输入时：
- **用户名**：`rennychou599-lgtm`
- **密码**：使用 Personal Access Token（不是 GitHub 密码）

### 方法 2: 手动清除凭据

#### 步骤 1: 清除 macOS Keychain 中的凭据

```bash
# 清除 git credential
printf "host=github.com\nprotocol=https\n\n" | git credential-osxkeychain erase

# 清除 macOS Keychain
security delete-internet-password -s github.com
```

#### 步骤 2: 清除 git credential cache

```bash
git credential-cache exit
```

#### 步骤 3: 重新配置 remote（如果需要）

```bash
cd /Users/hsienjenchiu/Desktop/IMJH
git remote remove origin
git remote add origin https://github.com/rennychou599-lgtm/ellen-classroom.git
```

#### 步骤 4: 推送代码

```bash
git push -u origin main
```

### 方法 3: 使用 GitHub Desktop 或 Keychain Access

1. **打开 Keychain Access**（钥匙串访问）
   - 按 `Cmd + Space`，输入 "Keychain Access"
   - 搜索 "github.com"
   - 删除所有找到的 GitHub 相关条目

2. **或者使用 GitHub Desktop**
   - 在 GitHub Desktop 中登出旧账号
   - 登录新账号 `rennychou599-lgtm`

## 🔑 创建 Personal Access Token

如果还没有 Personal Access Token：

1. 访问：https://github.com/settings/tokens/new
2. 输入 Token 名称（例如：`MacBook Pro`）
3. 选择过期时间
4. **勾选 `repo` 权限**（这是必需的）
5. 点击 "Generate token"
6. **立即复制 token**（只显示一次）

## ✅ 验证修复

执行以下命令测试：

```bash
cd /Users/hsienjenchiu/Desktop/IMJH
git push -u origin main
```

如果成功，您会看到：
```
Enumerating objects: ...
Counting objects: ...
Writing objects: ...
...
To https://github.com/rennychou599-lgtm/ellen-classroom.git
 * [new branch]      main -> main
```

## 🆘 如果仍然失败

1. **确认仓库权限**
   - 确保 `rennychou599-lgtm` 账号有该仓库的写入权限

2. **检查 Token 权限**
   - 确保 Personal Access Token 有 `repo` 权限

3. **使用 SSH 方式**（推荐长期使用）
   - 参考 `SETUP_SSH.md` 配置 SSH key
   - 然后使用：`git remote set-url origin git@github.com:rennychou599-lgtm/ellen-classroom.git`

---

**完成以上步骤后，应该可以成功推送代码了！** 🎉

# 🔐 GitHub SSH 配置指南

## 步骤 1: 生成 SSH Key

在终端中运行以下命令：

```bash
ssh-keygen -t ed25519 -C "rennychou599@gmail.com"
```

**提示说明：**
- 当提示 "Enter file in which to save the key" 时，直接按 Enter（使用默认路径）
- 当提示 "Enter passphrase" 时，可以直接按 Enter（不设置密码）或输入密码（更安全）
- 确认密码：再次输入相同密码或直接按 Enter

## 步骤 2: 启动 SSH Agent

```bash
eval "$(ssh-agent -s)"
```

## 步骤 3: 添加 SSH Key 到 SSH Agent

```bash
ssh-add ~/.ssh/id_ed25519
```

如果设置了密码，会提示输入密码。

## 步骤 4: 复制 SSH 公钥

```bash
cat ~/.ssh/id_ed25519.pub
```

**复制输出的全部内容**（以 `ssh-ed25519` 开头，以您的邮箱结尾）

## 步骤 5: 将 SSH Key 添加到 GitHub

1. 访问：https://github.com/settings/keys
2. 点击 **"New SSH key"**
3. **Title**: 输入一个描述性名称（例如：`MacBook Pro`）
4. **Key**: 粘贴步骤 4 复制的公钥内容
5. 点击 **"Add SSH key"**

## 步骤 6: 更改 Git Remote URL 为 SSH

在项目目录中运行：

```bash
cd /Users/hsienjenchiu/Desktop/IMJH
git remote set-url origin git@github.com:rennychou599-lgtm/ellen-classroom.git
```

## 步骤 7: 测试 SSH 连接

```bash
ssh -T git@github.com
```

**预期输出：**
```
Hi rennychou599-lgtm! You've successfully authenticated, but GitHub does not provide shell access.
```

如果看到这条消息，说明配置成功！🎉

## 步骤 8: 验证 Remote URL

```bash
git remote -v
```

应该显示：
```
origin	git@github.com:rennychou599-lgtm/ellen-classroom.git (fetch)
origin	git@github.com:rennychou599-lgtm/ellen-classroom.git (push)
```

## 步骤 9: 测试推送

```bash
git push
```

现在应该可以使用 SSH 方式推送代码了！

---

## 🔧 故障排除

### 问题 1: "Permission denied (publickey)"

**解决方案：**
- 确认 SSH key 已添加到 GitHub
- 确认使用了正确的 key：`ssh-add -l` 查看已添加的 keys
- 重新添加 key：`ssh-add ~/.ssh/id_ed25519`

### 问题 2: "Could not resolve hostname github.com"

**解决方案：**
- 检查网络连接
- 尝试：`ping github.com`

### 问题 3: 仍然要求输入密码

**解决方案：**
- 确认 remote URL 是 SSH 格式（`git@github.com:...`）
- 检查 SSH agent：`ssh-add -l`
- 重新启动 SSH agent 并添加 key

---

**完成以上步骤后，您就可以使用 SSH 方式推送代码到 GitHub 了！** 🚀

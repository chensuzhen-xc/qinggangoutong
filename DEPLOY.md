# 虚拟试衣项目部署指南 🚀

## 快速部署到 Vercel（推荐，5分钟搞定）

### 第一步：上传到 GitHub

1.  打开 GitHub：https://github.com/new
2.  创建新仓库（名称：`virtual-try-on`）
3.  在你的电脑上运行以下命令：

```bash
cd c:\Users\Administrator\Desktop\新建文件夹\projects
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/virtual-try-on.git
git push -u origin main
```

### 第二步：在 Vercel 部署

1.  打开 Vercel：https://vercel.com/
2.  点击「New Project」
3.  选择你的 GitHub 仓库
4.  **重要**：配置环境变量
    *   在「Environment Variables」部分添加：
    *   `ARK_API_KEY` = 你的火山引擎 API Key
    *   `ARK_API_URL` = https://ark.cn-beijing.volces.com/api/v3/images/generations
5.  点击「Deploy」！

### 第三步：分享你的作品

部署完成后，你会得到一个链接，类似：
https://virtual-try-on.vercel.app

你可以把这个链接分享给朋友了！

---

## 其他部署选项

### 选项 2：Netlify
https://www.netlify.com/

### 选项 3：传统服务器

```bash
# 在服务器上
npm install
npm run build
npm start
```

---

## 本地运行

```bash
cd projects
npm run dev
```

访问：http://localhost:3000/try-on

---

## 环境变量

确保在部署平台上配置以下环境变量：

```
ARK_API_KEY=你的API Key
ARK_API_URL=https://ark.cn-beijing.volces.com/api/v3/images/generations
```

---

## 项目结构

```
projects/
├── src/
│   ├── app/
│   │   ├── try-on/          # 虚拟试衣页面
│   │   └── api/try-on/      # 虚拟试衣 API
│   └── ...
├── package.json
├── vercel.json             # Vercel 配置
└── DEPLOY.md               # 本文件
```

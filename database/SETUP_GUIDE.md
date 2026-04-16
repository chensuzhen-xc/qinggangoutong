# 哄哄模拟器 - 用户认证配置指南

## 前置条件

- 一个 Supabase 账号（免费版即可）
- 已安装好 Node.js 和项目依赖

---

## 第一步：创建 Supabase 项目

1. 访问 https://supabase.com/dashboard
2. 点击 **"New Project"**
3. 填写项目信息：
   - Name: `哄哄模拟器`（或您喜欢的名字）
   - Database Password: 设置一个强密码（请记住这个密码）
   - Region: 选择离您最近的区域
4. 点击 **"Create new project"**
5. 等待项目创建完成（约2分钟）

---

## 第二步：获取项目凭证

项目创建完成后：

1. 在左侧菜单点击 **"Project Settings"** → **"API"**
2. 复制以下信息：
   - **Project URL** (例如: `https://xxxxx.supabase.co`)
   - **anon public** (以 `eyJhbG...` 开头的长字符串)

---

## 第三步：配置环境变量

编辑项目根目录的 `.env.local` 文件，添加以下内容：

```env
# 数据库连接（已配置）
DATABASE_URL=postgresql://...

# Coze SDK（已配置）
COZE_WORKLOAD_IDENTITY_API_KEY=...
COZE_INTEGRATION_BASE_URL=https://integration.coze.cn
COZE_INTEGRATION_MODEL_BASE_URL=https://integration.coze.cn/api/v3

# Supabase 配置（新增）
COZE_SUPABASE_URL=您的Supabase项目URL
COZE_SUPABASE_ANON_KEY=您的anon public key
```

**示例**：
```env
COZE_SUPABASE_URL=https://abcdefghijklmnopqrst.supabase.co
COZE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 第四步：创建数据库表

1. 在 Supabase 面板左侧菜单点击 **"SQL Editor"**
2. 点击 **"New query"**
3. 打开项目目录中的 `database/schema.sql` 文件
4. 复制全部 SQL 代码
5. 粘贴到 Supabase 的 SQL Editor 中
6. 点击 **"Run"** 执行

执行成功后，您会看到：
- `users` 表（用户表）
- `blog_posts` 表（博客文章表，含3篇预设文章）
- `game_records` 表（游戏记录表）
- `leaderboard` 表（排行榜表）

---

## 第五步：配置 Row Level Security (RLS)

为了安全，建议配置 RLS 策略：

### 1. users 表
```sql
-- 允许用户读取自己的信息
CREATE POLICY "Users can read own data" 
ON users FOR SELECT 
USING (auth.uid()::text = id::text);

-- 允许插入新用户
CREATE POLICY "Anyone can create user" 
ON users FOR INSERT 
WITH CHECK (true);
```

### 2. blog_posts 表
```sql
-- 所有人都可以读取博客
CREATE POLICY "Everyone can read blog posts" 
ON blog_posts FOR SELECT 
USING (true);
```

### 3. game_records 表
```sql
-- 用户可以读取自己的记录
CREATE POLICY "Users can read own records" 
ON game_records FOR SELECT 
USING (auth.uid()::text = user_id::text);

-- 用户可以插入自己的记录
CREATE POLICY "Users can insert own records" 
ON game_records FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);
```

### 4. leaderboard 表
```sql
-- 所有人都可以读取排行榜
CREATE POLICY "Everyone can read leaderboard" 
ON leaderboard FOR SELECT 
USING (true);

-- 用户可以更新自己的排名
CREATE POLICY "Users can update own ranking" 
ON leaderboard FOR ALL 
USING (auth.uid()::text = user_id::text);
```

---

## 第六步：重启开发服务器

配置完成后：

1. 停止当前的开发服务器（Ctrl+C）
2. 重新运行：
   ```bash
   npm run dev
   ```
3. 访问 http://localhost:3000

---

## 验证配置

1. 访问 http://localhost:3000/register
2. 尝试注册一个新账号
3. 如果成功注册并跳转，说明配置正确！

---

## 常见问题

### Q: 执行 SQL 时出现错误？
A: 确保您复制了完整的 `schema.sql` 文件内容，并且没有遗漏任何分号。

### Q: 注册时还是显示 "COZE_SUPABASE_URL is not set"？
A: 
1. 确认 `.env.local` 文件在项目根目录
2. 确认变量名是 `COZE_SUPABASE_URL`（不是 SUPABASE_URL）
3. 重启开发服务器

### Q: 如何查看数据库数据？
A: 在 Supabase 面板左侧菜单点击 **"Table Editor"**，可以查看和编辑所有表。

---

## 项目结构

```
projects/
├── .env.local                    # 环境变量配置
├── database/
│   ├── schema.sql               # 数据库表结构
│   └── SETUP_GUIDE.md          # 本配置指南
└── src/
    ├── lib/
    │   ├── supabase.ts          # Supabase 客户端
    │   ├── user.ts              # 用户相关操作
    │   ├── blog.ts              # 博客相关操作
    │   ├── gameRecord.ts        # 游戏记录操作
    │   └── leaderboard.ts       # 排行榜操作
    └── app/
        └── api/
            ├── auth/             # 认证 API
            └── blog/             # 博客 API
```

---

## 需要帮助？

如果遇到问题，请检查：
1. Supabase 项目是否已创建
2. `.env.local` 中的 URL 和 Key 是否正确
3. SQL 脚本是否成功执行
4. 开发服务器是否已重启

祝您配置顺利！🎉

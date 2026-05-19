# 哄哄模拟器 💝

一个有趣的互动式哄人模拟器，帮助你学习如何哄不同角色的人开心！

## 功能特点

- 👩 **女朋友** - 温柔傲娇，需要浪漫和体贴
- 👨 **男朋友** - 稳重直男，需要理解和支持
- 👩‍🤝‍👩 **闺蜜** - 毒舌护短，需要真诚和陪伴
- 🤝 **兄弟** - 豪爽义气，需要直接和坦诚
- 👔 **老板** - 严厉挑剔，需要专业和担当
- 👨‍👩‍👧 **父母** - 操心关爱，需要孝心和耐心
- 👧 **子女** - 叛逆懂事，需要理解和引导

## 技术栈

- **框架**: Next.js 16.1.1 (App Router)
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **样式**: Tailwind CSS v4
- **数据库**: Supabase
- **ORM**: Drizzle ORM
- **表单**: React Hook Form + Zod
- **图标**: Lucide React
- **包管理器**: pnpm 9+
- **语言**: TypeScript 5.x

## 快速开始

### 环境要求

- Node.js 20+
- pnpm 9.0.0+

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

创建 `.env.local` 文件并配置：

```env
COZE_SUPABASE_URL=your_supabase_url
COZE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 启动开发服务器

```bash
pnpm dev
```

打开 [http://localhost:5000](http://localhost:5000) 查看应用。

### 构建生产版本

```bash
pnpm build
```

### 启动生产服务器

```bash
pnpm start
```

## 项目结构

```
src/
├── app/                      # Next.js App Router 目录
│   ├── layout.tsx           # 根布局组件
│   ├── page.tsx             # 首页（游戏页面）
│   ├── login/               # 登录页面
│   ├── register/            # 注册页面
│   ├── profile/             # 个人中心
│   ├── ranking/             # 排行榜
│   ├── blog/                # 博客文章
│   ├── try-on/              # 试玩页面
│   ├── api/                 # API 路由
│   └── globals.css          # 全局样式
├── components/              # React 组件
│   ├── ui/                  # shadcn/ui 基础组件
│   └── game/                # 游戏相关组件
│       ├── ChatWindow.tsx   # 聊天窗口
│       ├── RoleSelector.tsx # 角色选择
│       ├── ScenarioSelector.tsx # 场景选择
│       ├── AffectionBar.tsx # 好感度条
│       └── InputArea.tsx    # 输入区域
├── context/                 # React Context
│   ├── AuthContext.tsx      # 认证上下文
│   └── GameContext.tsx      # 游戏上下文
├── data/                    # 数据文件
│   ├── roles.ts             # 角色数据
│   ├── scenarios.ts         # 场景数据
│   └── articles.ts          # 文章数据
├── lib/                     # 工具库
│   ├── supabase.ts          # Supabase 客户端
│   ├── prompts.ts           # AI 提示词
│   ├── rules.ts             # 游戏规则
│   └── utils.ts             # 工具函数
├── types/                   # TypeScript 类型定义
└── hooks/                   # 自定义 Hooks
```

## 游戏玩法

1. **选择角色** - 从7个预设角色中选择一个想要哄的对象
2. **选择场景** - 每个角色都有多个专属的生气场景
3. **开始对话** - 根据场景提示，输入你的哄人话术
4. **观察反馈** - AI 会根据你的回答给出反应和好感度变化
5. **提升排名** - 积累好感度，在排行榜上展示你的哄人技巧！

## 角色主题配色

每个角色都有独特的配色方案：

| 角色 | 主色调 | 背景色 | 特点 |
|------|--------|--------|------|
| 女朋友 | #ff6b9d | #fff5f8 | 浪漫可爱 |
| 男朋友 | #3b82f6 | #f0f7ff | 稳重大气 |
| 闺蜜 | #8b5cf6 | #faf5ff | 时尚活泼 |
| 兄弟 | #22c55e | #f0fdf4 | 活力豪爽 |
| 老板 | #475569 | #f8fafc | 专业严肃 |
| 父母 | #f97316 | #fff7ed | 温馨亲切 |
| 子女 | #06b6d4 | #ecfeff | 青春活力 |

## 开发规范

### 使用 pnpm 管理依赖

```bash
# 安装依赖
pnpm install

# 添加新依赖
pnpm add package-name

# 添加开发依赖
pnpm add -D package-name
```

### 优先使用 shadcn/ui 组件

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
```

### 使用 `@/` 路径别名

```tsx
import { cn } from '@/lib/utils';
import { Role } from '@/types';
```

## License

MIT

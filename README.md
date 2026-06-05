## ✨ 项目亮点 (Core Highlights)

*   **⚡ 纯粹的 Vibe Coding 体验**：结合 AI 编程助手进行敏捷迭代，代码架构即是设计语言。
*   **🎨 实时人机共生编辑 (Symbiotic Live Editing)**：
    *   引入 **TinaCMS 本地 GraphQL 引擎**，打破传统无头 CMS 的暗盒操作。
    *   支持**前端一键切换「编辑模式」**，在本地 `/admin/index.html` 实现完全可视化的内容微调。
    *   **热更新落盘**：所有可视化修改通过本地 GraphQL Mutation 直连文件系统，动态更新本地 Markdown / JSON，真正做到“所见即所得，所得即代码”。
*   **💎 模块化可插拔组件**：内置强类型的 `EditableText` 与 `EditableImage` 抽象封装，让底层静态数据具备动态生命力。
*   **🎨 精准工程设计语言**：遵循严格的 Token 体系（`tokens.json`, `variables.css`），将设计系统（Design System）深度融入 Tailwind CSS。

---

## 🛠️ 技术栈 (Tech Stack)

项目采用当下最前沿的前端生产力工具链进行构建：

| 领域 | 核心技术 | 作用说明 |
| :--- | :--- | :--- |
| **核心框架** | **Next.js (App Router)** | 全栈同构渲染、极速热重载 (Fast Refresh) 与强类型路由。 |
| **内容引擎** | **TinaCMS (Local GraphQL)** | 基于本地文件系统的 Git-backed Git-less 双模无头 CMS。 |
| **样式与UI** | **Tailwind CSS + Lucide** | 基于原子化 CSS 的高性能样式系统与现代图标库。 |
| **组件基础** | **Radix UI Primitive** | 提供无样式、无障碍访问 (A11y) 的底层交互骨架。 |
| **工程质量** | **Jest + ESLint + Prettier** | 自动化单元测试与统一的代码格式化守卫。 |

---

## 📦 目录规约 (Repository Structure)

```text
├── tina/                      # TinaCMS Schema 配置及自动生成的 GraphQL 客户端
├── content/                   # 核心持久化内容文件 (Markdown / JSON 数据层)
├── components/                # 核心 UI 库
│   ├── EditableText.tsx       # 可视化文本桥接组件
│   └── ui/                    # 原子化原子组件 (Button, Card, Badge)
├── app/                       # Next.js App Router 页面层 (Projects, Thoughts)
├── style/                     # 设计系统 Token 汇聚地 (Theme/CSS Variables)
└── public/admin/              # TinaCMS CLI 静态编译生成的后台单页应用 (SPA)

```

---

## 🚀 本地快速启动 (Quick Start)

### 1. 安装依赖

```bash
npm install

```

### 2. 启动开发服务器 (同时拉起 Next.js 与 TinaCMS Dev Server)

```bash
npm run dev

```

启动后，你可以在终端看到双端口并行：

* **前端预览**: [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
* **可视化后台**: [http://localhost:3000/admin/index.html](https://www.google.com/search?q=http://localhost:3000/admin/index.html)
* **GraphQL Playground**: [http://localhost:4001/graphql](https://www.google.com/search?q=http://localhost:4001/graphql)

---

## 🛡️ 开发备忘 (Developer Notes)

* **不要手动修改** `tina/__generated__` 内的任何文件，它们是由编译命令自动生成的。
* 修改 `tina/config.ts` 中的 Schema 结构后，Tina 编译器会自动更新前端查询所需的 TypeScript Types。

```

---

2026.6.5

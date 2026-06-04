# Tasks

- [x] Task 1: 配置测试环境
  - [x] SubTask 1.1: 安装并配置 Jest 和 React Testing Library。
  - [x] SubTask 1.2: 编写一个简单的验证测试以确保测试环境正常运行。

- [x] Task 2: 实现本地数据读写工具类 (TDD)
  - [x] SubTask 2.1: 编写 `lib/content.ts` 中 `getContent` 和 `saveContent` 的失败测试 (RED)。
  - [x] SubTask 2.2: 实现逻辑使测试通过 (GREEN)，支持 JSON 和 Markdown 的读写。
  - [x] SubTask 2.3: 重构代码 (REFACTOR)。

- [ ] Task 3: 实现 API 路由 (TDD)
  - [ ] SubTask 3.1: 编写 API 路由 (GET/POST `/api/content`) 的测试 (RED)。
  - [ ] SubTask 3.2: 实现 API 路由逻辑 (GREEN)。
  - [ ] SubTask 3.3: 重构 API 路由 (REFACTOR)。

- [ ] Task 4: 构建前端编辑上下文 (Edit Context)
  - [ ] SubTask 4.1: 创建全局的 `EditModeProvider`，包含进入/退出编辑模式的 Toggle UI。

- [ ] Task 5: 改造主页 (app/page.tsx) 实现内联编辑
  - [ ] SubTask 5.1: 创建可复用的 `EditableText` 和 `EditableImage` 组件。
  - [ ] SubTask 5.2: 提取当前主页的硬编码数据为 JSON 结构。
  - [ ] SubTask 5.3: 替换主页现有的文本和图片为 Editable 组件，并对接保存 API。

- [ ] Task 6: 改造项目页 (app/projects/[slug]/page.tsx) 实现 Markdown 编辑
  - [ ] SubTask 6.1: 引入 Markdown 编辑器及渲染组件 (例如 `react-markdown` 或其他轻量方案)。
  - [ ] SubTask 6.2: 替换项目正文区域，在编辑模式下显示编辑器，非编辑模式下渲染 Markdown，并对接保存 API。

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 5 and Task 6 depend on Task 3 and Task 4
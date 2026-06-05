# Thoughts 页面 TinaCMS 实时预览重构计划

## 1. 总结 (Summary)
当前 `app/thoughts/[slug]/page.tsx` 仍在使用硬编码的 Mock 数据 (`thoughtsData`) 渲染，这导致在 TinaCMS 的 `/admin` 面板中虽然可以进入 `/thoughts/[slug]` 路由进行预览，但页面无法显示真实的内容，并且不支持点击对应内容高亮编辑表单（Contextual Editing）的实时预览功能。本计划旨在将 Thoughts 页面重构为接入 TinaCMS GraphQL 客户端获取初始数据，并将渲染层拆分为客户端组件 (`use client`) 以支持 `useTina` 和 `tinaField` 绑定。

## 2. 现状分析 (Current State Analysis)
- **数据源**：`app/thoughts/[slug]/page.tsx` 中定义了静态的 `thoughtsData` 对象。
- **Tina Schema**：`tina/config.ts` 中已经定义了 `thought` Collection，并已包含 `title`, `date`, `type`, `readTime`, `body` (rich-text) 等字段，且 `ui.router` 已配置。
- **内容文件**：`content/thoughts` 目录下已存在相关的 Markdown 文件（如 `empty-space.md`, `engineering-precision.md`）。
- **组件架构**：目前 `page.tsx` 是一个 Server Component，它直接渲染了页面内容。

## 3. 改进方案 (Proposed Changes)

### 步骤 1：拆分并创建 Thoughts 页面的客户端组件
**新建文件**：`app/thoughts/[slug]/thought-page-client.tsx`
**具体修改**：
- 声明 `"use client";`。
- 引入必要的 UI 组件（如 `AnimatedSection`, `AnimatedItem`, `AnimatedGroup`）。
- 引入 `useTina`, `tinaField` 以及 `TinaMarkdown` (由于原本的内容是字符串数组，现在在 Tina 中是富文本，需要使用 `TinaMarkdown` 渲染)。
- 接收从服务端组件传来的 `query`, `variables`, `data`。
- 使用 `useTina` 钩子解析出实时的 `thought` 数据节点。
- 将原 `page.tsx` 中的 JSX 结构迁移过来，并为标题、日期、类型、阅读时间和正文绑定 `data-tina-field` 属性。
  *注意*：对于首字母下沉的样式，可以通过自定义 `TinaMarkdown` 的 `components` 属性来实现，或者简化处理，直接包裹在一个有样式的 `div` 中。

### 步骤 2：重构 Thoughts 页面的服务端组件
**修改文件**：`app/thoughts/[slug]/page.tsx`
**具体修改**：
- 移除硬编码的 `thoughtsData`。
- 导入生成的 GraphQL Client：`import client from "@/tina/__generated__/client";`。
- 导入新建的客户端组件：`import ThoughtPageClient from "./thought-page-client";`。
- 在 `ThoughtPage` 函数中，通过 `client.queries.thought({ relativePath: `${resolvedParams.slug}.md` })` 获取初始数据。
- 将获取到的数据传递给 `ThoughtPageClient`。

## 4. 假设与决策 (Assumptions & Decisions)
- **富文本渲染与首字母下沉**：原 Mock 数据中，正文是一个字符串数组，并且第一段有特定的首字母下沉样式。在迁移到 TinaCMS 后，正文变为了 `rich-text`。为保持样式，我计划在 `TinaMarkdown` 组件中自定义 `p` 标签的渲染逻辑，给第一个 `p` 标签加上对应的样式类名。

## 5. 验证步骤 (Verification Steps)
1. 运行 `npm run dev` 启动项目。
2. 访问 `http://localhost:3000/thoughts/empty-space`，确认页面正常渲染且样式符合预期。
3. 访问 `http://localhost:3000/admin`，进入 Thoughts 集合，打开 `empty-space` 文档。
4. 在右侧预览页面中检查内容是否显示，并点击标题或正文文本，观察左侧编辑器面板是否自动跳转高亮到对应的字段。
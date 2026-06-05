# TinaCMS 可视化编辑流修复计划

## 1. 总结 (Summary)
当前通过 `/admin` 进入 TinaCMS 后，无法正常使用可视化编辑流（Contextual Editing）。根据排查，本地的数据文件夹（`content/home`, `content/projects`, `content/thoughts`）已正确存在，问题的根因在于 `tina/config.ts` 中缺失了页面路由映射 (`ui.router`)，导致 CMS 侧边栏无法在预览 iframe 中打开正确的页面；同时，前端客户端组件中也缺失了 `data-tina-field` 属性，导致无法实现“点击页面元素自动高亮左侧表单”的互动体验。

## 2. 现状分析 (Current State Analysis)
- **文件夹排查**：已确认 `content/home` 目录包含 `home.json`，`content/projects` 和 `content/thoughts` 均包含有效的 Markdown 内容文件，因此排除文件夹不存在的问题。
- **Tina 配置排查**：在 `tina/config.ts` 的 collections 定义中，没有提供 `ui.router` 函数，因此系统不知道对应的文件修改后应在 iframe 中预览哪个 URL。
- **UI 绑定排查**：在 `app/home-page-client.tsx` 和 `app/projects/[slug]/project-page-client.tsx` 中，虽然成功通过 `useTina` 拿到了动态数据，但是没有使用 Tina 提供的 `tinaField` 工具函数为 DOM 元素注入 `data-tina-field` 属性。

## 3. 改进方案 (Proposed Changes)

### 步骤 1：配置 TinaCMS 的路由映射
**修改文件**：`tina/config.ts`
**具体修改**：
在各个 collection 中添加 `ui.router` 属性：
- **home** collection:
  ```typescript
  ui: {
    router: () => "/",
  }
  ```
- **project** collection:
  ```typescript
  ui: {
    router: ({ document }) => `/projects/${document._sys.filename}`,
  }
  ```
- **thought** collection:
  ```typescript
  ui: {
    router: ({ document }) => `/thoughts/${document._sys.filename}`,
  }
  ```

### 步骤 2：为前端页面增加可视化编辑属性 (Contextual Editing)
**修改文件**：`app/home-page-client.tsx` 和 `app/projects/[slug]/project-page-client.tsx`
**具体修改**：
1. **确认顶层指令**：这两个文件必须是客户端组件，确保文件顶部包含 `"use client";` 声明（目前已有，但需再次确认）。
2. **导入辅助函数**：导入 `tinaField` 辅助函数：`import { useTina, tinaField } from "tinacms/dist/react";`
3. **校准 tinaField 数据源**：确保传入的 `home` 或 `project` 对象是由 `useTina` 钩子解析后返回的精准数据节点（例如 `data.home` 或 `data.project`），而不是最外层的响应包裹体。
4. **为首页绑定属性**：为核心元素（如标题、简介、工作经历等）绑定 `data-tina-field`：
  ```jsx
  <h1 data-tina-field={tinaField(home?.intro, "title")} className="...">
    {home?.intro?.title}
  </h1>
  ```
5. **为项目详情页绑定属性**：为核心元素（如标题、副标题、正文等）绑定 `data-tina-field`：
  ```jsx
  <h1 data-tina-field={tinaField(project, "title")} className="...">
    {project.title}
  </h1>
  <div data-tina-field={tinaField(project, "body")}>
    <TinaMarkdown content={project.body} />
  </div>
  ```

## 4. 假设与决策 (Assumptions & Decisions)
- 假设用户期望的是完善的可视化编辑流体验，因此除了添加路由外，主动补充 `tinaField` 绑定是达到“真正进入可视化编辑流”体验的必要步骤。

## 5. 验证步骤 (Verification Steps)
1. 访问 `http://localhost:3000/admin`。
2. 从侧边栏进入 `Homepage` 集合并打开 `home` 文档，检查右侧的预览区是否成功渲染了首页 `/`。
3. 从侧边栏进入 `Projects` 集合并打开某个项目（如 `xiaoyuzhou`），检查预览区是否渲染了 `/projects/xiaoyuzhou`。
4. 在右侧预览页面中点击标题或正文文本，观察左侧编辑器面板是否自动跳转高亮到对应的字段。
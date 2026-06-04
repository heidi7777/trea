# 启用内容编辑功能 (Enable Content Editing) Spec

## Why
目前作品集的内容是硬编码在 React 组件中的。用户需要一种能够直接在页面上编辑文本、图片，并使用 Markdown 编辑项目详情正文的功能，以便于快速更新作品集而无需修改源代码。由于要求使用 TDD (测试驱动开发)，所有核心逻辑必须先编写测试。

## What Changes
- 引入本地基于文件的存储机制（主页内容存为 JSON，项目正文存为 Markdown）。
- 添加读取和保存这些本地文件的 API 路由。
- 在前端引入“编辑模式 (Edit Mode)”状态。
- 主页组件改造：在编辑模式下，文本变为可编辑的输入框/文本域，图片可修改链接或上传。
- 项目内容页改造：项目介绍下方的正文部分替换为 Markdown 编辑器，支持实时预览和保存。
- 引入 Jest 和 React Testing Library 以支持 TDD 流程。

## Impact
- Affected specs: 内容渲染、页面交互、API 路由
- Affected code: 
  - `app/page.tsx`
  - `app/projects/[slug]/page.tsx`
  - 新增 API 路由 `app/api/content/route.ts` 等
  - 新增工具类 `lib/content.ts`

## ADDED Requirements
### Requirement: 页面内联编辑 (Inline Editing)
系统应当允许用户在“编辑模式”下直接修改页面上的文本和图片，并保存到本地 JSON 文件中。
#### Scenario: 成功保存主页修改
- **WHEN** 用户处于编辑模式，修改了个人介绍文本或图片路径并点击保存
- **THEN** 系统调用 API 更新本地 JSON，并显示保存成功，刷新后内容保持最新。

### Requirement: Markdown 编辑 (Markdown Editing)
项目子页的正文部分必须支持 Markdown 格式的编辑和渲染。
#### Scenario: 成功保存项目正文
- **WHEN** 用户在项目页使用 Markdown 编辑器修改内容并点击保存
- **THEN** 系统调用 API 更新对应的 `.md` 文件，退出编辑模式后重新渲染最新的 Markdown 内容。

### Requirement: TDD 流程 (TDD Workflow)
所有数据读写和 API 路由的实现必须遵循测试驱动开发。
#### Scenario: 编写核心逻辑
- **WHEN** 开发者添加 `saveContent` 功能
- **THEN** 必须先编写一个失败的测试用例，然后编写最简代码使其通过，最后进行重构。
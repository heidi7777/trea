# TinaCMS 可视化编辑流修复计划

## 摘要

本计划旨在修复个人作品集站点中 TinaCMS 的 iframe 预览模式（可视化编辑流）。当前核心问题是 `tina/__generated__/` 目录缺失，导致 TinaCMS 的 GraphQL 客户端和类型定义无法加载，进而使 `/admin` 页面无法正常工作。此外，`thoughts/[slug]` 页面仍使用静态 mock 数据，未接入 TinaCMS 实时预览。

## 当前状态分析

### 已正确配置的部分

1. **tina/config.ts**: 已配置 `ui.router` 映射
   - `home` collection: `router: () => "/"`
   - `project` collection: `router: ({ document }) => "/projects/${document._sys.filename}"`
   - `thought` collection: `router: ({ document }) => "/thoughts/${document._sys.filename}"`

2. **edit-mode-toggle.tsx**: 点击后正确跳转到 `/admin`

3. **app/admin/[[...slug]]/page.tsx**: 已配置 TinaAdmin 和 TinaCloudProvider

4. **home-page-client.tsx**: 已使用 `useTina` 和 `tinaField`，正确绑定 `data-tina-field`

5. **project-page-client.tsx**: 已使用 `useTina` 和 `tinaField`，正确绑定 `data-tina-field`

### 存在的问题

1. **`tina/__generated__/` 目录缺失**
   - 现象: `tina/` 目录下只有 `config.ts` 和 `tina-lock.json`，没有 `__generated__/` 目录
   - 影响: `client.queries.home()`, `client.queries.project()`, `client.queries.thought()` 等方法无法使用，因为 GraphQL 客户端未生成
   - 根因: TinaCMS 的代码生成命令尚未运行

2. **`thoughts/[slug]/page.tsx` 未接入 TinaCMS**
   - 现象: 页面使用硬编码的 `thoughtsData` 对象，没有使用 `client.queries.thought()` 获取数据
   - 影响: Thought 页面无法在 `/admin` 中实现实时预览和可视化编辑
   - 需要: 像 `projects/[slug]/page.tsx` 一样，拆分为 Server Component 和 Client Component

3. **服务端数据获取层已废弃本地文件读取**
   - 状态: `app/api/content/route.ts` 和 `lib/content.ts` 已被删除
   - 现状: 数据获取完全依赖 TinaCMS GraphQL Client
   - 依赖: 必须先解决 `tina/__generated__/` 缺失问题，否则页面无法获取数据

## 提议的变更

### 任务 1: 运行 TinaCMS 代码生成命令

**目标**: 生成 `tina/__generated__/` 目录，包含 GraphQL 客户端和类型定义

**操作**:
1. 在终端运行: `npx tina dev`
2. 等待代码生成完成（会生成 `tina/__generated__/client.ts`, `types.ts` 等文件）
3. 验证 `tina/__generated__/` 目录已创建且包含文件

**验证**:
- 检查 `tina/__generated__/client.ts` 存在
- 检查 `tina/__generated__/types.ts` 包含 `HomeQuery`, `ProjectQuery`, `ThoughtQuery` 等类型

### 任务 2: 重构 thoughts/[slug]/page.tsx

**目标**: 将 Thought 页面接入 TinaCMS，支持实时预览和可视化编辑

**操作**:

**步骤 2.1: 创建客户端组件**
- 新建文件: `app/thoughts/[slug]/thought-page-client.tsx`
- 内容要求:
  - 添加 `'use client'` 指令
  - 导入 `useTina` 和 `tinaField` from `tinacms/dist/react`
  - 导入 `TinaMarkdown` from `tinacms/dist/rich-text`
  - 接收 `data`, `query`, `variables` props
  - 使用 `useTina` 代理数据
  - 在可编辑元素上添加 `data-tina-field={tinaField(thought, "fieldName")}`

**步骤 2.2: 重构服务端组件**
- 修改文件: `app/thoughts/[slug]/page.tsx`
- 内容要求:
  - 删除 `thoughtsData` mock 数据
  - 导入 `client` from `@/tina/__generated__/client`
  - 导入 `ThoughtPageClient` from `./thought-page-client`
  - 使用 `client.queries.thought({ relativePath: "${slug}.md" })` 获取数据
  - 返回 `<ThoughtPageClient {...res} />`

**参考实现**（基于 `projects/[slug]/page.tsx` 和 `project-page-client.tsx` 的模式）:

服务端组件 (`app/thoughts/[slug]/page.tsx`):
```typescript
import client from "@/tina/__generated__/client";
import ThoughtPageClient from "./thought-page-client";

export default async function ThoughtPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const res = await client.queries.thought({ relativePath: `${resolvedParams.slug}.md` });
  return <ThoughtPageClient {...res} />;
}
```

客户端组件 (`app/thoughts/[slug]/thought-page-client.tsx`):
```typescript
'use client';

import Link from "next/link";
import { AnimatedSection, AnimatedItem, AnimatedGroup } from "@/components/ui/animated-section";
import type { ThoughtQuery, ThoughtQueryVariables } from "@/tina/__generated__/types";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useTina, tinaField } from "tinacms/dist/react";

type ThoughtPageClientProps = {
  data: ThoughtQuery;
  query: string;
  variables: ThoughtQueryVariables;
};

export default function ThoughtPageClient(props: ThoughtPageClientProps) {
  const { data } = useTina<ThoughtQuery>({
    data: props.data,
    query: props.query,
    variables: props.variables,
  });
  const thought = data.thought;

  if (!thought) {
    return <div className="min-h-screen flex items-center justify-center font-te-40 text-4xl bg-graphite text-canvas">Thought Not Found</div>;
  }

  return (
    <div className="min-h-screen bg-graphite text-canvas font-te-20 selection:bg-accent selection:text-accent-foreground pb-32">
      {/* ... rest of the JSX with data-tina-field bindings ... */}
      <h1 data-tina-field={tinaField(thought, "title")} className="text-[50px] md:text-[80px] font-te-40 leading-[1.1] tracking-tight">{thought.title}</h1>
      <div data-tina-field={tinaField(thought, "body")}>
        <TinaMarkdown content={thought.body as any} />
      </div>
    </div>
  );
}
```

**验证**:
- Thought 页面从 TinaCMS 获取数据
- 在 `/admin` 中可以编辑 thought 内容并实时预览
- 点击 thought 字段时，侧边栏高亮对应表单

### 任务 3: 验证所有集合的路由映射

**目标**: 确保所有 collections 都有正确的 `ui.router` 映射

**操作**:
1. 检查 `tina/config.ts` 中的以下配置:
   - `home` collection: `router: () => "/"` ✓ (已配置)
   - `project` collection: `router: ({ document }) => "/projects/${document._sys.filename}"` ✓ (已配置)
   - `thought` collection: `router: ({ document }) => "/thoughts/${document._sys.filename}"` ✓ (已配置)

2. 确认 `content/` 目录结构正确:
   ```
   content/
   ├── home/
   │   └── home.json
   ├── projects/
   │   ├── design-system.md
   │   ├── tonghuashun.md
   │   └── xiaoyuzhou.md
   └── thoughts/
       ├── empty-space.md
       └── engineering-precision.md
   ```

**验证**:
- 所有集合都有 `ui.router` 配置
- 文件路径与 router 映射匹配

## 假设和决策

1. **TinaCMS CLI 版本**: 假设已安装的 `@tinacms/cli` 版本兼容当前配置
2. **Node.js 版本**: 假设 Node.js 版本支持 TinaCMS 的本地开发模式
3. **端口占用**: 假设端口 4001 (Tina GraphQL) 和 3000 (Next.js) 未被占用
4. **内容文件**: 假设 `content/` 目录中的文件格式正确，可以被 TinaCMS 解析
5. **iframe 预览**: 用户选择模式 A (iframe 预览模式)，这是 TinaCMS 的标准管理界面

## 验证步骤

### 步骤 1: 代码生成验证
- [ ] 运行 `npx tina dev` 成功
- [ ] `tina/__generated__/client.ts` 文件存在
- [ ] `tina/__generated__/types.ts` 文件包含 `HomeQuery`, `ProjectQuery`, `ThoughtQuery` 类型

### 步骤 2: 开发服务器验证
- [ ] 访问 `http://localhost:3000` 主页正常显示
- [ ] 访问 `http://localhost:3000/admin` 成功跳转到 TinaCMS 管理界面
- [ ] TinaCMS 侧边栏加载正常，显示 Home, Projects, Thoughts 三个集合

### 步骤 3: 主页可视化编辑验证
- [ ] 在 `/admin` 中点击 "Homepage" 集合
- [ ] 选择 home.json，进入编辑页面
- [ ] 右侧 iframe 预览区域显示主页内容
- [ ] 在左侧表单中修改 "Intro.title"，右侧预览实时更新
- [ ] 点击预览区域的标题，左侧表单自动滚动到对应字段并高亮

### 步骤 4: 项目页面可视化编辑验证
- [ ] 在 `/admin` 中点击 "Projects" 集合
- [ ] 选择任意项目（如 xiaoyuzhou.md），进入编辑页面
- [ ] 右侧 iframe 预览区域显示项目详情页
- [ ] 在左侧表单中修改 "Body" 内容，右侧预览实时更新
- [ ] 富文本内容正确渲染

### 步骤 5: Thought 页面可视化编辑验证
- [ ] 在 `/admin` 中点击 "Thoughts" 集合
- [ ] 选择任意 thought（如 empty-space.md），进入编辑页面
- [ ] 右侧 iframe 预览区域显示 thought 详情页
- [ ] 在左侧表单中修改 "Body" 内容，右侧预览实时更新
- [ ] 点击预览区域的标题，左侧表单自动滚动到对应字段并高亮

### 步骤 6: 导航验证
- [ ] 在主页点击 "EDIT" 按钮，正确跳转到 `/admin`
- [ ] 在 `/admin` 中编辑内容后点击 "Save"，内容正确保存到 Git
- [ ] 刷新页面后，修改的内容仍然显示

## 文件变更汇总

### 新增文件
- `app/thoughts/[slug]/thought-page-client.tsx` - Thought 页面客户端组件

### 修改文件
- `app/thoughts/[slug]/page.tsx` - 重构为 Server Component，接入 TinaCMS
- `tina/__generated__/` - 通过 `npx tina dev` 生成的目录和文件

### 不受影响但需验证的文件
- `app/page.tsx` - 主页服务端组件（已正确配置）
- `app/home-page-client.tsx` - 主页客户端组件（已正确配置）
- `app/projects/[slug]/page.tsx` - 项目页面服务端组件（已正确配置）
- `app/projects/[slug]/project-page-client.tsx` - 项目页面客户端组件（已正确配置）
- `tina/config.ts` - TinaCMS 配置（已正确配置）
- `app/admin/[[...slug]]/page.tsx` - TinaCMS 管理界面（已正确配置）
- `components/ui/edit-mode-toggle.tsx` - 编辑模式切换按钮（已正确配置）

## 风险与缓解措施

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| `npx tina dev` 生成失败 | 中 | 高 | 检查 Node.js 版本，确保 >=18；检查端口占用；查看错误日志 |
| `tina/__generated__/client.ts` 导入路径错误 | 低 | 高 | 确认生成后的文件路径与代码中的导入路径一致 |
| Thought 页面样式在 iframe 中显示异常 | 中 | 中 | 验证 `data-tina-field` 绑定正确，检查 CSS 是否在 iframe 中正确加载 |
| 实时预览不生效 | 中 | 高 | 确认 `useTina` 正确使用，检查 `data-tina-field` 绑定，查看浏览器控制台错误 |

## 实施计划概览

```
Phase 1: 代码生成
├── 运行 npx tina dev
├── 等待 tina/__generated__/ 目录生成
└── 验证 client.ts 和 types.ts 存在

Phase 2: Thought 页面重构
├── 创建 thought-page-client.tsx
│   ├── 添加 'use client'
│   ├── 导入 useTina, tinaField, TinaMarkdown
│   ├── 实现 ThoughtPageClient 组件
│   └── 添加 data-tina-field 绑定
├── 重构 page.tsx
│   ├── 删除 thoughtsData mock 数据
│   ├── 导入 client 和 ThoughtPageClient
│   ├── 使用 client.queries.thought() 获取数据
│   └── 返回 ThoughtPageClient 组件
└── 验证 Thought 页面正常工作

Phase 3: 集成验证
├── 启动开发服务器 (npm run dev)
├── 验证主页可视化编辑
├── 验证项目页面可视化编辑
├── 验证 Thought 页面可视化编辑
└── 验证导航和保存功能
```

## 结论

本计划通过生成 TinaCMS 代码和重构 Thought 页面，将使整个个人作品集站点支持 TinaCMS 的 iframe 预览模式（可视化编辑流）。实施后，用户可以在 `/admin` 中通过左侧表单编辑内容，右侧 iframe 实时预览页面效果，实现真正的可视化编辑体验。

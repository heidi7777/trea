# TinaCMS 迁移计划

## 概述
将现有基于 `fs/promises` 的本地文件读写方案全面替换为 TinaCMS，实现安全、自动化的 Git-backed 内容管理，支持页面内联编辑和 Markdown 实时预览。

## 当前状态分析

### 现有架构
- **数据层**: `lib/content.ts` 使用 `fs/promises` 直接读写 `source/` 和 `data/` 目录
- **API 层**: `app/api/content/route.ts` 提供无鉴权的 GET/POST 接口
- **前端编辑**: `EditableText.tsx` / `EditableImage.tsx` 组件通过 `fetch('/api/content')` 保存
- **编辑模式**: `EditModeContext` + `EditModeProvider` 管理编辑状态
- **页面数据**:
  - 首页 (`app/page.tsx`): Client Component，加载 JSON 数据
  - 项目详情 (`app/projects/[slug]/page.tsx`): Server Component，硬编码 Mock 数据
  - 文章详情 (`app/thoughts/[slug]/page.tsx`): Server Component，硬编码 Mock 数据

### 关键问题
1. `app/api/content/route.ts` 无鉴权，生产环境数据可被恶意篡改
2. `lib/content.ts` 直接操作文件系统，缺乏版本控制和冲突处理
3. 项目/文章详情页数据硬编码，无法编辑
4. 无 Markdown 渲染支持
5. Node.js 版本为 16.14.2，低于 TinaCMS 要求的 >=18

## 迁移阶段

### 阶段 1：环境初始化与冗余代码清理

#### 1.1 安装 TinaCMS
```bash
npm install tinacms @tinacms/cli
```

#### 1.2 初始化 TinaCMS
```bash
npx tinacms init
```
- 选择 Next.js
- public 目录保持默认
- 不覆盖现有 Layout/Page 文件

#### 1.3 删除危险文件
- `app/api/content/route.ts`
- `lib/content.ts`
- `__tests__/api/content.test.ts`
- `__tests__/content.test.ts`

#### 1.4 清理废弃组件（可选）
- `components/EditableText.tsx`
- `components/EditableImage.tsx`
- `contexts/EditModeContext.tsx`
- `providers/EditModeProvider.tsx`
- `components/ui/edit-mode-toggle.tsx`

### 阶段 2：定义 TinaCMS Schema

#### 2.1 创建 `tina/config.ts`

```typescript
import { defineConfig } from 'tinacms'

export default defineConfig({
  branch: process.env.VERCEL_GIT_COMMIT_REF || 'main',
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'home',
        label: 'Homepage',
        path: 'content/home',
        format: 'json',
        fields: [
          {
            type: 'object',
            name: 'intro',
            label: 'Intro',
            fields: [
              { type: 'string', name: 'title', label: 'Title', isBody: false },
              { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
              { type: 'string', name: 'avatarImage', label: 'Avatar Image' },
              { type: 'string', name: 'version', label: 'Version' },
              { type: 'string', name: 'updatedYear', label: 'Updated Year' },
            ],
          },
          {
            type: 'object',
            name: 'experience',
            label: 'Experience',
            list: true,
            fields: [
              { type: 'string', name: 'id', label: 'ID' },
              { type: 'string', name: 'period', label: 'Period' },
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'company', label: 'Company' },
              { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'projects',
            label: 'Projects',
            list: true,
            fields: [
              { type: 'string', name: 'id', label: 'ID' },
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'number', label: 'Number' },
              { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
              { type: 'string', name: 'tags', label: 'Tags', list: true },
            ],
          },
        ],
      },
      {
        name: 'project',
        label: 'Projects',
        path: 'content/projects',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
          { type: 'string', name: 'subtitle', label: 'Subtitle' },
          { type: 'string', name: 'role', label: 'Role' },
          { type: 'string', name: 'team', label: 'Team' },
          { type: 'string', name: 'tools', label: 'Tools' },
          { type: 'string', name: 'timeline', label: 'Timeline' },
          { type: 'string', name: 'heroImage', label: 'Hero Image' },
          { type: 'string', name: 'tags', label: 'Tags', list: true },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
      {
        name: 'thought',
        label: 'Thoughts',
        path: 'content/thoughts',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
          { type: 'datetime', name: 'date', label: 'Date' },
          { type: 'string', name: 'type', label: 'Type' },
          { type: 'string', name: 'readTime', label: 'Read Time' },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
    ],
  },
})
```

#### 2.2 迁移现有数据
将现有数据从 `source/` 迁移到 `content/` 目录：
- `source/home/home-content.json` → `content/home/home.json`
- 为每个项目创建 `content/projects/{slug}.md`
- 为每篇文章创建 `content/thoughts/{slug}.md`

### 阶段 3：重构服务端数据获取层

#### 3.1 生成 Tina Client
```bash
npx tinacms dev
# 或
npx tinacms build
```

#### 3.2 重构首页 (`app/page.tsx`)
```typescript
import { client } from '@/tina/__generated__/client'

export default async function PortfolioPage() {
  const { data } = await client.queries.home({ relativePath: 'home.json' })
  const home = data.home

  return (
    <div>
      <h1>{home.intro.title}</h1>
      <p>{home.intro.description}</p>
      {/* ... */}
    </div>
  )
}
```

#### 3.3 重构项目详情页 (`app/projects/[slug]/page.tsx`)
```typescript
import { client } from '@/tina/__generated__/client'
import { TinaMarkdown } from 'tinacms/dist/rich-text'

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data } = await client.queries.project({ relativePath: `${slug}.md` })
  const project = data.project

  return (
    <div>
      <h1>{project.title}</h1>
      <TinaMarkdown content={project.body} />
    </div>
  )
}
```

#### 3.4 重构文章详情页 (`app/thoughts/[slug]/page.tsx`)
类似项目详情页，使用 `thought` collection。

### 阶段 4：前端 Client 组件接入实时预览

#### 4.1 创建 Tina Preview Wrapper
```typescript
'use client'

import { useTina } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'

export function ProjectPreview({ query, variables, data: initialData }) {
  const { data } = useTina({ query, variables, data: initialData })

  return (
    <div>
      <h1>{data.project.title}</h1>
      <TinaMarkdown content={data.project.body} />
    </div>
  )
}
```

#### 4.2 修改页面传递 query/variables/data
```typescript
import { client } from '@/tina/__generated__/client'
import { ProjectPreview } from '@/components/ProjectPreview'

export default async function ProjectPage({ params }) {
  const { slug } = await params
  const result = await client.queries.project({ relativePath: `${slug}.md` })

  return (
    <ProjectPreview
      query={result.query}
      variables={result.variables}
      data={result.data}
    />
  )
}
```

#### 4.3 配置 `/admin` 路由
TinaCMS 会自动生成 `public/admin/index.html`，通过 `/_next/static/tina/` 访问。

### 环境变量配置
```env
TINA_CLIENT_ID=your-client-id
TINA_TOKEN=your-token
VERCEL_GIT_COMMIT_REF=main
```

### 注意事项
1. **Node.js 版本**: 当前环境为 Node.js 16.14.2，TinaCMS 要求 >=18。需要升级 Node.js 或使用 nvm 切换版本。
2. **Git 集成**: TinaCMS 需要 Git 仓库来追踪内容变更。确保项目已初始化 Git。
3. **媒体上传**: 配置 `media.tina` 后，图片上传会自动保存到 `public/uploads/`。
4. **构建流程**: 需要在构建前运行 `npx tinacms build` 生成 GraphQL 客户端。

# 任务目标：基于已初始化的 Next.js + Shadcn UI 项目，搭建个人作品集首页 (app/page.tsx)。

## 关键背景信息
你正在 `my-portfolio-code/huijing` 这个 Next.js 工程目录下工作。
我已经为你提供了定制的 `style` 文件夹（包含设计变量规范），并且已经运行了 `npx shadcn@latest add button card badge`，在 `components/ui` 目录下生成了所需的基础组件。

## 核心执行步骤与强制规则

### Step 1: 挂载全局样式
在写任何页面结构之前，请确保你已经读取了 `style` 文件夹下的设计规范（例如 `DESIGN.md`，或者 CSS 变量文件）。
- 你必须将 `app/globals.css` 中的 `:root` 变量，替换为 `style` 文件夹中定义的主题颜色和排版规则。
- 确保 `tailwind.config.ts` 中的 `theme.extend` 配置（如 colors, fontFamily）与我提供的样式规范精准映射。

### Step 2: 页面模块规划
页面必须分为以下四个连续的 Section（自上而下），同时tab可以进行快速定位：
1. **个人介绍**：极简布局，用于展示个人照片以及简短介绍。有一处按钮可以一键获得简历。
2. **过往履历**：包括实习和校园履历两个部分。时间轴呈现。
3. **核心项目**：3-4个过往实习项目。
4. **浴室沉思**：放置1-2个个人思考。
5. **联系方式**：极简底部通栏布局。邮箱、微信二维码，以及指向外部的链接（小红书）。
> **硬性原则：每个 section 布局必须不同。** 不要使用单一的居中列表一到底。

### Step 3: 选组件填充 (禁止默认样式)
在搭建上述 Section 时，**禁止使用任何 HTML 的默认样式**（如默认的 `<blockquote>`, 无样式的 `<ul>/<ol>`, 默认 `border` 等）。
你必须严格从 `components/ui` 目录中导入并使用 Shadcn 组件：
- 使用 `<Button>` 实现下载简历和外链跳转的交互。
- 使用 `<Card>`, `<CardHeader>`, `<CardContent>` 等封装作品集项目（如“小宇宙”、“同花顺”案例）。
- 使用 `<Badge>` 展示诸如“设计心理学”、“全栈独立开发”等核心技能点。
- *如果某个区域实在没有现成组件，你必须使用 Tailwind 自行手写，但必须符合 `style` 中的 `brand-dna` 规范（使用系统变量色值）。*

### Step 4: 自检与交付
完成代码编写后，请自检：
1. 页面是否在终端无报错启动？
2. 每一个区块（Section）是否都使用了不同的布局排版手法？
3. 颜色和阴影是否都是调用的 Tailwind 变量（如 `bg-primary`, `text-muted-foreground`），而非写死的 `#Hex` 值？

**请输出完整的 `app/page.tsx` 代码，以及你在 `app/globals.css` 中需要修改的配置代码。**
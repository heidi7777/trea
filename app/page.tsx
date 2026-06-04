import Image from "next/image"
import Link from "next/link"
import { LocalContentEditor } from "@/components/content/local-content-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AnimatedSection,
  AnimatedGroup,
  AnimatedItem,
} from "@/components/ui/animated-section"
import { getHomeContent } from "@/lib/content"

const navAnchors: Record<string, string> = {
  intro: "#intro",
  experience: "#experience",
  projects: "#projects",
  thoughts: "#thoughts",
  contact: "#contact",
}

export default async function PortfolioPage() {
  const home = await getHomeContent()

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-te-20 text-foreground selection:bg-accent selection:text-accent-foreground">
      {/* 蓝图网格背景 - 仅用于顶部区域增强工程感 */}
      <div
        className="pointer-events-none absolute inset-0 z-0 h-[100vh]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-smoke) 1px, transparent 1px), linear-gradient(to bottom, var(--color-smoke) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.15,
          maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
        }}
      ></div>

      {/* 带有毛玻璃效果的吸顶导航栏 */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
        <div className="container mx-auto flex h-16 items-center justify-between px-6 md:justify-center md:gap-8">
          <div className="text-[13px] font-bold tracking-widest uppercase md:hidden">
            {home.mobileSystemLabel}
          </div>
          <div className="hidden items-center gap-8 md:flex">
            {home.nav.map((label) => (
              <a
                key={label}
                href={
                  navAnchors[label.toLowerCase()] ?? `#${label.toLowerCase()}`
                }
                className="text-[13px] tracking-widest text-foreground uppercase transition-colors hover:text-accent"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pb-24">
        {/* Section 1: 个人介绍 (#intro) - 工程感排版布局 */}
        <AnimatedSection
          id="intro"
          className="relative flex min-h-[85vh] scroll-mt-16 items-center pt-16"
        >
          {/* 四角的十字准星装饰 */}
          <div className="absolute top-10 left-0 h-4 w-4 border-t border-l border-foreground opacity-30"></div>
          <div className="absolute top-10 right-0 h-4 w-4 border-t border-r border-foreground opacity-30"></div>
          <div className="absolute bottom-10 left-0 h-4 w-4 border-b border-l border-foreground opacity-30"></div>
          <div className="absolute right-0 bottom-10 h-4 w-4 border-r border-b border-foreground opacity-30"></div>

          <div className="grid w-full grid-cols-1 gap-[66px] lg:grid-cols-[1.2fr_1fr]">
            <div className="relative flex flex-col justify-center">
              {/* 顶部技术元数据 */}
              <div className="mb-[33px] flex items-center gap-4 font-mono text-[13px] tracking-widest text-muted-foreground uppercase">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent"></span>
                  {home.hero.status}
                </span>
                <span className="hidden sm:inline">|</span>
                <span className="hidden sm:inline">{home.hero.latitude}</span>
                <span className="hidden sm:inline">|</span>
                <span className="hidden sm:inline">{home.hero.longitude}</span>
              </div>

              <h1 className="mb-[33px] font-te-40 text-[50px] leading-[0.9] tracking-tight md:text-[80px] lg:text-[100px]">
                {home.hero.headline.map((line, index) => (
                  <span
                    key={`${line}-${index}`}
                    className={
                      index === 1 ? "block text-muted-foreground" : "block"
                    }
                  >
                    {line}
                  </span>
                ))}
              </h1>

              <p className="mb-[33px] max-w-lg text-[19px] leading-snug text-foreground md:text-[24px]">
                {home.hero.intro}
              </p>

              <div className="flex items-center gap-[22px]">
                <Button className="rounded-none bg-accent px-8 py-6 text-[13px] tracking-wider text-accent-foreground uppercase transition-transform hover:-translate-y-1 hover:bg-accent/90">
                  {home.hero.ctaLabel}
                </Button>
                <div className="flex flex-col text-[13px] tracking-widest text-muted-foreground uppercase">
                  <span>{home.hero.version}</span>
                  <span>{home.hero.updated}</span>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center lg:justify-end">
              {/* 头像容器 - 工业风包裹 */}
              <div className="group relative aspect-[3/4] w-full max-w-[450px] border border-border bg-muted p-4">
                <div className="absolute top-2 left-2 font-mono text-[10px] text-muted-foreground">
                  FIG-01
                </div>
                <div className="absolute right-2 bottom-2 font-mono text-[10px] text-muted-foreground">
                  100% SCALE
                </div>

                <div className="relative h-full w-full overflow-hidden border border-border">
                  <Image
                    src={home.hero.avatarImage}
                    alt={home.hero.avatarAlt}
                    fill
                    className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    priority
                  />
                  {/* 扫描线效果 */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,113,187,0.1)_50%,transparent_100%)] bg-[length:100%_4px] opacity-0 mix-blend-overlay transition-opacity group-hover:opacity-100"></div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Section 2: 过往履历 (#experience) - 时间轴布局 */}
        <AnimatedSection id="experience" className="scroll-mt-16 pt-32">
          <h2 className="mb-[66px] flex items-center gap-4 font-te-40 text-[40px] md:text-[60px]">
            <span className="hidden h-[1px] w-12 bg-foreground md:block"></span>
            {home.experienceTitle}
          </h2>
          <AnimatedGroup className="ml-[11px] max-w-3xl space-y-[66px] border-l border-border">
            {home.experiences.map((item) => (
              <AnimatedItem
                key={`${item.period}-${item.title}`}
                className="group relative pl-[33px]"
              >
                <div className="absolute top-[8px] left-[-5px] h-[9px] w-[9px] border border-border bg-background transition-colors group-hover:border-accent group-hover:bg-accent"></div>
                <div className="grid grid-cols-1 gap-[22px] md:grid-cols-[160px_1fr]">
                  <div className="pt-1 font-mono text-[13px] tracking-widest text-muted-foreground uppercase">
                    {item.period}
                  </div>
                  <div>
                    <h3 className="mb-2 font-te-40 text-[26px] text-foreground transition-colors group-hover:text-accent">
                      {item.title}
                    </h3>
                    <div className="mb-4 flex items-center gap-2 text-[13px] tracking-widest text-muted-foreground uppercase">
                      <span className="inline-block h-2 w-2 rounded-full bg-steel"></span>
                      {item.organization}
                    </div>
                    <p className="text-[19px] leading-relaxed text-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </AnimatedItem>
            ))}
          </AnimatedGroup>
        </AnimatedSection>

        {/* Section 3: 核心项目 (#projects) - 网格交替卡片布局 */}
        <AnimatedSection id="projects" className="scroll-mt-16 pt-32">
          <div className="mb-[66px] flex items-end justify-between">
            <h2 className="flex items-center gap-4 font-te-40 text-[40px] md:text-[60px]">
              <span className="hidden h-[1px] w-12 bg-foreground md:block"></span>
              {home.projectsTitle}
            </h2>
            <div className="hidden pb-3 text-[13px] tracking-widest text-muted-foreground uppercase md:block">
              {home.projectsKicker}
            </div>
          </div>

          <AnimatedGroup className="grid grid-cols-1 gap-[22px] md:grid-cols-2">
            {home.projects.map((project) => (
              <AnimatedItem
                key={project.slug}
                className={project.wide ? "md:col-span-2" : undefined}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block h-full"
                >
                  <Card
                    className={
                      project.wide
                        ? "grid grid-cols-1 rounded-none border-border bg-background shadow-none transition-colors duration-300 hover:border-foreground md:grid-cols-2"
                        : "flex h-full flex-col rounded-none border-border bg-background shadow-none transition-colors duration-300 hover:border-foreground"
                    }
                  >
                    <div
                      className={
                        project.wide
                          ? "relative aspect-[16/9] overflow-hidden border-b border-border bg-muted md:aspect-auto md:border-r md:border-b-0"
                          : "relative aspect-[4/3] overflow-hidden border-b border-border bg-muted"
                      }
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-[13px] tracking-widest text-muted-foreground uppercase transition-transform duration-700 group-hover:scale-105">
                        {project.previewLabel}
                      </div>
                      <div className="absolute inset-0 bg-accent/0 transition-colors duration-300 group-hover:bg-accent/5"></div>
                    </div>
                    <div
                      className={
                        project.wide
                          ? "flex flex-col justify-center"
                          : undefined
                      }
                    >
                      <CardHeader
                        className={project.wide ? "p-[33px]" : "p-[22px]"}
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <CardTitle
                            className={
                              project.wide
                                ? "font-te-40 text-[32px] text-foreground transition-colors group-hover:text-accent"
                                : "font-te-40 text-[26px] text-foreground transition-colors group-hover:text-accent"
                            }
                          >
                            {project.title}
                          </CardTitle>
                          <span className="font-mono text-[13px] text-muted-foreground">
                            {project.index}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="rounded-none border-border bg-background font-te-20 text-[13px] font-normal text-foreground"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent
                        className={
                          project.wide ? "p-[33px] pt-0" : "grow p-[22px] pt-0"
                        }
                      >
                        <p className="text-[19px] leading-relaxed text-muted-foreground">
                          {project.description}
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </AnimatedItem>
            ))}
          </AnimatedGroup>
        </AnimatedSection>

        {/* Section 4: 浴室沉思 (#thoughts) - 便当盒 (Bento Box) 布局 */}
        <AnimatedSection id="thoughts" className="scroll-mt-16 pt-32">
          <h2 className="mb-[66px] flex items-center gap-4 font-te-40 text-[40px] md:text-[60px]">
            <span className="hidden h-[1px] w-12 bg-foreground md:block"></span>
            {home.thoughtsTitle}
          </h2>
          <AnimatedGroup className="grid grid-cols-1 gap-[15px] md:grid-cols-3">
            {home.thoughts.map((thought, index) => (
              <AnimatedItem
                key={thought.slug}
                className={thought.featured ? "md:col-span-2" : undefined}
              >
                <Link
                  href={`/thoughts/${thought.slug}`}
                  className="group block h-full"
                >
                  <Card
                    className={
                      thought.featured
                        ? "relative h-full overflow-hidden rounded-none border-none bg-graphite text-canvas shadow-none transition-transform duration-500 hover:-translate-y-1"
                        : "flex h-full flex-col justify-between rounded-none border-border bg-muted shadow-none transition-colors duration-300 hover:bg-steel/30"
                    }
                  >
                    {thought.featured && (
                      <div className="absolute -right-20 -bottom-20 font-te-40 text-[200px] text-steel opacity-5 transition-transform duration-1000 select-none group-hover:scale-110">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    )}
                    <CardHeader
                      className={thought.featured ? "p-[44px]" : "p-[33px]"}
                    >
                      <div className="mb-6 flex items-center justify-between">
                        <div
                          className={
                            thought.featured
                              ? "flex items-center gap-2 text-[13px] tracking-widest text-steel uppercase"
                              : "text-[13px] tracking-widest text-muted-foreground uppercase"
                          }
                        >
                          {thought.featured && (
                            <span className="inline-block h-2 w-2 rounded-full bg-accent"></span>
                          )}
                          {thought.type}
                        </div>
                        <div
                          className={
                            thought.featured
                              ? "font-mono text-[13px] text-steel"
                              : "font-mono text-[13px] text-muted-foreground"
                          }
                        >
                          {thought.date}
                        </div>
                      </div>
                      <CardTitle
                        className={
                          thought.featured
                            ? "font-te-40 text-[40px] leading-tight text-canvas transition-colors group-hover:text-accent md:text-[50px]"
                            : "font-te-40 text-[32px] text-foreground transition-colors group-hover:text-accent"
                        }
                      >
                        {thought.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent
                      className={
                        thought.featured ? "p-[44px] pt-0" : "p-[33px] pt-0"
                      }
                    >
                      <p
                        className={
                          thought.featured
                            ? "max-w-xl text-[19px] leading-relaxed text-steel md:text-[24px]"
                            : "text-[19px] leading-relaxed text-muted-foreground"
                        }
                      >
                        {thought.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedItem>
            ))}
          </AnimatedGroup>
        </AnimatedSection>
      </main>

      {/* Section 5: 联系方式 (#contact) - 极简底部通栏布局 */}
      <footer
        id="contact"
        className="relative mt-32 scroll-mt-16 overflow-hidden border-t-[4px] border-accent bg-graphite pt-[88px] pb-[44px] text-canvas"
      >
        {/* Subtle grid on footer */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(to right, var(--color-ink) 1px, transparent 1px), linear-gradient(to bottom, var(--color-ink) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            opacity: 0.2,
          }}
        ></div>

        <div className="relative z-10 container mx-auto grid grid-cols-1 gap-[66px] px-6 md:grid-cols-2">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h2 className="mb-[22px] font-te-40 text-[50px] leading-none text-canvas md:text-[80px]">
                {home.contact.title}
              </h2>
              <p className="max-w-md text-[19px] text-steel">
                {home.contact.description}
              </p>

              <div className="mt-[44px] flex flex-wrap gap-[33px]">
                {home.contact.links.map((link) => (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http") ? "noreferrer" : undefined
                    }
                    className="group flex items-center gap-2 text-[13px] tracking-widest text-steel uppercase transition-colors hover:text-accent"
                  >
                    <span className="h-1 w-1 bg-steel transition-colors group-hover:bg-accent"></span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-[88px] flex w-full items-center justify-between text-[13px] text-smoke">
              <span>
                © {new Date().getFullYear()} {home.contact.copyright}
              </span>
              <span className="font-mono">SYS.END</span>
            </div>
          </div>

          <div className="flex items-center md:justify-end">
            <div className="group relative border border-smoke bg-graphite p-6">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-steel"></div>
              <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-steel"></div>
              <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-steel"></div>
              <div className="absolute right-0 bottom-0 h-2 w-2 border-r border-b border-steel"></div>

              <div className="relative h-[150px] w-[150px] bg-canvas p-2 transition-transform duration-500 group-hover:scale-105">
                <Image
                  src={home.contact.qrImage}
                  alt={home.contact.qrAlt}
                  fill
                  className="object-contain p-2 mix-blend-multiply"
                />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-center text-[13px] tracking-widest text-steel uppercase">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"></span>
                {home.contact.qrCaption}
              </div>
            </div>
          </div>
        </div>
      </footer>

      <LocalContentEditor kind="home" id="home" initialContent={home} />
    </div>
  )
}

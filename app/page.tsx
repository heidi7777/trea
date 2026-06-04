'use client';

import { useEffect, useState } from 'react';
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection, AnimatedGroup, AnimatedItem } from "@/components/ui/animated-section"
import { EditableText } from "@/components/EditableText"
import { EditableImage } from "@/components/EditableImage"

interface HomeContent {
  intro: {
    title: string;
    description: string;
    avatarImage: string;
    version: string;
    updatedYear: string;
  };
  experience: Array<{
    id: string;
    period: string;
    title: string;
    company: string;
    description: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    number: string;
    description: string;
    tags: string[];
  }>;
}

export default function PortfolioPage() {
  // 提供默认数据
  const defaultContent: HomeContent = {
    intro: {
      title: "DESIGNER\n&\nDEVELOPER",
      description: "I build minimalist, functional interfaces bridging the gap between rigorous design and robust engineering.",
      avatarImage: "/avatar.jpg",
      version: "Version 2.4.1",
      updatedYear: "Updated 2024"
    },
    experience: [
      {
        id: "frontend-intern",
        period: "2024 — Present",
        title: "Frontend Intern",
        company: "Tech Corp · Internship",
        description: "Developed core UI components and improved performance for the main dashboard application. Implemented strict design system guidelines."
      },
      {
        id: "uxui-intern",
        period: "2023 — 2024",
        title: "UI/UX Intern",
        company: "Design Studio · Internship",
        description: "Assisted in creating design systems and prototyping interactions for client projects. Conducted user research and usability testing."
      },
      {
        id: "computer-science",
        period: "2021 — 2025",
        title: "Computer Science",
        company: "University",
        description: "Studying Computer Science with focus on human-computer interaction and systems design."
      }
    ],
    projects: [
      {
        id: "xiaoyuzhou",
        title: "Xiaoyuzhou",
        number: "01",
        description: "A complete conceptual redesign of the podcast player focusing on minimalist interactions.",
        tags: ["UX Research", "Figma"]
      },
      {
        id: "tonghuashun",
        title: "Tonghuashun",
        number: "02",
        description: "Financial data visualization dashboard for retail investors.",
        tags: ["React", "Data Viz"]
      },
      {
        id: "design-system",
        title: "Personal Design System",
        number: "03",
        description: "A strictly defined design system modeled after teenage engineering's aesthetic. Features custom typography scales, rigid spacing variables, and high-contrast components.",
        tags: ["Design System", "Tailwind CSS"]
      }
    ]
  };

  const [content, setContent] = useState<HomeContent>(defaultContent);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content?type=home&id=home-content');
        if (response.ok) {
          const data = await response.json();
          // 深度合并：用返回的数据覆盖默认值，确保不缺失字段
          setContent(prev => ({
            intro: { ...prev.intro, ...(data.intro || {}) },
            experience: Array.isArray(data.experience) ? data.experience : prev.experience,
            projects: Array.isArray(data.projects) ? data.projects : prev.projects,
          }));
        }
      } catch (error) {
        console.error('Failed to load content:', error);
      }
    };

    loadContent();
  }, []);

  const displayContent = content;

  return (
    <div className="min-h-screen bg-background text-foreground font-te-20 selection:bg-accent selection:text-accent-foreground overflow-x-hidden">
      
      {/* 蓝图网格背景 - 仅用于顶部区域增强工程感 */}
      <div className="absolute inset-0 h-[100vh] pointer-events-none z-0" 
           style={{ 
             backgroundImage: `linear-gradient(to right, var(--color-smoke) 1px, transparent 1px), linear-gradient(to bottom, var(--color-smoke) 1px, transparent 1px)`,
             backgroundSize: '40px 40px',
             opacity: 0.15,
             maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
           }}>
      </div>

      {/* 带有毛玻璃效果的吸顶导航栏 */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border transition-colors duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between md:justify-center md:gap-8">
          <div className="md:hidden text-[13px] uppercase tracking-widest font-bold">SYS.OP</div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#intro" className="text-[13px] text-foreground hover:text-accent transition-colors uppercase tracking-widest">Intro</a>
            <a href="#experience" className="text-[13px] text-foreground hover:text-accent transition-colors uppercase tracking-widest">Experience</a>
            <a href="#projects" className="text-[13px] text-foreground hover:text-accent transition-colors uppercase tracking-widest">Projects</a>
            <a href="#thoughts" className="text-[13px] text-foreground hover:text-accent transition-colors uppercase tracking-widest">Thoughts</a>
            <a href="#contact" className="text-[13px] text-foreground hover:text-accent transition-colors uppercase tracking-widest">Contact</a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pb-24 relative z-10">
        
        {/* Section 1: 个人介绍 (#intro) - 工程感排版布局 */}
        <AnimatedSection id="intro" className="min-h-[85vh] flex items-center pt-16 scroll-mt-16 relative">
          {/* 四角的十字准星装饰 */}
          <div className="absolute top-10 left-0 w-4 h-4 border-t border-l border-foreground opacity-30"></div>
          <div className="absolute top-10 right-0 w-4 h-4 border-t border-r border-foreground opacity-30"></div>
          <div className="absolute bottom-10 left-0 w-4 h-4 border-b border-l border-foreground opacity-30"></div>
          <div className="absolute bottom-10 right-0 w-4 h-4 border-b border-r border-foreground opacity-30"></div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-[66px] w-full">
            <div className="flex flex-col justify-center relative">
              {/* 顶部技术元数据 */}
              <div className="flex items-center gap-4 mb-[33px] text-[13px] text-muted-foreground uppercase tracking-widest font-mono">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                  SYS_ONLINE
                </span>
                <span className="hidden sm:inline">|</span>
                <span className="hidden sm:inline">LAT: 31.2304 N</span>
                <span className="hidden sm:inline">|</span>
                <span className="hidden sm:inline">LON: 121.4737 E</span>
              </div>
              
              <h1 className="text-[50px] md:text-[80px] lg:text-[100px] font-te-40 leading-[0.9] tracking-tight mb-[33px] whitespace-pre-wrap">
                <EditableText
                  value={displayContent?.intro?.title || defaultContent.intro.title}
                  dataType="home"
                  dataId="home-content"
                  fieldPath="intro.title"
                  isMultiline={true}
                  className="block"
                />
              </h1>

              <p className="text-[19px] md:text-[24px] text-foreground max-w-lg leading-snug mb-[33px]">
                <EditableText
                  value={displayContent?.intro?.description || defaultContent.intro.description}
                  dataType="home"
                  dataId="home-content"
                  fieldPath="intro.description"
                  className=""
                />
              </p>

              <div className="flex items-center gap-[22px]">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-none text-[13px] px-8 py-6 uppercase tracking-wider transition-transform hover:-translate-y-1">
                  Download Resume
                </Button>
                <div className="text-[13px] text-muted-foreground uppercase tracking-widest flex flex-col">
                  <span>
                    <EditableText
                      value={displayContent?.intro?.version || defaultContent.intro.version}
                      dataType="home"
                      dataId="home-content"
                      fieldPath="intro.version"
                      className="text-muted-foreground"
                    />
                  </span>
                  <span>
                    <EditableText
                      value={displayContent?.intro?.updatedYear || defaultContent.intro.updatedYear}
                      dataType="home"
                      dataId="home-content"
                      fieldPath="intro.updatedYear"
                      className="text-muted-foreground"
                    />
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end items-center relative">
              {/* 头像容器 - 工业风包裹 */}
              <div className="relative w-full max-w-[450px] aspect-[3/4] bg-muted border border-border p-4 group">
                <div className="absolute top-2 left-2 text-[10px] text-muted-foreground font-mono">FIG-01</div>
                <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground font-mono">100% SCALE</div>

                <div className="relative w-full h-full overflow-hidden border border-border">
                  <EditableImage
                    src={displayContent?.intro?.avatarImage || defaultContent.intro.avatarImage}
                    alt="Avatar"
                    dataType="home"
                    dataId="home-content"
                    fieldPath="intro.avatarImage"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 450px"
                    priority
                  />
                  {/* 扫描线效果 */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,113,187,0.1)_50%,transparent_100%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay"></div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Section 2: 过往履历 (#experience) - 时间轴布局 */}
        <AnimatedSection id="experience" className="pt-32 scroll-mt-16">
          <h2 className="text-[40px] md:text-[60px] font-te-40 mb-[66px] flex items-center gap-4">
            <span className="w-12 h-[1px] bg-foreground hidden md:block"></span>
            Experience
          </h2>
          <AnimatedGroup className="max-w-3xl border-l border-border ml-[11px] space-y-[66px]">
            {/* 实习履历 1 */}
            <AnimatedItem className="relative pl-[33px] group">
              <div className="absolute w-[9px] h-[9px] bg-background border border-border left-[-5px] top-[8px] group-hover:bg-accent group-hover:border-accent transition-colors"></div>
              <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-[22px]">
                <div className="text-[13px] text-muted-foreground pt-1 uppercase tracking-widest font-mono">2024 — Present</div>
                <div>
                  <h3 className="text-[26px] font-te-40 mb-2 text-foreground group-hover:text-accent transition-colors">Frontend Intern</h3>
                  <div className="text-[13px] mb-4 text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-steel rounded-full inline-block"></span>
                    Tech Corp · Internship
                  </div>
                  <p className="text-[19px] text-foreground leading-relaxed">Developed core UI components and improved performance for the main dashboard application. Implemented strict design system guidelines.</p>
                </div>
              </div>
            </AnimatedItem>
            
            {/* 实习履历 2 */}
            <AnimatedItem className="relative pl-[33px] group">
              <div className="absolute w-[9px] h-[9px] bg-background border border-border left-[-5px] top-[8px] group-hover:bg-accent group-hover:border-accent transition-colors"></div>
              <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-[22px]">
                <div className="text-[13px] text-muted-foreground pt-1 uppercase tracking-widest font-mono">2023 — 2024</div>
                <div>
                  <h3 className="text-[26px] font-te-40 mb-2 text-foreground group-hover:text-accent transition-colors">UI/UX Intern</h3>
                  <div className="text-[13px] mb-4 text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-steel rounded-full inline-block"></span>
                    Design Studio · Internship
                  </div>
                  <p className="text-[19px] text-foreground leading-relaxed">Assisted in creating design systems and prototyping interactions for client projects. Conducted user research and usability testing.</p>
                </div>
              </div>
            </AnimatedItem>

            {/* 校园履历 */}
            <AnimatedItem className="relative pl-[33px] group">
              <div className="absolute w-[9px] h-[9px] bg-background border border-border left-[-5px] top-[8px] group-hover:bg-accent group-hover:border-accent transition-colors"></div>
              <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-[22px]">
                <div className="text-[13px] text-muted-foreground pt-1 uppercase tracking-widest font-mono">2021 — 2025</div>
                <div>
                  <h3 className="text-[26px] font-te-40 mb-2 text-foreground group-hover:text-accent transition-colors">Computer Science</h3>
                  <div className="text-[13px] mb-4 text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-steel rounded-full inline-block"></span>
                    University Name · Campus
                  </div>
                  <p className="text-[19px] text-foreground leading-relaxed">Focus on human-computer interaction and software engineering. Led the university tech club and organized multiple hackathons.</p>
                </div>
              </div>
            </AnimatedItem>
          </AnimatedGroup>
        </AnimatedSection>

        {/* Section 3: 核心项目 (#projects) - 网格交替卡片布局 */}
        <AnimatedSection id="projects" className="pt-32 scroll-mt-16">
          <div className="flex justify-between items-end mb-[66px]">
            <h2 className="text-[40px] md:text-[60px] font-te-40 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-foreground hidden md:block"></span>
              Projects
            </h2>
            <div className="text-[13px] text-muted-foreground uppercase tracking-widest hidden md:block pb-3">Selected Works (3)</div>
          </div>
          
          <AnimatedGroup className="grid grid-cols-1 md:grid-cols-2 gap-[22px]">
            {/* Project 1 */}
            <AnimatedItem>
              <Link href="/projects/xiaoyuzhou" className="block h-full group">
                <Card className="rounded-none border-border shadow-none bg-background flex flex-col h-full hover:border-foreground transition-colors duration-300">
                  <div className="aspect-[4/3] bg-muted border-b border-border relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-[13px] uppercase tracking-widest group-hover:scale-105 transition-transform duration-700">
                      Xiaoyuzhou Preview
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-300"></div>
                  </div>
                  <CardHeader className="p-[22px]">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-[26px] font-te-40 text-foreground group-hover:text-accent transition-colors">Xiaoyuzhou</CardTitle>
                      <span className="text-[13px] text-muted-foreground font-mono">01</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="rounded-none text-[13px] font-normal font-te-20 text-foreground border-border bg-background">UX Research</Badge>
                      <Badge variant="outline" className="rounded-none text-[13px] font-normal font-te-20 text-foreground border-border bg-background">Figma</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-[22px] pt-0 grow">
                    <p className="text-[19px] text-muted-foreground leading-relaxed">A complete conceptual redesign of the podcast player focusing on minimalist interactions.</p>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedItem>

            {/* Project 2 */}
            <AnimatedItem>
              <Link href="/projects/tonghuashun" className="block h-full group">
                <Card className="rounded-none border-border shadow-none bg-background flex flex-col h-full hover:border-foreground transition-colors duration-300">
                  <div className="aspect-[4/3] bg-muted border-b border-border relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-[13px] uppercase tracking-widest group-hover:scale-105 transition-transform duration-700">
                      Tonghuashun Preview
                    </div>
                    <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-300"></div>
                  </div>
                  <CardHeader className="p-[22px]">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-[26px] font-te-40 text-foreground group-hover:text-accent transition-colors">Tonghuashun</CardTitle>
                      <span className="text-[13px] text-muted-foreground font-mono">02</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="rounded-none text-[13px] font-normal font-te-20 text-foreground border-border bg-background">React</Badge>
                      <Badge variant="outline" className="rounded-none text-[13px] font-normal font-te-20 text-foreground border-border bg-background">Data Viz</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-[22px] pt-0 grow">
                    <p className="text-[19px] text-muted-foreground leading-relaxed">Financial data visualization dashboard for retail investors.</p>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedItem>

            {/* Project 3 - 占满两列的横向卡片 */}
            <AnimatedItem className="md:col-span-2">
              <Link href="/projects/design-system" className="block h-full group">
                <Card className="rounded-none border-border shadow-none grid grid-cols-1 md:grid-cols-2 bg-background hover:border-foreground transition-colors duration-300">
                  <div className="aspect-[16/9] md:aspect-auto bg-muted border-b md:border-b-0 md:border-r border-border relative overflow-hidden">
                     <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-[13px] uppercase tracking-widest group-hover:scale-105 transition-transform duration-700">
                      Design System Preview
                    </div>
                    <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-300"></div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <CardHeader className="p-[33px]">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-[32px] font-te-40 text-foreground group-hover:text-accent transition-colors">Personal Design System</CardTitle>
                        <span className="text-[13px] text-muted-foreground font-mono">03</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="rounded-none text-[13px] font-normal font-te-20 text-foreground border-border bg-background">Design System</Badge>
                        <Badge variant="outline" className="rounded-none text-[13px] font-normal font-te-20 text-foreground border-border bg-background">Tailwind CSS</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-[33px] pt-0">
                      <p className="text-[19px] text-muted-foreground leading-relaxed">A strictly defined design system modeled after teenage engineering's aesthetic. Features custom typography scales, rigid spacing variables, and high-contrast components.</p>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            </AnimatedItem>
          </AnimatedGroup>
        </AnimatedSection>

        {/* Section 4: 浴室沉思 (#thoughts) - 便当盒 (Bento Box) 布局 */}
        <AnimatedSection id="thoughts" className="pt-32 scroll-mt-16">
          <h2 className="text-[40px] md:text-[60px] font-te-40 mb-[66px] flex items-center gap-4">
            <span className="w-12 h-[1px] bg-foreground hidden md:block"></span>
            Thoughts
          </h2>
          <AnimatedGroup className="grid grid-cols-1 md:grid-cols-3 gap-[15px]">
            {/* 深色主沉思卡片 */}
            <AnimatedItem className="md:col-span-2">
              <Link href="/thoughts/empty-space" className="block h-full group">
                <Card className="rounded-none border-none shadow-none bg-graphite text-canvas h-full relative overflow-hidden transition-transform duration-500 hover:-translate-y-1">
                  {/* Decorative background element */}
                  <div className="absolute -right-20 -bottom-20 text-[200px] font-te-40 text-steel opacity-5 select-none group-hover:scale-110 transition-transform duration-1000">01</div>
                  
                  <CardHeader className="p-[44px]">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-[13px] text-steel uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent rounded-full inline-block"></span>
                        Essay
                      </div>
                      <div className="text-[13px] text-steel font-mono">Oct 12, 2023</div>
                    </div>
                    <CardTitle className="text-[40px] md:text-[50px] font-te-40 text-canvas leading-tight group-hover:text-accent transition-colors">The Value of Empty Space</CardTitle>
                  </CardHeader>
                  <CardContent className="p-[44px] pt-0">
                    <p className="text-[19px] md:text-[24px] text-steel leading-relaxed max-w-xl">In modern interface design, silence is as important as the notes. Embracing void areas allows critical information to breathe and establishes a natural hierarchy without relying on heavy borders or explicit dividers.</p>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedItem>

            {/* 浅色辅助沉思卡片 */}
            <AnimatedItem>
              <Link href="/thoughts/engineering-precision" className="block h-full group">
                <Card className="rounded-none border-border shadow-none bg-muted flex flex-col justify-between h-full hover:bg-steel/30 transition-colors duration-300">
                  <CardHeader className="p-[33px]">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-[13px] text-muted-foreground uppercase tracking-widest">Note</div>
                      <div className="text-[13px] text-muted-foreground font-mono">Nov 04, 2023</div>
                    </div>
                    <CardTitle className="text-[32px] font-te-40 text-foreground group-hover:text-accent transition-colors">Engineering Precision</CardTitle>
                  </CardHeader>
                  <CardContent className="p-[33px] pt-0">
                    <p className="text-[19px] text-muted-foreground leading-relaxed">Treating software like hardware. Why rigid constraints lead to better creative outcomes in frontend development.</p>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedItem>
          </AnimatedGroup>
        </AnimatedSection>
      </main>

      {/* Section 5: 联系方式 (#contact) - 极简底部通栏布局 */}
      <footer id="contact" className="bg-graphite text-canvas pt-[88px] pb-[44px] mt-32 scroll-mt-16 border-t-[4px] border-accent relative overflow-hidden">
        {/* Subtle grid on footer */}
        <div className="absolute inset-0 pointer-events-none z-0" 
             style={{ 
               backgroundImage: `linear-gradient(to right, var(--color-ink) 1px, transparent 1px), linear-gradient(to bottom, var(--color-ink) 1px, transparent 1px)`,
               backgroundSize: '40px 40px',
               opacity: 0.2
             }}>
        </div>
        
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-[66px] relative z-10">
          <div className="flex flex-col justify-between h-full">
            <div>
              <h2 className="text-[50px] md:text-[80px] font-te-40 mb-[22px] text-canvas leading-none">Let's connect.</h2>
              <p className="text-[19px] text-steel max-w-md">Currently open for new opportunities and interesting collaborations.</p>
              
              <div className="flex flex-wrap gap-[33px] mt-[44px]">
                <a href="mailto:hello@example.com" className="text-[13px] text-steel hover:text-accent transition-colors uppercase tracking-widest flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-steel group-hover:bg-accent transition-colors"></span>
                  Email
                </a>
                <a href="https://xiaohongshu.com" target="_blank" rel="noreferrer" className="text-[13px] text-steel hover:text-accent transition-colors uppercase tracking-widest flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-steel group-hover:bg-accent transition-colors"></span>
                  Xiaohongshu
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="text-[13px] text-steel hover:text-accent transition-colors uppercase tracking-widest flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-steel group-hover:bg-accent transition-colors"></span>
                  GitHub
                </a>
              </div>
            </div>
            <div className="text-[13px] text-smoke mt-[88px] flex items-center justify-between w-full">
              <span>© {new Date().getFullYear()} All rights reserved.</span>
              <span className="font-mono">SYS.END</span>
            </div>
          </div>
          
          <div className="flex md:justify-end items-center">
            <div className="border border-smoke p-6 bg-graphite relative group">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-steel"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-steel"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-steel"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-steel"></div>
              
              <div className="relative w-[150px] h-[150px] bg-canvas p-2 group-hover:scale-105 transition-transform duration-500">
                <Image 
                  src="/wechat-qr.jpg" 
                  alt="WeChat QR Code" 
                  fill 
                  sizes="150px"
                  className="object-contain p-2 mix-blend-multiply"
                />
              </div>
              <div className="text-center text-[13px] text-steel mt-4 uppercase tracking-widest flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
                Scan to add
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

import { Fragment, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type MarkdownRendererProps = {
  content: string
  className?: string
  tone?: "light" | "dark"
}

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; lines: string[] }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; lines: string[] }
  | { type: "code"; language: string; code: string }

function parseMarkdown(content: string): Block[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n")
  const blocks: Block[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim()
      const code: string[] = []
      index += 1

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        code.push(lines[index])
        index += 1
      }

      blocks.push({ type: "code", language, code: code.join("\n") })
      index += 1
      continue
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2],
      })
      index += 1
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = []
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""))
        index += 1
      }
      blocks.push({ type: "ul", items })
      continue
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = []
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""))
        index += 1
      }
      blocks.push({ type: "ol", items })
      continue
    }

    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = []
      while (index < lines.length && lines[index].trim().startsWith("> ")) {
        quoteLines.push(lines[index].trim().replace(/^>\s+/, ""))
        index += 1
      }
      blocks.push({ type: "quote", lines: quoteLines })
      continue
    }

    const paragraphLines: string[] = []
    while (index < lines.length) {
      const current = lines[index]
      const currentTrimmed = current.trim()
      const startsNewBlock =
        !currentTrimmed ||
        currentTrimmed.startsWith("```") ||
        /^(#{1,3})\s+/.test(currentTrimmed) ||
        /^[-*]\s+/.test(currentTrimmed) ||
        /^\d+\.\s+/.test(currentTrimmed) ||
        currentTrimmed.startsWith("> ")

      if (startsNewBlock) {
        break
      }

      paragraphLines.push(currentTrimmed)
      index += 1
    }

    blocks.push({ type: "paragraph", lines: paragraphLines })
  }

  return blocks
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern =
    /(\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\))|(`([^`]+)`)|(\*\*([^*]+)\*\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (match[2] && match[3]) {
      nodes.push(
        <a
          key={`${match.index}-link`}
          href={match[3]}
          className="text-accent underline underline-offset-4 transition-colors hover:text-foreground"
        >
          {match[2]}
        </a>
      )
    } else if (match[5]) {
      nodes.push(
        <code
          key={`${match.index}-code`}
          className="border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
        >
          {match[5]}
        </code>
      )
    } else if (match[7]) {
      nodes.push(
        <strong
          key={`${match.index}-strong`}
          className="font-semibold text-foreground"
        >
          {match[7]}
        </strong>
      )
    }

    lastIndex = pattern.lastIndex
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

export function MarkdownRenderer({
  content,
  className,
  tone = "light",
}: MarkdownRendererProps) {
  const blocks = parseMarkdown(content)

  return (
    <div
      className={cn(
        "markdown-content space-y-8 border-border text-[19px] leading-relaxed",
        tone === "dark" ? "text-steel" : "text-foreground",
        className
      )}
      style={{
        color:
          tone === "dark" ? "var(--color-steel)" : "var(--color-foreground)",
        fontFamily: "var(--font-te-20)",
      }}
    >
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const headingClass = cn(
            "font-te-40 leading-tight text-foreground",
            tone === "dark" && "text-canvas",
            block.level === 1 && "text-[40px] md:text-[50px]",
            block.level === 2 && "text-[32px] md:text-[40px]",
            block.level === 3 && "text-[26px] md:text-[32px]"
          )

          if (block.level === 1) {
            return (
              <h1
                key={index}
                className={headingClass}
                style={{ fontFamily: "var(--font-te-40)" }}
              >
                {renderInline(block.text)}
              </h1>
            )
          }

          if (block.level === 2) {
            return (
              <h2
                key={index}
                className={headingClass}
                style={{ fontFamily: "var(--font-te-40)" }}
              >
                {renderInline(block.text)}
              </h2>
            )
          }

          return (
            <h3
              key={index}
              className={headingClass}
              style={{ fontFamily: "var(--font-te-40)" }}
            >
              {renderInline(block.text)}
            </h3>
          )
        }

        if (block.type === "ul" || block.type === "ol") {
          const List = block.type === "ul" ? "ul" : "ol"
          return (
            <List
              key={index}
              className={cn(
                "space-y-3 pl-6",
                block.type === "ul" ? "list-disc" : "list-decimal"
              )}
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item)}</li>
              ))}
            </List>
          )
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={index}
              className="border-l-2 border-accent pl-6 text-muted-foreground"
            >
              {block.lines.map((line, lineIndex) => (
                <Fragment key={lineIndex}>
                  {lineIndex > 0 && <br />}
                  {renderInline(line)}
                </Fragment>
              ))}
            </blockquote>
          )
        }

        if (block.type === "code") {
          return (
            <pre
              key={index}
              className="overflow-x-auto border border-border bg-muted p-4 font-mono text-[15px] text-foreground"
            >
              {block.language && (
                <div className="mb-3 text-[11px] tracking-widest text-muted-foreground uppercase">
                  {block.language}
                </div>
              )}
              <code>{block.code}</code>
            </pre>
          )
        }

        return (
          <p
            key={index}
            className={cn(tone === "dark" ? "text-steel" : "text-foreground")}
          >
            {block.lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 && " "}
                {renderInline(line)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}

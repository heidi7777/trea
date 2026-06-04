"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import type { ProjectContent, ThoughtContent } from "@/lib/default-content"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type EditorMode =
  | {
      kind: "project"
      id: string
      initialContent: ProjectContent
    }
  | {
      kind: "thought"
      id: string
      initialContent: ThoughtContent
    }

function inputClassName(dark = false) {
  return cn(
    "w-full rounded-none border border-input bg-background px-3 py-2 text-[15px] text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    dark && "bg-graphite text-canvas"
  )
}

async function saveLocalContent(type: string, id: string, data: unknown) {
  const response = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, id, data }),
  })

  if (!response.ok) {
    const payload = (await response.json()) as { error?: string }
    throw new Error(payload.error ?? "Unable to save content")
  }
}

export function LocalContentEditor(props: EditorMode) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  )
  const [message, setMessage] = useState("")
  const [content, setContent] = useState(props.initialContent)

  const isProject = props.kind === "project"
  const markdownType = isProject ? "project-markdown" : "thought-markdown"
  const metadataType = isProject ? "projects" : "thoughts"

  const metadata = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(content).filter(([key]) => key !== "body")
      ),
    [content]
  )

  async function handleSave() {
    setStatus("saving")
    setMessage("Saving local content…")

    try {
      await saveLocalContent(metadataType, props.id, metadata)
      await saveLocalContent(markdownType, props.id, content.body)
      setStatus("saved")
      setMessage("Saved locally. Refreshing page content…")
      router.refresh()
    } catch (error) {
      setStatus("error")
      setMessage(
        error instanceof Error ? error.message : "Unable to save content"
      )
    }
  }

  function updateField(field: string, value: string) {
    setContent((current) => ({ ...current, [field]: value }))
  }

  function updateProjectListField(
    field: "tags" | "researchImages",
    value: string
  ) {
    setContent((current) => ({
      ...current,
      [field]: value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    }))
  }

  return (
    <>
      <Button
        type="button"
        variant="default"
        className="fixed right-6 bottom-6 z-[80] rounded-none border border-foreground shadow-lg"
        onClick={() => setOpen(true)}
      >
        Edit local page
      </Button>

      {open && (
        <div className="fixed inset-0 z-[90] bg-graphite/60 backdrop-blur-sm">
          <aside className="ml-auto flex h-full w-full max-w-2xl flex-col border-l border-border bg-background text-foreground shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-6">
              <div>
                <div className="text-[13px] tracking-widest text-muted-foreground uppercase">
                  Local editor / {props.kind}
                </div>
                <h2 className="font-te-40 text-[32px]">Edit page content</h2>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-none"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto p-6">
              <section className="space-y-4">
                <h3 className="text-[13px] font-bold tracking-widest uppercase">
                  Text fields
                </h3>
                <label className="block space-y-2 text-[13px] tracking-widest text-muted-foreground uppercase">
                  Title
                  <input
                    className={inputClassName()}
                    value={content.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                  />
                </label>

                {isProject ? (
                  <>
                    <label className="block space-y-2 text-[13px] tracking-widest text-muted-foreground uppercase">
                      Subtitle
                      <Textarea
                        value={(content as ProjectContent).subtitle}
                        onChange={(event) =>
                          updateField("subtitle", event.target.value)
                        }
                      />
                    </label>
                    <div className="grid gap-4 md:grid-cols-2">
                      {(["role", "team", "tools", "timeline"] as const).map(
                        (field) => (
                          <label
                            key={field}
                            className="block space-y-2 text-[13px] tracking-widest text-muted-foreground uppercase"
                          >
                            {field}
                            <input
                              className={inputClassName()}
                              value={(content as ProjectContent)[field]}
                              onChange={(event) =>
                                updateField(field, event.target.value)
                              }
                            />
                          </label>
                        )
                      )}
                    </div>
                    <label className="block space-y-2 text-[13px] tracking-widest text-muted-foreground uppercase">
                      Problem
                      <Textarea
                        value={(content as ProjectContent).problem}
                        onChange={(event) =>
                          updateField("problem", event.target.value)
                        }
                      />
                    </label>
                    <label className="block space-y-2 text-[13px] tracking-widest text-muted-foreground uppercase">
                      Solution
                      <Textarea
                        value={(content as ProjectContent).solution}
                        onChange={(event) =>
                          updateField("solution", event.target.value)
                        }
                      />
                    </label>
                    <label className="block space-y-2 text-[13px] tracking-widest text-muted-foreground uppercase">
                      Research intro
                      <Textarea
                        value={(content as ProjectContent).research}
                        onChange={(event) =>
                          updateField("research", event.target.value)
                        }
                      />
                    </label>
                  </>
                ) : (
                  <div className="grid gap-4 md:grid-cols-3">
                    {(["type", "date", "readTime"] as const).map((field) => (
                      <label
                        key={field}
                        className="block space-y-2 text-[13px] tracking-widest text-muted-foreground uppercase"
                      >
                        {field}
                        <input
                          className={inputClassName()}
                          value={(content as ThoughtContent)[field]}
                          onChange={(event) =>
                            updateField(field, event.target.value)
                          }
                        />
                      </label>
                    ))}
                  </div>
                )}
              </section>

              {isProject && (
                <section className="space-y-4">
                  <h3 className="text-[13px] font-bold tracking-widest uppercase">
                    Images and tags
                  </h3>
                  <label className="block space-y-2 text-[13px] tracking-widest text-muted-foreground uppercase">
                    Hero image path
                    <input
                      className={inputClassName()}
                      value={(content as ProjectContent).heroImage}
                      onChange={(event) =>
                        updateField("heroImage", event.target.value)
                      }
                      placeholder="/project-image.jpg"
                    />
                  </label>
                  <label className="block space-y-2 text-[13px] tracking-widest text-muted-foreground uppercase">
                    Research image paths, one per line
                    <Textarea
                      value={(content as ProjectContent).researchImages.join(
                        "\n"
                      )}
                      onChange={(event) =>
                        updateProjectListField(
                          "researchImages",
                          event.target.value
                        )
                      }
                      placeholder="/research-1.jpg"
                    />
                  </label>
                  <label className="block space-y-2 text-[13px] tracking-widest text-muted-foreground uppercase">
                    Tags, one per line
                    <Textarea
                      value={(content as ProjectContent).tags.join("\n")}
                      onChange={(event) =>
                        updateProjectListField("tags", event.target.value)
                      }
                    />
                  </label>
                </section>
              )}

              <section className="space-y-4">
                <h3 className="text-[13px] font-bold tracking-widest uppercase">
                  Markdown body
                </h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  This field is saved as local Markdown and rendered below the
                  project introduction or document header.
                </p>
                <Textarea
                  className="min-h-[360px] font-mono text-[14px] leading-relaxed"
                  value={content.body}
                  onChange={(event) => updateField("body", event.target.value)}
                />
              </section>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border p-6">
              <div
                className={cn(
                  "text-[13px] text-muted-foreground",
                  status === "error" && "text-destructive",
                  status === "saved" && "text-accent"
                )}
              >
                {message ||
                  "Edits are stored in the repository data folder on save."}
              </div>
              <Button
                type="button"
                className="rounded-none"
                disabled={status === "saving"}
                onClick={handleSave}
              >
                {status === "saving" ? "Saving…" : "Save locally"}
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

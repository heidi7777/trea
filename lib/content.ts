import fs from "fs/promises"
import path from "path"
import {
  defaultProjects,
  defaultThoughts,
  type ProjectContent,
  type ThoughtContent,
} from "@/lib/default-content"

const DATA_DIR = path.join(process.cwd(), "data")
const SAFE_ID_PATTERN = /^[a-z0-9-]+$/
const LOCAL_CONTENT_TYPES = new Set([
  "pages",
  "projects",
  "project-markdown",
  "thoughts",
  "thought-markdown",
])

function assertSafeContentPath(type: string, id: string) {
  if (!LOCAL_CONTENT_TYPES.has(type)) {
    throw new Error("Unsupported content type")
  }

  if (!SAFE_ID_PATTERN.test(id)) {
    throw new Error("Invalid content id")
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

async function readJsonContent(type: string, id: string) {
  assertSafeContentPath(type, id)

  const filePath = path.join(DATA_DIR, type, `${id}.json`)
  const raw = await fs.readFile(filePath, "utf-8")
  return JSON.parse(raw) as unknown
}

async function readMarkdownContent(type: string, id: string) {
  assertSafeContentPath(type, id)

  const filePath = path.join(DATA_DIR, type, `${id}.md`)
  return fs.readFile(filePath, "utf-8")
}

export async function getContent(
  type: string,
  id: string
): Promise<unknown | null> {
  assertSafeContentPath(type, id)
  const dir = path.join(DATA_DIR, type)

  const jsonPath = path.join(dir, `${id}.json`)
  try {
    const raw = await fs.readFile(jsonPath, "utf-8")
    return JSON.parse(raw)
  } catch {
    // JSON file not found or invalid, try markdown.
  }

  const mdPath = path.join(dir, `${id}.md`)
  try {
    return await fs.readFile(mdPath, "utf-8")
  } catch {
    // Markdown file not found.
  }

  return null
}

export async function saveContent(
  type: string,
  id: string,
  data: unknown
): Promise<void> {
  assertSafeContentPath(type, id)

  const dir = path.join(DATA_DIR, type)
  await fs.mkdir(dir, { recursive: true })

  if (typeof data === "string") {
    const filePath = path.join(dir, `${id}.md`)
    await fs.writeFile(filePath, data, "utf-8")
    return
  }

  if (!isRecord(data)) {
    throw new Error("JSON content must be an object")
  }

  const filePath = path.join(dir, `${id}.json`)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

export async function getProjectContent(
  slug: string
): Promise<ProjectContent | null> {
  assertSafeContentPath("projects", slug)

  const defaultProject = defaultProjects[slug]
  if (!defaultProject) {
    return null
  }

  let localMetadata: Partial<ProjectContent> = {}
  let localBody: string | undefined

  try {
    const data = await readJsonContent("projects", slug)
    if (isRecord(data)) {
      localMetadata = data
    }
  } catch {
    // Local project metadata is optional.
  }

  try {
    localBody = await readMarkdownContent("project-markdown", slug)
  } catch {
    // Local project Markdown is optional.
  }

  return {
    ...defaultProject,
    ...localMetadata,
    body: localBody ?? localMetadata.body ?? defaultProject.body,
  }
}

export async function getThoughtContent(
  slug: string
): Promise<ThoughtContent | null> {
  assertSafeContentPath("thoughts", slug)

  const defaultThought = defaultThoughts[slug]
  if (!defaultThought) {
    return null
  }

  let localMetadata: Partial<ThoughtContent> = {}
  let localBody: string | undefined

  try {
    const data = await readJsonContent("thoughts", slug)
    if (isRecord(data)) {
      localMetadata = data
    }
  } catch {
    // Local thought metadata is optional.
  }

  try {
    localBody = await readMarkdownContent("thought-markdown", slug)
  } catch {
    // Local thought Markdown is optional.
  }

  return {
    ...defaultThought,
    ...localMetadata,
    body: localBody ?? localMetadata.body ?? defaultThought.body,
  }
}

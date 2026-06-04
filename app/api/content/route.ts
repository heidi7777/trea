// TODO: [上线前必改] 部署到生产环境前，必须加上 process.env.NODE_ENV !== 'development' 的拦截逻辑
import { NextResponse } from "next/server"
import { getContent, saveContent } from "@/lib/content"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const id = searchParams.get("id")

  if (!type || !id) {
    return NextResponse.json(
      { error: "Missing type or id parameter" },
      { status: 400 }
    )
  }

  let content: unknown | null

  try {
    content = await getContent(type, id)
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid content path",
      },
      { status: 400 }
    )
  }

  if (content === null) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 })
  }

  return NextResponse.json(content)
}

export async function POST(request: Request) {
  let body: { type?: string; id?: string; data?: unknown }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { type, id, data } = body

  if (!type || !id || data === undefined) {
    return NextResponse.json(
      { error: "Missing type, id, or data" },
      { status: 400 }
    )
  }

  try {
    await saveContent(type, id, data)
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to save content",
      },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}

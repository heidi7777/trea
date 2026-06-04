class MockHeaders {
  private map = new Map<string, string>()

  append(name: string, value: string) {
    this.map.set(name, value)
  }

  delete(name: string) {
    this.map.delete(name)
  }

  get(name: string) {
    return this.map.get(name) ?? null
  }

  has(name: string) {
    return this.map.has(name)
  }

  set(name: string, value: string) {
    this.map.set(name, value)
  }

  forEach(callback: (value: string, key: string, parent: MockHeaders) => void) {
    this.map.forEach((value, key) => callback(value, key, this))
  }

  *[Symbol.iterator]() {
    yield* this.map.entries()
  }
}

class MockRequest {
  url: string
  headers = new MockHeaders()

  constructor(input: string | URL | { url: string }) {
    if (typeof input === "string") {
      this.url = input
    } else if (input instanceof URL) {
      this.url = input.toString()
    } else {
      this.url = input.url
    }
  }

  async json() {
    return {}
  }

  async text() {
    return ""
  }
}

class MockResponse {
  status: number
  statusText: string
  headers = new MockHeaders()
  ok: boolean

  constructor(
    private body: unknown = null,
    init?: { status?: number; statusText?: string }
  ) {
    this.status = init?.status ?? 200
    this.statusText = init?.statusText ?? ""
    this.ok = this.status >= 200 && this.status < 300
  }

  async json() {
    return this.body
  }

  async text() {
    return typeof this.body === "string" ? this.body : JSON.stringify(this.body)
  }

  static json(body: unknown, init?: { status?: number; statusText?: string }) {
    return new MockResponse(body, init)
  }
}

globalThis.Headers = MockHeaders as unknown as typeof Headers
globalThis.Request = MockRequest as unknown as typeof Request
globalThis.Response = MockResponse as unknown as typeof Response
globalThis.fetch = (async () => new MockResponse()) as unknown as typeof fetch

import "@testing-library/jest-dom"

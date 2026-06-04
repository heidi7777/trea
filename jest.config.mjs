class MockHeaders {
  _map = new Map();
  append(name, value) { this._map.set(name, value); }
  delete(name) { this._map.delete(name); }
  get(name) { return this._map.get(name) ?? null; }
  has(name) { return this._map.has(name); }
  set(name, value) { this._map.set(name, value); }
  forEach(callback) { this._map.forEach((v, k) => callback(v, k, this)); }
  *[Symbol.iterator]() { yield* this._map.entries(); }
}

class MockRequest {
  url;
  headers = new MockHeaders();
  constructor(input, init) {
    if (typeof input === 'string') {
      this.url = input;
    } else if (input instanceof URL) {
      this.url = input.toString();
    } else {
      this.url = input.url;
    }
  }
  async json() { return {}; }
  async text() { return ''; }
}

class MockResponse {
  status;
  statusText;
  headers = new MockHeaders();
  ok;
  constructor(body, init) {
    this.status = init?.status ?? 200;
    this.statusText = init?.statusText ?? '';
    this.ok = this.status >= 200 && this.status < 300;
  }
  async json() { return {}; }
  async text() { return ''; }
  static json(body, init) {
    return new MockResponse(null, init);
  }
}

global.Request = MockRequest;
global.Response = MockResponse;
global.Headers = MockHeaders;
global.fetch = function() { return Promise.resolve(new MockResponse()); };

import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)

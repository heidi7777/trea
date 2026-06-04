import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function getContent(type: string, id: string): Promise<unknown | null> {
  const dir = path.join(DATA_DIR, type);

  const jsonPath = path.join(dir, `${id}.json`);
  try {
    const raw = await fs.readFile(jsonPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    // JSON file not found or invalid, try markdown
  }

  const mdPath = path.join(dir, `${id}.md`);
  try {
    return await fs.readFile(mdPath, 'utf-8');
  } catch {
    // Markdown file not found
  }

  return null;
}

export async function saveContent(type: string, id: string, data: unknown): Promise<void> {
  const dir = path.join(DATA_DIR, type);
  await fs.mkdir(dir, { recursive: true });

  if (typeof data === 'string') {
    const filePath = path.join(dir, `${id}.md`);
    await fs.writeFile(filePath, data, 'utf-8');
  } else {
    const filePath = path.join(dir, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

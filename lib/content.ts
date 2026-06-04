import fs from 'fs/promises';
import path from 'path';

const SOURCE_DIR = path.join(process.cwd(), 'source');
const DATA_DIR = path.join(process.cwd(), 'data');

export async function getContent(type: string, id: string): Promise<unknown | null> {
  try {
    // 优先尝试从 source 目录读取
    try {
      const sourceDir = path.join(SOURCE_DIR, type);
      const jsonPath = path.join(sourceDir, `${id}.json`);
      const raw = await fs.readFile(jsonPath, 'utf-8');
      console.log('[getContent] Found JSON in source:', jsonPath);
      return JSON.parse(raw);
    } catch (e) {
      console.log('[getContent] Not found in source JSON:', `${SOURCE_DIR}/${type}/${id}.json`);
    }

    try {
      const sourceDir = path.join(SOURCE_DIR, type);
      const mdPath = path.join(sourceDir, `${id}.md`);
      console.log('[getContent] Trying source Markdown:', mdPath);
      return await fs.readFile(mdPath, 'utf-8');
    } catch (e) {
      console.log('[getContent] Not found in source Markdown:', `${SOURCE_DIR}/${type}/${id}.md`);
    }

    // 回退到 data 目录
    const dir = path.join(DATA_DIR, type);

    const jsonPath = path.join(dir, `${id}.json`);
    try {
      console.log('[getContent] Trying data JSON:', jsonPath);
      const raw = await fs.readFile(jsonPath, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.log('[getContent] Not found in data JSON');
    }

    const mdPath = path.join(dir, `${id}.md`);
    try {
      console.log('[getContent] Trying data Markdown:', mdPath);
      return await fs.readFile(mdPath, 'utf-8');
    } catch (e) {
      console.log('[getContent] Not found in data Markdown');
    }

    return null;
  } catch (error) {
    console.error('[getContent] Unexpected error:', error);
    throw error;
  }
}

export async function saveContent(type: string, id: string, data: unknown): Promise<void> {
  // 优先写入 source 目录
  const sourceDir = path.join(SOURCE_DIR, type);
  await fs.mkdir(sourceDir, { recursive: true });

  if (typeof data === 'string') {
    const filePath = path.join(sourceDir, `${id}.md`);
    await fs.writeFile(filePath, data, 'utf-8');
  } else {
    const filePath = path.join(sourceDir, `${id}.json`);
    // 如果是部分更新，先读取现有数据
    try {
      const existing = await fs.readFile(filePath, 'utf-8');
      const existingData = JSON.parse(existing) as Record<string, unknown>;
      const newData = data as Record<string, unknown>;
      
      // 深度合并对象
      const deepMerge = (target: any, source: any): any => {
        const result = { ...target };
        for (const key in source) {
          if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(result[key] || {}, source[key]);
          } else {
            result[key] = source[key];
          }
        }
        return result;
      };
      
      const merged = deepMerge(existingData, newData);
      await fs.writeFile(filePath, JSON.stringify(merged, null, 2), 'utf-8');
    } catch {
      // 文件不存在，直接写入
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }
  }
}

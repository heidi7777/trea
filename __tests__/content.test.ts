import { getContent, saveContent } from '@/lib/content';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function cleanDataDir() {
  if (fs.existsSync(DATA_DIR)) {
    fs.rmSync(DATA_DIR, { recursive: true, force: true });
  }
}

describe('content utilities', () => {
  beforeEach(() => {
    cleanDataDir();
  });

  afterAll(() => {
    cleanDataDir();
  });

  describe('getContent', () => {
    it('returns null when file does not exist', async () => {
      const result = await getContent('projects', 'nonexistent');
      expect(result).toBeNull();
    });

    it('reads and parses JSON content', async () => {
      const projectData = { title: 'My Project', tags: ['react', 'ts'] };
      const dir = path.join(DATA_DIR, 'projects');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'my-project.json'), JSON.stringify(projectData, null, 2));

      const result = await getContent('projects', 'my-project');
      expect(result).toEqual(projectData);
    });

    it('reads Markdown content as string', async () => {
      const mdContent = '# Hello\n\nThis is a thought.';
      const dir = path.join(DATA_DIR, 'thoughts');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'hello.md'), mdContent);

      const result = await getContent('thoughts', 'hello');
      expect(result).toBe(mdContent);
    });

    it('returns null when both json and md do not exist', async () => {
      const result = await getContent('projects', 'missing');
      expect(result).toBeNull();
    });
  });

  describe('saveContent', () => {
    it('saves JSON data to a .json file', async () => {
      const data = { title: 'New Project', year: 2024 };
      await saveContent('projects', 'new-project', data);

      const filePath = path.join(DATA_DIR, 'projects', 'new-project.json');
      expect(fs.existsSync(filePath)).toBe(true);
      const raw = fs.readFileSync(filePath, 'utf-8');
      expect(JSON.parse(raw)).toEqual(data);
    });

    it('saves string data to a .md file', async () => {
      const data = '# Markdown Title\n\nContent here.';
      await saveContent('thoughts', 'my-thought', data);

      const filePath = path.join(DATA_DIR, 'thoughts', 'my-thought.md');
      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.readFileSync(filePath, 'utf-8')).toBe(data);
    });

    it('overwrites existing file', async () => {
      const dir = path.join(DATA_DIR, 'projects');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'existing.json'), JSON.stringify({ old: true }));

      const newData = { old: false, updated: true };
      await saveContent('projects', 'existing', newData);

      const raw = fs.readFileSync(path.join(dir, 'existing.json'), 'utf-8');
      expect(JSON.parse(raw)).toEqual(newData);
    });
  });
});

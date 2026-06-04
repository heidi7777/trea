import { GET, POST } from '@/app/api/content/route';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function cleanDataDir() {
  if (fs.existsSync(DATA_DIR)) {
    fs.rmSync(DATA_DIR, { recursive: true, force: true });
  }
}

describe('/api/content', () => {
  beforeEach(() => {
    cleanDataDir();
  });

  afterAll(() => {
    cleanDataDir();
  });

  describe('GET', () => {
    it('returns content for a given type and id', async () => {
      const projectData = { title: 'My Project', tags: ['react', 'ts'] };
      const dir = path.join(DATA_DIR, 'projects');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, 'my-project.json'),
        JSON.stringify(projectData, null, 2)
      );

      const request = {
        url: 'http://localhost/api/content?type=projects&id=my-project',
      } as Request;
      const response = await GET(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result).toEqual(projectData);
    });

    it('returns 404 when content does not exist', async () => {
      const request = {
        url: 'http://localhost/api/content?type=projects&id=nonexistent',
      } as Request;
      const response = await GET(request);

      expect(response.status).toBe(404);
    });

    it('returns 400 when type or id is missing', async () => {
      const request = {
        url: 'http://localhost/api/content?type=projects',
      } as Request;
      const response = await GET(request);

      expect(response.status).toBe(400);
    });
  });

  describe('POST', () => {
    it('saves content for a given type and id', async () => {
      const data = { title: 'New Project', year: 2024 };
      const request = {
        json: async () => ({ type: 'projects', id: 'new-project', data }),
      } as Request;

      const response = await POST(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);

      const filePath = path.join(DATA_DIR, 'projects', 'new-project.json');
      expect(fs.existsSync(filePath)).toBe(true);
      expect(JSON.parse(fs.readFileSync(filePath, 'utf-8'))).toEqual(data);
    });

    it('returns 400 when type, id, or data is missing', async () => {
      const request = {
        json: async () => ({ type: 'projects', id: 'missing-data' }),
      } as Request;

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });
});

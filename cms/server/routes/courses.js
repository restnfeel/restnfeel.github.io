import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';

export function createCoursesRouter(PROJECT_ROOT) {
  const router = Router();
  const COURSES_DIR = path.join(PROJECT_ROOT, 'courses');

  // GET /api/courses — 강의 목록
  router.get('/', async (req, res) => {
    try {
      const entries = await fs.readdir(COURSES_DIR, { withFileTypes: true });
      const courses = [];
      for (const e of entries) {
        if (!e.isDirectory()) continue;
        const coursePath = path.join(COURSES_DIR, e.name);
        const metaPath = path.join(coursePath, 'course.json');
        try {
          const raw = await fs.readFile(metaPath, 'utf-8');
          courses.push({ id: e.name, ...JSON.parse(raw) });
        } catch {
          courses.push({ id: e.name, title: e.name });
        }
      }
      res.json(courses);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/courses/:id/docs — 문서 목록 (docs/ 하위 .md, .mdx 재귀 스캔)
  router.get('/:id/docs', async (req, res) => {
    try {
      const docsDir = path.join(COURSES_DIR, req.params.id, 'docs');
      const collected = [];
      async function scan(dir, prefix = '') {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const e of entries) {
          const rel = prefix ? `${prefix}/${e.name}` : e.name;
          if (e.isDirectory()) {
            await scan(path.join(dir, e.name), rel);
          } else if (e.isFile() && /\.mdx?$/i.test(e.name)) {
            const slug = rel.replace(/\.mdx?$/i, '');
            collected.push(slug);
          }
        }
      }
      await scan(docsDir);
      collected.sort();
      res.json(collected);
    } catch (err) {
      if (err.code === 'ENOENT') return res.json([]);
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/courses/:id/docs/:slug — 문서 내용 (slug에 / 포함 가능)
  router.get('/:id/docs/*', async (req, res) => {
    try {
      const slug = (req.params[0] || req.params.slug || '').replace(/\/$/, '');
      if (!slug) return res.status(400).json({ error: 'slug required' });
      const base = path.join(COURSES_DIR, req.params.id, 'docs');
      const safeBase = path.resolve(base);
      for (const ext of ['.md', '.mdx']) {
        const filePath = path.resolve(base, slug + ext);
        if (!filePath.startsWith(safeBase)) return res.status(400).json({ error: 'Invalid path' });
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          return res.json({ slug, content });
        } catch {
          continue;
        }
      }
      res.status(404).json({ error: 'Document not found' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT /api/courses/:id/docs/:slug — 문서 저장
  router.put('/:id/docs/:slug', async (req, res) => {
    try {
      const slug = req.params.slug;
      const { content } = req.body;
      const filePath = path.join(COURSES_DIR, req.params.id, 'docs', slug + '.md');
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content || '', 'utf-8');
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/courses/:id/metadata — course.json
  router.get('/:id/metadata', async (req, res) => {
    try {
      const filePath = path.join(COURSES_DIR, req.params.id, 'course.json');
      const raw = await fs.readFile(filePath, 'utf-8');
      res.json(JSON.parse(raw));
    } catch (err) {
      if (err.code === 'ENOENT') return res.status(404).json({ error: 'Not found' });
      res.status(500).json({ error: err.message });
    }
  });

  // PUT /api/courses/:id/metadata — course.json 저장
  router.put('/:id/metadata', async (req, res) => {
    try {
      const filePath = path.join(COURSES_DIR, req.params.id, 'course.json');
      await fs.writeFile(filePath, JSON.stringify(req.body, null, 2), 'utf-8');
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/courses/:id/docs — 새 문서 생성
  router.post('/:id/docs', async (req, res) => {
    try {
      const { slug, content } = req.body;
      if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ error: 'slug required' });
      }
      const safeSlug = slug.replace(/[^a-zA-Z0-9-_가-힣]/g, '-');
      const filePath = path.join(COURSES_DIR, req.params.id, 'docs', safeSlug + '.md');
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content || '# ' + safeSlug + '\n\n', 'utf-8');
      res.json({ slug: safeSlug });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

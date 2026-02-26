import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';

export function createIndexRouter(PROJECT_ROOT) {
  const router = Router();
  const INDEX_FILE = path.join(PROJECT_ROOT, 'index', 'courses.json');

  // GET /api/index — index/courses.json
  router.get('/', async (req, res) => {
    try {
      const raw = await fs.readFile(INDEX_FILE, 'utf-8');
      res.json(JSON.parse(raw));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT /api/index — index/courses.json 저장
  router.put('/', async (req, res) => {
    try {
      await fs.writeFile(INDEX_FILE, JSON.stringify(req.body, null, 2), 'utf-8');
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

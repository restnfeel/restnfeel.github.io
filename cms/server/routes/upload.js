import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

export function createUploadRouter(PROJECT_ROOT) {
  const router = Router();
  const COURSES_DIR = path.join(PROJECT_ROOT, 'courses');

  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      const dir = path.join(COURSES_DIR, req.params.courseId, 'static', 'img');
      await fs.mkdir(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.png';
      const name = Date.now() + '-' + (file.originalname || 'image').replace(/[^a-zA-Z0-9.-]/g, '_');
      cb(null, name);
    },
  });
  const upload = multer({ storage });

  // POST /api/upload/:courseId
  router.post('/:courseId', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/img/${req.file.filename}`;
    res.json({ url });
  });

  return router;
}

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCoursesRouter } from './routes/courses.js';
import { createIndexRouter } from './routes/indexRoute.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../..');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(PROJECT_ROOT, 'cms/client/dist')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, root: PROJECT_ROOT });
});
app.use('/api/courses', createCoursesRouter(PROJECT_ROOT));
app.use('/api/index', createIndexRouter(PROJECT_ROOT));

const PORT = 3001;
app.listen(PORT, () => console.log(`CMS API http://localhost:${PORT}`));

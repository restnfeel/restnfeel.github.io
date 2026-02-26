import { Router } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createDeployRouter(PROJECT_ROOT) {
  const router = Router();

  // POST /api/deploy
  router.post('/', async (req, res) => {
    try {
      const msg = `chore: CMS 업데이트 (${new Date().toISOString().slice(0, 10)})`;
      const { stdout, stderr } = await execAsync(
        `git add . && git status --short`,
        { cwd: PROJECT_ROOT }
      );
      if (!stdout.trim()) {
        return res.json({ ok: true, message: '변경 사항 없음' });
      }
      await execAsync(
        `git add . && git commit -m "${msg.replace(/"/g, '\\"')}" && git push`,
        { cwd: PROJECT_ROOT }
      );
      res.json({ ok: true, message: '배포 완료' });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.stderr || err.message });
    }
  });

  return router;
}

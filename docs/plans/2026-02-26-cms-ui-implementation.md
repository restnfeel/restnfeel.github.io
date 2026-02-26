# CMS UI 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 로컬 전용 CMS UI를 구현하여 courses/, index/ 콘텐츠를 편집하고, "배포" 버튼으로 Git push를 트리거한다.

**Architecture:** cms/ 폴더에 Express 백엔드 + Vite React 클라이언트. API가 파일시스템 기반으로 courses/, index/ 읽기·쓰기. 배포 시 child_process로 git 명령 실행.

**Tech Stack:** Node.js, Express, React, Vite, @uiw/react-md-editor, Tailwind CSS

**참조:** [2026-02-26-cms-ui-design.md](./2026-02-26-cms-ui-design.md)

---

## Task 1: CMS 프로젝트 뼈대

**Files:**
- Create: `cms/package.json`
- Create: `cms/server/package.json`
- Create: `cms/client/package.json`
- Create: `cms/server/index.js`
- Create: `cms/client/index.html`
- Create: `cms/client/src/main.jsx`
- Create: `cms/client/src/App.jsx`

**Step 1:** cms/package.json 생성 (concurrently로 server + client 동시 실행)

```json
{
  "name": "content-hub-cms",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

**Step 2:** cms/server/package.json 생성

```json
{
  "name": "cms-server",
  "type": "module",
  "scripts": {
    "dev": "node index.js"
  },
  "dependencies": {
    "express": "^4.21.0",
    "cors": "^2.8.5"
  }
}
```

**Step 3:** cms/server/index.js 생성 (기본 Express + CORS, 프로젝트 루트 CWD 설정)

```javascript
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../..');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(PROJECT_ROOT, 'cms/client/dist')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, root: PROJECT_ROOT });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`CMS API http://localhost:${PORT}`));
```

**Step 4:** cms/client/package.json 생성 (Vite + React)

```json
{
  "name": "cms-client",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.26.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.4.0"
  }
}
```

**Step 5:** cms/client/vite.config.js 생성 (API 프록시)

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: { port: 3000, proxy: { '/api': 'http://localhost:3001' } }
});
```

**Step 6:** cms/client/index.html, main.jsx, App.jsx 기본 생성

**Step 7:** cms/ 디렉터리에서 `npm install` 실행, `npm run dev` 동작 확인

**Step 8:** Commit

```bash
git add cms/
git commit -m "feat(cms): add project skeleton"
```

---

## Task 2: API - 강의 목록 및 문서 CRUD

**Files:**
- Create: `cms/server/routes/courses.js`
- Modify: `cms/server/index.js` (라우터 마운트)

**Step 1:** GET /api/courses — courses/ 하위 디렉터리 스캔, 각 course.json 읽기
**Step 2:** GET /api/courses/:id/docs — courses/:id/docs/*.md 목록
**Step 3:** GET /api/courses/:id/docs/:slug — 파일 내용 반환
**Step 4:** PUT /api/courses/:id/docs/:slug — 파일 저장
**Step 5:** POST /api/courses/:id/docs — 새 .md 파일 생성 (body: { slug, content })

**Step 6:** Commit

```bash
git add cms/server/
git commit -m "feat(cms): add courses and docs API"
```

---

## Task 3: API - 메타데이터 및 인덱스

**Files:**
- Create: `cms/server/routes/metadata.js`
- Create: `cms/server/routes/index.js` (index/courses.json)
- Modify: `cms/server/index.js`

**Step 1:** GET/PUT /api/courses/:id/metadata — course.json 읽기·쓰기
**Step 2:** GET/PUT /api/index — index/courses.json 읽기·쓰기

**Step 3:** Commit

```bash
git add cms/server/
git commit -m "feat(cms): add metadata and index API"
```

---

## Task 4: API - 이미지 업로드 및 배포

**Files:**
- Create: `cms/server/routes/upload.js`
- Create: `cms/server/routes/deploy.js`
- Modify: `cms/server/index.js` (multer 추가)

**Step 1:** POST /api/upload/:courseId — multipart/form-data, courses/:id/static/img/ 저장
**Step 2:** POST /api/deploy — child_process.exec('git add . && git commit -m "..." && git push')

**Step 3:** Commit

```bash
git add cms/server/
git commit -m "feat(cms): add upload and deploy API"
```

---

## Task 5: UI - 대시보드 및 라우팅

**Files:**
- Create: `cms/client/src/pages/Dashboard.jsx`
- Create: `cms/client/src/pages/CourseEdit.jsx`
- Create: `cms/client/src/pages/DocEdit.jsx`
- Create: `cms/client/src/pages/IndexEdit.jsx`
- Modify: `cms/client/src/App.jsx` (React Router 설정)

**Step 1:** 대시보드: /api/courses 호출, 강의 목록 표시, 링크
**Step 2:** 라우트: /, /courses/:id, /courses/:id/docs/:slug, /courses/:id/docs/new, /index

**Step 3:** Commit

```bash
git add cms/client/
git commit -m "feat(cms): add dashboard and routing"
```

---

## Task 6: UI - 마크다운 에디터 및 문서 편집

**Files:**
- Modify: `cms/client/package.json` (@uiw/react-md-editor 추가)
- Create: `cms/client/src/components/MarkdownEditor.jsx`
- Modify: `cms/client/src/pages/DocEdit.jsx`

**Step 1:** @uiw/react-md-editor 설치
**Step 2:** DocEdit 페이지에서 GET/PUT API 연동
**Step 3:** 새 문서 생성 플로우 (slug 입력 → 편집 화면)

**Step 4:** Commit

```bash
git add cms/client/
git commit -m "feat(cms): add markdown editor and doc edit"
```

---

## Task 7: UI - 메타데이터·인덱스 폼 및 배포 버튼

**Files:**
- Modify: `cms/client/src/pages/CourseEdit.jsx` (메타데이터 탭)
- Modify: `cms/client/src/pages/IndexEdit.jsx` (courses.json 폼)
- Create: `cms/client/src/components/DeployButton.jsx`
- Modify: `cms/client/src/App.jsx` (상단 DeployButton)

**Step 1:** course.json 필드 폼 (title, description, level, theme 등)
**Step 2:** index/courses.json 편집 (강의 추가/수정)
**Step 3:** DeployButton: POST /api/deploy, 토스트 표시

**Step 4:** Commit

```bash
git add cms/client/
git commit -m "feat(cms): add metadata, index form, deploy button"
```

---

## Task 8: UI - 이미지 업로드 및 스타일링

**Files:**
- Modify: `cms/client/src/pages/DocEdit.jsx` (이미지 업로드 버튼)
- Create: `cms/client/tailwind.config.js` (선택)
- Modify: `cms/client/src/index.css`

**Step 1:** DocEdit에서 이미지 업로드 input → POST /api/upload/:courseId
**Step 2:** 업로드 후 URL을 에디터에 삽입
**Step 3:** 기본 스타일 적용 (레이아웃, 버튼)

**Step 4:** Commit

```bash
git add cms/client/
git commit -m "feat(cms): add image upload and basic styling"
```

---

## Execution Handoff

**Plan complete and saved to `docs/plans/2026-02-26-cms-ui-implementation.md`.**

**Two execution options:**

1. **Subagent-Driven (this session)** — Fresh subagent per task, review between tasks, fast iteration  
2. **Parallel Session (separate)** — Open new session with executing-plans, batch execution with checkpoints

Which approach?

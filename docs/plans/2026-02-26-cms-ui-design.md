# CMS UI 설계 문서

> **프로젝트**: restnfeel.github.io — 바이브코딩 강의 중앙 관리 시스템
> **유형**: 설계 문서 (브레인스토밍 산출물)
> **작성일**: 2026-02-26
> **참조**: [rfp_basic.md](../rfp_basic.md)

---

## 1. 요구사항 요약

| 항목 | 선택 |
|------|------|
| 사용자 | 본인만 (개인) |
| CMS 접속 | 로컬 전용 (localhost) |
| 기능 | 문서 편집, 메타데이터, 인덱스, 이미지 관리 |
| 배포 | "배포" 버튼 클릭 시에만 commit + push |

---

## 2. 아키텍처 개요

```
[브라우저 localhost:3000]
        │
        ▼
┌─────────────────────────────────────┐
│  CMS UI (React SPA)                  │
│  - 강의 목록 / 문서 편집 / 인덱스 관리  │
│  - 마크다운 에디터, 이미지 업로드       │
└─────────────────────────────────────┘
        │  REST API
        ▼
┌─────────────────────────────────────┐
│  CMS 백엔드 (Node.js/Express)         │
│  - courses/ 읽기·쓰기                  │
│  - index/courses.json 읽기·쓰기        │
│  - 정적 파일(이미지) 저장               │
└─────────────────────────────────────┘
        │  파일시스템
        ▼
┌─────────────────────────────────────┐
│  restnfeel.github.io 레포 (로컬)      │
│  courses/, index/, shared/ ...       │
└─────────────────────────────────────┘
```

- CMS는 프로젝트 루트를 기준으로 `courses/`, `index/` 등을 상대 경로로 읽고 씀
- 인증 없음 (로컬 전용)

---

## 3. 디렉터리 구조 및 API

### 3.1 CMS 추가 디렉터리

```
restnfeel.github.io/
├── cms/
│   ├── server/           # Node.js 백엔드
│   │   ├── index.js
│   │   ├── routes/
│   │   └── package.json
│   ├── client/           # React 프론트엔드
│   │   ├── src/
│   │   └── package.json
│   └── package.json      # 루트: server + client 동시 실행
├── courses/
├── index/
└── ...
```

### 3.2 API 엔드포인트

| 메서드 | 경로 | 용도 |
|--------|------|------|
| GET | `/api/courses` | 강의 목록 |
| GET | `/api/courses/:id/docs` | 해당 강의 문서 목록 |
| GET | `/api/courses/:id/docs/:slug` | 문서 내용 |
| PUT | `/api/courses/:id/docs/:slug` | 문서 저장 |
| POST | `/api/courses/:id/docs` | 새 문서 생성 |
| GET/PUT | `/api/courses/:id/metadata` | course.json 읽기·쓰기 |
| GET/PUT | `/api/index` | index/courses.json 읽기·쓰기 |
| POST | `/api/upload/:courseId` | 이미지 업로드 → static/img/ |
| POST | `/api/deploy` | git add → commit → push |

### 3.3 실행 방법

```bash
cd cms && npm run dev   # localhost:3000 (UI) + localhost:3001 (API)
```

---

## 4. UI 화면 구성

| 화면 | 경로 | 기능 |
|------|------|------|
| 대시보드 | `/` | 강의 목록, 메인 인덱스 미리보기 링크 |
| 강의 편집 | `/courses/:id` | 탭: 문서 목록, 메타데이터(course.json) |
| 문서 편집 | `/courses/:id/docs/:slug` | 마크다운 에디터, 미리보기 |
| 새 문서 | `/courses/:id/docs/new` | 제목·파일명 입력 후 편집 화면 이동 |
| 인덱스 관리 | `/index` | courses.json 폼 편집 |
| 공통 | 상단 | "배포" 버튼 → deploy API 호출 |

### 배포 버튼 동작

1. 사용자 "배포" 클릭 → `/api/deploy` POST
2. 백엔드: `git status`로 변경 확인
3. 변경 있으면: `git add .` → `git commit -m "..."` → `git push`
4. 없으면: "변경 사항 없음" 응답
5. 프론트: 성공/실패 토스트 표시

---

## 5. 기술 스택

| 영역 | 선택 |
|------|------|
| 백엔드 | Node.js + Express |
| 프론트엔드 | React + Vite |
| 마크다운 에디터 | @uiw/react-md-editor 또는 react-markdown-editor-lite |
| 스타일링 | Tailwind CSS (또는 간단한 CSS) |

---

## 6. 오류 처리 및 주의사항

- API 에러: 4xx/5xx 시 프론트 토스트 표시
- Git push 실패: 에러 메시지 그대로 노출
- `cms/`는 프로젝트에 포함 (gitignore 아님)
- 실행 시 CWD는 프로젝트 루트 기준

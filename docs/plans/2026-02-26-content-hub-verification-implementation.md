# Content Hub 검증·보완 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** update-index.yml 권한 보완 및 generate-index.js 동작 검증을 통해 Content Hub CI 파이프라인을 안정화한다.

**Architecture:** 설계 문서(2026-02-26-content-hub-design.md)의 Approach A 적용. 기존 구현에 최소 변경만 가한다. update-index 워크플로우에 `permissions: contents: write` 추가 후, generate-index.js 로컬 실행으로 동작을 확인한다.

**Tech Stack:** GitHub Actions, Node.js 20, GITHUB_TOKEN

---

## Task 1: update-index.yml 권한 보완

**Files:**
- Modify: `.github/workflows/update-index.yml`

**Step 1: Add permissions block**

`update-index.yml`의 `jobs.update` 아래, `runs-on` 다음에 `permissions` 블록을 추가한다.

```yaml
jobs:
  update:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
```

**Step 2: Verify YAML syntax**

Run: `cat .github/workflows/update-index.yml | head -20`

Expected: `permissions:` 및 `contents: write`가 jobs.update 바로 아래에 있어야 함.

**Step 3: Commit**

```bash
git add .github/workflows/update-index.yml
git commit -m "fix(ci): add contents: write permission to update-index workflow"
```

---

## Task 2: generate-index.js 동작 검증

**Files:**
- Verify: `scripts/generate-index.js`
- Verify: `index/courses.json`
- Output: `index.html` (generated)

**Step 1: Run generate-index.js**

Run: `node scripts/generate-index.js`

Expected output: `✅  index.html 생성 완료 (강의 수: 2)` 또는 유사 메시지

**Step 2: Verify index.html exists**

Run: `head -30 index.html`

Expected: `<!DOCTYPE html>`, `<title>`, `디지로그랩스` 등 포함. 에러 없이 파일이 생성되어야 함.

**Step 3: Commit (if index.html changed)**

```bash
git add index.html
git status
# 변경이 있다면: git commit -m "chore: regenerate index.html"
```

---

## Checklist: 1회성 초기 설정 (사용자 수행)

구현 후, 배포가 정상 동작하려면 아래를 수동으로 설정해야 한다. RFP §6 참조.

- [ ] GitHub PAT 생성 (repo 권한) → `DEPLOY_TOKEN` 시크릿 등록
- [ ] `vibe_coding_basic` gh-pages: Source = gh-pages branch
- [ ] `vibe_coding_effiency` gh-pages: Source = gh-pages branch

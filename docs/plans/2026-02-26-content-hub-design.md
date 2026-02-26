# Content Hub 검증·보완 설계

> **프로젝트**: restnfeel.github.io — 바이브코딩 강의 중앙 관리 시스템
> **유형**: 설계 문서 (Approach A: 검증·보완 중심)
> **작성일**: 2026-02-26
> **참조**: [rfp_basic.md](../rfp_basic.md)

---

## 1. 설계 개요

RFP(rfp_basic.md)에 정의된 Content Hub 모놀리식 관리 시스템은 이미 대부분 구현되어 있다. 본 설계는 **갭·위험 요소만 최소한으로 보완**하는 방향으로 진행한다.

### 설계 원칙

- **YAGNI**: 현재 필요한 것만 구현
- **최소 변경**: 기존 동작 유지
- **검증 우선**: CI 동작·권한 이슈 해결

---

## 2. 현재 상태 vs RFP 갭 분석

| 구성요소 | RFP 명세 | 현재 구현 | 상태 |
|----------|----------|-----------|------|
| 디렉터리 구조 | courses/, shared/, index/, scripts/ | 존재 | ✅ 일치 |
| index/courses.json | 단일 데이터 소스 | basic, effiency 2개 등록 | ✅ 완료 |
| scripts/generate-index.js | courses.json → index.html | 테마, active 필터 포함 | ✅ 완료 |
| deploy-basic.yml | courses/basic/** 트리거 | paths, peaceiris 배포 | ✅ 완료 |
| deploy-effiency.yml | courses/effiency/** 트리거 | 동일 | ✅ 완료 |
| update-index.yml | index.json 변경 시 index.html 재생성 | 구현됨 | ⚠️ 권한 확인 필요 |
| shared/docusaurus-base | course.json 동적 로드 | fallback 포함 | ✅ 완료 |
| courses/*/course.json | 강의별 메타데이터 | basic, effiency | ✅ 완료 |

---

## 3. 보완 작업 명세

### 3.1 update-index.yml 권한 보완

**문제**: `GITHUB_TOKEN` 기본 권한으로 `git push` 시 `contents: write` 부족 가능성.

**해결**: 워크플로우에 `permissions` 블록 추가.

```yaml
jobs:
  update:
    runs-on: ubuntu-latest
    permissions:
      contents: write   # index.html 커밋·푸시에 필요
    steps:
      # ...
```

### 3.2 generate-index.js 동작 검증

- 로컬에서 `node scripts/generate-index.js` 실행
- `index.html` 생성 여부 확인
- 출력 메시지로 active 강의 수 확인

### 3.3 1회성 초기 설정 (사용자 수행)

RFP §6에 정의된 수동 절차. 설계 문서에 요약만 포함.

| 단계 | 작업 | 담당 |
|------|------|------|
| 1 | GitHub PAT 생성 (repo 권한) | 사용자 |
| 2 | `DEPLOY_TOKEN` 시크릿 등록 | 사용자 |
| 3 | vibe_coding_basic, vibe_coding_effiency의 gh-pages 설정 | 사용자 |

---

## 4. 제외 항목 (YAGNI)

- E2E 검증 스크립트 (`scripts/validate.js`): 추후 필요 시 검토
- deploy 워크플로우 통합/템플릿화: 현재 2개 강의만 있어 불필요
- 추가 자동화: RFP 범위 외

---

## 5. 승인 정보

- **선택된 접근법**: Approach A (검증·보완 중심)
- **승인 시점**: 2026-02-26
- **다음 단계**: writing-plans 스킬로 구현 계획 생성

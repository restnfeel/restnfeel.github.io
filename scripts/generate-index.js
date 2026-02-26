#!/usr/bin/env node
/**
 * generate-index.js
 *
 * index/courses.json 을 읽어 index.html 을 자동 생성합니다.
 * 강의 추가·수정은 index/courses.json 만 편집하세요.
 *
 * 사용법:
 *   node scripts/generate-index.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT        = path.join(__dirname, '..');
const COURSES_JSON = path.join(ROOT, 'index', 'courses.json');
const OUTPUT_HTML  = path.join(ROOT, 'index.html');

// ── 데이터 로드 ────────────────────────────────────────────────────────────────
const { site, courses } = JSON.parse(fs.readFileSync(COURSES_JSON, 'utf8'));

// ── 테마 팔레트 (theme: "a" | "b" | "c" | "d" | ...) ─────────────────────────
const THEMES = {
  a: {
    barGrad:      'linear-gradient(90deg, #7C3AED, #3B82F6)',
    hoverShadow:  'rgba(124, 58, 237, 0.15)',
    ctaColor:     '#93C5FD',
    ctaBorder:    'rgba(124,58,237,0.28)',
    ctaBg:        'rgba(124,58,237,0.18), rgba(59,130,246,0.18)',
    ctaBgHover:   'rgba(124,58,237,0.32), rgba(59,130,246,0.32)',
    ctaBorderHover: 'rgba(124,58,237,0.45)',
  },
  b: {
    barGrad:      'linear-gradient(90deg, #0EA5E9, #22D3EE)',
    hoverShadow:  'rgba(14, 165, 233, 0.12)',
    ctaColor:     '#67E8F9',
    ctaBorder:    'rgba(14,165,233,0.28)',
    ctaBg:        'rgba(14,165,233,0.18), rgba(34,211,238,0.18)',
    ctaBgHover:   'rgba(14,165,233,0.32), rgba(34,211,238,0.32)',
    ctaBorderHover: 'rgba(14,165,233,0.45)',
  },
  c: {
    barGrad:      'linear-gradient(90deg, #10B981, #34D399)',
    hoverShadow:  'rgba(16, 185, 129, 0.12)',
    ctaColor:     '#6EE7B7',
    ctaBorder:    'rgba(16,185,129,0.28)',
    ctaBg:        'rgba(16,185,129,0.18), rgba(52,211,153,0.18)',
    ctaBgHover:   'rgba(16,185,129,0.32), rgba(52,211,153,0.32)',
    ctaBorderHover: 'rgba(16,185,129,0.45)',
  },
  d: {
    barGrad:      'linear-gradient(90deg, #F59E0B, #FBBF24)',
    hoverShadow:  'rgba(245, 158, 11, 0.12)',
    ctaColor:     '#FDE68A',
    ctaBorder:    'rgba(245,158,11,0.28)',
    ctaBg:        'rgba(245,158,11,0.18), rgba(251,191,36,0.18)',
    ctaBgHover:   'rgba(245,158,11,0.32), rgba(251,191,36,0.32)',
    ctaBorderHover: 'rgba(245,158,11,0.45)',
  },
};

// ── 헬퍼 ──────────────────────────────────────────────────────────────────────
function getTheme(key) {
  return THEMES[key] || THEMES.a;
}

const activeCourses = courses.filter(c => c.status === 'active');

// 사용된 테마에 대한 CSS 동적 생성
const usedThemes = [...new Set(activeCourses.map(c => c.theme || 'a'))];

function buildThemeCss(key) {
  const t = getTheme(key);
  return `
    .card-${key}::before { background: ${t.barGrad}; }
    .card-${key}:hover    { box-shadow: 0 24px 64px ${t.hoverShadow}; }
    .card-${key} .cta {
      background: linear-gradient(135deg, ${t.ctaBg});
      color: ${t.ctaColor};
      border: 1px solid ${t.ctaBorder};
    }
    .card-${key} .cta:hover {
      background: linear-gradient(135deg, ${t.ctaBgHover});
      border-color: ${t.ctaBorderHover};
    }`;
}

const themeCss = usedThemes.map(buildThemeCss).join('\n');

// 카드 애니메이션 (각 테마의 첫 번째 카드 기준)
const cardAnimCss = activeCourses.map((c, i) => {
  const delay = (0.48 + i * 0.07).toFixed(2);
  return `    .grid > .card-${c.theme || 'a'}:nth-child(${i + 1}) { animation: fadeUp 0.55s ${delay}s ease both; }`;
}).join('\n');

// ── 카드 렌더 ─────────────────────────────────────────────────────────────────
function renderCard(course) {
  const themeKey = course.theme || 'a';
  const descHtml = course.description.split('\n').join('<br />');
  const tagsHtml = course.tags
    .map(tag => `<span class="tag">${escHtml(tag)}</span>`)
    .join('\n            ');

  return `
        <!-- ${escHtml(course.title)} -->
        <a href="${course.url}" target="_blank" rel="noopener" class="card card-${themeKey}">
          <div class="card-watermark" aria-hidden="true">${course.chapters}</div>
          <div class="card-top">
            <div class="badges">
              <span class="badge b-free">FREE</span>
              <span class="badge b-level">${escHtml(course.level)}</span>
            </div>
            <span class="card-meta">${course.chapters} chapters</span>
          </div>
          <h2 class="card-title">${escHtml(course.title)}</h2>
          <p class="card-desc">
            ${descHtml}
          </p>
          <div class="tags">
            ${tagsHtml}
          </div>
          <span class="cta">
            강의 시작하기
            <svg class="cta-ico" width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 6.5H12M12 6.5L7 1.5M12 6.5L7 11.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </a>`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const cardsHtml = activeCourses.map(renderCard).join('\n');

// ── HTML 생성 ─────────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${escHtml(site.description)}" />
  <meta property="og:title" content="${escHtml(site.title)}" />
  <meta property="og:description" content="${escHtml(site.description)}" />
  <meta property="og:type" content="website" />
  <title>${escHtml(site.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:           #060A14;
      --surface:      #0C1628;
      --card:         #0F1B2D;
      --border:       rgba(148, 163, 184, 0.07);
      --border-hi:    rgba(148, 163, 184, 0.14);
      --text-1:       #F1F5F9;
      --text-2:       #94A3B8;
      --text-3:       #475569;
      --grad-1a:      #7C3AED;
      --grad-1b:      #3B82F6;
      --grad-2a:      #0EA5E9;
      --grad-2b:      #22D3EE;
      --green:        #10B981;
      --amber:        #F59E0B;
    }

    html { scroll-behavior: smooth; }

    body {
      background-color: var(--bg);
      color: var(--text-1);
      font-family: 'Noto Sans KR', sans-serif;
      font-weight: 400;
      line-height: 1.6;
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* ── BACKGROUND ── */
    .bg-layer {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }
    .bg-layer::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 70% 55% at 15% 15%, rgba(124, 58, 237, 0.13) 0%, transparent 60%),
        radial-gradient(ellipse 55% 70% at 85% 85%, rgba(14, 165, 233, 0.1) 0%, transparent 60%),
        radial-gradient(ellipse 45% 45% at 55% 45%, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
      animation: bgDrift 14s ease-in-out infinite alternate;
    }
    .bg-layer::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(148, 163, 184, 0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(148, 163, 184, 0.025) 1px, transparent 1px);
      background-size: 52px 52px;
    }
    @keyframes bgDrift {
      0%   { transform: translate(0, 0) scale(1); }
      40%  { transform: translate(-1.5%, 2%) scale(1.02); }
      100% { transform: translate(1.5%, -1%) scale(0.99); }
    }

    /* ── LAYOUT ── */
    .wrap {
      position: relative;
      z-index: 1;
      max-width: 1080px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* ── NAV ── */
    nav {
      padding: 28px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-brand {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--text-3);
      text-decoration: none;
      transition: color 0.2s;
    }
    .nav-brand:hover { color: var(--text-2); }
    .nav-live {
      display: flex;
      align-items: center;
      gap: 7px;
      font-family: 'Space Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.1em;
      color: var(--text-3);
      text-transform: uppercase;
    }
    .live-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 6px var(--green);
      animation: blink 2.2s ease-in-out infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.45; }
    }

    /* ── HERO ── */
    .hero { padding: 76px 0 68px; text-align: center; }
    .hero-label {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: 'Space Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--text-3);
      margin-bottom: 30px;
      animation: fadeUp 0.55s 0.05s ease both;
    }
    .hero-label em { font-style: normal; color: var(--green); }
    .hero-label-sep { opacity: 0.3; }
    .hero-ko {
      font-family: 'Noto Sans KR', sans-serif;
      font-weight: 700;
      font-size: clamp(30px, 5.5vw, 56px);
      line-height: 1.2;
      color: var(--text-1);
      letter-spacing: -0.01em;
      margin-bottom: 10px;
      animation: fadeUp 0.55s 0.12s ease both;
    }
    .hero-en {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: clamp(54px, 10vw, 108px);
      line-height: 0.92;
      letter-spacing: -0.04em;
      background: linear-gradient(130deg, var(--grad-1a) 0%, var(--grad-1b) 45%, var(--grad-2b) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 28px;
      animation: fadeUp 0.55s 0.2s ease both;
    }
    .hero-tagline {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.14em;
      color: var(--text-3);
      text-transform: uppercase;
      margin-bottom: 18px;
      animation: fadeUp 0.55s 0.28s ease both;
    }
    .hero-desc {
      max-width: 460px;
      margin: 0 auto;
      font-size: 14.5px;
      font-weight: 300;
      color: var(--text-2);
      line-height: 1.85;
      animation: fadeUp 0.55s 0.35s ease both;
    }

    /* ── DIVIDER ── */
    .rule {
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, var(--border-hi) 30%, var(--border-hi) 70%, transparent 100%);
    }

    /* ── COURSES ── */
    .courses { padding: 64px 0 16px; }
    .sec-label {
      font-family: 'Space Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.26em;
      color: var(--text-3);
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 36px;
      animation: fadeUp 0.55s 0.4s ease both;
    }
    .sec-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
    }
    @media (max-width: 680px) {
      .grid { grid-template-columns: 1fr; }
    }

    /* ── CARD ── */
    .card {
      position: relative;
      display: block;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 30px 28px;
      overflow: hidden;
      text-decoration: none;
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .card:hover { transform: translateY(-5px); border-color: var(--border-hi); }
    .card:hover::before { opacity: 1; }
    ${themeCss}

    /* watermark */
    .card-watermark {
      position: absolute;
      bottom: -24px; right: -8px;
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 128px;
      line-height: 1;
      color: rgba(255, 255, 255, 0.025);
      pointer-events: none;
      user-select: none;
      letter-spacing: -0.05em;
    }
    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
    }
    .badges { display: flex; gap: 6px; }
    .badge {
      font-family: 'Space Mono', monospace;
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 3px 9px;
      border-radius: 100px;
    }
    .b-free {
      background: rgba(16, 185, 129, 0.12);
      color: var(--green);
      border: 1px solid rgba(16, 185, 129, 0.22);
    }
    .b-level {
      background: rgba(255,255,255,0.04);
      color: var(--text-3);
      border: 1px solid var(--border);
    }
    .card-meta { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--text-3); }
    .card-title {
      font-family: 'Noto Sans KR', sans-serif;
      font-weight: 700;
      font-size: 21px;
      color: var(--text-1);
      line-height: 1.3;
      margin-bottom: 10px;
    }
    .card-desc {
      font-size: 13.5px;
      font-weight: 300;
      color: var(--text-2);
      line-height: 1.8;
      margin-bottom: 22px;
    }
    .tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 26px; }
    .tag {
      font-family: 'Space Mono', monospace;
      font-size: 9.5px;
      color: var(--text-3);
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 3px 8px;
    }
    .cta {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-family: 'Noto Sans KR', sans-serif;
      font-weight: 500;
      font-size: 13px;
      padding: 10px 18px;
      border-radius: 8px;
      transition: background 0.2s ease, border-color 0.2s ease;
    }
    .cta-ico { transition: transform 0.2s ease; }
    .cta:hover .cta-ico { transform: translateX(3px); }

    /* ── COMING SOON ── */
    .coming { padding: 20px 0 72px; animation: fadeUp 0.55s 0.62s ease both; }
    .coming-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      background: rgba(255,255,255,0.02);
      border: 1px dashed rgba(148,163,184,0.1);
      border-radius: 12px;
      padding: 22px 28px;
    }
    @media (max-width: 500px) {
      .coming-inner { flex-direction: column; align-items: flex-start; }
    }
    .coming-text { font-size: 13.5px; font-weight: 300; color: var(--text-3); }
    .coming-text strong { display: block; font-weight: 500; font-size: 14px; color: var(--text-2); margin-bottom: 3px; }
    .coming-badge {
      font-family: 'Space Mono', monospace;
      font-size: 9.5px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--amber);
      background: rgba(245,158,11,0.1);
      border: 1px solid rgba(245,158,11,0.2);
      padding: 6px 14px;
      border-radius: 100px;
      white-space: nowrap;
    }

    /* ── FOOTER ── */
    footer { border-top: 1px solid var(--border); padding: 26px 0; }
    .footer-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .footer-copy { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--text-3); }
    .footer-link {
      font-family: 'Space Mono', monospace;
      font-size: 10px;
      color: var(--text-3);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: color 0.2s;
      letter-spacing: 0.05em;
    }
    .footer-link:hover { color: var(--text-2); }

    /* ── ANIMATIONS ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
${cardAnimCss}
  </style>
</head>
<body>

  <div class="bg-layer" aria-hidden="true"></div>

  <div class="wrap">

    <!-- NAV -->
    <nav>
      <a href="${site.brandUrl}" target="_blank" rel="noopener" class="nav-brand">
        ${escHtml(site.brand)}
      </a>
      <div class="nav-live">
        <div class="live-dot"></div>
        운영 중
      </div>
    </nav>

    <!-- HERO -->
    <header class="hero">
      <div class="hero-label">
        <em>FREE</em>
        <span class="hero-label-sep">/</span>
        VIBE CODING SERIES
      </div>
      <p class="hero-ko">바이브코딩 무료 강의</p>
      <h1 class="hero-en">VIBE CODING</h1>
      <p class="hero-tagline">디지털과 아날로그가 만나는 곳 &nbsp;·&nbsp; Digilog Labs</p>
      <p class="hero-desc">
        AI와 함께 코딩하는 새로운 패러다임.<br />
        처음 시작하는 분부터 비용을 최적화하려는 분까지,<br />
        모든 단계의 학습자를 위한 무료 강의입니다.
      </p>
    </header>

    <div class="rule"></div>

    <!-- COURSES -->
    <section class="courses" aria-label="강의 목록">
      <div class="sec-label">Courses — 강의 목록</div>
      <div class="grid">
${cardsHtml}
      </div>
    </section>

    <!-- COMING SOON -->
    <div class="coming">
      <div class="coming-inner">
        <div class="coming-text">
          <strong>더 많은 강의가 준비 중입니다</strong>
          새로운 바이브코딩 강의가 계속 업데이트될 예정입니다.
        </div>
        <span class="coming-badge">업데이트 예정</span>
      </div>
    </div>

    <!-- FOOTER -->
    <footer>
      <div class="footer-row">
        <span class="footer-copy">${escHtml(site.copyright)}</span>
        <a href="${site.brandUrl}" target="_blank" rel="noopener" class="footer-link">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.1"/>
            <path d="M6 1C4.7 2.7 4 4.3 4 6s.7 3.3 2 5M6 1c1.3 1.7 2 3.3 2 5s-.7 3.3-2 5M1 6h10" stroke="currentColor" stroke-width="1.1"/>
          </svg>
          digiloglabs.com
        </a>
      </div>
    </footer>

  </div>

</body>
</html>
`;

fs.writeFileSync(OUTPUT_HTML, html, 'utf8');
console.log(`✅  index.html 생성 완료 (강의 수: ${activeCourses.length})`);

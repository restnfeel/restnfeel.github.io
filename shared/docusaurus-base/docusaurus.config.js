// @ts-check

// course.json 은 빌드 시 CI 에서 주입됩니다.
// 로컬 개발 시에는 courses/<id>/course.json 을 루트에 복사하거나
// npm start 대신 content-hub 루트에서 개발하세요.
let course = {
  id: 'course',
  repo: 'course',
  url: 'https://restnfeel.github.io',
  title: '바이브 코딩 강의',
  description: '강의 설명',
  level: '입문',
  chapters: 0,
};

try {
  course = require('./course.json');
} catch (_) {
  // course.json 없을 때 기본값 사용
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: course.title,
  tagline: course.description,
  favicon: 'img/favicon.ico',

  url: 'https://restnfeel.github.io',
  baseUrl: `/${course.repo}/`,

  organizationName: 'restnfeel',
  projectName: course.repo,
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: course.title,
        items: [
          {
            href: 'https://restnfeel.github.io/',
            label: '← 강의 목록',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '강의 시리즈',
            items: [
              {
                label: '전체 강의 목록',
                href: 'https://restnfeel.github.io/',
              },
            ],
          },
          {
            title: '디지로그랩스',
            items: [
              {
                label: 'digiloglabs.com',
                href: 'https://digiloglabs.com',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} 디지로그랩스 주식회사`,
      },
      prism: {
        theme: require('prism-react-renderer').themes.github,
        darkTheme: require('prism-react-renderer').themes.dracula,
      },
    }),
};

module.exports = config;

import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: '대시보드', ariaLabel: '대시보드로 이동' },
  { path: '/index', label: '인덱스', ariaLabel: '인덱스 관리로 이동' },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <a href="#main" className="skip-link">
        본문으로 건너뛰기
      </a>
      <aside
        className="w-64 bg-slate-900 text-white shrink-0 flex flex-col"
        aria-label="사이드바"
      >
        <div className="p-6 border-b border-slate-700">
          <h1 className="font-semibold text-lg tracking-tight">Content Hub CMS</h1>
        </div>
        <nav className="flex-1 p-4" aria-label="메인 네비게이션">
          <ul className="space-y-1">
            {navItems.map(({ path, label, ariaLabel }) => (
              <li key={path}>
                <Link
                  to={path}
                  aria-label={ariaLabel}
                  aria-current={location.pathname === path ? 'page' : undefined}
                  className={`block px-4 py-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                    location.pathname === path
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main id="main" className="flex-1 overflow-auto scroll-mt-4">
        <div className="p-8 max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  );
}

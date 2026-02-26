import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses')
      .then((r) => r.json())
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-slate-500" role="status" aria-live="polite">
        로딩 중…
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 mb-6" style={{ textWrap: 'balance' }}>
        강의 목록
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {courses.length === 0 ? (
          <p className="text-slate-500 col-span-full">등록된 강의가 없습니다.</p>
        ) : (
          courses.map((c) => (
            <Link
              key={c.id}
              to={`/courses/${c.id}`}
              className="card p-5 block hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-xl"
            >
              <h3 className="font-medium text-slate-900 truncate">
                {c.title || c.id}
              </h3>
              {c.level && (
                <span className="inline-block mt-2 text-xs text-slate-500">
                  {c.level}
                </span>
              )}
            </Link>
          ))
        )}
      </div>
      <Link
        to="/index"
        className="inline-block mt-8 text-teal-600 hover:text-teal-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded"
      >
        인덱스 관리 →
      </Link>
    </div>
  );
}

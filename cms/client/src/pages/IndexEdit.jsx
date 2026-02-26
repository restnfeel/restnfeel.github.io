import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function IndexEdit() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/index')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/index', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('저장 실패');
      alert('저장됨');
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-slate-500" role="status" aria-live="polite">
        로딩 중…
      </div>
    );
  }
  if (!data) return <p className="text-slate-500">데이터 없음</p>;

  return (
    <div>
      <Link
        to="/"
        className="inline-block mb-6 text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
      >
        ← 대시보드
      </Link>
      <h2 className="text-2xl font-semibold text-slate-900 mb-6" style={{ textWrap: 'balance' }}>
        인덱스 관리
      </h2>
      <div className="card p-6 space-y-6">
        <section>
          <h3 className="font-medium text-slate-900 mb-4">사이트 설정</h3>
          <div>
            <label htmlFor="site-title" className="block text-sm font-medium text-slate-700 mb-1">
              제목
            </label>
            <input
              id="site-title"
              type="text"
              name="siteTitle"
              autoComplete="off"
              value={data.site?.title || ''}
              onChange={(e) => setData({ ...data, site: { ...data.site, title: e.target.value } })}
              className="input max-w-md"
            />
          </div>
        </section>
        <section>
          <h3 className="font-medium text-slate-900 mb-4">강의 목록</h3>
          <div className="space-y-6">
            {data.courses?.map((c, i) => (
              <div
                key={c.id}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-4"
              >
                <div>
                  <label htmlFor={`course-${i}-title`} className="block text-sm font-medium text-slate-700 mb-1">
                    제목
                  </label>
                  <input
                    id={`course-${i}-title`}
                    type="text"
                    value={c.title || ''}
                    onChange={(e) => {
                      const courses = [...data.courses];
                      courses[i] = { ...courses[i], title: e.target.value };
                      setData({ ...data, courses });
                    }}
                    className="input max-w-md"
                  />
                </div>
                <div>
                  <label htmlFor={`course-${i}-desc`} className="block text-sm font-medium text-slate-700 mb-1">
                    설명
                  </label>
                  <textarea
                    id={`course-${i}-desc`}
                    rows={2}
                    value={c.description || ''}
                    onChange={(e) => {
                      const courses = [...data.courses];
                      courses[i] = { ...courses[i], description: e.target.value };
                      setData({ ...data, courses });
                    }}
                    className="input max-w-xl"
                  />
                </div>
                <div className="flex gap-4">
                  <div>
                    <label htmlFor={`course-${i}-level`} className="block text-sm font-medium text-slate-700 mb-1">
                      레벨
                    </label>
                    <select
                      id={`course-${i}-level`}
                      value={c.level || ''}
                      onChange={(e) => {
                        const courses = [...data.courses];
                        courses[i] = { ...courses[i], level: e.target.value };
                        setData({ ...data, courses });
                      }}
                      className="input max-w-[120px]"
                    >
                      <option value="입문">입문</option>
                      <option value="중급">중급</option>
                      <option value="고급">고급</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`course-${i}-status`} className="block text-sm font-medium text-slate-700 mb-1">
                      상태
                    </label>
                    <select
                      id={`course-${i}-status`}
                      value={c.status || 'active'}
                      onChange={(e) => {
                        const courses = [...data.courses];
                        courses[i] = { ...courses[i], status: e.target.value };
                        setData({ ...data, courses });
                      }}
                      className="input max-w-[140px]"
                    >
                      <option value="active">active</option>
                      <option value="coming-soon">coming-soon</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="btn-primary disabled:opacity-60"
        >
          {saving ? '저장 중…' : '저장'}
        </button>
      </div>
    </div>
  );
}

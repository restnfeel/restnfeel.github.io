import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CourseEdit() {
  const { id } = useParams();
  const [tab, setTab] = useState('docs');
  const [docs, setDocs] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/courses/${id}/docs`).then((r) => r.json()),
      fetch(`/api/courses/${id}/metadata`).then((r) => r.json()).catch(() => ({})),
    ])
      .then(([d, m]) => {
        setDocs(d);
        setMeta(m);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const saveMeta = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/courses/${id}/metadata`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meta),
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

  return (
    <div>
      <Link
        to="/"
        className="inline-block mb-6 text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded"
      >
        ← 대시보드
      </Link>
      <h2 className="text-2xl font-semibold text-slate-900 mb-6" style={{ textWrap: 'balance' }}>
        {id}
      </h2>
      <div className="flex gap-2 mb-6" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'docs'}
          aria-controls="tab-docs"
          id="tab-docs-btn"
          onClick={() => setTab('docs')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
            tab === 'docs' ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          문서
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'meta'}
          aria-controls="tab-meta"
          id="tab-meta-btn"
          onClick={() => setTab('meta')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
            tab === 'meta' ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          메타데이터
        </button>
      </div>
      {tab === 'docs' && (
        <div id="tab-docs" role="tabpanel" aria-labelledby="tab-docs-btn" className="card p-6">
          <h3 className="font-medium text-slate-900 mb-4">문서 목록</h3>
          <ul className="space-y-2">
            {docs.map((s) => (
              <li key={s}>
                <Link
                  to={`/courses/${id}/docs/${s}`}
                  className="text-teal-600 hover:text-teal-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded"
                >
                  {s}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to={`/courses/${id}/docs/new`}
            className="inline-block mt-4 btn-primary"
          >
            + 새 문서
          </Link>
        </div>
      )}
      {tab === 'meta' && (
        <div id="tab-meta" role="tabpanel" aria-labelledby="tab-meta-btn" className="card p-6 space-y-4">
          <div>
            <label htmlFor="meta-title" className="block text-sm font-medium text-slate-700 mb-1">
              제목
            </label>
            <input
              id="meta-title"
              type="text"
              name="title"
              autoComplete="off"
              value={meta.title || ''}
              onChange={(e) => setMeta({ ...meta, title: e.target.value })}
              className="input max-w-md"
            />
          </div>
          <div>
            <label htmlFor="meta-desc" className="block text-sm font-medium text-slate-700 mb-1">
              설명
            </label>
            <textarea
              id="meta-desc"
              name="description"
              rows={3}
              value={meta.description || ''}
              onChange={(e) => setMeta({ ...meta, description: e.target.value })}
              className="input max-w-xl"
            />
          </div>
          <div className="flex gap-6">
            <div>
              <label htmlFor="meta-level" className="block text-sm font-medium text-slate-700 mb-1">
                레벨
              </label>
              <select
                id="meta-level"
                name="level"
                value={meta.level || ''}
                onChange={(e) => setMeta({ ...meta, level: e.target.value })}
                className="input max-w-[140px]"
              >
                <option value="입문">입문</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
              </select>
            </div>
            <div>
              <label htmlFor="meta-chapters" className="block text-sm font-medium text-slate-700 mb-1">
                챕터 수
              </label>
              <input
                id="meta-chapters"
                type="number"
                name="chapters"
                min={0}
                value={meta.chapters ?? 0}
                onChange={(e) => setMeta({ ...meta, chapters: +e.target.value })}
                className="input max-w-[100px] tabular-nums"
              />
            </div>
            <div>
              <label htmlFor="meta-theme" className="block text-sm font-medium text-slate-700 mb-1">
                테마
              </label>
              <select
                id="meta-theme"
                name="theme"
                value={meta.theme || 'a'}
                onChange={(e) => setMeta({ ...meta, theme: e.target.value })}
                className="input max-w-[80px]"
              >
                <option value="a">a</option>
                <option value="b">b</option>
                <option value="c">c</option>
                <option value="d">d</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={saveMeta}
            disabled={saving}
            className="btn-primary disabled:opacity-60"
          >
            {saving ? '저장 중…' : '저장'}
          </button>
        </div>
      )}
    </div>
  );
}

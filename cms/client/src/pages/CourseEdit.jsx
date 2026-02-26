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

  if (loading) return <p>로딩 중...</p>;

  return (
    <div>
      <h2>강의: {id}</h2>
      <p><Link to="/">← 대시보드</Link></p>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setTab('docs')} style={{ marginRight: 8 }}>문서</button>
        <button onClick={() => setTab('meta')}>메타데이터</button>
      </div>
      {tab === 'docs' && (
        <>
          <h3>문서 목록</h3>
          <ul>
            {docs.map((s) => (
              <li key={s}>
                <Link to={`/courses/${id}/docs/${s}`}>{s}</Link>
              </li>
            ))}
          </ul>
          <p><Link to={`/courses/${id}/docs/new`}>+ 새 문서</Link></p>
        </>
      )}
      {tab === 'meta' && (
        <div>
          <p>
            제목: <input value={meta.title || ''} onChange={(e) => setMeta({ ...meta, title: e.target.value })} style={{ width: 300 }} />
          </p>
          <p>
            설명: <textarea value={meta.description || ''} onChange={(e) => setMeta({ ...meta, description: e.target.value })} rows={3} style={{ width: 400 }} />
          </p>
          <p>
            레벨: <select value={meta.level || ''} onChange={(e) => setMeta({ ...meta, level: e.target.value })}>
              <option value="입문">입문</option>
              <option value="중급">중급</option>
              <option value="고급">고급</option>
            </select>
          </p>
          <p>
            챕터 수: <input type="number" value={meta.chapters || 0} onChange={(e) => setMeta({ ...meta, chapters: +e.target.value })} />
          </p>
          <p>
            테마: <select value={meta.theme || 'a'} onChange={(e) => setMeta({ ...meta, theme: e.target.value })}>
              <option value="a">a</option>
              <option value="b">b</option>
              <option value="c">c</option>
              <option value="d">d</option>
            </select>
          </p>
          <button onClick={saveMeta} disabled={saving}>{saving ? '저장 중...' : '저장'}</button>
        </div>
      )}
    </div>
  );
}

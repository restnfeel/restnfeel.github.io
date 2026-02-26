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

  if (loading) return <p>로딩 중...</p>;
  if (!data) return <p>데이터 없음</p>;

  return (
    <div>
      <h2>인덱스 관리</h2>
      <p><Link to="/">← 대시보드</Link></p>
      <h3>사이트 설정</h3>
      <p>제목: <input value={data.site?.title || ''} onChange={(e) => setData({ ...data, site: { ...data.site, title: e.target.value } })} style={{ width: 300 }} /></p>
      <h3>강의 목록</h3>
      {data.courses?.map((c, i) => (
        <div key={c.id} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12 }}>
          <p>제목: <input value={c.title || ''} onChange={(e) => {
            const courses = [...data.courses];
            courses[i] = { ...courses[i], title: e.target.value };
            setData({ ...data, courses });
          }} style={{ width: 300 }} /></p>
          <p>설명: <textarea value={c.description || ''} onChange={(e) => {
            const courses = [...data.courses];
            courses[i] = { ...courses[i], description: e.target.value };
            setData({ ...data, courses });
          }} rows={2} style={{ width: 400 }} /></p>
          <p>레벨: <select value={c.level || ''} onChange={(e) => {
            const courses = [...data.courses];
            courses[i] = { ...courses[i], level: e.target.value };
            setData({ ...data, courses });
          }}>
            <option value="입문">입문</option>
            <option value="중급">중급</option>
            <option value="고급">고급</option>
          </select></p>
          <p>상태: <select value={c.status || 'active'} onChange={(e) => {
            const courses = [...data.courses];
            courses[i] = { ...courses[i], status: e.target.value };
            setData({ ...data, courses });
          }}>
            <option value="active">active</option>
            <option value="coming-soon">coming-soon</option>
          </select></p>
        </div>
      ))}
      <button onClick={save} disabled={saving}>{saving ? '저장 중...' : '저장'}</button>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MarkdownEditor from '../components/MarkdownEditor';

export default function DocEdit() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const isNew = slug === 'new';
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [newSlug, setNewSlug] = useState('');

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/courses/${id}/docs/${slug}`)
      .then((r) => r.json())
      .then((d) => setContent(d.content || ''))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, slug, isNew]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const targetSlug = isNew ? newSlug : slug;
      if (!targetSlug) {
        alert('파일명을 입력하세요.');
        return;
      }
      if (isNew) {
        const res = await fetch(`/api/courses/${id}/docs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: targetSlug, content }),
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.error || '저장 실패');
        navigate(`/courses/${id}/docs/${d.slug}`, { replace: true });
      } else {
        const res = await fetch(`/api/courses/${id}/docs/${targetSlug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.error || '저장 실패');
        alert('저장됨');
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div>
      <p>
        <Link to={`/courses/${id}`}>← {id}</Link>
      </p>
      <h2>문서: {isNew ? '새 문서' : slug}</h2>
      {isNew && (
        <p>
          파일명: <input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="intro" />
        </p>
      )}
      <MarkdownEditor value={content} onChange={setContent} />
      <p style={{ marginTop: 16 }}>
        <button onClick={handleSave} disabled={saving}>
          {saving ? '저장 중...' : '저장'}
        </button>
      </p>
    </div>
  );
}

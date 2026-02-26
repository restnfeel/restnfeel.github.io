import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MarkdownEditor from '../components/MarkdownEditor';

export default function DocEdit() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(`/api/upload/${id}`, { method: 'POST', body: fd });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || '업로드 실패');
      const img = `![${file.name}](${d.url})\n`;
      setContent((c) => (c || '') + img);
    } catch (err) {
      alert(err.message);
    }
    e.target.value = '';
  };

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

  if (loading) {
    return (
      <div className="text-slate-500" role="status" aria-live="polite">
        로딩 중…
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="shrink-0">
      <Link
        to={`/courses/${id}`}
        className="inline-block mb-6 text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded"
      >
        ← {id}
      </Link>
      <h2 className="text-2xl font-semibold text-slate-900 mb-6" style={{ textWrap: 'balance' }}>
        {isNew ? '새 문서' : slug}
      </h2>
      {isNew && (
        <div className="mb-6">
          <label htmlFor="doc-slug" className="block text-sm font-medium text-slate-700 mb-1">
            파일명
          </label>
          <input
            id="doc-slug"
            type="text"
            name="slug"
            autoComplete="off"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            placeholder="intro"
            className="input max-w-xs"
          />
        </div>
      )}
      <div className="mb-4 flex gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          aria-label="이미지 파일 선택"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-secondary"
        >
          이미지 업로드
        </button>
      </div>
      </div>
      <div className="card overflow-hidden flex-1 min-h-[60vh] flex flex-col">
        <MarkdownEditor value={content} onChange={setContent} className="flex-1 min-h-[500px]" />
      </div>
      <div className="shrink-0 pt-4">
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="btn-primary disabled:opacity-60"
      >
        {saving ? '저장 중…' : '저장'}
      </button>
      </div>
    </div>
  );
}

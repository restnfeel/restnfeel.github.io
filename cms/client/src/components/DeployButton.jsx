import { useState } from 'react';

export default function DeployButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleDeploy = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/deploy', { method: 'POST' });
      const d = await res.json();
      setMessage(d.ok ? (d.message || '배포 완료') : (d.error || '배포 실패'));
      if (!d.ok) setLoading(false);
    } catch (e) {
      setMessage('오류: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3" role="status" aria-live="polite" aria-atomic="true">
      {message && <span className="text-sm text-slate-600">{message}</span>}
      <button
        type="button"
        onClick={handleDeploy}
        disabled={loading}
        aria-label={loading ? '배포 중' : 'Git에 커밋하고 푸시'}
        className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? '배포 중…' : '배포'}
      </button>
    </div>
  );
}

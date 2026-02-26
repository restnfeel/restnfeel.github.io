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
    <div style={{ marginBottom: 16 }}>
      <button onClick={handleDeploy} disabled={loading}>
        {loading ? '배포 중...' : '배포'}
      </button>
      {message && <span style={{ marginLeft: 12 }}>{message}</span>}
    </div>
  );
}

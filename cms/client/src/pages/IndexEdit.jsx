import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function IndexEdit() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/index')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (!data) return <p>데이터 없음</p>;

  return (
    <div>
      <h2>인덱스 관리</h2>
      <p>
        <Link to="/">← 대시보드</Link>
      </p>
      <p>폼은 Task 7에서 추가됩니다.</p>
      <pre style={{ background: '#f5f5f5', padding: 12, overflow: 'auto' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

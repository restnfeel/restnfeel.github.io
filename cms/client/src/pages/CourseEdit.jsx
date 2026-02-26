import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CourseEdit() {
  const { id } = useParams();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/courses/${id}/docs`)
      .then((r) => r.json())
      .then(setDocs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div>
      <h2>강의: {id}</h2>
      <p>
        <Link to="/">← 대시보드</Link>
      </p>
      <h3>문서 목록</h3>
      <ul>
        {docs.map((slug) => (
          <li key={slug}>
            <Link to={`/courses/${id}/docs/${slug}`}>{slug}</Link>
          </li>
        ))}
      </ul>
      <p>
        <Link to={`/courses/${id}/docs/new`}>+ 새 문서</Link>
      </p>
    </div>
  );
}

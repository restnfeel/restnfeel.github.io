import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses')
      .then((r) => r.json())
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div>
      <h2>강의 목록</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {courses.map((c) => (
          <li key={c.id} style={{ marginBottom: 12 }}>
            <Link to={`/courses/${c.id}`} style={{ fontSize: 18 }}>
              {c.title || c.id}
            </Link>
          </li>
        ))}
      </ul>
      <p>
        <Link to="/index">인덱스 관리</Link>
      </p>
    </div>
  );
}

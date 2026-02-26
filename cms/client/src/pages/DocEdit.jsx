import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function DocEdit() {
  const { id, slug } = useParams();
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  return (
    <div>
      <p>
        <Link to={`/courses/${id}`}>← {id}</Link>
      </p>
      <h2>문서: {slug || 'new'}</h2>
      <p>마크다운 에디터는 Task 6에서 추가됩니다.</p>
    </div>
  );
}

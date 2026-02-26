import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CourseEdit from './pages/CourseEdit';
import DocEdit from './pages/DocEdit';
import IndexEdit from './pages/IndexEdit';
import DeployButton from './components/DeployButton';

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
        <h1>Content Hub CMS</h1>
        <DeployButton />
        <nav style={{ marginBottom: 24 }}>
          <a href="/" style={{ marginRight: 16 }}>대시보드</a>
          <a href="/index" style={{ marginRight: 16 }}>인덱스</a>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses/:id" element={<CourseEdit />} />
          <Route path="/courses/:id/docs/new" element={<DocEdit />} />
          <Route path="/courses/:id/docs/:slug" element={<DocEdit />} />
          <Route path="/index" element={<IndexEdit />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

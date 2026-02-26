import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CourseEdit from './pages/CourseEdit';
import DocEdit from './pages/DocEdit';
import IndexEdit from './pages/IndexEdit';
import DeployButton from './components/DeployButton';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <div className="mb-6 flex justify-end">
          <DeployButton />
        </div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses/:id" element={<CourseEdit />} />
          <Route path="/courses/:id/docs/new" element={<DocEdit />} />
          <Route path="/courses/:id/docs/:slug" element={<DocEdit />} />
          <Route path="/index" element={<IndexEdit />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

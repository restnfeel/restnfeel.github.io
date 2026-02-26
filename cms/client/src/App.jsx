import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 20 }}>
        <h1>Content Hub CMS</h1>
        <Routes>
          <Route path="/" element={<p>대시보드</p>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

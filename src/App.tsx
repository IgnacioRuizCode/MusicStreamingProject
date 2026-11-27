import { useEffect } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { AboutPage } from './components/about-us/AboutPage';
import { AboutUsLayout } from './components/about-us/AboutUsLayout';
import './App.css';

function HomePlaceholder() {
  useEffect(() => {
    document.title = 'CODIFY · Inicio';
  }, []);

  return (
    <div className="home-placeholder">
      <h1>CODIFY</h1>
      <p>Tu música, en un solo lugar.</p>
      <Link to="/nosotros">Conocé al equipo</Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AboutUsLayout />}>
          <Route path="/" element={<HomePlaceholder />} />
          <Route path="/nosotros" element={<AboutPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

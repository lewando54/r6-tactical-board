import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import MapPage from './pages/MapPage';
import './index.css'; // Importuj style Tailwind

function App() {
  return (
    // Suspense jest potrzebny dla i18next podczas ładowania tłumaczeń
    <Suspense fallback="Loading...">
      <Router>
        <div className="app-container w-screen h-screen overflow-hidden">
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/map/:mapId" element={<MapPage />} />
            {/* Możesz dodać inne ścieżki, np. 404 */}
          </Routes>
        </div>
      </Router>
    </Suspense>
  );
}

export default App;
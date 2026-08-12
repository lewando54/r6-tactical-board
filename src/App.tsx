import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import MapPage from './pages/MapPage';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="app-container h-screen w-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/map/:mapId" element={<MapPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

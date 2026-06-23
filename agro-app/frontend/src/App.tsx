import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
// Import page components
import Dashboard from './pages/Dashboard';
import Seeds from './pages/Seeds';
import Diagnosis from './pages/Diagnosis';
import Recommendations from './pages/Recommendations';
import Weather from './pages/Weather';
import Calculator from './pages/Calculator';
import ChatPage from './pages/Chat';
import Map from './pages/Map';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/seeds" element={<Seeds />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/map" element={<Map />} />
          {/* Redirect unknown paths to home */}
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
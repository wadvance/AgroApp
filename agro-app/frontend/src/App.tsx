import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
// Import page components
import Dashboard from './pages/Dashboard';
import Seeds from './pages/Seeds';
import Diagnosis from './pages/Diagnosis';
import Recommendations from './pages/Recommendations';
import Weather from './pages/Weather';
import Calculator from './pages/Calculator';
import Chat from './pages/Chat';
import Map from './pages/Map';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/seeds" element={<Seeds />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/map" element={<Map />} />
          {/* Redirect unknown paths to home */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
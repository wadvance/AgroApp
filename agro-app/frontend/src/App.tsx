import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
// Import page components
import Dashboard from './pages/Dashboard';
import Seeds from './pages/Seeds';
import Diagnosis from './pages/Diagnosis';
import Recommendations from './pages/Recommendations';
import Weather from './pages/Weather';
import Calculator from './pages/Calculator';
import ChatPage from './pages/Chat';
import Map from './pages/Map';
import CropManagement from './pages/CropManagement';
import Irrigation from './pages/Irrigation';
import CalendarPage from './pages/Calendar';
import Profile from './pages/Profile';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, textAlign: 'center' }}>
          <h1>Error al cargar la aplicación</h1>
          <pre style={{ color: 'red' }}>{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/seeds" element={<Seeds />} />
            <Route path="/diagnosis" element={<Diagnosis />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/map" element={<Map />} />
            <Route path="/crops" element={<CropManagement />} />
            <Route path="/irrigation" element={<Irrigation />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/profile" element={<Profile />} />
            {/* Redirect unknown paths to home */}
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </HashRouter>
  );
}

export default App;
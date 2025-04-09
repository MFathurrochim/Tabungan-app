import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TransaksiPage from './pages/TransaksiPage';
import TargetPage from './pages/TargetPage';
import JadwalPage from './pages/JadwalPage';
import StatistikPage from './pages/Statistik';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/transaksi" element={<TransaksiPage />} />
            <Route path="/target" element={<TargetPage />} />
            <Route path="/jadwal" element={<JadwalPage />} />
            <Route path="/statistik" element={<StatistikPage />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../services/api';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [saldo, setSaldo] = useState(0);
  const [transaksi, setTransaksi] = useState([]);
  const [targets, setTargets] = useState([]);
  const [jadwal, setJadwal] = useState([]);
  const [statistik, setStatistik] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSaldo = async () => {
    try {
      const data = await api.getSaldo();
      setSaldo(data.total);
    } catch (err) {
      console.error('Error fetching saldo:', err);
      setError('Gagal memuat saldo');
    }
  };

  const fetchTransaksi = async () => {
    try {
      const data = await api.getTransaksi();
      setTransaksi(data);
    } catch (err) {
      console.error('Error fetching transaksi:', err);
      setError('Gagal memuat transaksi');
    }
  };

  const fetchTargets = async () => {
    try {
      const data = await api.getTarget();
      setTargets(data);
    } catch (err) {
      console.error('Error fetching targets:', err);
      setError('Gagal memuat target tabungan');
    }
  };

  const fetchJadwal = async () => {
    try {
      const data = await api.getJadwal();
      setJadwal(data);
    } catch (err) {
      console.error('Error fetching jadwal:', err);
      setError('Gagal memuat jadwal transaksi');
    }
  };

  const fetchStatistik = async () => {
    try {
      const data = await api.getStatistik();
      setStatistik(data);
    } catch (err) {
      console.error('Error fetching statistik:', err);
      setError('Gagal memuat statistik');
    }
  };

  const addNewTransaksi = async (newTransaksi) => {
    try {
      const result = await api.addTransaksi(newTransaksi);
      setTransaksi([result, ...transaksi]);
      setSaldo(result.current_balance);
      await fetchStatistik(); // Update statistik
      return true;
    } catch (err) {
      console.error('Error adding transaksi:', err);
      setError('Gagal menambahkan transaksi');
      return false;
    }
  };

  const addNewTarget = async (newTarget) => {
    try {
      const result = await api.addTarget(newTarget);
      setTargets([result, ...targets]);
      return true;
    } catch (err) {
      console.error('Error adding target:', err);
      setError('Gagal menambahkan target tabungan');
      return false;
    }
  };

  const updateTargetAmount = async (id, amount) => {
    try {
      const result = await api.updateTarget(id, amount);
      setTargets(targets.map(target => 
        target.id === parseInt(id) 
          ? { ...target, current_amount: result.current_amount, status: result.status } 
          : target
      ));
      return true;
    } catch (err) {
      console.error('Error updating target:', err);
      setError('Gagal mengupdate target tabungan');
      return false;
    }
  };

  const addNewJadwal = async (newJadwal) => {
    try {
      const result = await api.addJadwal(newJadwal);
      setJadwal([result, ...jadwal]);
      return true;
    } catch (err) {
      console.error('Error adding jadwal:', err);
      setError('Gagal menambahkan transaksi terjadwal');
      return false;
    }
  };

  const toggleJadwalStatus = async (id, isActive) => {
    try {
      const result = await api.toggleJadwal(id, isActive);
      setJadwal(jadwal.map(item => 
        item.id === parseInt(id) ? { ...item, is_active: result.is_active } : item
      ));
      return true;
    } catch (err) {
      console.error('Error toggling jadwal:', err);
      setError('Gagal mengubah status transaksi terjadwal');
      return false;
    }
  };

  const clearError = () => setError(null);

  // Load data when app starts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchSaldo(),
          fetchTransaksi(),
          fetchTargets(),
          fetchJadwal(),
          fetchStatistik()
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Gagal memuat data awal');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        saldo,
        transaksi,
        targets,
        jadwal,
        statistik,
        loading,
        error,
        clearError,
        fetchSaldo,
        fetchTransaksi,
        fetchTargets,
        fetchJadwal,
        fetchStatistik,
        addNewTransaksi,
        addNewTarget,
        updateTargetAmount,
        addNewJadwal,
        toggleJadwalStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
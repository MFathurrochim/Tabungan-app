import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL
});

export const getTransaksi = async () => {
  const response = await api.get('/transaksi');
  return response.data;
};

export const addTransaksi = async (transaksi) => {
  const response = await api.post('/transaksi', transaksi);
  return response.data;
};

export const getSaldo = async () => {
  const response = await api.get('/saldo');
  return response.data;
};

export const getTarget = async () => {
  const response = await api.get('/target');
  return response.data;
};

export const addTarget = async (target) => {
  const response = await api.post('/target', target);
  return response.data;
};

export const updateTarget = async (id, amount) => {
  const response = await api.put(`/target/${id}`, { amount });
  return response.data;
};

export const getJadwal = async () => {
  const response = await api.get('/jadwal');
  return response.data;
};

export const addJadwal = async (jadwal) => {
  const response = await api.post('/jadwal', jadwal);
  return response.data;
};

export const toggleJadwal = async (id, is_active) => {
  const response = await api.put(`/jadwal/${id}/toggle`, { is_active });
  return response.data;
};

export const getStatistik = async () => {
  const response = await api.get('/statistik');
  return response.data;
};

export const getLaporan = async (startDate, endDate) => {
  let url = '/laporan';
  if (startDate || endDate) {
    url += '?';
    if (startDate) url += `start_date=${startDate}`;
    if (startDate && endDate) url += '&';
    if (endDate) url += `end_date=${endDate}`;
  }
  const response = await api.get(url);
  return response.data;
};
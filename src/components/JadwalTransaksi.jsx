import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { 
  CalendarIcon, 
  ArrowPathIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const JadwalTransaksi = ({ jadwal, onToggle }) => {
  const [isToggling, setIsToggling] = useState(false);
  
  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await onToggle(jadwal.id, !jadwal.is_active);
    } catch (err) {
      console.error('Error toggling jadwal:', err);
    } finally {
      setIsToggling(false);
    }
  };
  
  const frequencyText = {
    'daily': 'Harian',
    'weekly': 'Mingguan',
    'monthly': 'Bulanan',
    'yearly': 'Tahunan'
  };
  
  return (
    <div className={`card ${jadwal.is_active ? '' : 'opacity-70'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${jadwal.type === 'masuk' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            {jadwal.type === 'masuk' ? (
              <ArrowUpIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <ArrowDownIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
          </div>
          <div className="ml-3">
            <h3 className="font-bold">
              {jadwal.type === 'masuk' ? 'Pemasukan' : 'Pengeluaran'} Terjadwal
            </h3>
            {jadwal.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{jadwal.description}</p>
            )}
          </div>
        </div>
        <div className={`px-2 py-1 text-xs rounded-full ${
          jadwal.is_active 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
        }`}>
          {jadwal.is_active ? 'Aktif' : 'Nonaktif'}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Jumlah</p>
          <p className={`font-semibold ${jadwal.type === 'masuk' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {jadwal.type === 'masuk' ? '+' : '-'}{formatCurrency(jadwal.amount)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Frekuensi</p>
          <p className="font-semibold flex items-center">
            <ArrowPathIcon className="w-4 h-4 mr-1" />
            {frequencyText[jadwal.frequency] || jadwal.frequency}
          </p>
        </div>
      </div>
      
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
        <CalendarIcon className="w-4 h-4 mr-1" />
        <span>Transaksi berikutnya: {formatDate(jadwal.next_date)}</span>
      </div>
      
      <button
        onClick={handleToggle}
        disabled={isToggling}
        className={`w-full btn ${
          jadwal.is_active 
            ? 'btn-outline text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' 
            : 'btn-outline text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
        }`}
      >
        {isToggling ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memproses...
          </span>
        ) : jadwal.is_active ? (
          <span className="flex items-center justify-center">
            <XMarkIcon className="w-5 h-5 mr-1" />
            Nonaktifkan
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <CheckIcon className="w-5 h-5 mr-1" />
            Aktifkan
          </span>
        )}
      </button>
    </div>
  );
};

export default JadwalTransaksi;
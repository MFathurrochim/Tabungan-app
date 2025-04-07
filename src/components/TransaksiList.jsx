import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ArrowUpIcon, ArrowDownIcon, ClockIcon } from '@heroicons/react/24/outline';

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
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const TransaksiList = () => {
  const { transaksi } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Filter and search transactions
  const filteredTransaksi = transaksi.filter(trx => {
    const matchesType = filterType === 'all' || trx.type === filterType;
    const matchesSearch = searchTerm === '' || 
      (trx.category && trx.category.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (trx.description && trx.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesSearch;
  });

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-4">Daftar Transaksi</h2>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            className="input"
            placeholder="Cari transaksi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Semua Transaksi</option>
            <option value="masuk">Pemasukan</option>
            <option value="keluar">Pengeluaran</option>
          </select>
        </div>
      </div>
      
      {filteredTransaksi.length > 0 ? (
        <div className="space-y-3">
          {filteredTransaksi.map((trx) => (
            <div key={trx.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-light transition-colors">
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${trx.type === 'masuk' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                  {trx.type === 'masuk' ? (
                    <ArrowUpIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowDownIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{trx.category || (trx.type === 'masuk' ? 'Pemasukan' : 'Pengeluaran')}</p>
                  {trx.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{trx.description}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {formatDate(trx.date)}
                  </p>
                </div>
              </div>
              <p className={`font-semibold ${trx.type === 'masuk' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trx.type === 'masuk' ? '+' : '-'}{formatCurrency(trx.amount)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {searchTerm || filterType !== 'all' ? (
            <p>Tidak ada transaksi yang cocok dengan filter</p>
          ) : (
            <p>Belum ada transaksi. Tambahkan transaksi baru.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TransaksiList;
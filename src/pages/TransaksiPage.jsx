import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import TransaksiForm from 'src/components/TransaksiForm';
import TransaksiList from 'src/components/TransaksiList';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const TransaksiPage = () => {
  const { saldo } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaksi</h1>
        <div className="mt-3 md:mt-0">
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="btn btn-primary"
          >
            {isFormOpen ? 'Tutup Form' : 'Tambah Transaksi'}
          </button>
        </div>
      </div>
      
      {/* Saldo Card */}
      <div className="card bg-gradient-to-r from-primary to-primary/80 text-white">
        <h2 className="text-lg font-medium opacity-90">Total Saldo</h2>
        <p className="text-3xl font-bold mt-2">{formatCurrency(saldo)}</p>
      </div>

      {/* Transaction Form */}
      {isFormOpen && (
        <TransaksiForm onClose={() => setIsFormOpen(false)} />
      )}
      
      {/* Transaction List */}
      <TransaksiList />
    </div>
  );
};

export default TransaksiPage;
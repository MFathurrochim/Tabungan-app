import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import { ArrowDownIcon, ArrowUpIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

// Custom Target icon
const TargetIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <circle cx="12" cy="12" r="8" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="5" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2" strokeWidth="1.5" />
  </svg>
);

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

const Dashboard = () => {
  const { saldo, transaksi, targets, statistik } = useAppContext();
  
  // Get latest 5 transactions
  const recentTransaksi = transaksi.slice(0, 5);
  
  // Get active targets
  const activeTargets = targets.filter(target => target.status === 'ongoing');

  return (
    <div className="space-y-6">
      {/* Saldo Card */}
      <div className="card bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="flex flex-col">
          <h2 className="text-lg font-medium opacity-90">Total Saldo</h2>
          <p className="text-3xl font-bold mt-2">{formatCurrency(saldo)}</p>
          
          {statistik.bulanan && (
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-sm opacity-90">Pemasukan Bulan Ini</p>
                <p className="text-lg font-semibold flex items-center gap-1 mt-1">
                  <ArrowUpIcon className="w-4 h-4" />
                  {formatCurrency(statistik.bulanan.pemasukan)}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-90">Pengeluaran Bulan Ini</p>
                <p className="text-lg font-semibold flex items-center gap-1 mt-1">
                  <ArrowDownIcon className="w-4 h-4" />
                  {formatCurrency(statistik.bulanan.pengeluaran)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link 
          to="/transaksi" 
          className="card text-center hover:shadow-md transition-shadow"
        >
          <ArrowUpIcon className="w-8 h-8 mx-auto text-green-500" />
          <p className="mt-2 font-medium">Tambah Saldo</p>
        </Link>
        <Link 
          to="/transaksi" 
          className="card text-center hover:shadow-md transition-shadow"
        >
          <ArrowDownIcon className="w-8 h-8 mx-auto text-red-500" />
          <p className="mt-2 font-medium">Kurangi Saldo</p>
        </Link>
        <Link 
          to="/target" 
          className="card text-center hover:shadow-md transition-shadow"
        >
          <TargetIcon className="w-8 h-8 mx-auto text-primary" />
          <p className="mt-2 font-medium">Target Tabungan</p>
        </Link>
        <Link 
          to="/jadwal" 
          className="card text-center hover:shadow-md transition-shadow"
        >
          <CalendarIcon className="w-8 h-8 mx-auto text-blue-500" />
          <p className="mt-2 font-medium">Jadwal Transaksi</p>
        </Link>
      </div>

      {/* Recent Transactions & Active Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Transaksi Terbaru</h2>
            <Link to="/transaksi" className="text-primary text-sm hover:underline">
              Lihat Semua
            </Link>
          </div>
          {recentTransaksi.length > 0 ? (
            <div className="space-y-3">
              {recentTransaksi.map((trx) => (
                <div key={trx.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark rounded-lg">
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
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
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Belum ada transaksi
            </p>
          )}
        </div>

        {/* Active Targets */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Target Tabungan Aktif</h2>
            <Link to="/target" className="text-primary text-sm hover:underline">
              Lihat Semua
            </Link>
          </div>
          {activeTargets.length > 0 ? (
            <div className="space-y-4">
              {activeTargets.map((target) => {
                const percentage = Math.min(Math.round((target.current_amount / target.target_amount) * 100), 100);
                const targetDate = new Date(target.target_date);
                const formattedDate = targetDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
                
                return (
                  <div key={target.id} className="space-y-2">
                    <div className="flex justify-between">
                      <p className="font-medium">{target.nama}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {percentage}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-600 dark:text-gray-400">
                        {formatCurrency(target.current_amount)} / {formatCurrency(target.target_amount)}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 flex items-center">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Belum ada target tabungan aktif
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
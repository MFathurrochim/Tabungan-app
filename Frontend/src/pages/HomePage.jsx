import React from 'react';
import { Link } from 'react-router-dom';
import Dashboard from '../components/dashboard';

const HomePage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="mt-3 sm:mt-0">
          <Link 
            to="/transaksi" 
            className="btn btn-primary inline-flex items-center"
          >
            <span>Tambah Transaksi</span>
          </Link>
        </div>
      </div>
      
      <Dashboard />
    </div>
  );
};

export default HomePage;
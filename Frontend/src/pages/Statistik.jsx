import React from 'react';
import StatistikComponent from '../components/Statistik';

const StatistikPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Statistik</h1>
      <StatistikComponent />
    </div>
  );
};

export default StatistikPage;
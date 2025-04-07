import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Statistik = () => {
  const { transaksi, statistik } = useAppContext();
  const [categoryData, setCategoryData] = useState({ income: [], expense: [] });
  const [timeData, setTimeData] = useState([]);
  
  useEffect(() => {
    if (transaksi.length > 0) {
      const incomeCategories = {};
      const expenseCategories = {};
      
      transaksi.forEach(trx => {
        const category = trx.category || 'Lainnya';
        
        if (trx.type === 'masuk') {
          incomeCategories[category] = (incomeCategories[category] || 0) + trx.amount;
        } else {
          expenseCategories[category] = (expenseCategories[category] || 0) + trx.amount;
        }
      });
      
      setCategoryData({
        income: Object.entries(incomeCategories).map(([category, amount]) => ({ category, amount })),
        expense: Object.entries(expenseCategories).map(([category, amount]) => ({ category, amount }))
      });
      
      const monthlyData = {};
      
      transaksi.forEach(trx => {
        const date = new Date(trx.date);
        const month = date.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[month]) {
          monthlyData[month] = { income: 0, expense: 0 };
        }
        
        if (trx.type === 'masuk') {
          monthlyData[month].income += trx.amount;
        } else {
          monthlyData[month].expense += trx.amount;
        }
      });
      
      const sortedMonths = Object.entries(monthlyData)
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => {
          const dateA = new Date(a.month.split(' ')[1], new Date(Date.parse(`${a.month.split(' ')[0]} 1, 2000`)).getMonth());
          const dateB = new Date(b.month.split(' ')[1], new Date(Date.parse(`${b.month.split(' ')[0]} 1, 2000`)).getMonth());
          return dateA - dateB;
        });
      
      setTimeData(sortedMonths.slice(-6)); // Last 6 months
    }
  }, [transaksi]);
  
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            return `${context.label}: ${formatCurrency(value)}`;
          }
        }
      }
    }
  };
  
  const expensePieData = {
    labels: categoryData.expense.map(item => item.category),
    datasets: [
      {
        data: categoryData.expense.map(item => item.amount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#E7E9ED'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const incomePieData = {
    labels: categoryData.income.map(item => item.category),
    datasets: [
      {
        data: categoryData.income.map(item => item.amount),
        backgroundColor: [
          '#4BC0C0',
          '#36A2EB',
          '#FFCE56',
          '#FF6384',
          '#9966FF',
          '#FF9F40',
          '#E7E9ED'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const barOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        ticks: {
          callback: function(value) {
            return formatCurrency(value).replace('Rp', '');
          }
        }
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            return `${context.dataset.label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
  };
  
  const barData = {
    labels: timeData.map(item => item.month),
    datasets: [
      {
        label: 'Pemasukan',
        data: timeData.map(item => item.income),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
      {
        label: 'Pengeluaran',
        data: timeData.map(item => item.expense),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
    ],
  };
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-r from-primary to-primary/80 text-white">
          <h3 className="text-lg opacity-90 mb-2">Total Saldo</h3>
          <p className="text-2xl font-bold">{formatCurrency(statistik?.total_saldo || 0)}</p>
        </div>
        <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
          <h3 className="text-lg opacity-90 mb-2">Pemasukan Bulan Ini</h3>
          <p className="text-2xl font-bold">{formatCurrency(statistik?.bulanan?.pemasukan || 0)}</p>
        </div>
        <div className="card bg-gradient-to-r from-red-500 to-red-600 text-white">
          <h3 className="text-lg opacity-90 mb-2">Pengeluaran Bulan Ini</h3>
          <p className="text-2xl font-bold">{formatCurrency(statistik?.bulanan?.pengeluaran || 0)}</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Income vs Expense over time */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4">Transaksi Bulanan</h3>
          {timeData.length > 0 ? (
            <Bar options={barOptions} data={barData} />
          ) : (
            <div className="py-10 text-center text-gray-500">
              Belum ada data transaksi
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Kategori Pengeluaran</h3>
            {categoryData.expense.length > 0 ? (
              <Pie data={expensePieData} options={pieOptions} />
            ) : (
              <div className="py-10 text-center text-gray-500">
                Belum ada data pengeluaran
              </div>
            )}
          </div>
          
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Kategori Pemasukan</h3>
            {categoryData.income.length > 0 ? (
              <Pie data={incomePieData} options={pieOptions} />
            ) : (
              <div className="py-10 text-center text-gray-500">
                Belum ada data pemasukan
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistik;
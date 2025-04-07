import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { CalendarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

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

const TargetTabungan = ({ target, onUpdateAmount }) => {
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const percentage = Math.min(Math.round((target.current_amount / target.target_amount) * 100), 100);
  
  const handleAmountChange = (e) => {
    // Only allow numbers
    if (!/^\d*\.?\d*$/.test(e.target.value) && e.target.value !== '') return;
    setAmount(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    
    // Validate
    if (!amount || parseFloat(amount) <= 0) {
      setError('Jumlah harus lebih dari 0');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onUpdateAmount(target.id, parseFloat(amount));
      setAmount('');
      setShowAddFunds(false);
    } catch (err) {
      setError('Gagal menambahkan dana');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const remainingAmount = target.target_amount - target.current_amount;
  const isCompleted = target.status === 'completed';
  
  return (
    <div className={`card border-l-4 ${isCompleted ? 'border-l-green-500' : 'border-l-primary'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold">{target.nama}</h3>
        <div className={`px-2 py-1 text-xs rounded-full ${
          isCompleted 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
            : 'bg-primary/10 text-primary'
        }`}>
          {isCompleted ? 'Selesai' : 'Dalam Proses'}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600 dark:text-gray-400">Progress:</span>
          <span className="text-sm font-medium">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-primary'}`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Target</p>
          <p className="font-semibold">{formatCurrency(target.target_amount)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Terkumpul</p>
          <p className="font-semibold">{formatCurrency(target.current_amount)}</p>
        </div>
      </div>
      
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
        <CalendarIcon className="w-4 h-4 mr-1" />
        <span>Target: {formatDate(target.target_date)}</span>
      </div>
      
      {!isCompleted && (
        <div>
          {!showAddFunds ? (
            <button
              onClick={() => setShowAddFunds(true)}
              className="btn btn-primary w-full"
            >
              Tambah Dana
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              <div>
                <label htmlFor={`amount-${target.id}`} className="label">Jumlah Dana</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400">Rp</span>
                  </div>
                  <input
                    type="text"
                    id={`amount-${target.id}`}
                    className="input pl-10"
                    placeholder="0"
                    value={amount}
                    onChange={handleAmountChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFunds(false)}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      
      {isCompleted && (
        <div className="flex items-center justify-center text-green-600 dark:text-green-400 mt-2">
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          <span>Target tabungan tercapai!</span>
        </div>
      )}
    </div>
  );
};

export default TargetTabungan;
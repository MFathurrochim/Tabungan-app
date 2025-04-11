import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const TransaksiForm = ({ onClose }) => {
  const { addNewTransaksi } = useAppContext();
  const [formData, setFormData] = useState({
    type: 'masuk',
    amount: '',
    category: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      // Only allow numbers
      if (!/^\d*\.?\d*$/.test(value) && value !== '') return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    
    // Validate form
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Jumlah transaksi harus lebih dari 0');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const transaksiData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description
      };
      
      const success = await addNewTransaksi(transaksiData);
      
      if (success) {
        // Reset form and notify parent component
        setFormData({
          type: 'masuk',
          amount: '',
          category: '',
          description: ''
        });
        onClose();
      }
    } catch (err) {
      setError('Gagal menambahkan transaksi');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-4">Tambah Transaksi Baru</h2>
      
      {error && (
        <div className="mb-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Jenis Transaksi</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`flex items-center justify-center p-3 rounded-lg border-2 ${
                formData.type === 'masuk' 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setFormData({ ...formData, type: 'masuk' })}
            >
              <ArrowUpIcon className="w-5 h-5 mr-2 text-green-500" />
              Pemasukan
            </button>
            <button
              type="button"
              className={`flex items-center justify-center p-3 rounded-lg border-2 ${
                formData.type === 'keluar' 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setFormData({ ...formData, type: 'keluar' })}
            >
              <ArrowDownIcon className="w-5 h-5 mr-2 text-red-500" />
              Pengeluaran
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor="amount" className="label">Jumlah</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400">Rp</span>
            </div>
            <input
              type="text"
              id="amount"
              name="amount"
              className="input pl-10"
              placeholder="0"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="category" className="label">Kategori</label>
          <input
            type="text"
            id="category"
            name="category"
            className="input"
            placeholder={formData.type === 'masuk' ? "Contoh: Gaji, Bonus, dll" : "Contoh: Makanan, Transportasi, dll"}
            value={formData.category}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="description" className="label">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            className="input min-h-[80px]"
            placeholder="Deskripsi transaksi (opsional)"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            className="btn btn-outline mr-2"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </span>
            ) : 'Simpan Transaksi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransaksiForm;
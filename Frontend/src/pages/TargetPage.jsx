import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import TargetTabungan from '../components/TargetTabungan';

const TargetPage = () => {
  const { targets, addNewTarget, updateTargetAmount } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    target_amount: '',
    target_date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'target_amount' && !/^\d*\.?\d*$/.test(value) && value !== '') {
      return;
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
    if (!formData.nama) {
      setError('Nama target tidak boleh kosong');
      return;
    }
    
    if (!formData.target_amount || parseFloat(formData.target_amount) <= 0) {
      setError('Jumlah target harus lebih dari 0');
      return;
    }
    
    if (!formData.target_date) {
      setError('Tanggal target tidak boleh kosong');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const targetData = {
        nama: formData.nama,
        target_amount: parseFloat(formData.target_amount),
        target_date: new Date(formData.target_date).toISOString()
      };
      
      const success = await addNewTarget(targetData);
      
      if (success) {
        // Reset form and close it
        setFormData({
          nama: '',
          target_amount: '',
          target_date: ''
        });
        setIsFormOpen(false);
      }
    } catch (err) {
      setError('Gagal menambahkan target tabungan');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Separate targets by status
  const activeTargets = targets.filter(target => target.status === 'ongoing');
  const completedTargets = targets.filter(target => target.status === 'completed');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Target Tabungan</h1>
        <div className="mt-3 md:mt-0">
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="btn btn-primary"
          >
            {isFormOpen ? 'Tutup Form' : 'Tambah Target'}
          </button>
        </div>
      </div>
      
      {/* Add Target Form */}
      {isFormOpen && (
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Tambah Target Tabungan</h2>
          
          {error && (
            <div className="mb-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nama" className="label">Nama Target</label>
              <input
                type="text"
                id="nama"
                name="nama"
                className="input"
                placeholder="Contoh: Liburan Akhir Tahun, Beli Laptop, dll"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="target_amount" className="label">Jumlah Target</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">Rp</span>
                </div>
                <input
                  type="text"
                  id="target_amount"
                  name="target_amount"
                  className="input pl-10"
                  placeholder="0"
                  value={formData.target_amount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="target_date" className="label">Tanggal Target</label>
              <input
                type="date"
                id="target_date"
                name="target_date"
                className="input"
                value={formData.target_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className="btn btn-outline mr-2"
                onClick={() => setIsFormOpen(false)}
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
                ) : 'Simpan Target'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Active Targets */}
      <div>
        <h2 className="text-xl font-bold mb-4">Target Aktif</h2>
        {activeTargets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTargets.map(target => (
              <TargetTabungan 
                key={target.id} 
                target={target} 
                onUpdateAmount={updateTargetAmount}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-8 text-gray-500 dark:text-gray-400">
            Belum ada target tabungan aktif. Tambahkan target baru.
          </div>
        )}
      </div>
      
      {/* Completed Targets */}
      {completedTargets.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Target Tercapai</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedTargets.map(target => (
              <TargetTabungan 
                key={target.id} 
                target={target} 
                onUpdateAmount={updateTargetAmount}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TargetPage;
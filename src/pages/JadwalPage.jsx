import React, { useState } from 'react';
import { useAppContext } from 'src/contexts/AppContext';
import JadwalTransaksi from 'src/components/JadwalTransaksi';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const JadwalPage = () => {
  const { jadwal, addNewJadwal, toggleJadwalStatus } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'masuk',
    amount: '',
    frequency: 'monthly',
    next_date: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'amount' && !/^\d*\.?\d*$/.test(value) && value !== '') {
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
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Jumlah transaksi harus lebih dari 0');
      return;
    }
    
    if (!formData.next_date) {
      setError('Tanggal transaksi berikutnya harus diisi');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const jadwalData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        frequency: formData.frequency,
        next_date: new Date(formData.next_date).toISOString(),
        description: formData.description
      };
      
      const success = await addNewJadwal(jadwalData);
      
      if (success) {
        // Reset form and close it
        setFormData({
          type: 'masuk',
          amount: '',
          frequency: 'monthly',
          next_date: '',
          description: ''
        });
        setIsFormOpen(false);
      }
    } catch (err) {
      setError('Gagal menambahkan jadwal transaksi');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const activeJadwal = jadwal.filter(item => item.is_active);
  const inactiveJadwal = jadwal.filter(item => !item.is_active);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Jadwal Transaksi</h1>
        <div className="mt-3 md:mt-0">
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="btn btn-primary"
          >
            {isFormOpen ? 'Tutup Form' : 'Tambah Jadwal'}
          </button>
        </div>
      </div>
      
      {/* Add Jadwal Form */}
      {isFormOpen && (
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Tambah Jadwal Transaksi</h2>
          
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
              <label htmlFor="frequency" className="label">Frekuensi</label>
              <select
                id="frequency"
                name="frequency"
                className="select"
                value={formData.frequency}
                onChange={handleChange}
                required
              >
                <option value="daily">Harian</option>
                <option value="weekly">Mingguan</option>
                <option value="monthly">Bulanan</option>
                <option value="yearly">Tahunan</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="next_date" className="label">Tanggal Transaksi Berikutnya</label>
              <input
                type="date"
                id="next_date"
                name="next_date"
                className="input"
                value={formData.next_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
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
                ) : 'Simpan Jadwal'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Active Jadwal */}
      <div>
        <h2 className="text-xl font-bold mb-4">Jadwal Transaksi Aktif</h2>
        {activeJadwal.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeJadwal.map(item => (
              <JadwalTransaksi 
                key={item.id} 
                jadwal={item} 
                onToggle={toggleJadwalStatus}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-8 text-gray-500 dark:text-gray-400">
            Belum ada jadwal transaksi aktif. Tambahkan jadwal baru.
          </div>
        )}
      </div>
      
      {/* Inactive Jadwal */}
      {inactiveJadwal.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Jadwal Transaksi Nonaktif</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inactiveJadwal.map(item => (
              <JadwalTransaksi 
                key={item.id} 
                jadwal={item} 
                onToggle={toggleJadwalStatus}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JadwalPage;
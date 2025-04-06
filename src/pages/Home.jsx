import { useState } from 'react'
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

export default function Home() {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [transactions, setTransactions] = useState([])

  const handleAdd = () => {
    if (!amount) return
    setTransactions([
      { type: 'Tambah', amount: parseFloat(amount), description, date: new Date().toLocaleString() },
      ...transactions
    ])
    setAmount('')
    setDescription('')
  }

  const handleSubtract = () => {
    if (!amount) return
    setTransactions([
      { type: 'Kurang', amount: -parseFloat(amount), description, date: new Date().toLocaleString() },
      ...transactions
    ])
    setAmount('')
    setDescription('')
  }

  const total = transactions.reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">💰 Tabunganku</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <input
          type="number"
          className="border p-3 rounded-lg w-full"
          placeholder="Masukkan jumlah"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          className="border p-3 rounded-lg w-full"
          placeholder="Keterangan (Opsional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex gap-4 justify-center mb-6">
        <button onClick={handleAdd} className="bg-green-500 hover:bg-green-600 transition text-white px-6 py-3 rounded-xl flex items-center gap-2">
          <ArrowUpCircle size={20} /> Tambah
        </button>
        <button onClick={handleSubtract} className="bg-red-500 hover:bg-red-600 transition text-white px-6 py-3 rounded-xl flex items-center gap-2">
          <ArrowDownCircle size={20} /> Kurang
        </button>
      </div>

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold">Total Tabungan:</h2>
        <p className="text-3xl font-bold text-blue-700 mt-2">Rp {total.toLocaleString()}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">📜 Riwayat Transaksi</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500">Belum ada transaksi.</p>
        ) : (
          <ul className="space-y-3">
            {transactions.map((t, i) => (
              <li key={i} className="border p-4 rounded-lg shadow-sm bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">{t.date}</p>
                  <p className="text-gray-800 font-medium">{t.description || '-'}</p>
                </div>
                <span className={t.amount >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                  {t.type} Rp {Math.abs(t.amount).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { BarChart3, TrendingUp, CreditCard, ShoppingBag, Calendar, Download } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from 'recharts'
import { seedTransactions, chartData, formatRupiah, formatDate } from '../data/seedData'

const monthlyData = [
  { bulan: 'Jan', penjualan: 1200000, transaksi: 42 },
  { bulan: 'Feb', penjualan: 980000, transaksi: 38 },
  { bulan: 'Mar', penjualan: 1450000, transaksi: 55 },
  { bulan: 'Apr', penjualan: 1100000, transaksi: 44 },
  { bulan: 'Mei', penjualan: 1680000, transaksi: 67 },
  { bulan: 'Jun', penjualan: 1380000, transaksi: 51 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-700 border border-dark-600 rounded-xl px-3 py-2 shadow-lg">
        <p className="text-xs text-dark-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name === 'penjualan' ? formatRupiah(p.value) : `${p.value} transaksi`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Laporan() {
  const [period, setPeriod] = useState('mingguan')

  const totalPenjualan = seedTransactions.reduce((s, t) => s + t.total, 0)
  const totalTransaksi = seedTransactions.length
  const avgTransaksi = totalPenjualan / totalTransaksi
  const qrisCount = seedTransactions.filter(t => t.metode_pembayaran === 'QRIS').length
  const tunaiCount = totalTransaksi - qrisCount

  return (
    <div className="space-y-5">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['harian', 'mingguan', 'bulanan'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border capitalize ${
                period === p
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-dark-700 text-dark-400 border-dark-600 hover:border-dark-500'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: TrendingUp,
            label: 'Total Pendapatan',
            value: formatRupiah(totalPenjualan),
            sub: period,
            color: 'bg-primary-500/20 text-primary-400',
          },
          {
            icon: ShoppingBag,
            label: 'Total Transaksi',
            value: `${totalTransaksi}x`,
            sub: 'transaksi',
            color: 'bg-blue-500/20 text-blue-400',
          },
          {
            icon: BarChart3,
            label: 'Rata-rata Transaksi',
            value: formatRupiah(avgTransaksi),
            sub: 'per transaksi',
            color: 'bg-purple-500/20 text-purple-400',
          },
          {
            icon: CreditCard,
            label: 'Pembayaran QRIS',
            value: `${Math.round(qrisCount / totalTransaksi * 100)}%`,
            sub: `${qrisCount} dari ${totalTransaksi}`,
            color: 'bg-green-500/20 text-green-400',
          },
        ].map(s => (
          <div key={s.label} className="stat-card animate-fade-in">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-dark-50">{s.value}</p>
              <p className="text-sm text-dark-500">{s.label}</p>
              <p className="text-xs text-dark-600 capitalize">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar chart penjualan */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-dark-50">Penjualan per Hari</h3>
              <p className="text-xs text-dark-500">7 hari terakhir</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="hari" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="penjualan" fill="#f97316" radius={[6, 6, 0, 0]} name="penjualan" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly trend */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-dark-50">Tren Bulanan</h3>
              <p className="text-xs text-dark-500">6 bulan terakhir</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="bulan" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="penjualan" stroke="#f97316" strokeWidth={2.5} dot={{ r: 4, fill: '#f97316' }} name="penjualan" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metode pembayaran */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { metode: 'Tunai', count: tunaiCount, pct: Math.round(tunaiCount / totalTransaksi * 100), color: 'bg-green-500' },
          { metode: 'QRIS', count: qrisCount, pct: Math.round(qrisCount / totalTransaksi * 100), color: 'bg-blue-500' },
        ].map(m => (
          <div key={m.metode} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CreditCard className={`w-4 h-4 ${m.metode === 'QRIS' ? 'text-blue-400' : 'text-green-400'}`} />
                <span className="font-medium text-dark-100">{m.metode}</span>
              </div>
              <span className="text-sm font-bold text-dark-50">{m.pct}%</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2 mb-2">
              <div className={`${m.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${m.pct}%` }} />
            </div>
            <p className="text-xs text-dark-500">{m.count} transaksi</p>
          </div>
        ))}
      </div>

      {/* Transaction detail table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-dark-700 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary-400" />
          <h3 className="font-semibold text-dark-50">Rincian Transaksi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700/50">
              <tr>
                {['#ID', 'Tanggal & Waktu', 'Metode', 'Total'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-dark-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700/50">
              {seedTransactions.map(t => (
                <tr key={t.id} className="hover:bg-dark-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-dark-400">#{String(t.id).padStart(6, '0')}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-300">{formatDate(t.tanggal)}</td>
                  <td className="px-4 py-3">
                    <span className={t.metode_pembayaran === 'QRIS' ? 'badge-info' : 'badge-success'}>
                      {t.metode_pembayaran}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-dark-50">{formatRupiah(t.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Total row */}
        <div className="p-4 border-t border-dark-700 bg-dark-700/30">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-dark-400">Total Keseluruhan</span>
            <span className="text-lg font-bold text-primary-400">{formatRupiah(totalPenjualan)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

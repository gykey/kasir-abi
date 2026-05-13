import { useState } from 'react'
import {
  TrendingUp, ShoppingBag, Package, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Clock, CreditCard
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { seedTransactions, chartData, formatRupiah, formatDate, seedProducts } from '../data/seedData'

const StatCard = ({ icon: Icon, label, value, change, changeType, color }) => (
  <div className="stat-card group cursor-default animate-fade-in">
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      {change && (
        <span className={`flex items-center gap-1 text-xs font-medium ${
          changeType === 'up' ? 'text-green-400' : 'text-red-400'
        }`}>
          {changeType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </span>
      )}
    </div>
    <div>
      <p className="text-2xl font-bold text-dark-50">{value}</p>
      <p className="text-sm text-dark-500">{label}</p>
    </div>
  </div>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-700 border border-dark-600 rounded-xl px-3 py-2 shadow-lg">
        <p className="text-xs text-dark-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-primary-400">{formatRupiah(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const todayTotal = seedTransactions
    .filter(t => new Date(t.tanggal).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.total, 0)

  const todayCount = seedTransactions.filter(
    t => new Date(t.tanggal).toDateString() === new Date().toDateString()
  ).length

  const lowStockProducts = seedProducts.filter(p => p.stok <= 10)
  const topProduct = seedProducts.reduce((max, p) => p.stok > max.stok ? p : max, seedProducts[0])

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 p-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white rounded-full translate-y-1/2" />
        </div>
        <div className="relative">
          <p className="text-primary-100 text-sm font-medium mb-1">Selamat datang kembali 👋</p>
          <h1 className="text-2xl font-bold text-white">Masby Snack Dashboard</h1>
          <p className="text-primary-200 text-sm mt-1">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Penjualan Hari Ini"
          value={formatRupiah(todayTotal)}
          change="12.5%"
          changeType="up"
          color="bg-primary-500/20 text-primary-400"
        />
        <StatCard
          icon={ShoppingBag}
          label="Transaksi Hari Ini"
          value={`${todayCount} transaksi`}
          change="3%"
          changeType="up"
          color="bg-blue-500/20 text-blue-400"
        />
        <StatCard
          icon={Package}
          label="Total Produk"
          value={`${seedProducts.length} produk`}
          color="bg-purple-500/20 text-purple-400"
        />
        <StatCard
          icon={AlertTriangle}
          label="Stok Hampir Habis"
          value={`${lowStockProducts.length} produk`}
          changeType="down"
          color="bg-yellow-500/20 text-yellow-400"
        />
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-dark-50">Grafik Penjualan</h3>
              <p className="text-xs text-dark-500">7 hari terakhir</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              <span>+18.2%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorPenjualan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="hari" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="penjualan"
                stroke="#f97316"
                strokeWidth={2.5}
                fill="url(#colorPenjualan)"
                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#fb923c' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top & Low stock */}
        <div className="space-y-4">
          {/* Top products */}
          <div className="card p-5">
            <h3 className="font-semibold text-dark-50 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-400" />
              Produk Terlaris
            </h3>
            <div className="space-y-2">
              {seedProducts.slice(0, 4).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-lg">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark-200 truncate">{p.nama_produk}</p>
                    <div className="w-full bg-dark-700 rounded-full h-1 mt-1">
                      <div
                        className="bg-primary-500 h-1 rounded-full transition-all"
                        style={{ width: `${Math.max(30, 100 - i * 20)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-dark-500 shrink-0">{100 - i * 20}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Low stock alert */}
          <div className="card p-5 border-yellow-500/20">
            <h3 className="font-semibold text-dark-50 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Stok Hampir Habis
            </h3>
            <div className="space-y-2">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{p.emoji}</span>
                    <p className="text-sm text-dark-300 truncate max-w-[120px]">{p.nama_produk}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    p.stok === 0 ? 'bg-red-500/20 text-red-400' :
                    p.stok <= 5 ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {p.stok} pcs
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-dark-50 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-400" />
            Transaksi Terbaru
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left text-xs font-medium text-dark-500 pb-3 pr-4">#ID</th>
                <th className="text-left text-xs font-medium text-dark-500 pb-3 pr-4">Waktu</th>
                <th className="text-left text-xs font-medium text-dark-500 pb-3 pr-4">Metode</th>
                <th className="text-right text-xs font-medium text-dark-500 pb-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700/50">
              {seedTransactions.map(t => (
                <tr key={t.id} className="hover:bg-dark-700/30 transition-colors">
                  <td className="py-3 pr-4">
                    <span className="text-xs font-mono text-dark-400">#{String(t.id).padStart(4, '0')}</span>
                  </td>
                  <td className="py-3 pr-4 text-sm text-dark-300">{formatDate(t.tanggal)}</td>
                  <td className="py-3 pr-4">
                    <span className={t.metode_pembayaran === 'QRIS' ? 'badge-info' : 'badge-success'}>
                      <CreditCard className="w-3 h-3 mr-1 inline" />
                      {t.metode_pembayaran}
                    </span>
                  </td>
                  <td className="py-3 text-right font-semibold text-dark-50">{formatRupiah(t.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

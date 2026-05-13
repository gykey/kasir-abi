// Template/seed data for Masby Snack
export const seedProducts = [
  {
    id: 1,
    nama_produk: "Chitato Sapi Panggang",
    harga: 8000,
    stok: 50,
    kategori: "Keripik",
    gambar_url: null,
    emoji: "🥔"
  },
  {
    id: 2,
    nama_produk: "Taro Net Original",
    harga: 5000,
    stok: 30,
    kategori: "Keripik",
    gambar_url: null,
    emoji: "🍟"
  },
  {
    id: 3,
    nama_produk: "Indomie Goreng",
    harga: 4000,
    stok: 100,
    kategori: "Mie Instan",
    gambar_url: null,
    emoji: "🍜"
  },
  {
    id: 4,
    nama_produk: "Oreo Original",
    harga: 7000,
    stok: 45,
    kategori: "Biskuit",
    gambar_url: null,
    emoji: "🍪"
  },
  {
    id: 5,
    nama_produk: "Richeese Nabati",
    harga: 2000,
    stok: 80,
    kategori: "Wafer",
    gambar_url: null,
    emoji: "🧇"
  },
  {
    id: 6,
    nama_produk: "Good Time Choco",
    harga: 9000,
    stok: 25,
    kategori: "Biskuit",
    gambar_url: null,
    emoji: "🍫"
  },
  {
    id: 7,
    nama_produk: "Momogi Jagung Bakar",
    harga: 3000,
    stok: 60,
    kategori: "Snack Jagung",
    gambar_url: null,
    emoji: "🌽"
  },
  {
    id: 8,
    nama_produk: "Qtela Cassava Barbeque",
    harga: 10000,
    stok: 20,
    kategori: "Keripik",
    gambar_url: null,
    emoji: "🥓"
  },
  {
    id: 9,
    nama_produk: "Piattos Keju",
    harga: 8000,
    stok: 35,
    kategori: "Keripik",
    gambar_url: null,
    emoji: "🧀"
  },
  {
    id: 10,
    nama_produk: "Superstar Snack",
    harga: 5000,
    stok: 5,
    kategori: "Snack Jagung",
    gambar_url: null,
    emoji: "⭐"
  },
  {
    id: 11,
    nama_produk: "Khong Guan Asst.",
    harga: 15000,
    stok: 15,
    kategori: "Biskuit",
    gambar_url: null,
    emoji: "🫙"
  },
  {
    id: 12,
    nama_produk: "Snickers Bar",
    harga: 12000,
    stok: 3,
    kategori: "Coklat",
    gambar_url: null,
    emoji: "🍬"
  },
]

export const seedTransactions = [
  { id: 1, tanggal: new Date(Date.now() - 0).toISOString(), total: 25000, metode_pembayaran: "Tunai" },
  { id: 2, tanggal: new Date(Date.now() - 3600000).toISOString(), total: 15000, metode_pembayaran: "QRIS" },
  { id: 3, tanggal: new Date(Date.now() - 7200000).toISOString(), total: 40000, metode_pembayaran: "Tunai" },
  { id: 4, tanggal: new Date(Date.now() - 86400000).toISOString(), total: 18000, metode_pembayaran: "QRIS" },
  { id: 5, tanggal: new Date(Date.now() - 86400000 * 2).toISOString(), total: 32000, metode_pembayaran: "Tunai" },
  { id: 6, tanggal: new Date(Date.now() - 86400000 * 3).toISOString(), total: 27000, metode_pembayaran: "QRIS" },
  { id: 7, tanggal: new Date(Date.now() - 86400000 * 4).toISOString(), total: 55000, metode_pembayaran: "Tunai" },
]

export const chartData = [
  { hari: "Sen", penjualan: 45000 },
  { hari: "Sel", penjualan: 62000 },
  { hari: "Rab", penjualan: 38000 },
  { hari: "Kam", penjualan: 75000 },
  { hari: "Jum", penjualan: 91000 },
  { hari: "Sab", penjualan: 120000 },
  { hari: "Min", penjualan: 85000 },
]

export const categories = ["Semua", "Keripik", "Biskuit", "Wafer", "Mie Instan", "Snack Jagung", "Coklat"]

export const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

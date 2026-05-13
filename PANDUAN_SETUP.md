# 🔐 Panduan Setup Login & Register — Masby Snack

## Langkah 1: Buat Akun Pertama di Supabase Dashboard

Karena baru pertama kali, buat akun admin lewat Supabase langsung:

1. Buka https://supabase.com/dashboard/project/niqekrftgsprrxutgfvm
2. Klik menu **Authentication** → **Users**
3. Klik tombol **Add User** → **Create New User**
4. Isi:
   - Email: `admin@masbysnack.com`
   - Password: `Admin123!`
5. Klik **Create User**

> Setelah itu, login langsung dari website kasir dengan email & password tersebut.

---

## Langkah 2 (Opsional): Nonaktifkan Konfirmasi Email

Agar register langsung bisa login tanpa klik email konfirmasi:

1. Di Supabase Dashboard → **Authentication** → **Providers**
2. Scroll ke **Email** provider
3. Matikan toggle **"Confirm email"** → Save

---

## Langkah 3: Jalankan Schema SQL

1. Buka Supabase Dashboard → **SQL Editor**
2. Copy-paste isi file `supabase/schema.sql`
3. Klik **Run**

---

## Fitur Login & Register

| Fitur | Keterangan |
|-------|------------|
| Login | Supabase Auth (email + password) |
| Register | Daftar akun baru dengan Nama, Email, Role |
| Role | Kasir / Admin / Owner (disimpan di user_metadata) |
| Password strength | Indikator kekuatan password real-time |
| Validasi | Cek kecocokan password konfirmasi |
| Error handling | Pesan error bahasa Indonesia |
| Auto-redirect | Login → Dashboard, Sudah login → tidak bisa akses /login |
| Protected route | Semua halaman selain /login butuh autentikasi |
| Logout | Tombol Keluar di sidebar, sesi langsung dihapus |
| Sidebar | Tampilkan nama & role user yang sedang login |


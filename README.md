# crootagent.github.io 🌐

Landing page resmi dan portal dokumentasi untuk **CRootAgent** — asisten pengembang cerdas (*CLI agentic coding assistant*) ultra-ringan berbasis Rust.

Aplikasi web ini dibangun dengan filosofi **CrootJS** (vanilla JavaScript ES6+ modules via CDN tanpa bundler atau dependensi berat):
- Memisahkan HTML, CSS, dan JS ke dalam berkas independen.
- Menggunakan `croot.js` (`api.js`, `element.js`, `useragent.js`) untuk memanggil API GitHub Releases.
- Mendeteksi sistem operasi pengguna secara dinamis dan menyediakan tombol unduh 1-klik untuk binary yang sesuai (Linux, macOS Apple Silicon / Intel, Windows).
- Menyediakan skrip instalasi instan (`install.sh` dan `install.ps1`).

---

## 🚀 Menjalankan Secara Lokal

Karena menggunakan ES Module (`<script type="module">`), buka proyek menggunakan server HTTP lokal:

```bash
# Python
python3 -m http.server 8080

# Atau buka di browser:
# http://localhost:8080
```

---

## 📄 Lisensi & Kontribusi

Proyek ini dilisensikan di bawah **GNU General Public License v3.0 (GPL-3.0)**.  
Bagian dari Proyek 2 D4 Teknik Informatika, Universitas Logistik dan Bisnis Internasional (ULBI), Bandung.  
Pengembang: **Ahmad Zakky Nurfauzan** (NIM: **714250028**).

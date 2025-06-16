# AJAX To-Do List Application

Aplikasi web sederhana untuk manajemen tugas (To-Do List) yang menggunakan teknologi AJAX untuk interaksi dinamis tanpa reload halaman.

## Fitur Utama

- ✅ **Menambah Tugas Baru** - Tambah tugas dengan input yang responsif
- 📝 **Menampilkan Daftar Tugas** - Melihat semua tugas dalam interface yang menarik
- ✔️ **Menandai Tugas Selesai** - Toggle status tugas completed/pending
- 🗑️ **Menghapus Tugas** - Hapus tugas dengan konfirmasi
- 📊 **Statistik Real-time** - Melihat jumlah total, selesai, dan pending tugas
- 🔄 **Refresh Data** - Memuat ulang data tugas
- � **Penyimpanan Persisten** - Data tersimpan di localStorage (tidak hilang saat refresh)
- 🗑️ **Hapus Semua Data** - Bersihkan semua tugas sekaligus
- �📱 **Responsive Design** - Tampilan yang optimal di semua device
- 🎨 **UI Modern** - Interface yang indah dan user-friendly

## Teknologi yang Digunakan

- **HTML5** - Struktur markup semantik
- **CSS3** - Styling modern dengan flexbox dan grid
- **JavaScript (ES6+)** - Logika aplikasi dan AJAX simulation
- **AJAX Simulation** - Simulasi komunikasi asynchronous dengan server

## Cara Menjalankan

1. **Clone atau Download** file-file project
2. **Buka file `index.html`** di web browser
3. **Mulai menggunakan** aplikasi To-Do List

```bash
# Atau gunakan live server jika menggunakan VS Code
# Install Live Server extension, kemudian klik kanan pada index.html -> "Open with Live Server"
```

## Struktur File

```
AJAX/
├── index.html      # File HTML utama
├── style.css       # Stylesheet untuk tampilan
├── script.js       # JavaScript untuk logika dan AJAX
└── README.md       # Dokumentasi project
```

## Penyimpanan Data

Aplikasi ini menggunakan **localStorage** untuk menyimpan data secara persisten:

### ✅ **Data yang Tersimpan:**
- Daftar semua tugas
- Status completed/pending setiap tugas
- Counter ID untuk tugas baru

### 💾 **Keuntungan localStorage:**
- Data tidak hilang saat refresh halaman
- Data tersimpan di browser lokal
- Tidak memerlukan koneksi internet
- Akses data yang cepat

### 🗑️ **Menghapus Data:**
- Gunakan tombol "🗑️" di header untuk hapus semua data
- Atau buka Developer Tools → Application → localStorage → hapus manual

```javascript
// Contoh penggunaan localStorage dalam aplikasi
function saveToStorage() {
    localStorage.setItem('ajax_todo_tasks', JSON.stringify(tasks));
    localStorage.setItem('ajax_todo_counter', taskIdCounter.toString());
}

function loadFromStorage() {
    const savedTasks = localStorage.getItem('ajax_todo_tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}
```

## Cara Kerja AJAX

Aplikasi ini mensimulasikan penggunaan AJAX dengan fitur-fitur berikut:

### 1. **Loading States**
- Menampilkan indicator loading saat memuat data
- Button loading saat menambah tugas
- Animasi spinner yang smooth

### 2. **Asynchronous Operations**
```javascript
// Contoh simulasi AJAX untuk menambah tugas
function addTask() {
    // Simulasi delay jaringan
    setTimeout(() => {
        try {
            const response = simulateServerResponse('POST', '/api/tasks', newTask);
            if (response.success) {
                // Update UI tanpa reload
                renderTasks();
                updateStats();
                saveToStorage(); // Simpan ke localStorage
                showNotification('Tugas berhasil ditambahkan!');
            }
        } catch (error) {
            showNotification('Gagal menambah tugas', true);
        }
    }, 600);
}
```

### 3. **Error Handling**
- Handling error dengan graceful degradation
- Notifikasi error yang informatif
- Recovery mechanism

### 4. **Real-time Updates**
- Update statistik secara real-time
- Animasi perubahan data
- Sync UI state dengan data

## Fitur AJAX yang Didemonstrasikan

| Operation | Method | Endpoint | Deskripsi |
|-----------|--------|----------|-----------|
| Load Tasks | GET | `/api/tasks` | Memuat semua tugas |
| Add Task | POST | `/api/tasks` | Menambah tugas baru |
| Update Task | PUT | `/api/tasks/:id` | Update status tugas |
| Delete Task | DELETE | `/api/tasks/:id` | Menghapus tugas |

## Responsive Design

Aplikasi ini responsive dan bekerja optimal di:
- 💻 **Desktop** (1200px+)
- 📱 **Tablet** (768px - 1199px)
- 📱 **Mobile** (< 768px)

## Customization

### Mengganti Warna Theme
Edit variabel di `style.css`:
```css
/* Primary gradient */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* Secondary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Menambah Fitur Baru
1. Tambah HTML element di `index.html`
2. Tambah styling di `style.css`
3. Implementasi logika di `script.js`

## Browser Compatibility

- ✅ Chrome (60+)
- ✅ Firefox (60+)
- ✅ Safari (12+)
- ✅ Edge (79+)

## Development Notes

Untuk pengembangan lebih lanjut:

1. **Backend Integration**: Ganti simulasi dengan real API calls
2. **Data Persistence**: Tambah localStorage atau database
3. **Authentication**: Implementasi user login/register
4. **Real-time Sync**: WebSocket untuk multi-user support

## Credits

Dibuat sebagai demonstrasi penggunaan teknologi AJAX dalam pengembangan web modern.

---

**Happy Coding! 🚀**

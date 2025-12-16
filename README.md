# 🎭 Realtime Face Emotion Detection

Aplikasi deteksi emosi wajah berbasis web yang mendukung **Real-time Webcam** dan **Upload Foto**. Dibangun menggunakan **FastAPI** (Backend) dan **TensorFlow/Keras** (Deep Learning), serta menggunakan **MTCNN** untuk deteksi wajah dan **DeepFace** untuk ekstraksi fitur.

![Demo Screenshot](https://via.placeholder.com/800x400?text=Screenshot+Aplikasi+Anda)

## 🚀 Fitur Utama

- **Real-time Detection:** Mendeteksi wajah dan emosi secara langsung via webcam.
- **Multi-Face Detection:** Bisa mendeteksi banyak wajah sekaligus dalam satu frame.
- **Bounding Box:** Menampilkan kotak hijau di wajah yang terdeteksi.
- **High Accuracy:** Menggunakan MTCNN untuk _cropping_ wajah yang presisi dan DeepFace (OpenFace) untuk _embedding_.
- **Latency Stats:** Menampilkan kecepatan proses (ms) dan jumlah wajah yang terdeteksi.

## 🛠️ Tech Stack

- **Backend:** Python 3.10, FastAPI, Uvicorn.
- **AI/ML Engine:** TensorFlow 2.10, Keras, MTCNN, DeepFace.
- **Frontend:** HTML5, JavaScript (Vanilla), Tailwind CSS (via CDN).

---

## ⚠️ Prasyarat (PENTING!)

Project ini membutuhkan versi library yang spesifik agar model dapat berjalan lancar di Windows/Linux.

- **Python:** Wajib versi **3.10** (Jangan 3.11 atau 3.13).
- **TensorFlow:** Versi **2.10.0**.
- **NumPy:** Versi **1.26.4** (Harus < 2.0).

---

## 📥 Cara Install & Menjalankan

### 1. Clone Repository


git clone [https://github.com/roynurff/face-emotion-detection.git](https://github.com/roynurff/face-emotion-detection.git)
cd face-emotion-detection
2. Setup Backend
Sangat disarankan menggunakan Virtual Environment (Anaconda/Venv).

Opsi A: Menggunakan Anaconda (Rekomendasi)

Bash

# Buat environment baru dengan Python 3.10
conda create -n cv python=3.10
conda activate cv

# Masuk ke folder backend
cd backend

# Install dependencies (Gunakan file requirements yang sudah difix)
pip install -r requirements.txt
Opsi B: Menggunakan Venv Biasa

Bash

cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
3. Menjalankan Server (Backend)
Pastikan terminal berada di dalam folder backend/ dan environment sudah aktif.

Bash

uvicorn main:app --reload
Jika sukses, akan muncul pesan: Uvicorn running on http://127.0.0.1:8000.

Note: Saat pertama kali dijalankan, aplikasi akan mendownload weights untuk DeepFace/OpenFace (sekitar 15-50MB). Tunggu hingga selesai.

4. Menjalankan Frontend
Buka folder frontend.

Buka file index.html.

Saran: Gunakan Live Server di VS Code agar browser tidak memblokir akses webcam karena isu CORS.

Install Ekstensi "Live Server" di VS Code.

Klik kanan pada index.html -> "Open with Live Server".

📂 Struktur Project
face-emotion-detection/
│
├── backend/
│   ├── model.h5              # Model klasifikasi emosi (Keras)
│   ├── main.py               # Entry point FastAPI
│   ├── requirements.txt      # Daftar library & versi fix
│   └── utils/
│       └── preprocess.py     # Helper functions
│
├── frontend/
│   ├── index.html            # UI Utama
│   ├── js/
│   │   ├── webcam.js         # Logic Realtime & Drawing Canvas
│   │   └── upload.js         # Logic Upload File
│   └── css/
│
├── .gitignore                # File yang diabaikan Git
└── README.md                 # Dokumentasi ini
🐛 Troubleshooting Umum
1. Error Protobuf atau TensorFlow conflict? Pastikan Anda menggunakan requirements.txt yang ada di repo ini. Versi protobuf==3.19.6 atau yang kompatibel dengan TF 2.10 sangat krusial.

2. Webcam tidak muncul / Permission Denied? Pastikan browser mengizinkan akses kamera. Coba buka melalui localhost atau 127.0.0.1 (Live Server), jangan buka file langsung (file:///C:/...).

3. Input Shape Error (1, 48, 48, 1) vs (None, 128)? Ini terjadi jika preprocessing salah. Pastikan main.py menggunakan DeepFace untuk mengubah gambar wajah menjadi embedding vector (128 dimensi) sebelum masuk ke model klasifikasi.

🤝 Kontribusi
Silakan fork repository ini, lakukan perubahan, dan kirim Pull Request.

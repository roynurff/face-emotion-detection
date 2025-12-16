# 🎭 Realtime Face Emotion Detection (LERA AI)

Aplikasi **deteksi emosi wajah berbasis web** yang mendukung **Real-time Webcam** dan **Upload Foto**.  
Project ini dibangun menggunakan **FastAPI** sebagai backend, **TensorFlow/Keras** untuk deep learning, serta **MTCNN** dan **DeepFace** untuk deteksi dan ekstraksi fitur wajah.


<img width="1897" height="908" alt="image" src="https://github.com/user-attachments/assets/44a2f363-5808-4965-863e-5d18f6fb654f" />

---

## 🚀 Fitur Utama

- 🎥 **Realtime Webcam Detection**  
  Deteksi wajah & emosi secara langsung dari kamera.

- 🖼️ **Image Upload Detection**  
  Upload foto dan dapatkan prediksi emosi.

- 👥 **Multi-Face Detection**  
  Mendeteksi lebih dari satu wajah dalam satu frame.

- 🟩 **Bounding Box & Label**  
  Menampilkan kotak wajah + label emosi & confidence.

- ⚡ **Latency Monitoring**  
  Menampilkan waktu proses (ms) secara realtime.

- 🧠 **AI-based Emotion Classification**  
  Kombinasi MTCNN + DeepFace + Model Keras custom.

---

## 🛠️ Tech Stack

### Backend
- Python **3.10**
- FastAPI
- Uvicorn
- TensorFlow **2.10**
- Keras
- MTCNN
- DeepFace

### Frontend
- HTML5
- Vanilla JavaScript
- Tailwind CSS (CDN)
- Canvas API (drawing bounding box)

---

## ⚠️ Prasyarat (WAJIB DIBACA)

Agar project **tidak error**, gunakan versi berikut:

| Komponen | Versi |
|--------|-------|
| Python | **3.10.x** |
| TensorFlow | **2.10.0** |
| NumPy | **1.26.4** (< 2.0) |
| Protobuf | **3.19.6** |

> ❌ Python 3.11 / 3.12 / 3.13 **TIDAK disarankan**  
> ❌ NumPy 2.x akan menyebabkan error TensorFlow

---

## 📥 Cara Install & Menjalankan

### 1️⃣ Clone Repository
bash
git clone https://github.com/roynurff/face-emotion-detection.git
cd face-emotion-detection

### 2️⃣ SETUP BACKEND
Opsi A: Anaconda/Miniconda (download)
conda create -n cv python=3.10
conda activate cv

cd backend
pip install -r requirements.txt

Opsi B: Venv
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac / Linux
source venv/bin/activate

pip install -r requirements.txt

### 3️⃣ MENJALANKAN BACKEND (FAST API)
- uvicorn main:app --reload
jika sukses akan

- Uvicorn running on http://127.0.0.1:8000

### 4️⃣ Menjalankan Frontend

- Buka folder frontend/
- Buka index.html
- Disarankan: gunakan Live Server (VS Code)
  Kenapa Live Server?
  Browser tidak memblokir webcam
  Menghindari error getUserMedia

Langkah:
- Install ekstensi Live Server
- Klik kanan index.html → Open with Live Server

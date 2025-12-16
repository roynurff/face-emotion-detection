from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
import tensorflow as tf
import numpy as np
import cv2
from mtcnn import MTCNN
from PIL import Image
from deepface import DeepFace

from utils.preprocess import preprocess_image

app = FastAPI()

detector = MTCNN()

openface_model = DeepFace.build_model("OpenFace")

# CORS biar frontend kebaca
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# LOAD MODEL
model = tf.keras.models.load_model("model.h5", compile=False)

LABELS = ["Angry", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]

@app.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):
    # 1. Baca Image
    file_bytes = await file.read()
    img = Image.open(BytesIO(file_bytes)).convert("RGB")
    img_np = np.array(img)
    img_rgb = img_np

    # 2. Deteksi SEMUA Wajah
    faces = detector.detect_faces(img_rgb)
    
    results = [] # List buat nampung hasil banyak wajah

    # Loop untuk setiap wajah yang ketemu
    for face_data in faces:
        x, y, w, h = face_data['box']
        x, y = max(0, x), max(0, y) # Safety check koordinat

        img_h, img_w, _ = img_rgb.shape
        if x + w > img_w: w = img_w - x
        if y + h > img_h: h = img_h - y

        # Crop Wajah ini
        face_img = img_rgb[y:y+h, x:x+w]

        if face_img.size == 0:
            print("wajah kosong")
            continue

        # Skip kalau wajahnya terlalu kecil (misal noise)
        if w < 20 or h < 20: 
            continue

        face_resized = cv2.resize(face_img, (96, 96))

        try:
            # Prediksi Emosi Wajah INI
            embedding_objs = DeepFace.represent(
                img_path = face_resized,
                model_name = "OpenFace",
                # model = openface_model,
                enforce_detection = False,
                detector_backend = "skip"
            )
            
            embedding = embedding_objs[0]["embedding"]
            embedding_array = np.array(embedding).reshape(1, 128)
            
            preds = model.predict(embedding_array)[0]
            idx = int(np.argmax(preds))
            
            # Simpan hasil wajah ini ke list
            results.append({
                "box": {
                    "x": int(x),
                    "y": int(y),
                    "w": int(w),
                    "h": int(h),
                },
                "emotion": LABELS[idx],
                "confidence": float(preds[idx])
            })
            
        except Exception as e:
            print(f"Error processing face: {e}")

    # Balikin list of results
    return {"faces": results}

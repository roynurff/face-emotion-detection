import numpy as np
from PIL import Image
from deepface import DeepFace
import cv2

def preprocess_image(image_file):
    """
    Mengubah file gambar upload jadi Embedding Vector (128 fitur)
    menggunakan DeepFace (OpenFace model), persis seperti di training.
    """
    # 1. Buka file gambar pake PIL
    img = Image.open(image_file).convert("RGB")
    img = np.array(img)

    # 2. DeepFace biasanya butuh format BGR (bawaan OpenCV), jadi kita balik warnanya
    # Dari RGB -> BGR
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    # 3. Ekstrak Embedding pake DeepFace
    # Logic ini sama persis kayak di notebook bagian 'image_to_embedding'
    # enforce_detection=False biar kalau mukanya gak sempurna dia gak error
    embedding_objs = DeepFace.represent(
        img_path = img,
        model_name = "OpenFace",
        enforce_detection = False,
        detector_backend = "skip" 
    )
    
    # Ambil embedding (list of float)
    embedding = embedding_objs[0]["embedding"]
    
    # 4. Ubah jadi Numpy Array dengan bentuk (1, 128) biar bisa masuk model
    # Model lu minta shape (None, 128)
    embedding_array = np.array(embedding).reshape(1, 128)
    
    return embedding_array
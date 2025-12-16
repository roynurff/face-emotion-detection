const uploadBtn = document.getElementById("uploadBtn");
const imageInput = document.getElementById("imageInput");
const resultDiv = document.getElementById("result");
const emotionText = document.getElementById("emotionText");
const confidenceText = document.getElementById("confidenceText");
const confidenceBar = document.getElementById("confidenceBar");
const loading = document.getElementById("loadingUpload");
const uploadArea = document.getElementById("uploadArea");
const imagePreview = document.getElementById("imagePreview");
const previewImg = document.getElementById("previewImg");
const resultImg = document.getElementById("resultImg");
const clearBtn = document.getElementById("clearBtn");
const analyzeAgainBtn = document.getElementById("analyzeAgainBtn");

let selectedFile = null;

// ==========================================
// PREVIEW IMAGE FUNCTION
// ==========================================
function showPreview(file) {
  if (!file || !file.type.startsWith("image/")) {
    alert("File harus berupa gambar!");
    return;
  }

  selectedFile = file;
  const reader = new FileReader();

  reader.onload = (e) => {
    previewImg.src = e.target.result;
    imagePreview.classList.remove("hidden");
    uploadArea.classList.add("hidden");
    uploadBtn.disabled = false;
  };

  reader.readAsDataURL(file);
}

// ==========================================
// FILE INPUT (CHOOSE IMAGE)
// ==========================================
imageInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    showPreview(e.target.files[0]);
  }
});

// ==========================================
// DRAG & DROP
// ==========================================
uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("border-blue-500", "bg-blue-100");
});

uploadArea.addEventListener("dragleave", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("border-blue-500", "bg-blue-100");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("border-blue-500", "bg-blue-100");

  if (e.dataTransfer.files.length > 0) {
    showPreview(e.dataTransfer.files[0]);
  }
});

// CLEAR BUTTON
clearBtn.addEventListener("click", () => {
  selectedFile = null;
  imageInput.value = "";
  previewImg.src = "";
  imagePreview.classList.add("hidden");
  uploadArea.classList.remove("hidden");
  uploadBtn.disabled = true;
  resultDiv.classList.add("hidden");
});

// ANALYZE AGAIN BUTTON
analyzeAgainBtn.addEventListener("click", () => {
  selectedFile = null;
  imageInput.value = "";
  previewImg.src = "";
  resultImg.src = "";
  imagePreview.classList.add("hidden");
  uploadArea.classList.remove("hidden");
  uploadBtn.disabled = true;
  resultDiv.classList.add("hidden");
});

// PREDICT EMOTION
uploadBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    alert("Pilih gambar dulu bro");
    return;
  }

  resultDiv.classList.add("hidden");
  loading.classList.remove("hidden");

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const res = await fetch("http://127.0.0.1:8000/predict-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    loading.classList.add("hidden");
    resultDiv.classList.remove("hidden");

    // SHOW UPLOADED IMAGE IN RESULT
    resultImg.src = previewImg.src;
    if (!data.faces || data.faces.length === 0) {
      emotionText.textContent = "❌ Tidak ada wajah terdeteksi";
      confidenceText.textContent = "";
      confidenceBar.style.width = "0%";
      return;
    }

    // 🔥 MULTI FACE COUNTER
    let text = `🧑‍🤝‍🧑 ${data.faces.length} wajah terdeteksi\n\n`;

    data.faces.forEach((face, i) => {
      text += `Face ${i + 1}: ${face.emotion} (${(
        face.confidence * 100
      ).toFixed(1)}%)\n`;
    });
    emotionText.textContent = text;

    // Ambil wajah pertama (utama)
    const mainFace = data.faces[0];
    const confidence = (mainFace.confidence * 100).toFixed(1);
    confidenceText.textContent = `${mainFace.emotion} - ${confidence}%`;
    confidenceBar.style.width = `${confidence}%`;
  } catch (err) {
    loading.classList.add("hidden");
    alert("Error server");
    console.error(err);
  }
});

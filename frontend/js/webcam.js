const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const webcamresultDiv = document.getElementById("result");
const facesCountText = document.getElementById("facesCount");
const latencyText = document.getElementById("latencyText");

let isRunning = false;
let isPredicting = false;
let lastDetection = null;

// 1. INIT CAMERA
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user",
      },
      audio: false,
    });
    video.srcObject = stream;

    await video.play();

    video.onloadedmetadata = () => {
      // AMBIL RESOLUSI ASLI DARI KAMERA
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // SET VIDEO ELEMENT SIZE BIAR GAK STRETCH
      video.width = videoWidth;
      video.height = videoHeight;

      // SET CANVAS EXACT SAMA KAYAK VIDEO (GAK GEPENG)
      canvas.width = videoWidth;
      canvas.height = videoHeight;

      console.log("Webcam ready:", canvas.width, "x", canvas.height);
    };
  } catch (err) {
    console.error("Camera error:", err);
    alert("Gagal akses kamera");
  }
}

startCamera();

// 2. DRAW LOOP (VISUAL - FAST)
function drawLoop() {
  if (!isRunning) return;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  if (lastDetection?.faces?.length) {
    lastDetection.faces.forEach((face) => {
      const { x, y, w, h } = face.box;

      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);

      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "#00FF00";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 4;
      ctx.fillText(
        `${face.emotion} (${(face.confidence * 100).toFixed(0)}%)`,
        x,
        y - 8
      );
      ctx.shadowBlur = 0;
    });
  }
  requestAnimationFrame(drawLoop);
}

// ==============================
// 3. PREDICTION LOOP (OTAK)
async function predictLoop() {
  if (!isRunning || isPredicting) return;
  if (video.videoWidth === 0 || video.videoHeight === 0) {
    setTimeout(predictLoop, 100);
    return;
  }

  isPredicting = true;

  // KECILIN RESOLUSI KIRIM KE BACKEND
  const TARGET_W = 320;
  const scale = TARGET_W / video.videoWidth;

  const offscreen = document.createElement("canvas");
  offscreen.width = TARGET_W;
  offscreen.height = video.videoHeight * scale;

  const ctx = offscreen.getContext("2d");
  ctx.drawImage(video, 0, 0, offscreen.width, offscreen.height);

  offscreen.toBlob(
    async (blob) => {
      if (!blob) {
        isPredicting = false;
        return;
      }

      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      try {
        const start = performance.now();
        const res = await fetch("http://127.0.0.1:8000/predict-image", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        const duration = Math.round(performance.now() - start);
        latencyText.innerText = `${duration} ms`;

        const count = data.faces ? data.faces.length : 0;
        facesCountText.innerText = count;

        // SCALE BOX KE CANVAS ASLI
        if (data.faces) {
          const scaleX = canvas.width / offscreen.width;
          const scaleY = canvas.height / offscreen.height;

          data.faces.forEach((f) => {
            f.box.x *= scaleX;
            f.box.y *= scaleY;
            f.box.w *= scaleX;
            f.box.h *= scaleY;
          });
        }

        lastDetection = data;

        webcamresultDiv.innerHTML = `
        <div style="color:limegreen;">
          👥 Faces: ${data.faces?.length || 0}
        </div>
        <div style="font-size:14px; color:gray;">
          ⏱ Latency: ${latency} ms
        </div>
      `;
      } catch (err) {
        console.error("Prediction error:", err);
      } finally {
        isPredicting = false;
        if (isRunning) setTimeout(predictLoop, 80);
      }
    },
    "image/jpeg",
    0.8
  );
}

// ==============================
// 4. BUTTON CONTROL
startBtn.addEventListener("click", () => {
  if (isRunning) return;
  isRunning = true;

  startBtn.disabled = true;
  stopBtn.disabled = false;

  drawLoop();
  predictLoop();
});

stopBtn.addEventListener("click", () => {
  isRunning = false;

  startBtn.disabled = false;
  stopBtn.disabled = true;

  facesCountText.innerText = "0";
  latencyText.innerText = "- ms";

  webcamresultDiv.innerHTML = "⏹ Stopped";

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
});

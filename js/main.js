const startBtn = document.getElementById('startBtn');
const video = document.getElementById('video');
const photosContainer = document.getElementById('photos-container');
const downloadBtn = document.getElementById('downloadBtn');
const numFotosSelect = document.getElementById('numFotos');
const contador = document.getElementById('contador');

let photoCount = 0;
let totalPhotos = 3;
let photos = [];

// Function to start the webcam
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (error) {
    alert('Could not access the camera');
  }
}

// Function to start the countdown before taking a photo
function startCountdown(callback) {
  let count = 5;
  contador.style.display = 'block';
  function tick() {
    contador.textContent = `¡${count}!`;
    if (count <= 0) {
      callback();
    } else {
      count--;
      setTimeout(tick, 1000);
    }
  }
  tick();
}

// Function to capture a single photo
function capturePhoto() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const photoData = canvas.toDataURL('image/png');
  photos.push(photoData);

  const img = document.createElement('img');
  img.src = photoData;
  img.style.border = '10px solid white';
  img.style.borderRadius = '20px';
  img.style.margin = '10px';
  img.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
  img.style.width = '100%';
  photosContainer.appendChild(img);

  photoCount++;
  contador.style.display = 'none';

  // If more photos are needed, continue the countdown
  if (photoCount < totalPhotos) {
    setTimeout(() => {
      startCountdown(capturePhoto);
    }, 500);
  } else {
    downloadBtn.style.display = 'block';
  }
}

// Start button event listener
startBtn.addEventListener('click', () => {
  totalPhotos = parseInt(numFotosSelect.value, 10);
  photoCount = 0;
  photos = [];
  photosContainer.innerHTML = '';
  contador.style.display = 'none';
  downloadBtn.style.display = 'none';

  startCamera();
  startCountdown(capturePhoto);
  startBtn.disabled = true;
});

// Function to generate the final cabin-style image
function generateCabinImage() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const width = 400;
  const height = 800;
  const topBorderHeight = 30;     // Extra top border
  const bottomBorderHeight = 110; // Extra bottom border

  canvas.width = width;
  canvas.height = height + bottomBorderHeight + topBorderHeight;

  // Light orange background gradient
  const backgroundGradient = ctx.createLinearGradient(0, 0, width, canvas.height);
  backgroundGradient.addColorStop(0, '#ffc070');
  backgroundGradient.addColorStop(1, '#ffa533');
  ctx.fillStyle = backgroundGradient;

  // Final canvas with rounded corners
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, canvas.width, canvas.height, 20);
  ctx.clip();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorative white-ish geometric shapes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    const x = Math.random() * width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 70 + 30;
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const photoHeight = height / totalPhotos;

  photos.forEach((photoData, index) => {
    const img = new Image();
    img.src = photoData;
    img.onload = () => {
      const padding = 20;
      const photoWidth = width - 2 * padding;
      const yPos = topBorderHeight + index * photoHeight + 10;

      // 3D shadow effect behind each image
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(padding + 4, yPos + 4, photoWidth + 5, photoHeight - 15, 10);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fill();
      ctx.restore();

      // Cropped image with rounded corners
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(padding, yPos, photoWidth, photoHeight - 20, 10);
      ctx.clip();
      ctx.drawImage(img, padding, yPos, photoWidth, photoHeight - 20);
      ctx.restore();

      // Enable download when the last image is loaded
      if (index === totalPhotos - 1) {
        const finalImage = canvas.toDataURL('image/png');
        downloadBtn.addEventListener('click', () => {
          const a = document.createElement('a');
          a.href = finalImage;
          a.download = 'h1Photos.png';
          a.click();
        });
      }
    };
  });

  ctx.restore();
}

// Download button event listener
downloadBtn.addEventListener('click', generateCabinImage);

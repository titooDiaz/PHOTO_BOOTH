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

  if (photoCount < totalPhotos) {
    setTimeout(() => {
      startCountdown(capturePhoto);
    }, 500);
  } else {
    downloadBtn.style.display = 'block';
  }
}

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

function generateCabinImage() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const width = 400;
  const height = 800;
  const topBorderHeight = 30;
  const bottomBorderHeight = 110;
  const design = document.getElementById('diseno').value;

  canvas.width = width;
  canvas.height = height + bottomBorderHeight + topBorderHeight;

  if (design === 'geometrico') {
    const gradient = ctx.createLinearGradient(0, 0, width, canvas.height);
    gradient.addColorStop(0, '#ffc070');
    gradient.addColorStop(1, '#ffa533');
    ctx.fillStyle = gradient;
  } else if (design === 'corazones') {
    ctx.fillStyle = '#ffd1dc';
  } else if (design === 'snoopy') {
    ctx.fillStyle = '#d0f0ff';
  }

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, canvas.width, canvas.height, 20);
  ctx.clip();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (design === 'geometrico') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      const x = Math.random() * width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 70 + 30;
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (design === 'corazones') {
    const heart = (x, y, size) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x, y - size / 2, x - size, y - size / 2, x - size, y);
      ctx.bezierCurveTo(x - size, y + size, x, y + size * 1.5, x, y + size * 2);
      ctx.bezierCurveTo(x, y + size * 1.5, x + size, y + size, x + size, y);
      ctx.bezierCurveTo(x + size, y - size / 2, x, y - size / 2, x, y);
      ctx.closePath();
      ctx.fill();
    };

    ctx.fillStyle = 'rgba(255, 0, 100, 0.3)';
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 15 + 10;
      heart(x, y, size);
    }
  } else if (design === 'minimalista') {
    ctx.fillStyle = '#ffffff'; // fondo blanco
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Líneas grises sutiles
    ctx.strokeStyle = '#e0e0e0';
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
  
    // Texto elegante
    ctx.fillStyle = '#999';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('H1 Photo Booth', canvas.width / 2, 25);
  }
  

  function drawPhotos() {
    const photoHeight = height / totalPhotos;
    photos.forEach((photoData, index) => {
      const img = new Image();
      img.src = photoData;
      img.onload = () => {
        const padding = 20;
        const photoWidth = width - 2 * padding;
        const yPos = topBorderHeight + index * photoHeight + 10;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(padding + 4, yPos + 4, photoWidth + 5, photoHeight - 15, 10);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(padding, yPos, photoWidth, photoHeight - 20, 10);
        ctx.clip();

        const targetWidth = photoWidth;
        const targetHeight = photoHeight - 20;
        const imgAspect = img.width / img.height;
        const boxAspect = targetWidth / targetHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > boxAspect) {
          drawHeight = targetHeight;
          drawWidth = targetHeight * imgAspect;
          offsetX = padding - (drawWidth - targetWidth) / 2;
          offsetY = yPos;
        } else {
          drawWidth = targetWidth;
          drawHeight = targetWidth / imgAspect;
          offsetX = padding;
          offsetY = yPos - (drawHeight - targetHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        ctx.restore();

        if (index === totalPhotos - 1) {
          const finalImage = canvas.toDataURL('image/png');
          downloadBtn.onclick = () => {
            const a = document.createElement('a');
            a.href = finalImage;
            a.download = 'h1Photos.png';
            a.click();
          };
        }
      };
    });

    ctx.restore();
  }

  if (design === 'snoopy') {
    const snoopyImg = new Image();
    snoopyImg.crossOrigin = 'anonymous';
    snoopyImg.src = 'https://upload.wikimedia.org/wikipedia/en/5/53/Snoopy_Peanuts.png';
    snoopyImg.onload = () => {
      const numSnoopys = 50; // ¡Muchos Snoopys!
      for (let i = 0; i < numSnoopys; i++) {
        const size = 30 + Math.random() * 50;
        const x = Math.random() * (canvas.width - size);
        const y = Math.random() * (canvas.height - size - 150);
        ctx.save();
        ctx.globalAlpha = 0.4 + Math.random() * 0.6; // Transparencias suaves
        ctx.drawImage(snoopyImg, x, y, size, size);
        ctx.restore();
      }
      drawPhotos();
    };
    return;
  }
  

  drawPhotos();
}

downloadBtn.addEventListener('click', generateCabinImage);
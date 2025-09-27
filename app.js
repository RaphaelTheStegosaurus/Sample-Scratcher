let activeBrushImage = new Image();
activeBrushImage.src = "./brushes/brush-01.svg";
function setBrushImage(shapeId) {
  let shapeCode = parseInt(shapeId);
  let newSrc = "./brushes/brush-01.svg";
  switch (shapeCode) {
    case 1:
      newSrc = "./brushes/brush-01.svg";
      break;
    case 2:
      newSrc = "./brushes/brush-02.svg";
      break;
    case 3:
      newSrc = "./brushes/brush-03.svg";
      break;
    case 4:
      newSrc = "./brushes/brush-04.svg";
      break;
    case 5:
      newSrc = "./brushes/brush-05.svg";
      break;
    default:
      newSrc = "./brushes/brush-01.svg";
      break;
  }
  if (activeBrushImage.src.endsWith(newSrc.substring(1))) {
    console.log("El pincel ya está activo. No se requiere carga.");
    return Promise.resolve();
  }
  const newBrush = new Image();
  newBrush.src = newSrc;
  return new Promise((resolve) => {
    newBrush.onload = () => {
      activeBrushImage = newBrush;
      console.log(`Pincel actualizado a: ${newSrc}`);
      resolve();
    };
    newBrush.onerror = () => {
      console.error(`Error al cargar el pincel: ${newSrc}`);
      resolve();
    };
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("scratchCanvas");
  const container = canvas.parentElement;
  const ctx = canvas.getContext("2d");
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  ctx.fillStyle = "#C0C0C0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // También puedes usar una imagen: ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  let isScratching = false;

  function getCorrectCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return { x, y };
  }
  canvas.addEventListener("mousedown", (e) => {
    isScratching = true;
    scratch(e.offsetX, e.offsetY);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (isScratching) {
      scratch(e.offsetX, e.offsetY);
    }
  });
  canvas.addEventListener("mouseup", () => {
    isScratching = false;
  });
  //[c] mobile device
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    isScratching = true;
    const { x, y } = getCorrectCoordinates(e);
    scratch(x, y);
  });
  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (isScratching) {
      const { x, y } = getCorrectCoordinates(e);
      scratch(x, y);
    }
  });
  canvas.addEventListener("touchend", () => {
    isScratching = false;
  });

  function scratch(x, y) {
    const brush = activeBrushImage;
    ctx.globalCompositeOperation = "destination-out";
    ctx.drawImage(brush, x - brush.width / 2, y - brush.height / 2);
    ctx.beginPath();
    ctx.arc(x, y, 0, 0, Math.PI * 2);
    ctx.fill();
    checkProgress();
  }
  function checkProgress() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] === 0) {
        transparentPixels++;
      }
    }
    const progress = (transparentPixels / (canvas.width * canvas.height)) * 100;
    console.log(`Progreso de rascado: ${progress.toFixed(2)}%`);
    //[ ] mejorar la experiencia al terminar
    // Todo : ajustar por si hay pequenos espacios que no se alcanzan a ver
    if (progress > 95) {
      canvas.style.display = "none";
      alert("You Win");
    }
  }
  setBrushImage(1);
});

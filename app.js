document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("scratchCanvas");
  const container = canvas.parentElement;
  const ctx = canvas.getContext("2d");

  // Configura el tamaño del canvas para que coincida con el contenedor
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  // Rellena el canvas con el color o imagen "opaca"
  ctx.fillStyle = "#C0C0C0"; // Un gris para simular la capa de rascar
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // También puedes usar una imagen: ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  let isScratching = false;

  // Eventos para PC (mouse)
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

  // Eventos para dispositivos móviles (touch)
  canvas.addEventListener("touchstart", (e) => {
    isScratching = true;
    e.preventDefault(); // Evita el desplazamiento de la página
    const touch = e.touches[0];
    scratch(
      touch.clientX - canvas.offsetLeft,
      touch.clientY - canvas.offsetTop
    );
  });

  canvas.addEventListener("touchmove", (e) => {
    if (isScratching) {
      e.preventDefault();
      const touch = e.touches[0];
      scratch(
        touch.clientX - canvas.offsetLeft,
        touch.clientY - canvas.offsetTop
      );
    }
  });

  canvas.addEventListener("touchend", () => {
    isScratching = false;
  });

  function scratch(x, y) {
    ctx.globalCompositeOperation = "destination-out"; // Borra en lugar de dibujar
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2); // Círculo de 20px de radio
    ctx.fill();
  }
});

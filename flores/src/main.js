const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Configuración del ramo
const NUM_FLOWERS = 7;
const flowers = [];

// Crear las características de cada flor
for (let i = 0; i < NUM_FLOWERS; i++) {
    // Distribuir las flores en forma de abanico
    const offset = (i - Math.floor(NUM_FLOWERS / 2)) * 80;

    flowers.push({
        // El tallo nace del centro inferior
        startX: canvas.width / 2,
        startY: canvas.height + 50,

        // Punto de control para curvar el tallo
        controlX: canvas.width / 2 + offset * 0.5,
        controlY: canvas.height * 0.7,

        // El centro de la flor (formando un arco: las de en medio son más altas)
        endX: canvas.width / 2 + offset,
        endY: canvas.height / 2 + Math.abs(offset) * 0.6 - 150,

        // Matemáticas de la flor
        k: Math.floor(Math.random() * 3) + 4, // Entre 4 y 6 pétalos (x2 si es par)
        a: Math.random() * 30 + 40, // Tamaño de la flor

        // Tonos amarillos/dorados (HSL: 45 es oro, 60 es amarillo limón)
        hue: 45 + Math.random() * 15,

        // Progreso del dibujo
        angle: 0,
        speed: 0.015 + Math.random() * 0.01
    });
}

function drawBouquet() {
    // Limpiamos el lienzo por completo en cada fotograma
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    flowers.forEach(f => {
        // 1. DIBUJAR EL TALLO (Verde)
        ctx.beginPath();
        ctx.moveTo(f.startX, f.startY);
        ctx.quadraticCurveTo(f.controlX, f.controlY, f.endX, f.endY);
        ctx.strokeStyle = '#228B22'; // Verde bosque
        ctx.lineWidth = 4;
        ctx.shadowBlur = 0; // Sin brillo para el tallo
        ctx.stroke();

        // 2. DIBUJAR LA FLOR (Amarilla)
        ctx.beginPath();
        // Trazamos la curva desde 0 hasta el ángulo actual de crecimiento
        for (let t = 0; t <= f.angle; t += 0.05) {
            const r = f.a * Math.cos(f.k * t);
            const px = f.endX + r * Math.cos(t);
            const py = f.endY + r * Math.sin(t);

            if (t === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }

        // Estilos de neón/brillo amarillo
        ctx.strokeStyle = `hsl(${f.hue}, 100%, 50%)`;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.stroke();

        // Dibujar un centro brillante (el "polen")
        ctx.beginPath();
        ctx.arc(f.endX, f.endY, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFA500'; // Naranja
        ctx.fill();

        // 3. CRECER LA FLOR
        // Math.PI * 2 es un círculo completo. Detenemos el crecimiento al completarla.
        if (f.angle < Math.PI * 2) {
            f.angle += f.speed;
        }
    });

    requestAnimationFrame(drawBouquet);
}

// Iniciar la animación
drawBouquet();
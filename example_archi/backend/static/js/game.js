const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Exemple simple : dessiner un cercle qui bouge
let x = 50;
let y = 300;
let dx = 2;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();

    x += dx;
    if (x > canvas.width - 30 || x < 30) dx = -dx;

    requestAnimationFrame(draw);
}

draw();

// Exemple de sauvegarde des données (position du cercle) sur serveur
async function saveGame() {
    const data = { x: x, y: y };
    const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log('Sauvegarde:', result);
}

// Exemple de chargement des données depuis serveur
async function loadGame() {
    const response = await fetch('/api/load');
    const data = await response.json();
    if (data.x && data.y) {
        x = data.x;
        y = data.y;
    }
}

loadGame();

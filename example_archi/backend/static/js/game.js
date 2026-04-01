const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Exemple simple : dessiner une voiture qui bouge
let x = 50;
let y = 300;
let dx = 0;
let dy = 0;
let carSpeed = 0; // Vitesse d'accélération/décélération horizontale
let carSpeedY = 0; // Vitesse d'accélération/décélération verticale

// Objet pour tracker les touches du clavier
const keys = {};

// Écouteurs pour les touches du clavier
document.addEventListener('keydown', function(event) {
    keys[event.key] = true;
});

document.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});

function drawCar(xPos, yPos) {
    // Carrosserie
    ctx.fillStyle = 'red';
    ctx.fillRect(xPos - 10, yPos - 5, 20, 10);
    
    // Fenêtre
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(xPos - 7.5, yPos - 3.75, 15, 7.5)
    
    // Roue gauche
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(xPos -7.7,yPos + 5,2.5,0,Math.PI*2);
    ctx.fill();
    ctx.closePath();
    
    // Roue droite
    ctx.beginPath();
    ctx.arc(xPos + 7.7,yPos +5,2.5,0,Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

// Essai de dessin d'une piste de course (racetrack)
function drawRacetrack(xPos, yPos) {
    ctx.beginPath();

    // Ovale extérieur (noir)
    ctx.fillStyle = 'black';
    ctx.ellipse(xPos, yPos, 120, 60, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ovale intérieur (vide/blanc)
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.ellipse(xPos, yPos, 90, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.closePath();
}

function draw() {
    // Draw green background
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawCar(x, y);

    // Accélération/Décélération horizontale avec Left/Right arrow
    if (keys['ArrowRight']) {
        carSpeed = Math.min(carSpeed + 0.5, 8); // Max speed 8
    }
    if (keys['ArrowLeft']) {
        carSpeed = Math.max(carSpeed - 0.5, -8); // Min speed -8
    }
    
    // Freinage progressif horizontal si aucune touche de vitesse n'est pressée
    if (!keys['ArrowLeft'] && !keys['ArrowRight']) {
        carSpeed *= 0.95; // Décélération progressive
        if (Math.abs(carSpeed) < 0.1) carSpeed = 0; // Arrêt complet
    }
    
    x += carSpeed;
    
    // Accélération/Décélération verticale avec Up/Down arrow
    if (keys['ArrowUp']) {
        carSpeedY = Math.max(carSpeedY - 0.5, -8); // Accélération vers le haut
    }
    if (keys['ArrowDown']) {
        carSpeedY = Math.min(carSpeedY + 0.5, 8); // Accélération vers le bas
    }
    
    // Freinage progressif vertical si aucune touche de vitesse n'est pressée
    if (!keys['ArrowUp'] && !keys['ArrowDown']) {
        carSpeedY *= 0.95; // Décélération progressive
        if (Math.abs(carSpeedY) < 0.1) carSpeedY = 0; // Arrêt complet
    }
    
    y += carSpeedY;
    
    // Contrôle horizontal direct avec Q et D
    if (keys['q'] || keys['Q']) {
        x -= 5;
    }
    if (keys['d'] || keys['D']) {
        x += 5;
    }
    
    // Contrôle vertical direct avec Z et S
    if (keys['z'] || keys['Z']) {
        y -= 5;
    }
    if (keys['s'] || keys['S']) {
        y += 5;
    }
    
    // Limiter le mouvement horizontal
    if (x > canvas.width - 10) x = canvas.width - 10;
    if (x < 10) x = 10;
    
    // Limiter le mouvement vertical
    if (y < 12) y = 12;
    if (y > canvas.height - 12) y = canvas.height - 12;

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

// Ficheiro: pong.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pongCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // VARIÁVEIS DO JOGO
    let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, speedX: 5, speedY: 5 };
    let player = { x: 10, y: canvas.height / 2 - 50, width: 10, height: 100, score: 0 };
    let computer = { x: canvas.width - 20, y: canvas.height / 2 - 50, width: 10, height: 100, score: 0 };
    const net = { x: canvas.width / 2 - 1, y: 0, width: 2, height: 10 };

    // FUNÇÕES DE DESENHO
    function drawRect(x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); }
    function drawCircle(x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2, false); ctx.fill(); }
    function drawText(text, x, y, color) { ctx.fillStyle = color; ctx.font = "45px fantasy"; ctx.fillText(text, x, y); }
    function drawNet() { for(let i=0; i <= canvas.height; i+=15) { drawRect(net.x, net.y + i, net.width, net.height, "WHITE"); } }

    // CONTROLE DO JOGADOR
    canvas.addEventListener('mousemove', movePaddle);
    function movePaddle(evt) {
        let rect = canvas.getBoundingClientRect();
        player.y = evt.clientY - rect.top - player.height / 2;
    }

    // LÓGICA DE COLISÃO
    function collision(b, p) {
        b.top = b.y - b.radius; b.bottom = b.y + b.radius;
        b.left = b.x - b.radius; b.right = b.x + b.radius;
        p.top = p.y; p.bottom = p.y + p.height;
        p.left = p.x; p.right = p.x + p.width;
        return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
    }

    // RESETAR BOLA
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.speedX = -ball.speedX;
        ball.speedY = 5;
    }

    // LÓGICA DE UPDATE
    function update() {
        // Mover a bola
        ball.x += ball.speedX;
        ball.y += ball.speedY;

        // IA do computador
        computer.y += ((ball.y - (computer.y + computer.height / 2))) * 0.1;
        
        // Colisão com as bordas superior/inferior
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
            ball.speedY = -ball.speedY;
        }

        let p = (ball.x < canvas.width / 2) ? player : computer;
        if (collision(ball, p)) {
            let collidePoint = (ball.y - (p.y + p.height / 2));
            collidePoint = collidePoint / (p.height / 2);
            let angleRad = (Math.PI / 4) * collidePoint;
            let direction = (ball.x < canvas.width / 2) ? 1 : -1;
            ball.speedX = direction * 5 * Math.cos(angleRad);
            ball.speedY = 5 * Math.sin(angleRad);
        }

        // PONTUAÇÃO
        if (ball.x - ball.radius < 0) {
            computer.score++;
            resetBall();
        } else if (ball.x + ball.radius > canvas.width) {
            player.score++;
            resetBall();
        }
    }

    // RENDERIZAR O JOGO
    function render() {
        drawRect(0, 0, canvas.width, canvas.height, "BLACK");
        drawText(player.score, canvas.width / 4, canvas.height / 5, "WHITE");
        drawText(computer.score, 3 * canvas.width / 4, canvas.height / 5, "WHITE");
        drawNet();
        drawRect(player.x, player.y, player.width, player.height, "WHITE");
        drawRect(computer.x, computer.y, computer.width, computer.height, "WHITE");
        drawCircle(ball.x, ball.y, ball.radius, "WHITE");
    }

    // GAME LOOP
    function gameLoop() {
        update();
        render();
        requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
});
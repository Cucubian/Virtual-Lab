function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const status = document.getElementById('experiment-status');

    let gravity = 9.8;
    let mass = 5;
    let velocity = 0;
    let isRunning = false;
    let startTime = 0;
    let elapsedTime = 0;

    const ball = {
        x: 400,
        y: 100,
        radius: 20,
        color: '#ef4444',
        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + mass, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = '#991b1b';
            ctx.stroke();
        }
    };

    params.innerHTML = `
        <div class="param-row">
            <label>Trọng lực (m/s²): <span id="valG">${gravity}</span></label>
            <input type="range" id="sliderG" min="0" max="30" step="0.1" value="${gravity}">
        </div>
        <div class="param-row">
            <label>Khối lượng (kg): <span id="valM">${mass}</span></label>
            <input type="range" id="sliderM" min="1" max="20" value="${mass}">
        </div>
    `;

    document.getElementById('sliderG').oninput = (e) => {
        gravity = parseFloat(e.target.value);
        document.getElementById('valG').textContent = gravity;
    };
    document.getElementById('sliderM').oninput = (e) => {
        mass = parseInt(e.target.value);
        document.getElementById('valM').textContent = mass;
    };

    engine.addObject(ball);

    engine.update = function(deltaTime) {
        if (!isRunning) return;

        elapsedTime += deltaTime;
        // Physics: v = u + at, s = ut + 0.5at^2
        // Pixel scale: 1m = 50px
        const scale = 50;
        velocity += gravity * deltaTime;
        ball.y += velocity * scale * deltaTime;

        // Ground collision
        if (ball.y > 450 - ball.radius - mass) {
            ball.y = 450 - ball.radius - mass;
            isRunning = false;
            status.textContent = "Hoàn thành";
        }
    };

    const originalDraw = engine.draw.bind(engine);
    engine.draw = function() {
        originalDraw();
        const ctx = this.ctx;
        
        // Draw Ground
        ctx.fillStyle = '#64748b';
        ctx.fillRect(0, 450, 800, 50);

        // UI Info
        ctx.fillStyle = '#1e293b';
        ctx.font = '16px Inter';
        ctx.fillText(`Vận tốc: ${(velocity).toFixed(2)} m/s`, 50, 50);
        ctx.fillText(`Thời gian: ${elapsedTime.toFixed(2)} s`, 50, 80);
        ctx.fillText(`Độ cao: ${((450 - ball.y) / 50).toFixed(2)} m`, 50, 110);
    };

    startBtn.onclick = () => {
        if (!isRunning && ball.y < 400) {
            isRunning = true;
            status.textContent = "Đang chạy";
        }
    };

    resetBtn.onclick = () => {
        isRunning = false;
        velocity = 0;
        elapsedTime = 0;
        ball.y = 100;
        status.textContent = "Sẵn sàng";
    };

    engine.start();
}

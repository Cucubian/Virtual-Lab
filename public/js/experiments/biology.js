function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const status = document.getElementById('experiment-status');

    let populations = {
        grass: 100,
        rabbits: 20,
        foxes: 5
    };

    let history = [];
    let isRunning = false;
    let timer = 0;

    const COLORS = {
        grass: '#10b981',
        rabbits: '#94a3b8',
        foxes: '#f59e0b'
    };

    engine.update = function(deltaTime) {
        if (!isRunning) return;

        timer += deltaTime;
        if (timer > 0.5) { // Update stats every 0.5s
            timer = 0;
            
            // Lotka-Volterra inspired simplified model
            const oldR = populations.rabbits;
            const oldF = populations.foxes;
            const oldG = populations.grass;

            // Grass grows
            populations.grass += oldG * 0.05 - (oldR * 0.2);
            // Rabbits eat grass and reproduce, get eaten by foxes
            populations.rabbits += oldR * (oldG * 0.001) - (oldF * 0.5);
            // Foxes eat rabbits and reproduce
            populations.foxes += oldF * (oldR * 0.02) - (oldF * 0.1);

            // Clamp values
            Object.keys(populations).forEach(k => {
                populations[k] = Math.max(0, populations[k]);
                if (k === 'grass' && populations[k] > 200) populations[k] = 200;
            });

            history.push({ ...populations });
            if (history.length > 50) history.shift();
        }
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        // Draw Bars
        const margin = 100;
        const spacing = 150;
        
        ctx.font = 'bold 16px Inter';
        
        // Grass
        ctx.fillStyle = COLORS.grass;
        ctx.fillRect(margin, 400 - populations.grass, 80, populations.grass);
        ctx.fillText('Cỏ', margin + 25, 430);
        ctx.fillText(Math.round(populations.grass), margin + 25, 400 - populations.grass - 10);

        // Rabbits
        ctx.fillStyle = COLORS.rabbits;
        ctx.fillRect(margin + spacing, 400 - populations.rabbits * 5, 80, populations.rabbits * 5);
        ctx.fillText('Thỏ', margin + spacing + 25, 430);
        ctx.fillText(Math.round(populations.rabbits), margin + spacing + 25, 400 - populations.rabbits * 5 - 10);

        // Foxes
        ctx.fillStyle = COLORS.foxes;
        ctx.fillRect(margin + spacing * 2, 400 - populations.foxes * 20, 80, populations.foxes * 20);
        ctx.fillText('Cáo', margin + spacing * 2 + 25, 430);
        ctx.fillText(Math.round(populations.foxes), margin + spacing * 2 + 25, 400 - populations.foxes * 20 - 10);

        // Draw Trend Line
        ctx.strokeStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(500, 50);
        ctx.lineTo(500, 350);
        ctx.lineTo(750, 350);
        ctx.stroke();

        if (history.length > 1) {
            ['grass', 'rabbits', 'foxes'].forEach(key => {
                ctx.strokeStyle = COLORS[key];
                ctx.beginPath();
                history.forEach((state, i) => {
                    const x = 500 + (i * 5);
                    let val = state[key];
                    if (key === 'rabbits') val *= 5;
                    if (key === 'foxes') val *= 20;
                    const y = 350 - (val / 200 * 300);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                ctx.stroke();
            });
        }
    };

    startBtn.onclick = () => {
        isRunning = !isRunning;
        startBtn.textContent = isRunning ? "Tạm dừng" : "Bắt đầu";
        startBtn.className = isRunning ? "btn btn-warning" : "btn btn-success";
        status.textContent = isRunning ? "Đang mô phỏng..." : "Đang tạm dừng";
    };

    resetBtn.onclick = () => {
        populations = { grass: 100, rabbits: 20, foxes: 5 };
        history = [];
        isRunning = false;
        startBtn.textContent = "Bắt đầu";
        startBtn.className = "btn btn-success";
        status.textContent = "Sẵn sàng";
    };

    engine.start();
}

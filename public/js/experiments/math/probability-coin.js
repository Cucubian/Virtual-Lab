function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    startBtn.textContent = "Tung một lần";
    
    let heads = 0, tails = 0, total = 0;
    let flipping = false;
    let currentFace = 'H';

    params.innerHTML = `
        <div class="glass-card" style="padding:20px; text-align:center;">
            <div style="display:flex; justify-content:space-around; margin-bottom:15px;">
                <div><h1 id="hC" style="color:#fbbf24">0</h1><small>Ngửa (H)</small></div>
                <div><h1 id="tC" style="color:#94a3b8">0</h1><small>Sấp (T)</small></div>
            </div>
            <p>Tỉ lệ Ngửa: <b id="ratio">0%</b></p>
        </div>
        <button id="batch-flip" class="btn btn-info" style="width:100%; margin-top:15px;">Tung 100 lần</button>
    `;

    const update = () => {
        document.getElementById('hC').textContent = heads;
        document.getElementById('tC').textContent = tails;
        const r = total === 0 ? 0 : (heads/total * 100).toFixed(1);
        document.getElementById('ratio').textContent = r + '%';
        status.textContent = `Tổng cộng: ${total} lần tung`;
    };

    const flip = () => {
        if (flipping) return;
        flipping = true;
        let count = 0;
        const iv = setInterval(() => {
            currentFace = Math.random() < 0.5 ? 'H' : 'T';
            count++;
            if (count > 10) {
                clearInterval(iv);
                if (currentFace === 'H') heads++; else tails++;
                total++;
                flipping = false;
                update();
            }
        }, 50);
    };

    startBtn.onclick = flip;
    resetBtn.onclick = () => { heads=0; tails=0; total=0; update(); };
    document.getElementById('batch-flip').onclick = () => {
        for(let i=0; i<100; i++) {
            if (Math.random() < 0.5) heads++; else tails++;
            total++;
        }
        update();
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;
        const cx = 400; const cy = 250;

        ctx.save();
        ctx.translate(cx, cy);
        if (flipping) ctx.scale(Math.sin(Date.now()/50), 1);
        
        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.arc(0,0, 80, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 60px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText(currentFace, 0, 20);
        ctx.restore();
    };

    engine.start();
}

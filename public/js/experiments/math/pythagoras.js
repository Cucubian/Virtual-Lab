function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    let a = 3;
    let b = 4;
    let fill = 0;
    let animating = false;
    const scale = 35; // Adjusted scale for better fitting

    params.innerHTML = `
        <div class="space-y-6">
            <div class="param-row bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div class="flex justify-between mb-2">
                    <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Cạnh a (Dọc)</span>
                    <span class="text-lg font-black text-rose-500" id="valA">${a}</span>
                </div>
                <input type="range" id="rangeA" min="2" max="6" value="${a}" class="w-full accent-rose-500">
            </div>
            <div class="param-row bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div class="flex justify-between mb-2">
                    <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Cạnh b (Ngang)</span>
                    <span class="text-lg font-black text-emerald-500" id="valB">${b}</span>
                </div>
                <input type="range" id="rangeB" min="2" max="6" value="${b}" class="w-full accent-emerald-500">
            </div>
            <div class="glass-card p-6 text-center bg-indigo-50/50 border-none">
                <p id="formula" class="text-2xl font-black tracking-tighter">
                    <span class="text-rose-500">${a}²</span> + <span class="text-emerald-500">${b}²</span> = <span class="text-indigo-600">${a*a + b*b}</span>
                </p>
                <p class="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2">Tổng bình phương diện tích</p>
            </div>
        </div>
    `;

    const update = () => {
        a = parseInt(document.getElementById('rangeA').value);
        b = parseInt(document.getElementById('rangeB').value);
        document.getElementById('valA').textContent = a;
        document.getElementById('valB').textContent = b;
        document.getElementById('formula').innerHTML = `<span class="text-rose-500">${a}²</span> + <span class="text-emerald-500">${b}²</span> = <span class="text-indigo-600">${a*a + b*b}</span>`;
        fill = 0;
        animating = false;
        status.textContent = "Nhấn 'Bắt đầu' để kiểm chứng định lý";
        status.className = "text-primary font-bold";
    }

    document.getElementById('rangeA').oninput = update;
    document.getElementById('rangeB').oninput = update;

    startBtn.onclick = () => {
        if (animating) return;
        fill = 0;
        animating = true;
        status.textContent = "Nước đang chảy vào bình phương cạnh huyền...";
    };

    resetBtn.onclick = () => {
        document.getElementById('rangeA').value = 3;
        document.getElementById('rangeB').value = 4;
        update();
    };

    engine.update = (dt) => {
        if (animating && fill < 1) {
            fill += dt * 0.4;
            if (fill >= 1) {
                fill = 1;
                animating = false;
                status.textContent = "Chính xác! a² + b² = c²";
                status.className = "text-emerald-500 font-bold";
            }
        }
    };

    function drawPerfectSquare(ctx, x, y, sizeX, sizeY, color, fillPercent, label, labelPos) {
        ctx.save();
        ctx.translate(x, y);
        
        // Background Square
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, sizeX, sizeY);
        
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.1;
        ctx.fillRect(0, 0, sizeX, sizeY);
        
        // Fill liquid effect
        ctx.globalAlpha = 0.6;
        if (fillPercent > 0) {
            const fillH = sizeY * fillPercent;
            ctx.fillRect(0, sizeY - fillH, sizeX, fillH);
        }
        
        ctx.globalAlpha = 1;
        ctx.fillStyle = color;
        ctx.font = 'bold 14px Outfit';
        const labelX = labelPos === 'left' ? -10 : sizeX / 2;
        const labelY = labelPos === 'top' ? -15 : sizeY + 25;
        ctx.textAlign = 'center';
        ctx.fillText(label, labelX, labelY);
        
        ctx.restore();
    }

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;
        
        const ox = 250;
        const oy = 350;

        const pa = a * scale;
        const pb = b * scale;
        const pc = Math.sqrt(pa*pa + pb*pb);
        const angle = Math.atan2(pa, pb);

        drawPerfectSquare(ctx, ox - pa, oy - pa, pa, pa, '#f43f5e', 1 - fill, `a² = ${a*a}`, 'top');
        drawPerfectSquare(ctx, ox, oy, pb, pb, '#10b981', 1 - fill, `b² = ${b*b}`, 'bottom');

        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox, oy - pa);
        ctx.lineTo(ox + pb, oy);
        ctx.closePath();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(ox, oy - 15);
        ctx.lineTo(ox + 15, oy - 15);
        ctx.lineTo(ox + 15, oy);
        ctx.stroke();

        ctx.save();
        ctx.translate(ox + pb, oy);
        ctx.rotate(-angle);
        
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, pc, -pc);
        
        ctx.fillStyle = '#6366f1';
        ctx.globalAlpha = 0.1;
        ctx.fillRect(0, 0, pc, -pc);
        
        ctx.globalAlpha = 0.6;
        const fillH = -pc * fill;
        ctx.fillRect(0, 0, pc, fillH);
        
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#6366f1';
        ctx.font = 'bold 16px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText(`c² = ${a*a + b*b}`, pc/2, -pc - 15);
        
        ctx.restore();
        
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 12px Inter';
        ctx.fillText(`a=${a}`, ox - 15, oy - pa/2);
        ctx.fillText(`b=${b}`, ox + pb/2, oy + 15);
    };

    engine.start();
    update();
}

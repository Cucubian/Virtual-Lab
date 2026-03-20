function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Mờ nút bắt đầu vì đây là mô phỏng tương tác thời gian thực
    startBtn.disabled = true;
    startBtn.classList.add('opacity-50', 'cursor-not-allowed', 'grayscale');
    startBtn.title = "Mô phỏng này tự động cập nhật khi bạn nhập số";

    let a = 0.5;
    let b = 0.0;
    let c = 0.0;

    const cx = engine.width / 2;
    const cy = engine.height / 2;
    const scale = 30;

    params.innerHTML = `
        <div class="space-y-6 max-w-full overflow-hidden">
            <div class="glass-card p-5 border-none bg-slate-900 text-white shadow-xl">
                <h4 class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3 text-center">Hàm số bậc hai</h4>
                <p id="eq-text" class="text-xl font-black text-center tracking-tighter truncate">
                    y = <span class="text-indigo-400">0.5</span>x² + <span class="text-rose-400">0.0</span>x + <span class="text-emerald-400">0.0</span>
                </p>
            </div>
            
            <div class="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div class="space-y-2">
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Hệ số a (Độ cong)</label>
                    <input type="number" id="input-a" step="0.1" value="0.5" class="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-indigo-600 text-center focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                </div>

                <div class="space-y-2">
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Hệ số b (Tịnh tiến)</label>
                    <input type="number" id="input-b" step="0.5" value="0" class="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-rose-600 text-center focus:ring-2 focus:ring-rose-500 outline-none transition-all">
                </div>

                <div class="space-y-2">
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Hệ số c (Tự do)</label>
                    <input type="number" id="input-c" step="0.5" value="0" class="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-emerald-600 text-center focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                </div>
            </div>

            <div class="p-4 bg-slate-900/5 rounded-xl border border-slate-200">
                <div id="delta-info" class="text-center font-black text-slate-700 text-xs tracking-wide">
                    Δ = b² - 4ac = 0.0
                </div>
            </div>
        </div>
    `;

    const inputA = document.getElementById('input-a');
    const inputB = document.getElementById('input-b');
    const inputC = document.getElementById('input-c');
    const deltaInfo = document.getElementById('delta-info');

    const updateUI = () => {
        const eqText = document.getElementById('eq-text');
        const aVal = parseFloat(inputA.value) || 0;
        const bVal = parseFloat(inputB.value) || 0;
        const cVal = parseFloat(inputC.value) || 0;
        
        a = aVal; b = bVal; c = cVal;
        
        const bSign = b >= 0 ? '+' : '-';
        const cSign = c >= 0 ? '+' : '-';
        
        eqText.innerHTML = `y = <span class="text-indigo-400">${a.toFixed(1)}</span>x² ${bSign} <span class="text-rose-400">${Math.abs(b).toFixed(1)}</span>x ${cSign} <span class="text-emerald-400">${Math.abs(c).toFixed(1)}</span>`;
        
        const delta = b*b - 4*a*c;
        deltaInfo.innerHTML = `Δ = ${b.toFixed(1)}² - 4(${a.toFixed(1)})(${c.toFixed(1)}) = ${delta.toFixed(2)}`;
        
        if (delta > 0) deltaInfo.className = "text-center font-bold text-emerald-600 text-sm";
        else if (delta === 0) deltaInfo.className = "text-center font-bold text-amber-600 text-sm";
        else deltaInfo.className = "text-center font-bold text-rose-600 text-sm";
    };

    [inputA, inputB, inputC].forEach(input => {
        input.oninput = updateUI;
    });

    resetBtn.onclick = () => {
        inputA.value = 0.5;
        inputB.value = 0;
        inputC.value = 0;
        a = 0.5; b = 0; c = 0; // Explicitly update
        updateUI();
        status.textContent = "Đã đặt lại mặc định (Parabol cân đối).";
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        // Grid
        ctx.strokeStyle = 'rgba(0,0,0,0.05)';
        for(let i = -15; i <= 15; i++) {
            ctx.beginPath(); ctx.moveTo(cx + i * scale, 0); ctx.lineTo(cx + i * scale, this.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, cy + i * scale); ctx.lineTo(this.width, cy + i * scale); ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, cy); ctx.lineTo(this.width, cy);
        ctx.moveTo(cx, 0); ctx.lineTo(cx, this.height);
        ctx.stroke();

        // Parabola
        ctx.beginPath();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 4;
        
        const xLimit = cx / scale;
        let first = true;
        for(let xMath = -xLimit; xMath <= xLimit; xMath += 0.05) {
            const yMath = a * xMath * xMath + b * xMath + c;
            const sx = cx + xMath * scale;
            const sy = cy - yMath * scale;
            
            if (sy >= 0 && sy <= this.height) {
                if (first) {
                    ctx.moveTo(sx, sy);
                    first = false;
                } else {
                    ctx.lineTo(sx, sy);
                }
            }
        }
        ctx.stroke();

        // Vertex
        if (Math.abs(a) > 0.01) {
            const vxMath = -b / (2 * a);
            const vyMath = a * vxMath * vxMath + b * vxMath + c;
            const vsx = cx + vxMath * scale;
            const vsy = cy - vyMath * scale;
            
            if (vsx > 0 && vsx < this.width && vsy > 0 && vsy < this.height) {
                ctx.fillStyle = '#f43f5e';
                ctx.beginPath();
                ctx.arc(vsx, vsy, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillText(`Đỉnh (${vxMath.toFixed(1)}, ${vyMath.toFixed(1)})`, vsx + 10, vsy - 10);
            }
        }
    };

    engine.start();
    status.textContent = "Điều chỉnh các hệ số để quan sát sự biến hình của Parabol.";
}

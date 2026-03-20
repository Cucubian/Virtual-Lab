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

    let a = 1.0;
    let b = 0.0;

    class ControlHandle extends LabObject {
        constructor(x, y, color, type) {
            super(x, y, 20, 20, color, 'circle');
            this.draggable = false;
            this.handleType = type; // 'slope' or 'intercept'
        }
        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Label
            ctx.fillStyle = this.color;
            ctx.font = 'bold 12px Inter';
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.fillText(this.handleType === 'intercept' ? 'Điểm b' : 'Độ dốc a', this.x + 15, this.y + 5);
            ctx.shadowBlur = 0;
        }
    }

    const cx = engine.width / 2;
    const cy = engine.height / 2;
    const scale = 40;

    const interceptHandle = new ControlHandle(cx, cy - b * scale, '#f43f5e', 'intercept');
    const slopeHandle = new ControlHandle(cx + scale, cy - (a * 1 + b) * scale, '#6366f1', 'slope');
    
    engine.addObject(interceptHandle);
    engine.addObject(slopeHandle);

    params.innerHTML = `
        <div class="space-y-6 max-w-full overflow-hidden">
            <div class="glass-card p-5 border-none bg-slate-900 text-white shadow-xl">
                <h4 class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3 text-center text-indigo-200">Phương trình hiện tại</h4>
                <p id="eq-text" class="text-2xl font-black text-center tracking-tighter truncate">
                    y = <span class="text-indigo-400">1.0</span>x + <span class="text-rose-400">0.0</span>
                </p>
            </div>
            
            <div class="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-5">
                <div class="space-y-2">
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400">Hệ số góc (a)</label>
                    <input type="number" id="input-a" value="1" step="0.1" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                </div>

                <div class="space-y-2">
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400">Cao độ gốc (b)</label>
                    <input type="number" id="input-b" value="0" step="0.5" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-rose-600 focus:ring-2 focus:ring-rose-500 outline-none transition-all">
                </div>
            </div>

            <div class="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <p class="text-[11px] font-medium text-indigo-600 leading-relaxed italic">
                    💡 <b>Mẹo:</b> Hệ số <b>a</b> quyết định độ dốc, <b>b</b> quyết định vị trí cắt trục tung.
                </p>
            </div>
        </div>
    `;

    const inputA = document.getElementById('input-a');
    const inputB = document.getElementById('input-b');

    const updateUI = () => {
        const eqText = document.getElementById('eq-text');
        const bVal = parseFloat(inputB.value) || 0;
        const aVal = parseFloat(inputA.value) || 0;
        const bDisplay = bVal >= 0 ? `+ ${bVal.toFixed(1)}` : `- ${Math.abs(bVal).toFixed(1)}`;
        eqText.innerHTML = `y = <span class="text-indigo-400">${aVal.toFixed(1)}</span>x <span class="text-rose-400">${bDisplay}</span>`;
        a = aVal;
        b = bVal;
    };

    [inputA, inputB].forEach(input => {
        input.oninput = updateUI;
    });

    resetBtn.onclick = () => {
        inputA.value = 1.0;
        inputB.value = 0.0;
        a = 1.0; // Update variables explicitly
        b = 0.0;
        updateUI();
        status.textContent = "Đã đặt lại mặc định (y = 1.0x + 0.0).";
    };

    engine.update = () => {
        interceptHandle.y = cy - b * scale;
        slopeHandle.y = cy - (a * 1 + b) * scale;
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        // 1. Grid
        ctx.strokeStyle = 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 1;
        for(let i = -10; i <= 10; i++) {
            const pos = i * scale;
            ctx.beginPath(); ctx.moveTo(cx + pos, 0); ctx.lineTo(cx + pos, this.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, cy + pos); ctx.lineTo(this.width, cy + pos); ctx.stroke();
        }

        // 2. Axes
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, cy); ctx.lineTo(this.width, cy); // X
        ctx.moveTo(cx, 0); ctx.lineTo(cx, this.height); // Y
        ctx.stroke();

        // 3. The Function Line
        ctx.beginPath();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 4;
        const xLimit = cx / scale;
        ctx.moveTo(0, cy - (a * - (cx/scale) + b) * scale);
        for (let xMath = -xLimit; xMath <= xLimit; xMath += 0.1) {
            const yMath = a * xMath + b;
            const sx = cx + xMath * scale;
            const sy = cy - yMath * scale;
            ctx.lineTo(sx, sy);
        }
        ctx.stroke();

        // 4. Coordinates labels
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Inter';
        ctx.fillText('x', this.width - 20, cy - 10);
        ctx.fillText('y', cx + 10, 20);

        this.objects.forEach(o => o.draw(ctx));
    };

    engine.start();
    status.textContent = "Nhập các hệ số a và b để thay đổi đồ thị.";
}

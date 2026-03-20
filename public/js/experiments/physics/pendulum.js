function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    let length = 250; // pixels
    let mass = 1.0;
    let initialAngle = 30; // degrees
    let currentAngle = (initialAngle * Math.PI) / 180;
    let angularVel = 0;
    let g = 9.8 * 80; // Scaled gravity for pixels
    let isRunning = false;
    let time = 0;

    params.innerHTML = `
        <div class="space-y-6">
            <div class="glass-card p-5 border-none bg-slate-900 text-white shadow-xl">
                <h4 class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3 text-center">Thông số dao động</h4>
                <div class="grid grid-cols-2 gap-4 text-center">
                    <div class="p-3 bg-slate-800 rounded-xl border border-slate-700">
                        <div class="text-[10px] font-black text-indigo-400 uppercase">Chu kỳ (T)</div>
                        <div class="text-xl font-black italic tracking-tighter" id="period-display">0.00s</div>
                    </div>
                    <div class="p-3 bg-slate-800 rounded-xl border border-slate-700">
                        <div class="text-[10px] font-black text-rose-400 uppercase">Tần số (f)</div>
                        <div class="text-xl font-black italic tracking-tighter" id="freq-display">0.00Hz</div>
                    </div>
                </div>
            </div>

            <div class="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-5">
                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Chiều dài dây (l)</label>
                        <span class="text-xs font-bold text-indigo-600" id="valL">250 px</span>
                    </div>
                    <input type="range" id="sliderL" min="100" max="400" value="250" class="w-full accent-indigo-600">
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Góc ban đầu (α₀)</label>
                        <span class="text-xs font-bold text-rose-600" id="valA">30°</span>
                    </div>
                    <input type="range" id="sliderA" min="5" max="90" value="30" class="w-full accent-rose-600">
                </div>
                
                <div class="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[11px] text-indigo-700 leading-relaxed italic font-medium">
                    💡 Chu kỳ của con lắc đơn chỉ phụ thuộc vào <b>chiều dài dây</b> và <b>gia tốc trọng trường</b>, không phụ thuộc vào khối lượng.
                </div>
            </div>
        </div>
    `;

    const sliderL = document.getElementById('sliderL');
    const sliderA = document.getElementById('sliderA');
    const valL = document.getElementById('valL');
    const valA = document.getElementById('valA');
    const periodDisplay = document.getElementById('period-display');
    const freqDisplay = document.getElementById('freq-display');

    const updateCalc = () => {
        length = parseInt(sliderL.value);
        initialAngle = parseInt(sliderA.value);
        valL.textContent = `${length} px`;
        valA.textContent = `${initialAngle}°`;
        
        const period = 2 * Math.PI * Math.sqrt(length / g);
        periodDisplay.textContent = period.toFixed(2) + 's';
        freqDisplay.textContent = (1 / period).toFixed(2) + 'Hz';
        
        if (!isRunning) {
            currentAngle = (initialAngle * Math.PI) / 180;
            angularVel = 0;
            time = 0;
        }
    };

    sliderL.oninput = updateCalc;
    sliderA.oninput = updateCalc;

    function reset() {
        isRunning = false;
        updateCalc();
        status.textContent = "Kéo con lắc hoặc nhấn 'Bắt đầu'.";
        status.className = "text-indigo-600 font-bold";
        startBtn.disabled = false;
        startBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'grayscale');
    }

    startBtn.onclick = () => {
        isRunning = true;
        startBtn.disabled = true;
        startBtn.classList.add('opacity-50', 'cursor-not-allowed', 'grayscale');
        status.textContent = "Đang dao động...";
    };

    resetBtn.onclick = reset;

    const bob = new LabObject(0, 0, 35, 35, '#f43f5e', 'circle');
    engine.addObject(bob);

    engine.update = (dt) => {
        if (!isRunning) return;
        
        // Pendulum equation: θ'' = -(g/L) * sin(θ)
        const accel = -(g / length) * Math.sin(currentAngle);
        angularVel += accel * dt;
        currentAngle += angularVel * dt;
        
        // Very light damping
        angularVel *= 0.9995;
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;
        const cx = 400;
        const cy = 20;

        const bx = cx + length * Math.sin(currentAngle);
        const by = cy + length * Math.cos(currentAngle);

        // Ceiling
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cx - 80, cy - 10, 160, 10);
        
        // Pivot point
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#1e293b';
        ctx.fill();

        // String
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(bx, by);
        ctx.stroke();

        // Angle arc for visual aid
        if (Math.abs(currentAngle) > 0.1) {
            ctx.beginPath();
            const arcR = 50;
            ctx.arc(cx, cy, arcR, Math.PI/2, Math.PI/2 + currentAngle, currentAngle < 0);
            ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
            ctx.lineWidth = 4;
            ctx.stroke();
            
            ctx.fillStyle = '#f43f5e';
            ctx.font = '10px Inter';
            ctx.fillText(`${(currentAngle * 180 / Math.PI).toFixed(0)}°`, cx + 10, cy + 70);
        }

        // Bob
        bob.x = bx;
        bob.y = by;
        bob.draw(ctx);
        
        // Shadow on ground
        ctx.beginPath();
        ctx.ellipse(bx, 480, 20 + (by/50), 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fill();
    };

    updateCalc();
    engine.start();
}

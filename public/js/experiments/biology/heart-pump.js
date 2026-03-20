function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    startBtn.textContent = "Bắt đầu mô phỏng";

    let pulse = 0;
    let heartRate = 60; 
    let isBeating = false;
    let particles = [];
    let ecgPoints = [];

    params.innerHTML = `
        <div class="space-y-6">
            <div class="p-6 bg-slate-900 rounded-[32px] shadow-2xl border border-white/10 relative overflow-hidden">
                <div class="flex justify-between items-center mb-6">
                    <h4 class="text-[10px] font-black uppercase tracking-widest text-rose-500">Màn hình theo dõi</h4>
                    <div class="flex gap-1">
                        <div class="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                        <div class="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <div class="flex justify-between items-end">
                        <span class="text-[10px] text-slate-400 font-bold uppercase">Nhịp tim (BPM)</span>
                        <span id="bpm-val" class="text-2xl font-black text-white tabular-nums">60</span>
                    </div>
                    <div class="flex justify-between items-end">
                        <span class="text-[10px] text-slate-400 font-bold uppercase">Huyết áp (mmHg)</span>
                        <span id="bp-val" class="text-sm font-black text-rose-400 tabular-nums">120 / 80</span>
                    </div>
                </div>

                <div class="mt-6 h-20 bg-black/40 rounded-xl overflow-hidden relative">
                    <canvas id="ecg-canvas" width="200" height="80" class="w-full h-full"></canvas>
                </div>
            </div>

            <div class="param-row">
                <label class="text-[10px] font-black uppercase text-slate-400 block mb-3">Điều chỉnh cường độ:</label>
                <input type="range" id="bpm-slider" min="40" max="180" step="1" value="60" class="w-full accent-rose-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer">
            </div>

            <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-3">
                <div class="text-xl">🫁</div>
                <p class="text-[9px] text-slate-500 leading-relaxed pt-1">
                    Chu kỳ tim gồm 3 pha: Co tâm nhĩ (0.1s), Co tâm thất (0.3s) và Dãn chung (0.4s).
                </p>
            </div>
        </div>
    `;

    const bpmSlider = document.getElementById('bpm-slider');
    const bpmVal = document.getElementById('bpm-val');
    const bpVal = document.getElementById('bp-val');

    bpmSlider.oninput = (e) => {
        heartRate = parseInt(e.target.value);
        bpmVal.textContent = heartRate;
    };

    startBtn.onclick = () => {
        isBeating = !isBeating;
        startBtn.textContent = isBeating ? "Dừng mô phỏng" : "Bắt đầu mô phỏng";
        startBtn.classList.toggle('bg-rose-500', isBeating);
        status.textContent = isBeating ? "Đang theo dõi nhịp sinh học" : "Sẵn sàng";
    };

    resetBtn.onclick = () => {
        isBeating = false;
        particles = [];
        ecgPoints = [];
        startBtn.textContent = "Bắt đầu mô phỏng";
        startBtn.classList.remove('bg-rose-500');
        status.textContent = "Sẵn sàng";
    };

    engine.update = (dt) => {
        if (isBeating) {
            pulse += dt * (heartRate / 60) * Math.PI * 2;
            
            const contraction = Math.sin(pulse) > 0.7;
            const systolic = 110 + (heartRate/10) + (contraction ? 10 : 0);
            const diastolic = 70 + (heartRate/20);
            bpVal.textContent = `${Math.round(systolic)} / ${Math.round(diastolic)}`;

            if (contraction && Math.random() < 0.4) {
                // Blood particles flow out
                particles.push({ x: 430, y: 220, vx: 100, vy: -150, color: '#f43f5e', life: 1.5 });
                particles.push({ x: 370, y: 220, vx: -100, vy: -150, color: '#3b82f6', life: 1.5 });
            }

            // ECG points update
            ecgPoints.push(Math.sin(pulse) * 20 + (Math.random()-0.5)*5);
            if (ecgPoints.length > 50) ecgPoints.shift();
        }

        particles.forEach((p, i) => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            if (p.life < 0) particles.splice(i, 1);
        });
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;
        const cx = 400; const cy = 250;
        
        // Heart scaling effect
        const scale = 1.2 + (isBeating ? Math.max(0, Math.sin(pulse)) * 0.15 : 0);

        // Vessel background (Abstract)
        ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 15;
        ctx.beginPath();
        ctx.moveTo(cx, 0); ctx.lineTo(cx, 150); 
        ctx.bezierCurveTo(cx+100, 150, cx+150, 300, cx, 500);
        ctx.stroke();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);

        // Drawing Left & Right Heart with Bezier curves for a "Beautiful" look
        const drawChamber = (side) => {
            ctx.fillStyle = side === 'left' ? 'rgba(244, 63, 94, 0.4)' : 'rgba(59, 130, 246, 0.4)';
            ctx.strokeStyle = side === 'left' ? '#f43f5e' : '#3b82f6';
            ctx.lineWidth = 4;
            
            ctx.beginPath();
            if (side === 'left') {
                ctx.moveTo(2, -40);
                ctx.bezierCurveTo(60, -80, 80, 20, 2, 80);
            } else {
                ctx.moveTo(-2, -40);
                ctx.bezierCurveTo(-60, -80, -80, 20, -2, 80);
            }
            ctx.fill(); ctx.stroke();
        };

        drawChamber('right');
        drawChamber('left');

        // VALVES
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
        const valveOpen = isBeating && Math.sin(pulse) > 0.7;
        
        ctx.beginPath();
        ctx.moveTo(-30, 0); ctx.lineTo(valveOpen ? -10 : -50, 10);
        ctx.moveTo(30, 0); ctx.lineTo(valveOpen ? 10 : 50, 10);
        ctx.stroke();

        ctx.restore();

        // Particles
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / 1.5;
            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fill();
            ctx.globalAlpha = 1.0;
        });

        // Small ECG on main canvas
        if (isBeating) {
            ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2;
            ctx.beginPath();
            ecgPoints.forEach((p, i) => {
                ctx.lineTo(10 + i * 4, 480 - 40 + p);
            });
            ctx.stroke();
        }
    };

    engine.start();
}

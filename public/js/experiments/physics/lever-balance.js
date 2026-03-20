function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Mờ nút bắt đầu vì đây là mô phỏng tương tác thời gian thực
    startBtn.disabled = true;
    startBtn.classList.add('opacity-50', 'cursor-not-allowed', 'grayscale');
    startBtn.title = "Mô phỏng này tự động cập nhật khi bạn thay đổi thông số";

    let leverAngle = 0;
    let weightL = 20;
    let distL = 100;
    let weightR = 20;
    let distR = 100;

    params.innerHTML = `
        <div class="space-y-6">
            <div class="glass-card p-5 border-none bg-slate-900 text-white shadow-xl">
                <h4 class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3 text-center">Trạng thái cân bằng</h4>
                <div class="grid grid-cols-2 gap-4 text-center">
                    <div class="p-3 bg-slate-800 rounded-xl border border-slate-700">
                        <div class="text-[10px] font-black text-rose-400 uppercase">M_trái (F.d)</div>
                        <div class="text-xl font-black italic tracking-tighter" id="torqueL-header">0</div>
                    </div>
                    <div class="p-3 bg-slate-800 rounded-xl border border-slate-700">
                        <div class="text-[10px] font-black text-indigo-400 uppercase">M_phải (F.d)</div>
                        <div class="text-xl font-black italic tracking-tighter" id="torqueR-header">0</div>
                    </div>
                </div>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <!-- Bên trái -->
                <div class="space-y-4">
                    <div class="flex justify-between items-center text-rose-500 font-black text-[10px] tracking-widest uppercase">
                        <span>BÊN TRÁI (F₁)</span>
                        <span id="label-left">${weightL}kg | ${distL}m</span>
                    </div>
                    <div class="space-y-3 px-1">
                        <input type="range" id="sliderWL" min="10" max="100" step="10" value="${weightL}" class="w-full accent-rose-500">
                        <input type="range" id="sliderDL" min="20" max="180" value="${distL}" class="w-full accent-rose-300 h-1">
                    </div>
                </div>

                <div class="h-px bg-slate-100"></div>

                <!-- Bên phải -->
                <div class="space-y-4">
                    <div class="flex justify-between items-center text-indigo-500 font-black text-[10px] tracking-widest uppercase">
                        <span>BÊN PHẢI (F₂)</span>
                        <span id="label-right">${weightR}kg | ${distR}m</span>
                    </div>
                    <div class="space-y-3 px-1">
                        <input type="range" id="sliderWR" min="10" max="100" step="10" value="${weightR}" class="w-full accent-indigo-500">
                        <input type="range" id="sliderDR" min="20" max="180" value="${distR}" class="w-full accent-indigo-300 h-1">
                    </div>
                </div>
                
                <div class="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[10px] text-indigo-700 leading-relaxed italic font-medium">
                    💡 <b>Quy tắc Moment:</b> Đòn bẩy sẽ cân bằng khi tổng Moment các lực làm vật quay cùng chiều kim đồng hồ bằng tổng Moment các lực làm vật quay ngược chiều.
                </div>
            </div>
        </div>
    `;

    const update = () => {
        weightL = parseInt(document.getElementById('sliderWL').value);
        distL = parseInt(document.getElementById('sliderDL').value);
        weightR = parseInt(document.getElementById('sliderWR').value);
        distR = parseInt(document.getElementById('sliderDR').value);
        
        document.getElementById('label-left').textContent = `${weightL}kg | ${distL}m`;
        document.getElementById('label-right').textContent = `${weightR}kg | ${distR}m`;
        
        const torqueL = weightL * distL;
        const torqueR = weightR * distR;
        document.getElementById('torqueL-header').textContent = torqueL;
        document.getElementById('torqueR-header').textContent = torqueR;

        const diff = torqueR - torqueL;
        const targetAngle = (diff / 2000) * (Math.PI / 6); // Max 30 degrees tilt
        
        // Smooth transition
        leverAngle += (targetAngle - leverAngle) * 0.1;
        
        if (Math.abs(diff) < 20) {
            status.textContent = "HỆ THỐNG CÂN BẰNG!";
            status.className = "text-emerald-500 font-bold";
        } else {
            status.textContent = diff > 0 ? "Nghiêng sang PHẢI (M₂ > M₁)" : "Nghiêng sang TRÁI (M₁ > M₂)";
            status.className = "text-rose-500 font-bold";
        }
    };

    document.querySelectorAll('input').forEach(i => i.oninput = update);

    resetBtn.onclick = () => {
        document.getElementById('sliderWL').value = 20;
        document.getElementById('sliderDL').value = 100;
        document.getElementById('sliderWR').value = 20;
        document.getElementById('sliderDR').value = 100;
        update();
        status.textContent = "Đã đặt lại vị trí cân bằng.";
    };

    engine.draw = function() {
        this.clear();
        update(); // Call update in draw loop for smoothing

        const ctx = this.ctx;
        const cx = 400;
        const cy = 380;

        // Support triangle (The Pivot)
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - 30, cy + 90);
        ctx.lineTo(cx + 30, cy + 90);
        ctx.fill();
        
        // Pivot point circle
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();

        // Lever Bar
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(leverAngle);
        
        // Main Bar
        ctx.fillStyle = '#334155';
        ctx.fillRect(-220, -5, 440, 10);
        
        // Ruler markers
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        for(let i = -200; i <= 200; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, -5);
            ctx.lineTo(i, 5);
            ctx.stroke();
        }

        // Weights
        function drawWeight(x, mass, color, label) {
            const h = 20 + mass * 0.5;
            const w = 40;
            ctx.fillStyle = color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0,0,0,0.1)';
            
            // Block
            ctx.fillRect(x - w/2, -5 - h, w, h);
            
            // Label on block
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(`${mass}`, x, -h/2);
            
            // Small hook on top
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, -5 - h - 5, 5, 0, Math.PI * 2);
            ctx.stroke();
        }

        drawWeight(-distL, weightL, '#f43f5e', 'L'); // Left
        drawWeight(distR, weightR, '#6366f1', 'R'); // Right

        ctx.restore();
    };

    engine.start();
}

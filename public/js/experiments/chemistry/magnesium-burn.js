function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    startBtn.textContent = "Bắt đầu đốt";

    let isBurning = false;
    let burnProgress = 0;
    let particles = [];
    let flameIntensity = 1;
    let flashAlpha = 0;

    params.innerHTML = `
        <div class="space-y-6">
            <div class="param-row">
                <label class="text-[10px] font-black uppercase text-slate-400 block mb-2">Cường độ ngọn lửa: <span id="flame-val" class="text-orange-500 font-black">Vừa</span></label>
                <input type="range" id="flame-slider" min="0.5" max="2" step="0.1" value="1" class="w-full accent-orange-500">
            </div>

            <div class="p-6 bg-slate-900 text-white rounded-[24px] shadow-xl relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-10 text-4xl">🔥</div>
                <h4 class="text-xs font-black uppercase tracking-widest text-white/40 mb-3">Phản ứng Hóa học</h4>
                <p class="text-lg font-black italic text-orange-400">2Mg + O₂ → 2MgO</p>
                <p class="text-[10px] text-white/50 mt-4 leading-relaxed italic">Magie cháy trong không khí tạo ra ngọn lửa sáng chói (tia cực tím) và để lại chất rắn màu trắng là Magie Oxit.</p>
            </div>

            <div class="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3">
                <span class="text-xl">⚠️</span>
                <p class="text-[10px] font-bold text-orange-700">Lưu ý: Không nên nhìn trực tiếp vào ngọn lửa Magie vì độ sáng cực cao.</p>
            </div>
        </div>
    `;

    const flameSlider = document.getElementById('flame-slider');
    flameSlider.oninput = (e) => {
        flameIntensity = parseFloat(e.target.value);
        const labels = { 0.5: 'Yếu', 1: 'Vừa', 1.5: 'Mạnh', 2: 'Rất mạnh' };
        document.getElementById('flame-val').textContent = labels[Math.round(flameIntensity * 2) / 2] || 'Vừa';
        resetExperiment();
    };

    function resetExperiment() {
        isBurning = false;
        burnProgress = 0;
        particles = [];
        flashAlpha = 0;
        status.textContent = "Sẵn sàng";
        status.className = "text-xs font-black text-slate-500 tracking-widest uppercase";
        startBtn.disabled = false;
        startBtn.classList.remove('opacity-50');
    }

    startBtn.onclick = () => {
        isBurning = true;
        startBtn.disabled = true;
        startBtn.classList.add('opacity-50');
        status.textContent = "Đang xảy ra phản ứng oxi hóa mạnh!";
        status.className = "text-xs font-black text-orange-500 tracking-widest uppercase animate-pulse";
    };

    resetBtn.onclick = resetExperiment;

    engine.update = (dt) => {
        if (isBurning && burnProgress < 1) {
            burnProgress += dt * 0.2 * flameIntensity;
            flashAlpha = 0.3 + Math.random() * 0.7; // Flickering flash
            
            // Particles (Smoke and Sparks)
            if (Math.random() < 0.8) {
                particles.push({
                    x: 400 + (Math.random()-0.5)*10,
                    y: 380 - burnProgress * 250,
                    vx: (Math.random()-0.5)*4,
                    vy: -Math.random()*5 - 2,
                    size: 2 + Math.random()*4,
                    color: Math.random() > 0.5 ? '#fff' : '#cbd5e1',
                    life: 1.5
                });
            }
        } else if (burnProgress >= 1) {
            flashAlpha = 0;
            status.textContent = "Phản ứng kết thúc - MgO đã hình thành";
            status.className = "text-xs font-black text-indigo-500 tracking-widest uppercase";
        }
        
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // Gravity for sparks
            p.life -= dt;
            if (p.life < 0) particles.splice(i, 1);
        });
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        // 1. Draw Bunsen Burner
        const burnerGrad = ctx.createLinearGradient(370, 0, 430, 0);
        burnerGrad.addColorStop(0, '#475569');
        burnerGrad.addColorStop(0.5, '#94a3b8');
        burnerGrad.addColorStop(1, '#475569');
        ctx.fillStyle = burnerGrad;
        ctx.fillRect(385, 420, 30, 60); // Base
        ctx.fillRect(390, 380, 20, 40); // Tube

        // 2. Flame
        const flameSize = 15 * flameIntensity;
        const flameGrad = ctx.createRadialGradient(400, 370, 0, 400, 370, flameSize * 3);
        flameGrad.addColorStop(0, '#fff');
        flameGrad.addColorStop(0.2, '#60a5fa'); // Inner blue
        flameGrad.addColorStop(0.6, 'rgba(59, 130, 246, 0.4)');
        flameGrad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(390, 375);
        ctx.quadraticCurveTo(400, 375 - (flameSize*4), 410, 375);
        ctx.fill();

        // 3. Magnesium Ribbon & Ash
        const ribbonTop = 380 - (1 - burnProgress) * 250;
        
        // Ribbon (unburned)
        if (burnProgress < 1) {
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 8;
            ctx.lineCap = 'butt';
            ctx.beginPath();
            ctx.moveTo(400, ribbonTop);
            ctx.lineTo(400, 380 - 250);
            ctx.stroke();
            
            // Metallic shine
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(398, ribbonTop); ctx.lineTo(398, 380 - 250); ctx.stroke();
        }

        // MgO Ash (burned part)
        if (burnProgress > 0) {
            ctx.strokeStyle = '#f1f5f9';
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(400, 380);
            ctx.lineTo(400, ribbonTop);
            ctx.stroke();
        }

        // 4. Burning Flash Effect
        if (isBurning && burnProgress < 1) {
            const glow = ctx.createRadialGradient(400, ribbonTop, 0, 400, ribbonTop, 200);
            glow.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha})`);
            glow.addColorStop(0.5, `rgba(255, 255, 255, ${flashAlpha * 0.3})`);
            glow.addColorStop(1, 'transparent');
            
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(400, ribbonTop, 200, 0, Math.PI * 2);
            ctx.fill();

            // Central spark
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(400, ribbonTop, 10 + Math.random() * 10, 0, Math.PI * 2);
            ctx.fill();
        }

        // 5. Particles
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life > 0 ? p.life / 1.5 : 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (p.life / 1.5), 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;
    };

    engine.start();
}

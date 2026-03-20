function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    startBtn.textContent = "Nhỏ giọt (HCl)";

    let acidAdded = 0;
    let baseConc = 0.1;
    let acidConc = 0.1;
    let isDripping = false;
    let drops = [];
    let stirrerAngle = 0;

    // The target volume for neutralization: V_acid = (C_base * V_base) / C_acid
    // Assuming 10ml of Base in beaker
    const baseVolume = 10;
    function getTarget() {
        return (baseConc * baseVolume) / acidConc;
    }

    params.innerHTML = `
        <div class="space-y-6">
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner text-center">
                <p class="text-[10px] font-black uppercase text-slate-400 mb-2">Lượng HCl đã nhỏ:</p>
                <h2 id="ml-val" class="text-3xl font-black text-indigo-600 font-mono">0.00 ml</h2>
                <div class="h-2 bg-slate-200 rounded-full mt-4 overflow-hidden">
                    <div id="gauge-fill" class="h-full bg-indigo-500 transition-all duration-100" style="width: 0%"></div>
                </div>
            </div>

            <div class="space-y-4">
                <div>
                    <label class="text-[10px] font-black uppercase text-slate-400 block mb-2">Nồng độ NaOH (M): <span id="base-conc-val" class="text-pink-500">0.10</span></label>
                    <input type="range" id="base-conc" min="0.01" max="0.5" step="0.01" value="0.1" class="w-full accent-pink-500">
                </div>
                <div>
                    <label class="text-[10px] font-black uppercase text-slate-400 block mb-2">Nồng độ HCl (M): <span id="acid-conc-val" class="text-indigo-500">0.10</span></label>
                    <input type="range" id="acid-conc" min="0.01" max="0.5" step="0.01" value="0.1" class="w-full accent-indigo-500">
                </div>
            </div>

            <div class="p-4 bg-pink-50 rounded-2xl border border-pink-100">
                <p class="text-[11px] font-bold text-pink-700 italic">
                    Chỉ thị: Phenolphthalein
                </p>
                <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    Dung dịch kiềm có màu hồng. Nhỏ axit cho đến khi dung dịch vừa mất màu hồng.
                </p>
            </div>
        </div>
    `;

    const mlVal = document.getElementById('ml-val');
    const gaugeFill = document.getElementById('gauge-fill');
    
    document.getElementById('base-conc').oninput = (e) => {
        baseConc = parseFloat(e.target.value);
        document.getElementById('base-conc-val').textContent = baseConc.toFixed(2);
        resetExperiment();
    };
    document.getElementById('acid-conc').oninput = (e) => {
        acidConc = parseFloat(e.target.value);
        document.getElementById('acid-conc-val').textContent = acidConc.toFixed(2);
        resetExperiment();
    };

    startBtn.onmousedown = () => isDripping = true;
    startBtn.onmouseup = () => isDripping = false;
    startBtn.onmouseleave = () => isDripping = false;

    // Mobile touch support
    startBtn.addEventListener('touchstart', (e) => { e.preventDefault(); isDripping = true; });
    startBtn.addEventListener('touchend', () => isDripping = false);

    function resetExperiment() {
        acidAdded = 0;
        drops = [];
        isDripping = false;
        mlVal.textContent = "0.00 ml";
        gaugeFill.style.width = "0%";
        status.textContent = "Sẵn sàng (NaOH + PP)";
        status.className = "text-xs font-black text-slate-500 tracking-widest uppercase";
    }

    resetBtn.onclick = resetExperiment;

    engine.update = (dt) => {
        const target = getTarget();

        if (isDripping && acidAdded < 25) {
            acidAdded += dt * 0.5; // Titration speed
            mlVal.textContent = acidAdded.toFixed(2) + " ml";
            gaugeFill.style.width = (acidAdded / 25 * 100) + '%';
            if (Math.random() < 0.2) {
                drops.push({ x: 400, y: 180, v: 5 });
            }
        }
        
        drops.forEach((d, i) => {
            d.y += d.v;
            if (d.y > 380) drops.splice(i, 1);
        });

        stirrerAngle += dt * 10;

        if (Math.abs(acidAdded - target) < 0.05) {
            status.textContent = "Đã trung hòa (pH ≈ 7)";
            status.className = "text-xs font-black text-emerald-500 tracking-widest uppercase";
        } else if (acidAdded > target) {
            status.textContent = "Quá điểm tương đương (Dư Axit)";
            status.className = "text-xs font-black text-slate-400 tracking-widest uppercase";
        } else {
            status.textContent = "Đang chuẩn độ...";
            status.className = "text-xs font-black text-pink-500 tracking-widest uppercase animate-pulse";
        }
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;
        const target = getTarget();

        // 1. Draw Burette
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
        ctx.strokeRect(390, 20, 20, 160);
        ctx.fillStyle = 'rgba(241, 245, 249, 0.5)';
        ctx.fillRect(391, 20, 18, 160);
        
        // Acid in Burette
        ctx.fillStyle = 'rgba(186, 230, 253, 0.4)';
        ctx.fillRect(391, 20 + (acidAdded/25 * 160), 18, 160 - (acidAdded/25 * 160));
        
        // Burette tip
        ctx.beginPath();
        ctx.moveTo(395, 180); ctx.lineTo(405, 180); ctx.lineTo(400, 200); ctx.closePath();
        ctx.fill(); ctx.stroke();
        
        // Valve
        ctx.fillStyle = isDripping ? '#10b981' : '#ef4444';
        ctx.fillRect(385, 175, 30, 8);

        // 2. Draw Beaker
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(350, 320); 
        ctx.lineTo(350, 450); 
        ctx.lineTo(450, 450); 
        ctx.lineTo(450, 320);
        ctx.stroke();

        // 3. Liquid (Pink to colorless)
        // Transition: Pink disappears quickly near target
        let pinkAlpha = 0.6;
        if (acidAdded >= target - 0.5) {
            pinkAlpha = Math.max(0, 0.6 * (1 - (acidAdded - (target - 0.5))));
        }
        
        ctx.fillStyle = `rgba(244, 114, 182, ${pinkAlpha})`;
        ctx.fillRect(353, 380, 94, 68);
        
        // Water base
        ctx.fillStyle = 'rgba(186, 230, 253, 0.2)';
        ctx.fillRect(353, 380, 94, 68);

        // 4. Stirrer
        ctx.save();
        ctx.translate(400, 440);
        ctx.rotate(stirrerAngle);
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 4; ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.fillRect(-15, -3, 30, 6);
        ctx.restore();

        // 5. Drops
        ctx.fillStyle = 'rgba(186, 230, 253, 0.8)';
        drops.forEach(d => {
            ctx.beginPath(); ctx.arc(d.x, d.y, 4, 0, Math.PI*2); ctx.fill();
        });

        // 6. Labels and reflex
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(360, 330); ctx.lineTo(360, 440); ctx.stroke();
    };

    engine.start();
}

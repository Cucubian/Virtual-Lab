function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    startBtn.textContent = "Thả kim loại";

    let metal = 'Zn';
    let concentration = 1; // M
    let bubbles = [];
    let particles = []; // For reaction effects
    let isReacting = false;
    let metalSize = 1; // Shrinking factor
    let solutionColor = 'rgba(186, 230, 253, 0.4)';

    params.innerHTML = `
        <div class="space-y-6">
            <div class="param-row">
                <label class="text-[10px] font-black uppercase text-slate-400 block mb-2">Chọn kim loại:</label>
                <select id="metal-select" class="w-full p-3 rounded-xl border-2 border-slate-100 bg-white font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all">
                    <option value="Zn">Kẽm (Zn) - Hoạt động mạnh</option>
                    <option value="Fe">Sắt (Fe) - Hoạt động trung bình</option>
                    <option value="Cu">Đồng (Cu) - Không phản ứng</option>
                </select>
            </div>
            <div class="param-row">
                <label class="text-[10px] font-black uppercase text-slate-400 block mb-2">Nồng độ Axit HCl (M): <span id="conc-val" class="text-indigo-600 font-black">1.0</span></label>
                <input type="range" id="conc-slider" min="0.1" max="3" step="0.1" value="1" class="w-full accent-indigo-500">
            </div>
            <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mt-4">
                <p class="text-[11px] font-bold text-indigo-700 italic">
                    Phương trình: M + 2HCl → MCl₂ + H₂↑
                </p>
                <p class="text-[10px] text-slate-500 mt-2">
                    Nồng độ cao làm phản ứng xảy ra nhanh hơn.
                </p>
            </div>
        </div>
    `;

    document.getElementById('metal-select').onchange = (e) => {
        metal = e.target.value;
        resetExperiment();
    };

    document.getElementById('conc-slider').oninput = (e) => {
        concentration = parseFloat(e.target.value);
        document.getElementById('conc-val').textContent = concentration.toFixed(1);
        resetExperiment();
    };

    function resetExperiment() {
        isReacting = false;
        bubbles = [];
        particles = [];
        metalSize = 1;
        solutionColor = 'rgba(186, 230, 253, 0.4)';
        status.textContent = "Sẵn sàng";
        status.className = "text-xs font-black text-slate-500 tracking-widest uppercase";
        startBtn.disabled = false;
        startBtn.classList.remove('opacity-50');
    }

    startBtn.onclick = () => {
        if (metal === 'Cu') {
            status.textContent = "Đồng không phản ứng với HCl!";
            status.className = "text-xs font-black text-rose-500 tracking-widest uppercase";
        } else {
            isReacting = true;
            startBtn.disabled = true;
            startBtn.classList.add('opacity-50');
            status.textContent = `Kim loại ${metal} đang tan và sủi bọt khí H₂`;
            status.className = "text-xs font-black text-emerald-500 tracking-widest uppercase animate-pulse";
        }
    };

    resetBtn.onclick = resetExperiment;

    engine.update = function(deltaTime) {
        if (isReacting) {
            // Reaction intensity based on metal and concentration
            const activityBase = metal === 'Zn' ? 0.6 : 0.25;
            const intensity = activityBase * (concentration / 1);
            
            if (metalSize > 0.1) {
                metalSize -= 0.0005 * intensity;
                
                // Color change for Fe -> FeCl2 (Pale Green)
                if (metal === 'Fe') {
                    solutionColor = `rgba(187, 247, 208, ${0.4 + (1 - metalSize) * 0.4})`;
                }

                if (Math.random() < intensity) {
                    bubbles.push({
                        x: 385 + Math.random() * 30,
                        y: 430,
                        size: 1 + Math.random() * 3,
                        speed: 1.5 + Math.random() * 2 + (intensity * 2)
                    });
                }
            } else {
                isReacting = false;
                status.textContent = "Phản ứng kết thúc - Kim loại đã tan hết";
                status.className = "text-xs font-black text-indigo-500 tracking-widest uppercase";
            }
        }

        bubbles.forEach((b, i) => {
            b.y -= b.speed;
            b.x += (Math.random() - 0.5) * 2;
            if (b.y < 155) bubbles.splice(i, 1);
        });
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        // Draw Solution First
        ctx.fillStyle = solutionColor;
        ctx.beginPath();
        ctx.moveTo(354, 150);
        ctx.lineTo(354, 445);
        ctx.arc(400, 445, 46, Math.PI, 0, true);
        ctx.lineTo(446, 150);
        ctx.fill();

        // Test tube (Shine effect)
        const tubeGrad = ctx.createLinearGradient(350, 0, 450, 0);
        tubeGrad.addColorStop(0, '#94a3b8');
        tubeGrad.addColorStop(0.3, '#f1f5f9');
        tubeGrad.addColorStop(1, '#94a3b8');
        
        ctx.strokeStyle = tubeGrad;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(350, 50);
        ctx.lineTo(350, 450);
        ctx.arc(400, 450, 50, Math.PI, 0, true);
        ctx.lineTo(450, 50);
        ctx.stroke();

        // Metal Piece
        if (metalSize > 0) {
            const metalColor = metal === 'Zn' ? '#94a3b8' : (metal === 'Fe' ? '#475569' : '#b45309');
            ctx.fillStyle = metalColor;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            const w = 30 * metalSize;
            const h = 20 * metalSize;
            ctx.fillRect(400 - w/2, 440 - h, w, h);
            ctx.shadowBlur = 0;
        }

        // Bubbles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        bubbles.forEach(b => {
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

        // Add glass reflex
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(365, 80);
        ctx.lineTo(365, 400);
        ctx.stroke();
    };

    engine.start();
}

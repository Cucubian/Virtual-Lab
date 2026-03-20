function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    startBtn.textContent = "Trộn dung dịch";

    let pourProgress = 0;
    let isPouring = false;
    let particles = [];
    let reactionType = 'BaCl2_Na2SO4';

    const reactions = {
        'BaCl2_Na2SO4': {
            name: 'BaCl₂ + Na₂SO₄',
            ppt: 'BaSO₄',
            color: '#f8fafc',
            desc: 'Kết tủa trắng (Bari Sunfat)',
            formula: 'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl'
        },
        'AgNO3_NaCl': {
            name: 'AgNO₃ + NaCl',
            ppt: 'AgCl',
            color: '#cbd5e1',
            desc: 'Kết tủa trắng (Bạc Clorua)',
            formula: 'AgNO₃ + NaCl → AgCl↓ + NaNO₃'
        },
        'CuSO4_NaOH': {
            name: 'CuSO₄ + NaOH',
            ppt: 'Cu(OH)₂',
            color: '#3b82f6',
            desc: 'Kết tủa xanh lơ (Đồng(II) Hiđroxit)',
            formula: 'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄'
        },
        'FeCl3_NaOH': {
            name: 'FeCl₃ + NaOH',
            ppt: 'Fe(OH)₃',
            color: '#92400e',
            desc: 'Kết tủa nâu đỏ (Sắt(III) Hiđroxit)',
            formula: 'FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl'
        }
    };

    params.innerHTML = `
        <div class="space-y-6">
            <div class="param-row">
                <label class="text-[10px] font-black uppercase text-slate-400 block mb-2">Chọn phản ứng:</label>
                <select id="reaction-select" class="w-full p-3 rounded-xl border-2 border-slate-100 bg-white font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all">
                    ${Object.entries(reactions).map(([id, r]) => `<option value="${id}">${r.name}</option>`).join('')}
                </select>
            </div>

            <div id="reaction-card" class="p-6 bg-slate-50 rounded-[24px] border border-slate-100 shadow-inner">
                <h4 id="ppt-desc" class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">${reactions[reactionType].desc}</h4>
                <p id="ppt-formula" class="text-sm font-mono font-bold text-indigo-600">${reactions[reactionType].formula}</p>
            </div>

            <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 italic">
                <p class="text-[10px] text-slate-500 leading-relaxed">Phản ứng trao đổi ion trong dung dịch tạo thành chất không tan gọi là kết tủa.</p>
            </div>
        </div>
    `;

    const reactionSelect = document.getElementById('reaction-select');
    reactionSelect.onchange = (e) => {
        reactionType = e.target.value;
        const r = reactions[reactionType];
        document.getElementById('ppt-desc').textContent = r.desc;
        document.getElementById('ppt-formula').textContent = r.formula;
        resetExperiment();
    };

    function resetExperiment() {
        isPouring = false;
        pourProgress = 0;
        particles = [];
        status.textContent = "Sẵn sàng";
        status.className = "text-xs font-black text-slate-500 tracking-widest uppercase";
        startBtn.disabled = false;
        startBtn.classList.remove('opacity-50');
    }

    startBtn.onclick = () => {
        isPouring = true;
        startBtn.disabled = true;
        startBtn.classList.add('opacity-50');
        status.textContent = "Đang trộn dung dịch...";
        status.className = "text-xs font-black text-indigo-500 tracking-widest uppercase animate-pulse";
    };

    resetBtn.onclick = resetExperiment;

    engine.update = (dt) => {
        if (isPouring && pourProgress < 1) {
            pourProgress += dt * 0.4;
            
            // Generate precipitate particles
            const r = reactions[reactionType];
            for(let i=0; i<3; i++) {
                particles.push({
                    x: 420 + (Math.random()*60),
                    y: 360 + (Math.random()*20),
                    vy: 0.5 + Math.random() * 1.5,
                    size: 2 + Math.random() * 3,
                    color: r.color,
                    targetY: 430 + (Math.random()*15),
                    settled: false
                });
            }
            
            if (pourProgress >= 1) {
                status.textContent = "Phản ứng hoàn tất - Kết tủa đang lắng xuống";
                status.className = "text-xs font-black text-emerald-500 tracking-widest uppercase";
            }
        }
        
        particles.forEach(p => {
            if (!p.settled) {
                p.y += p.vy;
                p.x += (Math.random() - 0.5) * 1;
                if (p.y >= p.targetY) {
                    p.y = p.targetY;
                    p.settled = true;
                }
            }
        });
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        // 1. Drawing the Source Beaker (Pouring)
        ctx.save();
        ctx.translate(350, 250);
        ctx.rotate(-pourProgress * Math.PI/2.5);
        
        // Glass
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
        ctx.strokeRect(-30, -50, 60, 100);
        
        // Liquid
        if (pourProgress < 1) {
            ctx.fillStyle = 'rgba(186, 230, 253, 0.4)';
            const liquidLevel = (1 - pourProgress) * 96;
            ctx.fillRect(-28, 48 - liquidLevel, 56, liquidLevel);
        }
        ctx.restore();

        // 2. Pouring Stream
        if (isPouring && pourProgress < 0.95) {
            ctx.fillStyle = 'rgba(186, 230, 253, 0.6)';
            ctx.fillRect(380, 220, 6, 140);
        }

        // 3. Target Beaker
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(400, 320); ctx.lineTo(400, 450); ctx.lineTo(500, 450); ctx.lineTo(500, 320);
        ctx.stroke();

        // Target Liquid
        ctx.fillStyle = 'rgba(186, 230, 253, 0.3)';
        ctx.fillRect(402, 360, 96, 88);

        // 4. Precipitate Particles
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.settled ? 1.0 : 0.7;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // Glass Highlights
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(410, 330); ctx.lineTo(410, 440); ctx.stroke();
    };

    engine.start();
}

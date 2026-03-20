function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    startBtn.textContent = "Thêm dung dịch";

    let substance = 'lemon';
    let volume = 500; // ml
    let isPouring = false;
    let particles = [];

    const substances = {
        'lemon': { name: 'Nước chanh', ph: 2.5, color: 'rgba(254, 240, 138, 0.8)', formula: 'Acidic' },
        'vinegar': { name: 'Giấm ăn', ph: 3.0, color: 'rgba(255, 255, 255, 0.4)', formula: 'Acidic' },
        'water': { name: 'Nước tinh khiết', ph: 7.0, color: 'rgba(186, 230, 253, 0.5)', formula: 'Neutral' },
        'blood': { name: 'Máu hồng cầu', ph: 7.4, color: 'rgba(239, 68, 68, 0.8)', formula: 'Slightly Alkaline' },
        'soap': { name: 'Xà phòng', ph: 10.0, color: 'rgba(219, 234, 254, 0.8)', formula: 'Alkaline' },
        'bleach': { name: 'Nước tẩy', ph: 13.0, color: 'rgba(147, 197, 253, 0.3)', formula: 'Strongly Alkaline' }
    };

    params.innerHTML = `
        <div class="space-y-6">
            <div class="param-row">
                <label class="text-[10px] font-black uppercase text-slate-400 block mb-2">Chọn chất lỏng:</label>
                <select id="ph-select" class="w-full p-3 rounded-xl border-2 border-slate-100 bg-white font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all">
                    ${Object.entries(substances).map(([id, s]) => `<option value="${id}">${s.name}</option>`).join('')}
                </select>
            </div>

            <div id="ph-card" class="p-6 bg-slate-900 text-white rounded-[24px] shadow-xl relative overflow-hidden text-center">
                <h4 class="text-xs font-black uppercase tracking-widest text-white/40 mb-3">Chỉ số pH thực tế</h4>
                <div id="ph-value" class="text-6xl font-black italic text-white" style="transition: color 0.5s;">0.0</div>
                <p id="ph-type" class="text-[10px] text-white/50 mt-4 leading-relaxed italic uppercase font-bold tracking-widest">-</p>
                <div id="ph-strip" class="h-1 w-full mt-4 rounded-full overflow-hidden flex">
                    ${Array.from({length: 15}).map((_, i) => `<div style="flex:1; background: ${getPHColor(i)}; height: 100%;"></div>`).join('')}
                </div>
            </div>

            <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 italic">
                <p class="text-[10px] text-slate-500 leading-relaxed italic">Thang pH chạy từ 0 đến 14. Dưới 7 là Axit, trên 7 là Bazơ, đúng 7 là Trung tính.</p>
            </div>
        </div>
    `;

    function getPHColor(ph) {
        const colors = [
            '#ef4444', '#f87171', '#fb923c', '#fbbf24', '#fde047', 
            '#bef264', '#a3e635', '#4ade80', '#2dd4bf', '#22d3ee',
            '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc'
        ];
        return colors[Math.min(14, Math.max(0, Math.floor(ph)))];
    }

    const phSelect = document.getElementById('ph-select');
    const phValue = document.getElementById('ph-value');
    const phType = document.getElementById('ph-type');

    phSelect.onchange = (e) => {
        substance = e.target.value;
        resetExperiment();
    };

    function resetExperiment() {
        isPouring = false;
        volume = 0;
        particles = [];
        phValue.textContent = "0.0";
        phValue.style.color = "#fff";
        phType.textContent = "-";
        status.textContent = "Sẵn sàng";
        status.className = "text-xs font-black text-slate-500 tracking-widest uppercase";
        startBtn.disabled = false;
        startBtn.classList.remove('opacity-50');
    }

    startBtn.onclick = () => {
        isPouring = true;
        startBtn.disabled = true;
        startBtn.classList.add('opacity-50');
        status.textContent = "Đang thêm chất lỏng...";
        status.className = "text-xs font-black text-indigo-500 tracking-widest uppercase animate-pulse";
    };

    resetBtn.onclick = resetExperiment;

    engine.update = (dt) => {
        if (isPouring && volume < 500) {
            volume += dt * 100 * 2;
            const s = substances[substance];
            const currentPH = (s.ph * (volume / 500)).toFixed(1);
            phValue.textContent = currentPH;
            phValue.style.color = getPHColor(parseFloat(currentPH));
            
            if (volume >= 500) {
                volume = 500;
                isPouring = false;
                phType.textContent = s.ph < 7 ? "Môi trường Axit" : (s.ph > 7 ? "Môi trường Bazơ" : "Môi trường Trung tính");
                status.textContent = "Hoàn thành đo pH!";
                status.className = "text-xs font-black text-emerald-500 tracking-widest uppercase";
            }
        }
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        // Draw Beaker
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4;
        ctx.lineJoin = 'round';
        ctx.strokeRect(300, 100, 200, 350);

        // Liquid
        const s = substances[substance];
        ctx.fillStyle = s.color;
        const liquidHeight = (volume / 500) * 330;
        ctx.fillRect(304, 448 - liquidHeight, 192, liquidHeight);

        // Grid marks
        ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            const y = 448 - (i * 66);
            ctx.beginPath(); ctx.moveTo(300, y); ctx.lineTo(320, y); ctx.stroke();
            ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 10px Inter';
            ctx.fillText((i*100) + 'ml', 270, y + 5);
        }

        // Pouring stream
        if (isPouring) {
            ctx.fillStyle = s.color;
            ctx.fillRect(397, 20, 6, 448 - liquidHeight - 20);
        }

        // Glass reflection
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(315, 120); ctx.lineTo(315, 430); ctx.stroke();
    };

    resetExperiment();
    engine.start();
}

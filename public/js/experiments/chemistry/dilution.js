function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    startBtn.textContent = "Thêm nước (100ml)";

    let volume = 100; // ml
    let solute = 'CuSO4';
    const mol = 0.5;

    const soluteData = {
        'CuSO4': { name: 'Đồng(II) sunfat', color: [37, 99, 235], formula: 'CuSO₄' },
        'KMnO4': { name: 'Kali pemanganat', color: [147, 51, 234], formula: 'KMnO₄' },
        'K2Cr2O7': { name: 'Kali đicromat', color: [234, 88, 12], formula: 'K₂Cr₂O₇' }
    };

    params.innerHTML = `
        <div class="space-y-6">
            <div class="param-row">
                <label class="text-[10px] font-black uppercase text-slate-400 block mb-2">Chọn chất tan:</label>
                <select id="solute-select" class="w-full p-3 rounded-xl border-2 border-slate-100 bg-white font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all">
                    <option value="CuSO4">CuSO₄ (Xanh dương)</option>
                    <option value="KMnO4">KMnO₄ (Tím)</option>
                    <option value="K2Cr2O7">K₂Cr₂O₇ (Da cam)</option>
                </select>
            </div>

            <div class="p-6 bg-slate-900 text-white rounded-[24px] shadow-xl space-y-4">
                <div class="flex justify-between items-center text-[10px] font-black uppercase text-white/40 tracking-widest">
                    <span>Thông số dung dịch</span>
                    <span class="p-1 bg-white/10 rounded">LIVE</span>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                        <p class="text-[10px] text-white/50">Thể tích (V)</p>
                        <p class="text-xl font-black font-mono"><span id="valV">${volume}</span> <span class="text-[10px] opacity-40">ml</span></p>
                    </div>
                    <div class="space-y-1">
                        <p class="text-[10px] text-white/50">Nồng độ (CM)</p>
                        <p class="text-xl font-black font-mono text-indigo-400"><span id="valCM">5.0</span> <span class="text-[10px] opacity-40">M</span></p>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 italic">
                <p class="text-[11px] font-bold text-indigo-700">Công thức: CM = n / V</p>
                <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">Khi thêm dung môi (nước), thể tích tăng làm nồng độ giảm, cường độ màu sắc cũng nhạt dần.</p>
            </div>
        </div>
    `;

    const valV = document.getElementById('valV');
    const valCM = document.getElementById('valCM');
    const soluteSelect = document.getElementById('solute-select');

    soluteSelect.onchange = (e) => {
        solute = e.target.value;
        resetExperiment();
    };

    function resetExperiment() {
        volume = 100;
        update();
    }

    startBtn.onclick = () => {
        if (volume < 800) {
            volume += 100;
            update();
        } else {
            status.textContent = "Cốc đã đầy!";
            status.className = "text-xs font-black text-rose-500 tracking-widest uppercase";
        }
    };

    function update() {
        valV.textContent = volume;
        const cm = (mol / (volume / 1000)).toFixed(1);
        valCM.textContent = cm;
        status.textContent = `Đã pha loãng: V = ${volume}ml, CM = ${cm}M`;
        status.className = "text-xs font-black text-indigo-500 tracking-widest uppercase";
    }

    resetBtn.onclick = resetExperiment;

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        // Draw Beaker
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(300, 100); ctx.lineTo(300, 450); ctx.lineTo(500, 450); ctx.lineTo(500, 100);
        ctx.stroke();

        // Liquid color based on solute and concentration
        const s = soluteData[solute];
        const concentration = (mol / (volume / 1000));
        const alpha = Math.min(0.9, concentration * 0.15);
        ctx.fillStyle = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${alpha})`;
        
        const liquidHeight = (volume / 800) * 330;
        ctx.fillRect(302, 448 - liquidHeight, 196, liquidHeight);

        // Glass reflection
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(315, 120); ctx.lineTo(315, 430); ctx.stroke();

        // Volumetric marks
        ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 1;
        ctx.textAlign = 'right';
        for(let v=200; v<=800; v+=200) {
            const h = (v/800) * 330;
            ctx.beginPath(); ctx.moveTo(300, 448 - h); ctx.lineTo(320, 448 - h); ctx.stroke();
            ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 10px Inter';
            ctx.fillText(v + " ml", 290, 452 - h);
        }
        ctx.textAlign = 'left';
    };

    update();
    engine.start();
}

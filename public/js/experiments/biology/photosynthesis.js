function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const resetBtn = document.getElementById('reset-btn');

    let light = 50;
    let co2 = 50;
    let temp = 25;
    let bubbles = [];

    params.innerHTML = `
        <div class="space-y-6">
            <div class="space-y-4">
                <div>
                    <label class="text-[10px] font-black uppercase text-slate-400 block mb-2">Cường độ ánh sáng: <span id="valL" class="text-amber-500">${light}</span>%</label>
                    <input type="range" id="sliderL" min="0" max="100" value="${light}" class="w-full accent-amber-500">
                </div>
                <div>
                    <label class="text-[10px] font-black uppercase text-slate-400 block mb-2">Nồng độ CO₂: <span id="valC" class="text-indigo-500">${co2}</span>%</label>
                    <input type="range" id="sliderC" min="10" max="100" value="${co2}" class="w-full accent-indigo-500">
                </div>
                <div>
                    <label class="text-[10px] font-black uppercase text-slate-400 block mb-2">Nhiệt độ (°C): <span id="valT" class="text-rose-500">${temp}</span>°C</label>
                    <input type="range" id="sliderT" min="0" max="50" value="${temp}" class="w-full accent-rose-500">
                </div>
            </div>

            <div class="p-6 bg-slate-900 text-white rounded-[24px] shadow-xl relative overflow-hidden">
                <h4 class="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Phương trình Quang hợp</h4>
                <p class="text-xs font-bold leading-relaxed">
                    <span class="text-indigo-400">6CO₂</span> + <span class="text-blue-400">6H₂O</span> 
                    <span class="mx-1 text-white/30">→</span>
                    <span class="text-emerald-400">C₆H₁₂O₆</span> + <span class="text-amber-400">6O₂↑</span>
                </p>
                <div id="rate-gauge" class="h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                    <div id="rate-fill" class="h-full bg-emerald-500 transition-all duration-500" style="width: 25%"></div>
                </div>
            </div>
        </div>
    `;

    const rateFill = document.getElementById('rate-fill');
    
    const updateUI = () => {
        // Photosynthesis rate peaks around 25-35C, drops at extremes
        const tempFactor = Math.max(0, 1 - Math.abs(temp - 30) / 30);
        const rate = (light/100) * (co2/100) * tempFactor;
        rateFill.style.width = (rate * 100) + '%';
        
        status.textContent = rate > 0.1 ? "Quang hợp đang diễn ra mạnh mẽ" : "Quang hợp diễn ra chậm";
        status.className = "text-xs font-black " + (rate > 0.5 ? "text-emerald-500 animate-pulse" : "text-slate-500") + " tracking-widest uppercase";
    };

    document.getElementById('sliderL').oninput = (e) => {
        light = parseInt(e.target.value);
        document.getElementById('valL').textContent = light;
        updateUI();
    };
    document.getElementById('sliderC').oninput = (e) => {
        co2 = parseInt(e.target.value);
        document.getElementById('valC').textContent = co2;
        updateUI();
    };
    document.getElementById('sliderT').oninput = (e) => {
        temp = parseInt(e.target.value);
        document.getElementById('valT').textContent = temp;
        updateUI();
    };

    resetBtn.onclick = () => {
        light = 50; co2 = 50; temp = 25;
        document.getElementById('sliderL').value = 50;
        document.getElementById('sliderC').value = 50;
        document.getElementById('sliderT').value = 25;
        document.getElementById('valL').textContent = 50;
        document.getElementById('valC').textContent = 50;
        document.getElementById('valT').textContent = 25;
        bubbles = [];
        updateUI();
    };

    engine.update = function(dt) {
        const tempFactor = Math.max(0, 1 - Math.abs(temp - 30) / 30);
        const rate = (light/100) * (co2/100) * tempFactor;
        
        if (Math.random() < rate * 0.5) {
            bubbles.push({
                x: 350 + Math.random() * 100,
                y: 380,
                size: 2 + Math.random() * 5,
                speed: 1 + Math.random() * 3,
                opacity: 0.8
            });
        }

        bubbles.forEach((b, i) => {
            b.y -= b.speed;
            b.x += Math.sin(b.y / 20) * 1;
            if (b.y < 110) bubbles.splice(i, 1);
        });
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        // Beaker (Water)
        ctx.fillStyle = 'rgba(186, 230, 253, 0.2)';
        ctx.fillRect(250, 100, 300, 380);
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(250, 100); ctx.lineTo(250, 480); ctx.lineTo(550, 480); ctx.lineTo(550, 100);
        ctx.stroke();

        // Light Effect
        if (light > 0) {
            const grad = ctx.createLinearGradient(0,0,300,300);
            grad.addColorStop(0, `rgba(253, 224, 71, ${light/200})`);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(0,0); ctx.lineTo(400,0); ctx.lineTo(250, 400); ctx.lineTo(0, 400);
            ctx.fill();
        }

        // Plant (Anacharis/Rong đuôi chó)
        ctx.strokeStyle = '#065f46'; ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(400, 480);
        ctx.bezierCurveTo(380, 400, 420, 300, 400, 150);
        ctx.stroke();

        for(let h=0; h<300; h+=30) {
            ctx.fillStyle = '#10b981';
            ctx.save(); ctx.translate(400 + Math.sin(h/50)*10, 450-h);
            ctx.rotate(Math.sin(h/20));
            ctx.beginPath(); ctx.ellipse(20, 0, 15, 6, 0.5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(-20, 0, 15, 6, -0.5, 0, Math.PI*2); ctx.fill();
            ctx.restore();
        }

        // Bubbles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
        bubbles.forEach(b => {
            ctx.beginPath(); ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });
    };

    updateUI();
    engine.start();
}

function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    let height = 300; // meters
    let gravity = 9.8;
    let airResistance = true;
    let isRunning = false;
    let time = 0;
    
    const objects = [
        { name: 'Quả táo', color: '#f43f5e', drag: 0.02, pos: 200, y: 0, done: false, t: 0 },
        { name: 'Quả cầu chì', color: '#64748b', drag: 0.005, pos: 400, y: 0, done: false, t: 0 },
        { name: 'Lông vũ', color: '#818cf8', drag: 0.8, pos: 600, y: 0, done: false, t: 0 }
    ];

    params.innerHTML = `
        <div class="space-y-6">
            <div class="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase text-slate-400">Độ cao rơi (m)</label>
                    <input type="range" id="height-slider" min="50" max="500" value="300" class="w-full accent-indigo-500">
                    <div class="text-right font-bold text-indigo-600" id="height-val">300m</div>
                </div>

                <div class="space-y-3 pt-2">
                    <label class="text-[10px] font-black uppercase text-slate-400">Môi trường</label>
                    <div class="flex gap-2">
                        <button id="air-on" class="flex-1 py-2 rounded-lg border-2 border-indigo-500 bg-indigo-50 text-indigo-700 font-bold text-xs">Có Không Khí</button>
                        <button id="air-off" class="flex-1 py-2 rounded-lg border-2 border-slate-200 text-slate-500 font-bold text-xs">Chân Không</button>
                    </div>
                </div>
            </div>

            <div class="glass-card p-4 bg-slate-900 text-white rounded-xl">
                <h5 class="text-[9px] uppercase tracking-widest text-white/40 mb-3">Thời gian rơi thực tế</h5>
                <div id="results" class="space-y-2">
                    ${objects.map(o => `
                        <div class="flex justify-between text-[11px]">
                            <span>${o.name}:</span>
                            <span id="res-${o.name}" class="font-mono text-indigo-400">0.00s</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    const hSlider = document.getElementById('height-slider');
    const airOn = document.getElementById('air-on');
    const airOff = document.getElementById('air-off');

    hSlider.oninput = () => {
        height = parseInt(hSlider.value);
        document.getElementById('height-val').textContent = height + "m";
        reset();
    };

    airOn.onclick = () => {
        airResistance = true;
        airOn.className = "flex-1 py-2 rounded-lg border-2 border-indigo-500 bg-indigo-50 text-indigo-700 font-bold text-xs";
        airOff.className = "flex-1 py-2 rounded-lg border-2 border-slate-200 text-slate-500 font-bold text-xs";
        reset();
    };
    airOff.onclick = () => {
        airResistance = false;
        airOff.className = "flex-1 py-2 rounded-lg border-2 border-indigo-500 bg-indigo-50 text-indigo-700 font-bold text-xs";
        airOn.className = "flex-1 py-2 rounded-lg border-2 border-slate-200 text-slate-500 font-bold text-xs";
        reset();
    };

    const reset = () => {
        isRunning = false;
        time = 0;
        objects.forEach(o => {
            o.y = 50;
            o.done = false;
            o.t = 0;
            document.getElementById(`res-${o.name}`).textContent = "0.00s";
        });
        status.textContent = "Sẵn sàng";
        status.className = "text-slate-400 font-bold italic";
        startBtn.disabled = false;
        startBtn.classList.remove('opacity-50', 'grayscale');
    };

    startBtn.onclick = () => {
        isRunning = true;
        startBtn.disabled = true;
        startBtn.classList.add('opacity-50', 'grayscale');
        status.textContent = "Đang rơi...";
        status.className = "text-indigo-600 font-bold animate-pulse";
    };

    resetBtn.onclick = reset;

    engine.update = (dt) => {
        if (!isRunning) return;
        
        time += 0.016; // Approx 60fps
        let allDone = true;

        objects.forEach(o => {
            if (!o.done) {
                // Physics: v = g*t, y = 0.5 * g * t^2
                // If air resistance, we use terminal velocity approximation or just a drag factor
                const effectiveG = airResistance ? gravity * (1 - o.drag) : gravity;
                const d = 0.5 * effectiveG * (time * time) * 10; // Scaling factor 10
                o.y = 50 + d;

                if (o.y >= 450) {
                    o.y = 450;
                    o.done = true;
                    o.t = time;
                    document.getElementById(`res-${o.name}`).textContent = time.toFixed(2) + "s";
                } else {
                    allDone = false;
                }
            }
        });

        if (allDone) {
            isRunning = false;
            status.textContent = "Hoàn thành!";
            status.className = "text-emerald-500 font-bold";
        }
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        // Draw Ground
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(50, 460, this.width - 100, 2);

        // Scale Markers
        ctx.strokeStyle = 'rgba(0,0,0,0.05)';
        ctx.setLineDash([5, 5]);
        for(let i=0; i<10; i++) {
            const py = 50 + i * 40;
            ctx.beginPath(); ctx.moveTo(50, py); ctx.lineTo(this.width - 50, py); ctx.stroke();
        }
        ctx.setLineDash([]);

        objects.forEach(o => {
            ctx.fillStyle = o.color;
            ctx.beginPath();
            if (o.name === 'Lông vũ') {
                ctx.ellipse(o.pos, o.y, 10, 25, 0, 0, Math.PI * 2);
            } else {
                ctx.arc(o.pos, o.y, 15, 0, Math.PI * 2);
            }
            ctx.fill();
            
            // Motion blur
            if (isRunning && !o.done) {
                ctx.globalAlpha = 0.3;
                ctx.fillRect(o.pos - 5, o.y - 20, 10, 15);
                ctx.globalAlpha = 1.0;
            }
        });
    };

    reset();
    engine.start();
}

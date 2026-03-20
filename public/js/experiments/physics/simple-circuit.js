function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Nút Start trong bài này sẽ đóng vai trò là "Bật/Tắt công tắc"
    startBtn.textContent = "⚡ Bật nguồn";
    let isClosed = false;
    let voltage = 9;

    params.innerHTML = `
        <div class="space-y-6">
            <div class="glass-card p-5 border-none bg-slate-900 text-white shadow-xl">
                <h4 class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3 text-center">Nguồn điện (V)</h4>
                <div class="text-center">
                    <span class="text-3xl font-black italic tracking-tighter text-indigo-400" id="valV-header">${voltage}V</span>
                </div>
            </div>

            <div class="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-5">
                <div class="space-y-2">
                    <div class="flex justify-between items-center px-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Điều chỉnh Điện áp</label>
                        <span class="text-xs font-bold text-indigo-600" id="valV">${voltage} Volt</span>
                    </div>
                    <input type="range" id="sliderV" min="1.5" max="30" step="1.5" value="9" class="w-full accent-indigo-600">
                </div>
                
                <div class="space-y-3 pt-2">
                    <div class="flex items-center gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 italic text-[11px] text-indigo-700">
                        <span>💡</span>
                        <p>Độ sáng của đèn tỷ lệ thuận với bình phương điện áp (P = U²/R).</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const sliderV = document.getElementById('sliderV');
    const valV = document.getElementById('valV');
    const valVHeader = document.getElementById('valV-header');

    sliderV.oninput = (e) => {
        voltage = parseFloat(e.target.value);
        valV.textContent = voltage + ' Volt';
        valVHeader.textContent = voltage + 'V';
    };

    const toggle = () => {
        isClosed = !isClosed;
        status.textContent = isClosed ? "Mạch kín: Dòng điện đang chạy!" : "Mạch hở: Đèn đã tắt.";
        status.className = isClosed ? "text-emerald-500 font-bold" : "text-slate-500 font-bold";
        startBtn.textContent = isClosed ? "🔌 Ngắt nguồn" : "⚡ Bật nguồn";
        startBtn.classList.toggle('bg-rose-500', isClosed);
        startBtn.classList.toggle('hover:bg-rose-600', isClosed);
    };

    startBtn.onclick = toggle;
    resetBtn.onclick = () => {
        if (isClosed) toggle();
        sliderV.value = 9;
        voltage = 9;
        valV.textContent = '9 Volt';
        valVHeader.textContent = '9V';
    };

    class Component extends LabObject {
        constructor(x, y, w, h, icon, name, color='#1e293b') {
            super(x, y, w, h, color);
            this.icon = icon;
            this.name = name;
        }
        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            // Outer shadow/glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(0,0,0,0.1)';
            
            // Card
            ctx.fillStyle = '#1e293b';
            if (ctx.roundRect) {
                ctx.beginPath();
                ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 15);
                ctx.fill();
            } else {
                ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            }
            
            ctx.shadowBlur = 0;
            
            // Icon
            ctx.font = '36px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(this.icon, 0, 12);
            
            // Name
            ctx.font = 'bold 9px Inter';
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillText(this.name.toUpperCase(), 0, this.height/2 - 10);
            
            ctx.restore();
        }
    }

    const battery = new Component(200, 350, 100, 80, '🔋', 'Nguồn DC');
    const lamp = new Component(400, 150, 100, 100, '💡', 'Tải (Đèn)');
    const sw = new Component(600, 350, 100, 80, isClosed ? '🔌' : '🚫', 'Công tắc');
    
    engine.addObject(battery);
    engine.addObject(lamp);
    engine.addObject(sw);

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;
        
        sw.icon = isClosed ? '🔌' : '🚫';

        // Wires
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        
        // Wire Path
        ctx.moveTo(battery.x, battery.y - 40); // Top of battery
        ctx.lineTo(battery.x, 150);
        ctx.lineTo(lamp.x - 50, 150); // To lamp
        
        ctx.moveTo(lamp.x + 50, 150);
        ctx.lineTo(sw.x, 150);
        ctx.lineTo(sw.x, sw.y - 40); // to switch
        
        ctx.moveTo(sw.x, sw.y + 40);
        ctx.lineTo(sw.x, 430);
        ctx.lineTo(battery.x, 430);
        ctx.lineTo(battery.x, battery.y + 40);
        
        ctx.stroke();

        // Components
        this.objects.forEach(o => o.draw(ctx));

        if (isClosed) {
            // Lamp Glow
            const glowStrength = voltage / 30;
            ctx.save();
            ctx.beginPath();
            const grad = ctx.createRadialGradient(lamp.x, lamp.y, 0, lamp.x, lamp.y, 120 * glowStrength + 40);
            grad.addColorStop(0, `rgba(253, 224, 71, ${0.4 * glowStrength + 0.2})`);
            grad.addColorStop(1, 'rgba(253, 224, 71, 0)');
            ctx.fillStyle = grad;
            ctx.arc(lamp.x, lamp.y, 160, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Electrons (animation)
            const t = Date.now() / (1000 - voltage * 20);
            ctx.fillStyle = '#fbbf24';
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#fbbf24';
            
            const drawElectron = (offset) => {
                const progress = (t + offset) % 4;
                let ex, ey;
                if (progress < 1) { // batt -> lamp
                    ex = battery.x; ey = (battery.y - 40) - ( (battery.y-40) - 150 ) * progress;
                } else if (progress < 1.5) { // corner -> lamp
                    ex = battery.x + (lamp.x - 50 - battery.x) * (progress-1)*2; ey = 150;
                } else if (progress < 2.5) { // lamp -> sw
                    ex = (lamp.x + 50) + (sw.x - (lamp.x + 50)) * (progress-1.5); ey = 150;
                } else { // sw -> batt
                    ex = sw.x; ey = 150 + ( (sw.y-40) - 150 ) * (progress-2.5);
                }
                if (ex !== undefined) {
                    ctx.beginPath(); ctx.arc(ex, ey, 4, 0, Math.PI*2); ctx.fill();
                }
            };
            
            for(let i=0; i<5; i++) drawElectron(i * 0.8);
            ctx.shadowBlur = 0;
        }
    };

    engine.start();
}

function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    startBtn.style.display = 'none'; // Not needed for this drag-drop exp

    const solutions = [
        { name: 'Nước chanh', ph: 2.2, color: 'rgba(254, 240, 138, 0.7)', x: 120, y: 350 },
        { name: 'Giấm ăn', ph: 3.0, color: 'rgba(255, 255, 255, 0.3)', x: 260, y: 350 },
        { name: 'Nước cất', ph: 7.0, color: 'rgba(186, 230, 253, 0.4)', x: 400, y: 350 },
        { name: 'Nước baking soda', ph: 9.0, color: 'rgba(241, 245, 249, 0.5)', x: 540, y: 350 },
        { name: 'Nước vôi trong', ph: 12.5, color: 'rgba(248, 250, 252, 0.8)', x: 680, y: 350 }
    ];

    params.innerHTML = `
        <div class="space-y-6">
            <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p class="text-[11px] font-bold text-indigo-700">Hướng dẫn:</p>
                <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">Kéo giấy quỳ tím và nhúng vào các cốc dung dịch để kiểm tra tính Axit/Bazơ.</p>
            </div>
            
            <div id="result-box" class="glass-card p-6 border-l-4 border-indigo-500 bg-white shadow-xl hidden animate-fade-in">
                <h4 id="res-name" class="text-sm font-black text-slate-900 mb-1">Tên chất</h4>
                <p id="res-ph" class="text-[10px] font-bold text-indigo-500 mb-3">pH: 0.0</p>
                <div id="res-indicator" class="p-3 rounded-xl text-center font-black text-[10px] uppercase tracking-tighter">
                    Môi trường
                </div>
            </div>

            <div class="grid grid-cols-1 gap-2">
                <div class="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase">
                    <div class="w-3 h-3 bg-rose-500 rounded-sm"></div> Axit (pH < 7)
                </div>
                <div class="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase">
                    <div class="w-3 h-3 bg-slate-300 rounded-sm"></div> Trung tính (pH = 7)
                </div>
                <div class="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase">
                    <div class="w-3 h-3 bg-blue-500 rounded-sm"></div> Bazơ (pH > 7)
                </div>
            </div>
        </div>
    `;

    const resBox = document.getElementById('result-box');
    const resName = document.getElementById('res-name');
    const resPH = document.getElementById('res-ph');
    const resInd = document.getElementById('res-indicator');

    class Cup extends LabObject {
        constructor(sol) {
            super(sol.x, sol.y, 100, 120, sol.color);
            this.sol = sol;
        }
        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);

            // 1. Solution
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.roundRect(-45, 20, 90, 75, [0, 0, 15, 15]);
            ctx.fill();

            // 2. Beaker Glass
            const grad = ctx.createLinearGradient(-50, 0, 50, 0);
            grad.addColorStop(0, 'rgba(148, 163, 184, 0.5)');
            grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
            grad.addColorStop(1, 'rgba(148, 163, 184, 0.5)');
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-50, -20);
            ctx.lineTo(-50, 85);
            ctx.arc(0, 85, 50, Math.PI, 0, true);
            ctx.lineTo(50, -20);
            ctx.stroke();

            // 3. Label
            ctx.fillStyle = '#475569';
            ctx.font = 'bold 10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(this.sol.name, 0, 115);
            ctx.restore();
        }
    }

    class LitmusPaper extends LabObject {
        constructor() {
            super(400, 100, 30, 120, '#ddd6fe');
            this.draggable = true;
            this.tipColor = '#c4b5fd';
            this.isDipped = false;
        }
        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            // Paper Body
            ctx.fillStyle = '#fdfcfe';
            ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(0,0,0,0.1)';
            ctx.fillRect(-15, -60, 30, 120);
            
            // Reagent tip (Litmus)
            ctx.fillStyle = this.tipColor;
            ctx.fillRect(-15, 20, 30, 40);
            
            // Texture/Lines
            ctx.strokeStyle = 'rgba(0,0,0,0.05)';
            ctx.lineWidth = 1;
            ctx.strokeRect(-15, -60, 30, 120);

            ctx.restore();
        }
    }

    const cups = solutions.map(s => new Cup(s));
    cups.forEach(c => engine.addObject(c));

    const litmus = new LitmusPaper();
    engine.addObject(litmus);

    engine.update = function(dt) {
        // Handle collision with liquid
        const collision = cups.find(c => 
            Math.abs(litmus.x - c.x) < 40 && 
            litmus.y + 60 > c.y + 20 && litmus.y + 60 < c.y + 95
        );

        if (collision) {
            const ph = collision.sol.ph;
            // Realistic color change
            if (ph < 4) litmus.tipColor = '#ef4444'; // Strong acid - Red
            else if (ph < 7) litmus.tipColor = '#f87171'; // Weak acid - Light red
            else if (ph > 10) litmus.tipColor = '#1e40af'; // Strong base - Dark blue
            else if (ph > 7) litmus.tipColor = '#60a5fa'; // Weak base - Light blue
            else litmus.tipColor = '#c4b5fd'; // Neutral - Purple

            resBox.style.display = 'block';
            resName.textContent = collision.sol.name;
            resPH.textContent = `Độ pH đo được: ${ph.toFixed(1)}`;
            
            if (ph < 7) {
                resInd.textContent = "Môi trường Axit";
                resInd.className = "p-3 rounded-xl text-center font-black text-[10px] uppercase tracking-tighter bg-rose-50 text-rose-600 border border-rose-100";
            } else if (ph > 7) {
                resInd.textContent = "Môi trường Bazơ";
                resInd.className = "p-3 rounded-xl text-center font-black text-[10px] uppercase tracking-tighter bg-blue-50 text-blue-600 border border-blue-100";
            } else {
                resInd.textContent = "Môi trường Trung tính";
                resInd.className = "p-3 rounded-xl text-center font-black text-[10px] uppercase tracking-tighter bg-slate-50 text-slate-600 border border-slate-100";
            }
            status.textContent = "Đã nhận biết môi trường!";
            status.className = "text-xs font-black text-emerald-500 tracking-widest uppercase";
        }
    };

    resetBtn.onclick = () => {
        litmus.x = 400; litmus.y = 100;
        litmus.tipColor = '#c4b5fd';
        resBox.style.display = 'none';
        status.textContent = "Sẵn sàng";
        status.className = "text-xs font-black text-slate-500 tracking-widest uppercase";
    };

    engine.start();
}

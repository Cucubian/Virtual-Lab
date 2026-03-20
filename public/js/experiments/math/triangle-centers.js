function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Mờ nút bắt đầu vì đây là mô phỏng tương tác thời gian thực
    startBtn.disabled = true;
    startBtn.classList.add('opacity-50', 'cursor-not-allowed', 'grayscale');
    startBtn.title = "Mô phỏng này tự động cập nhật khi bạn kéo các đỉnh";

    class DraggableVertex extends LabObject {
        constructor(x, y, label, color) {
            super(x, y, 30, 30, color, 'circle');
            this.label = label;
            this.draggable = true;
        }
        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 14px Outfit';
            ctx.textAlign = 'center';
            ctx.fillText(this.label, 0, -20);
            ctx.restore();
        }
    }

    const A = new DraggableVertex(400, 100, 'A', '#6366f1');
    const B = new DraggableVertex(200, 400, 'B', '#6366f1');
    const C = new DraggableVertex(600, 400, 'C', '#6366f1');
    engine.addObject(A); engine.addObject(B); engine.addObject(C);

    let mode = 'median';

    params.innerHTML = `
        <div class="space-y-4">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Các điểm đặc biệt</h4>
            <div class="grid grid-cols-1 gap-3">
                <button class="mode-btn active p-4 rounded-xl border-2 text-left font-bold transition-all flex items-center gap-3" data-mode="median">
                    <span class="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center font-serif italic text-lg shadow-sm">G</span>
                    Trọng tâm (Trung tuyến)
                </button>
                <button class="mode-btn p-4 rounded-xl border-2 text-left font-bold transition-all flex items-center gap-3" data-mode="altitude">
                    <span class="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-serif italic text-lg shadow-sm">H</span>
                    Trực tâm (Đường cao)
                </button>
                <button class="mode-btn p-4 rounded-xl border-2 text-left font-bold transition-all flex items-center gap-3" data-mode="bisector">
                    <span class="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-serif italic text-lg shadow-sm">O</span>
                    Tâm ngoại tiếp (Trung trực)
                </button>
                <button class="mode-btn p-4 rounded-xl border-2 text-left font-bold transition-all flex items-center gap-3" data-mode="incenter">
                    <span class="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-serif italic text-lg shadow-sm">I</span>
                    Tâm nội tiếp (Phân giác)
                </button>
            </div>
            <div class="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-xs text-slate-500">
                Hãy kéo các đỉnh tam giác để xem các điểm đặc biệt di chuyển theo quy luật.
            </div>
        </div>
    `;

    const updateBtns = () => {
        params.querySelectorAll('.mode-btn').forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active', 'border-indigo-600', 'bg-indigo-50', 'text-indigo-600');
                btn.classList.remove('border-slate-100', 'text-slate-500');
            } else {
                btn.classList.remove('active', 'border-indigo-600', 'bg-indigo-50', 'text-indigo-600');
                btn.classList.add('border-slate-100', 'text-slate-500');
            }
        });
    };

    params.querySelectorAll('.mode-btn').forEach(btn => {
        btn.onclick = () => {
            mode = btn.dataset.mode;
            updateBtns();
        };
    });
    updateBtns();

    resetBtn.onclick = () => {
        A.x = 400; A.y = 100;
        B.x = 200; B.y = 400;
        C.x = 600; C.y = 400;
        mode = 'median';
        updateBtns();
        status.textContent = "Đã đặt lại tam giác mặc định.";
    };

    const drawLine = (ctx, x1, y1, x2, y2, color, dashed = true) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx*dx + dy*dy);
        if (len < 1) return;
        
        ctx.beginPath();
        if (dashed) {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
        } else {
            ctx.moveTo(x1 - dx * 10, y1 - dy * 10);
            ctx.lineTo(x2 + dx * 10, y2 + dy * 10);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        if (dashed) ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
    };

    const getProjection = (P, A, B) => {
        const v = { x: B.x - A.x, y: B.y - A.y };
        const u = { x: P.x - A.x, y: P.y - A.y };
        const dot = v.x * u.x + v.y * u.y;
        const vLenSq = v.x * v.x + v.y * v.y;
        if (vLenSq === 0) return A;
        const t = dot / vLenSq;
        return { x: A.x + t * v.x, y: A.y + t * v.y };
    };

    const intersect = (p1, p2, p3, p4) => {
        const x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;
        const x3 = p3.x, y3 = p3.y, x4 = p4.x, y4 = p4.y;
        const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        if (Math.abs(denom) < 0.001) return null;
        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
        return { x: x1 + ua * (x2 - x1), y: y1 + ua * (y2 - y1) };
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.lineTo(C.x, C.y);
        ctx.closePath();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.fill();

        if (mode === 'median') {
            const mBC = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 };
            const mAC = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 };
            const mAB = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
            
            drawLine(ctx, A.x, A.y, mBC.x, mBC.y, '#f43f5e', true);
            drawLine(ctx, B.x, B.y, mAC.x, mAC.y, '#f43f5e', true);
            drawLine(ctx, C.x, C.y, mAB.x, mAB.y, '#f43f5e', true);
            
            const G = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.arc(G.x, G.y, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('G', G.x, G.y + 4);
            status.textContent = "G (Trọng tâm) là giao điểm của 3 đường trung tuyến.";
        } else if (mode === 'altitude') {
            const hA = getProjection(A, B, C);
            const hB = getProjection(B, A, C);
            const hC = getProjection(C, A, B);
            
            drawLine(ctx, A.x, A.y, hA.x, hA.y, '#10b981', true);
            drawLine(ctx, B.x, B.y, hB.x, hB.y, '#10b981', true);
            drawLine(ctx, C.x, C.y, hC.x, hC.y, '#10b981', true);
            
            const H = intersect(A, hA, B, hB);
            if (H) {
                ctx.fillStyle = '#10b981';
                ctx.beginPath();
                ctx.arc(H.x, H.y, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.fillText('H', H.x, H.y + 4);
            }
            status.textContent = "H (Trực tâm) là giao điểm của 3 đường cao.";
        } else if (mode === 'bisector') {
            const mBC = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 };
            const mAC = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 };
            const mAB = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
            
            const vBC = { x: C.x - B.x, y: C.y - B.y };
            const vAC = { x: C.x - A.x, y: C.y - A.y };
            const vAB = { x: B.x - A.x, y: B.y - A.y };

            const pBC = { x: -vBC.y, y: vBC.x };
            const pAC = { x: -vAC.y, y: vAC.x };
            const pAB = { x: -vAB.y, y: vAB.x };
            
            drawLine(ctx, mBC.x, mBC.y, mBC.x + pBC.x, mBC.y + pBC.y, '#f59e0b', false);
            drawLine(ctx, mAC.x, mAC.y, mAC.x + pAC.x, mAC.y + pAC.y, '#f59e0b', false);
            drawLine(ctx, mAB.x, mAB.y, mAB.x + pAB.x, mAB.y + pAB.y, '#f59e0b', false);
            
            const O = intersect(mBC, {x: mBC.x + pBC.x, y: mBC.y + pBC.y}, mAC, {x: mAC.x + pAC.x, y: mAC.y + pAC.y});
            if (O) {
                const R = Math.sqrt((O.x - A.x)**2 + (O.y - A.y)**2);
                ctx.beginPath();
                ctx.arc(O.x, O.y, R, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
                ctx.lineWidth = 2;
                ctx.setLineDash([10, 5]);
                ctx.stroke();
                ctx.setLineDash([]);
                
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.arc(O.x, O.y, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.fillText('O', O.x, O.y + 4);
            }
            status.textContent = "O (Tâm ngoại tiếp) là giao điểm 3 đường trung trực.";
        } else if (mode === 'incenter') {
            const dist = (p1, p2) => Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
            const a = dist(B, C);
            const b = dist(A, C);
            const c = dist(A, B);
            const P = a + b + c;
            
            const I = {
                x: (a * A.x + b * B.x + c * C.x) / P,
                y: (a * A.y + b * B.y + c * C.y) / P
            };
            
            drawLine(ctx, A.x, A.y, I.x, I.y, '#6366f1', true);
            drawLine(ctx, B.x, B.y, I.x, I.y, '#6366f1', true);
            drawLine(ctx, C.x, C.y, I.x, I.y, '#6366f1', true);
            
            const s = P / 2;
            const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
            const r = area / s;
            
            ctx.beginPath();
            ctx.arc(I.x, I.y, r, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
            
            ctx.fillStyle = '#6366f1';
            ctx.beginPath();
            ctx.arc(I.x, I.y, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.fillText('I', I.x, I.y + 4);
            status.textContent = "I (Tâm nội tiếp) là giao điểm các đường phân giác.";
        }

        this.objects.forEach(o => o.draw(ctx));
    };

    engine.start();
}


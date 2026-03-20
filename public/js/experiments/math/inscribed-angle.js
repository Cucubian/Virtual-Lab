function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Mờ nút bắt đầu vì đây là mô phỏng tương tác thời gian thực
    startBtn.disabled = true;
    startBtn.classList.add('opacity-50', 'cursor-not-allowed', 'grayscale');
    startBtn.title = "Mô phỏng này tự động cập nhật khi bạn kéo các điểm";

    class CircPoint extends LabObject {
        constructor(angle, label, color) {
            super(0, 0, 30, 30, color, 'circle');
            this.angle = angle;
            this.label = label;
            this.draggable = true;
            this.radius = 150;
            this.ox = 400;
            this.oy = 250;
            this.updatePos();
        }

        updatePos() {
            this.x = this.ox + Math.cos(this.angle) * this.radius;
            this.y = this.oy + Math.sin(this.angle) * this.radius;
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.fillStyle = this.color;
            ctx.font = 'bold 16px Outfit';
            ctx.fillText(this.label, this.x + 15, this.y + 5);
        }

        isPointInside(px, py) {
            const dx = px - this.x;
            const dy = py - this.y;
            return Math.sqrt(dx*dx + dy*dy) < 20;
        }
    }

    const A = new CircPoint(Math.PI * 1.2, 'A', '#f43f5e');
    const B = new CircPoint(Math.PI * 1.8, 'B', '#10b981');
    const M = new CircPoint(Math.PI * 0.5, 'M', '#6366f1');

    engine.addObject(A);
    engine.addObject(B);
    engine.addObject(M);

    params.innerHTML = `
        <div class="space-y-6">
            <div class="glass-card p-6 border-none bg-indigo-50/50">
                <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Mối quan hệ góc</h4>
                <div class="space-y-4">
                    <div class="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm border border-indigo-100">
                        <span class="text-xs font-bold text-slate-500">Góc ở tâm (AOB):</span>
                        <span class="text-lg font-black text-rose-500" id="central-angle">0°</span>
                    </div>
                    <div class="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm border border-indigo-100">
                        <span class="text-xs font-bold text-slate-500">Góc nội tiếp (AMB):</span>
                        <span class="text-lg font-black text-indigo-600" id="inscribed-angle">0°</span>
                    </div>
                </div>
            </div>
            <div class="p-6 bg-amber-50 rounded-2xl border border-amber-100 italic text-[11px] text-amber-700 leading-relaxed font-medium">
                Kéo các điểm <b>A, B, M</b> quanh đường tròn để thấy: Số đo góc nội tiếp luôn bằng <b>nửa</b> số đo góc ở tâm cùng chắn một cung.
            </div>
        </div>
    `;

    engine.handleMouseMove = (e) => {
        if (engine.isDragging && engine.draggedObject) {
            const mouse = engine.getMousePos(e);
            const angle = Math.atan2(mouse.y - 250, mouse.x - 400);
            engine.draggedObject.angle = angle;
            engine.draggedObject.updatePos();
        }
    };

    resetBtn.onclick = () => {
        A.angle = Math.PI * 1.2; A.updatePos();
        B.angle = Math.PI * 1.8; B.updatePos();
        M.angle = Math.PI * 0.5; M.updatePos();
        status.textContent = "Đã đặt lại vị trí các điểm.";
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;
        const ox = 400;
        const oy = 250;
        const r = 150;

        // Draw main circle
        ctx.beginPath();
        ctx.arc(ox, oy, r, 0, Math.PI * 2);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw center O
        ctx.beginPath();
        ctx.arc(ox, oy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#94a3b8';
        ctx.fill();
        ctx.font = 'bold 12px Inter';
        ctx.fillText('O', ox - 5, oy - 10);

        // Calculate angles
        let angA = A.angle;
        let angB = B.angle;
        let angM = M.angle;

        // Normalize to 0-2PI
        const normalize = (a) => (a < 0 ? a + Math.PI * 2 : a);
        let diffCentral = normalize(angB) - normalize(angA);
        if (diffCentral < 0) diffCentral += Math.PI * 2;
        if (diffCentral > Math.PI) diffCentral = Math.PI * 2 - diffCentral;

        // Draw Inscribed Angle (AMB)
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(M.x, M.y);
        ctx.lineTo(B.x, B.y);
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = 'rgba(99, 102, 241, 0.1)';
        ctx.fill();

        // Draw Central Angle (AOB)
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(ox, oy);
        ctx.lineTo(B.x, B.y);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Update UI
        const degCentral = (diffCentral * 180 / Math.PI);
        const degInscribed = degCentral / 2;
        
        document.getElementById('central-angle').textContent = `${Math.round(degCentral)}°`;
        document.getElementById('inscribed-angle').textContent = `${Math.round(degInscribed)}°`;

        status.textContent = `Góc nội tiếp = ${Math.round(degInscribed)}° | Góc ở tâm = ${Math.round(degCentral)}°`;

        this.objects.forEach(o => o.draw(ctx));
    };

    engine.start();
}

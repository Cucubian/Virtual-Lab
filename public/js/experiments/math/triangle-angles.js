function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    let isAnimating = false;
    let progress = 0;

    class DraggableVertex extends LabObject {
        constructor(x, y, label, color) {
            super(x, y, 40, 40, color, 'circle');
            this.label = label;
            this.draggable = true;
            this.isHovered = false;
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            // Outer glow
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 2 + 5, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.isHovered ? 0.3 : 0.1;
            ctx.fill();
            
            // Main circle
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Label
            ctx.fillStyle = '#fff';
            ctx.font = 'black 16px Outfit';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.label, 0, 0);
            
            ctx.restore();
        }

        isPointInside(px, py) {
            const dist = Math.sqrt((px - this.x) ** 2 + (py - this.y) ** 2);
            this.isHovered = dist < this.width / 2 + 10;
            return dist < this.width / 2;
        }
    }

    const A = new DraggableVertex(400, 100, 'A', '#6366f1');
    const B = new DraggableVertex(250, 350, 'B', '#f43f5e');
    const C = new DraggableVertex(550, 350, 'C', '#10b981');
    engine.addObject(A); engine.addObject(B); engine.addObject(C);

    params.innerHTML = `
        <div class="space-y-6">
            <div class="glass-card p-6 border-none bg-indigo-50/50">
                <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Thao tác</h4>
                <p class="text-sm font-medium text-slate-600">Thú vị chưa? Bạn có thể <b>kéo trực tiếp</b> các đỉnh A, B, C trên màn hình để thay đổi hình dạng tam giác!</p>
            </div>
            <div class="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                <span class="text-xl">💡</span>
                <p class="text-xs text-amber-700 font-medium leading-relaxed">Sau khi tạo xong tam giác ưng ý, hãy nhấn nút "Bắt đầu" để xem phép màu: ghép 3 góc thành một đường thẳng.</p>
            </div>
        </div>
    `;

    startBtn.onclick = () => {
        isAnimating = true;
        progress = 0;
        A.draggable = false;
        B.draggable = false;
        C.draggable = false;
    };

    resetBtn.onclick = () => {
        isAnimating = false;
        progress = 0;
        status.textContent = "Sẵn sàng";
        status.className = "text-slate-500 font-bold uppercase tracking-widest text-xs";
        A.draggable = true;
        B.draggable = true;
        C.draggable = true;
    };

    function drawAngleSector(ctx, x, y, startAngle, endAngle, color, p, targetX, targetY, extraRotation) {
        ctx.save();
        
        // Interpolate position
        const nx = x + (targetX - x) * p;
        const ny = y + (targetY - y) * p;
        ctx.translate(nx, ny);
        
        // Rotate to final horizontal position
        ctx.rotate(extraRotation * p);
        
        // Draw the sector
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 120, startAngle, endAngle);
        ctx.closePath();
        
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 1;
        ctx.stroke();
        
        // Add label inside sector
        ctx.restore();
    }

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        // Draw Triangle lines
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.lineTo(C.x, C.y);
        ctx.closePath();
        ctx.strokeStyle = '#cbd5e1';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);

        // Helper to get internal angle parameters
        const getAngleData = (v, n1, n2) => {
            let a1 = Math.atan2(n1.y - v.y, n1.x - v.x);
            let a2 = Math.atan2(n2.y - v.y, n2.x - v.x);
            let diff = a2 - a1;
            
            // Normalize to [0, 2PI)
            while (diff < 0) diff += Math.PI * 2;
            
            // If diff > PI, then a1->a2 CW is the external angle
            if (diff > Math.PI) {
                const temp = a1;
                a1 = a2;
                a2 = temp;
                diff = Math.PI * 2 - diff;
            }
            return { start: a1, end: a2, sweep: diff };
        };

        const dataA = getAngleData(A, B, C);
        const dataB = getAngleData(B, C, A);
        const dataC = getAngleData(C, A, B);

        // Common target for "merging" angles
        const tx = 400;
        const ty = 450;

        if (isAnimating && progress < 1) {
            progress += 0.015;
            status.textContent = "Đang kiểm chứng: Ghép 3 góc...";
        }

        // Draw sectors with correct stacking
        // We stack them along a flat line PI
        // Angle B (Red)
        drawAngleSector(ctx, B.x, B.y, dataB.start, dataB.end, '#f43f5e', progress, tx, ty, Math.PI - dataB.start);
        
        // Angle A (Blue)
        drawAngleSector(ctx, A.x, A.y, dataA.start, dataA.end, '#6366f1', progress, tx, ty, Math.PI + dataB.sweep - dataA.start);
        
        // Angle C (Green)
        drawAngleSector(ctx, C.x, C.y, dataC.start, dataC.end, '#10b981', progress, tx, ty, Math.PI + dataB.sweep + dataA.sweep - dataC.start);

        // Draw Labels inside sectors at p=1
        if (progress > 0.5) {
            ctx.save();
            ctx.translate(tx, ty);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Inter';
            
            // Label B
            ctx.save(); ctx.rotate(Math.PI + dataB.sweep/2); ctx.fillText('B', 70, 0); ctx.restore();
            // Label A
            ctx.save(); ctx.rotate(Math.PI + dataB.sweep + dataA.sweep/2); ctx.fillText('A', 70, 0); ctx.restore();
            // Label C
            ctx.save(); ctx.rotate(Math.PI + dataB.sweep + dataA.sweep + dataC.sweep/2); ctx.fillText('C', 70, 0); ctx.restore();
            
            ctx.restore();
        }

        if (progress >= 1) {
            progress = 1;
            // Draw horizontal base line
            ctx.beginPath();
            ctx.moveTo(tx - 200, ty);
            ctx.lineTo(tx + 200, ty);
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 4;
            ctx.stroke();
            
            ctx.fillStyle = '#334155';
            ctx.font = 'bold 20px Outfit';
            ctx.textAlign = 'center';
            ctx.fillText("Tổng các góc = 180°", tx, ty + 40);
            
            status.textContent = "Đã chứng minh: Tổng 3 góc = 180°";
            status.className = "text-emerald-500 font-bold uppercase tracking-widest text-xs";
        }

        // Only draw vertices if not fully merged
        if (progress < 1) {
            this.objects.forEach(o => o.draw(ctx));
        }
    };

    engine.start();
}

function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Mờ nút bắt đầu vì đây là mô phỏng tương tác thời gian thực
    startBtn.disabled = true;
    startBtn.classList.add('opacity-50', 'cursor-not-allowed', 'grayscale');
    startBtn.title = "Mô phỏng này tự động cập nhật khi bạn xoay tia tới";

    let angle = 30; // degrees

    params.innerHTML = `
        <div class="space-y-6">
            <div class="p-6 bg-slate-900 border-none rounded-3xl shadow-xl text-center text-white">
                <h4 class="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-2">Định luật phản xạ</h4>
                <p class="text-2xl font-black italic tracking-tighter">i = i' = <span id="valI-header">${angle}</span>°</p>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div class="flex justify-between items-center mb-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Góc tới (i)</label>
                    <span class="text-lg font-black text-rose-500" id="valI">${angle}°</span>
                </div>
                <input type="range" id="sliderI" min="0" max="80" value="${angle}" class="w-full accent-rose-500">
                
                <div class="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[11px] text-indigo-700 leading-relaxed italic mt-4 font-medium">
                    Tia phản xạ nằm trong mặt phẳng tới và góc phản xạ luôn bằng góc tới.
                </div>
            </div>
        </div>
    `;

    const slider = document.getElementById('sliderI');
    const valI = document.getElementById('valI');
    const valIHeader = document.getElementById('valI-header');

    const updateUI = () => {
        angle = parseInt(slider.value);
        valI.textContent = `${angle}°`;
        valIHeader.textContent = angle;
        status.textContent = `Góc tới: ${angle}° | Góc phản xạ: ${angle}°`;
    };

    slider.oninput = updateUI;

    resetBtn.onclick = () => {
        slider.value = 30;
        updateUI();
        status.textContent = "Đã đặt lại góc mặc định.";
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;
        const centerX = this.width / 2;
        const mirrorY = 400;

        // Mirror
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(centerX - 200, mirrorY, 400, 10);
        // Mirror hatching
        ctx.strokeStyle = '#cbd5e1';
        for(let i=-200; i<200; i+=10) {
            ctx.beginPath();
            ctx.moveTo(centerX + i, mirrorY + 10);
            ctx.lineTo(centerX + i - 5, mirrorY + 20);
            ctx.stroke();
        }

        // Normal line
        ctx.setLineDash([8, 8]);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, mirrorY);
        ctx.lineTo(centerX, mirrorY - 250);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 10px Inter';
        ctx.fillText('PHÁP TUYẾN', centerX - 30, mirrorY - 260);

        // Rays
        const rad = (angle * Math.PI) / 180;
        const rayLen = 220;

        // Incident Ray (Tia tới)
        const ix = centerX - rayLen * Math.sin(rad);
        const iy = mirrorY - rayLen * Math.cos(rad);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(ix, iy);
        ctx.lineTo(centerX, mirrorY);
        ctx.stroke();
        
        // Reflection Ray (Tia phản xạ)
        const rx = centerX + rayLen * Math.sin(rad);
        const ry = mirrorY - rayLen * Math.cos(rad);
        ctx.strokeStyle = '#6366f1';
        ctx.beginPath();
        ctx.moveTo(centerX, mirrorY);
        ctx.lineTo(rx, ry);
        ctx.stroke();

        // Arrows
        function drawArrow(x1, y1, x2, y2) {
            const headlen = 12;
            const dx = x2 - x1;
            const dy = y2 - y1;
            const ang = Math.atan2(dy, dx);
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - headlen * Math.cos(ang - Math.PI / 6), y2 - headlen * Math.sin(ang - Math.PI / 6));
            ctx.lineTo(x2 - headlen * Math.cos(ang + Math.PI / 6), y2 - headlen * Math.sin(ang + Math.PI / 6));
            ctx.closePath();
            ctx.fill();
        }

        ctx.fillStyle = '#f43f5e';
        drawArrow(ix, iy, centerX - (centerX-ix)*0.4, mirrorY - (mirrorY-iy)*0.4);
        ctx.fillStyle = '#6366f1';
        drawArrow(centerX, mirrorY, centerX + (rx-centerX)*0.6, mirrorY - (mirrorY-ry)*0.6);

        // Angle arcs
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, mirrorY, 60, -Math.PI/2 - rad, -Math.PI/2);
        ctx.stroke();
        
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 12px Inter';
        ctx.fillText(`i = ${angle}°`, centerX - 35, mirrorY - 70);

        ctx.beginPath();
        ctx.arc(centerX, mirrorY, 60, -Math.PI/2, -Math.PI/2 + rad);
        ctx.stroke();
        ctx.fillText(`i' = ${angle}°`, centerX + 10, mirrorY - 70);
    };

    engine.start();
    status.textContent = "Điều chỉnh góc tới để quan sát sự phản xạ.";
}

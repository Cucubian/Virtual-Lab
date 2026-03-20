function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    startBtn.textContent = "Kiểm tra chuỗi";

    const organisms = [
        { id: 'grass', name: 'Cỏ', icon: '🌿', type: 'producer', x: 100, y: 120 },
        { id: 'rabbit', name: 'Thỏ', icon: '🐇', type: 'consumer-1', x: 250, y: 220 },
        { id: 'fox', name: 'Cáo', icon: '🦊', type: 'consumer-2', x: 400, y: 120 },
        { id: 'eagle', name: 'Đại bàng', icon: '🦅', type: 'consumer-3', x: 550, y: 220 }
    ];

    const slots = [
        { x: 120, y: 400, expected: 'producer', label: 'Sản xuất', color: '#10b981' },
        { x: 300, y: 400, expected: 'consumer-1', label: 'Tiêu thụ 1', color: '#f59e0b' },
        { x: 480, y: 400, expected: 'consumer-2', label: 'Tiêu thụ 2', color: '#ef4444' },
        { x: 660, y: 400, expected: 'consumer-3', label: 'Tiêu thụ 3', color: '#b91c1c' }
    ];

    params.innerHTML = `
        <div class="space-y-6">
            <div class="p-6 rounded-[24px] shadow-xl relative overflow-hidden"
                 style="background: linear-gradient(135deg, #6366f1, #a855f7); color: white;">
                <div class="absolute top-[-10px] right-[-10px] w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                <h4 class="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Thử thách sinh thái</h4>
                <p class="text-xs font-bold leading-relaxed">Hãy sắp xếp các sinh vật theo đúng thứ tự dòng năng lượng truyền đi.</p>
            </div>

            <div id="chain-result" class="p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm hidden">
                <h5 id="result-title" class="text-[10px] font-black uppercase mb-1">Kết quả</h5>
                <p id="result-text" class="text-[10px] text-slate-500 leading-relaxed font-medium italic"></p>
            </div>

            <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div class="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-xs">💡</div>
                <p class="text-[10px] text-slate-500 flex-1 leading-tight font-medium">Gợi ý: Bắt đầu từ sinh vật tự chế tạo được thức ăn từ ánh sáng mặt trời.</p>
            </div>
        </div>
    `;

    const chainResult = document.getElementById('chain-result');
    const resultTitle = document.getElementById('result-title');
    const resultText = document.getElementById('result-text');

    class Organism extends LabObject {
        constructor(data) {
            super(data.x, data.y, 100, 100, '#ffffff', 'rect');
            this.id = data.id;
            this.name = data.name;
            this.icon = data.icon;
            this.type = data.type;
            this.draggable = true;
            this.baseX = data.x;
            this.baseY = data.y;
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            // Premium Card look
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(0,0,0,0.08)';
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(-this.width/2, -this.height/2, this.width, this.height, 24);
            ctx.fill();
            
            // Icon
            ctx.font = '40px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowBlur = 0;
            ctx.fillText(this.icon, 0, -12);
            
            // Name
            ctx.fillStyle = '#475569';
            ctx.font = 'bold 10px Inter';
            ctx.fillText(this.name.toUpperCase(), 0, 32);
            
            ctx.restore();
        }
    }

    const orgObjects = organisms.map(o => new Organism(o));
    orgObjects.forEach(o => engine.addObject(o));

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        // Background grid dots
        ctx.fillStyle = '#cbd5e1';
        for(let i=20; i<800; i+=40) {
            for(let j=20; j<500; j+=40) {
                ctx.beginPath(); ctx.arc(i, j, 1, 0, Math.PI*2); ctx.fill();
            }
        }

        // Draw Slots with glassmorphism effect
        slots.forEach((s, i) => {
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 4]);
            ctx.beginPath();
            ctx.roundRect(s.x - 55, s.y - 55, 110, 110, 25);
            ctx.fill(); ctx.stroke();
            ctx.setLineDash([]);
            
            ctx.fillStyle = s.color; ctx.font = 'black 9px Inter'; ctx.textAlign = 'center';
            ctx.fillText(s.label.toUpperCase(), s.x, s.y + 75);

            // Flow Arrow
            if (i < slots.length - 1) {
                const nextS = slots[i+1];
                ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 4; ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(s.x + 70, s.y); ctx.lineTo(nextS.x - 70, s.y);
                ctx.stroke();
                // Arrow head
                ctx.beginPath();
                ctx.moveTo(nextS.x - 85, s.y - 8); ctx.lineTo(nextS.x - 70, s.y); ctx.lineTo(nextS.x - 85, s.y + 8);
                ctx.stroke();
            }
        });

        this.objects.forEach(o => o.draw(ctx));
    };

    startBtn.onclick = () => {
        let correctCount = 0;
        slots.forEach(s => {
            const found = orgObjects.find(o => 
                Math.abs(o.x - s.x) < 50 && Math.abs(o.y - s.y) < 50
            );
            if (found && found.type === s.expected) {
                correctCount++;
                // Snap to center
                found.x = s.x; found.y = s.y;
            }
        });

        chainResult.classList.remove('hidden');
        if (correctCount === 4) {
            resultTitle.textContent = "THÀNH CÔNG! 🎉";
            resultTitle.className = "text-[10px] font-black uppercase mb-1 text-emerald-600";
            resultText.textContent = "Bạn đã hoàn thành chuỗi thức ăn: Tảo/Cây → Thỏ → Cáo → Đại bàng. Đây là chu kỳ năng lượng lành mạnh!";
            status.textContent = "Chuỗi thức ăn hoàn hảo!";
            status.className = "text-xs font-black text-emerald-500 tracking-widest uppercase animate-bounce";
        } else {
            resultTitle.textContent = "THỬ LẠI XEM...";
            resultTitle.className = "text-[10px] font-black uppercase mb-1 text-rose-500";
            resultText.textContent = `Bạn đã đặt đúng ${correctCount}/4 vị trí. Hãy kiểm tra lại dòng chảy năng lượng từ sinh vật sản xuất nhé.`;
            status.textContent = "Chưa chính xác!";
            status.className = "text-xs font-black text-rose-500 tracking-widest uppercase";
        }
    };

    resetBtn.onclick = () => {
        orgObjects.forEach((o, i) => {
            o.x = o.baseX;
            o.y = o.baseY;
        });
        chainResult.classList.add('hidden');
        status.textContent = "Sẵn sàng";
        status.className = "text-xs font-black text-slate-500 tracking-widest uppercase";
    };

    engine.start();
}

function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const resetBtn = document.getElementById('reset-btn');

    let absorptionParticles = [];

    params.innerHTML = `
        <div class="space-y-6">
            <div class="p-6 rounded-[24px] shadow-xl relative overflow-hidden" 
                 style="background: linear-gradient(135deg, #fb923c, #f43f5e); color: white;">
                <h4 class="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Hành trình năng lượng</h4>
                <div class="h-1.5 bg-white/20 rounded-full overflow-hidden mt-4">
                    <div id="digest-progress" class="h-full bg-white transition-all duration-300" style="width: 0%"></div>
                </div>
            </div>

            <div id="digest-info" class="p-6 bg-white rounded-[28px] border-2 border-slate-100 shadow-xl hidden animate-fade-in">
                <div class="flex items-center gap-3 mb-3">
                    <div id="organ-color-tag" class="w-2 h-10 rounded-full"></div>
                    <div>
                        <h4 id="organ-name" class="text-xs font-extra-bold text-slate-900 uppercase">Cơ quan</h4>
                        <p class="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Chức năng chính</p>
                    </div>
                </div>
                <p id="organ-task" class="text-[10px] text-slate-500 leading-relaxed font-medium"></p>
            </div>

            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p class="text-[10px] text-slate-400 leading-relaxed italic">💡 Gợi ý: Hãy quan sát mẩu thức ăn nhỏ dần và đổi màu khi các enzyme phân giải nó.</p>
            </div>
        </div>
    `;

    const infoBox = document.getElementById('digest-info');
    const organName = document.getElementById('organ-name');
    const organTask = document.getElementById('organ-task');
    const organColorTag = document.getElementById('organ-color-tag');
    const digestProgress = document.getElementById('digest-progress');

    const organs = [
        { name: "Khoang miệng", y: 80, color: '#fca5a5', task: "Nghiền nát cơ học và thủy phân tinh bột nhờ enzyme Amylase." },
        { name: "Thực quản", y: 160, color: '#fca5a5', task: "Vận chuyển thức ăn bằng các đợt sóng co thắt nhu động (Peristalsis)." },
        { name: "Dạ dày", y: 280, color: '#f87171', task: "Nhào trộn dịch vị HCl, tiêu hóa Protein thành chuỗi Peptide ngắn hơn." },
        { name: "Ruột non", y: 390, color: '#ef4444', task: "Nơi quan trọng nhất: Phân giải hoàn toàn và hấp thụ chất dinh dưỡng vào máu." },
        { name: "Ruột già", y: 460, color: '#b91c1c', task: "Hấp thụ lại nước, cô đặc chất bã tạo thành phân để thải ra ngoài." }
    ];

    const food = new LabObject(400, 40, 35, 30, '#f59e0b', 'rect'); 
    food.draggable = true;
    engine.addObject(food);

    engine.handleMouseMove = function(e) {
        LabEngine.prototype.handleMouseMove.call(this, e);
        
        if (this.isDragging && this.draggedObject === food) {
            const h = Math.min(1, Math.max(0, (food.y - 40) / 420));
            digestProgress.style.width = (h * 100) + '%';
            
            // Transform food: darker and smaller as it digests
            food.width = 35 - (h * 20);
            food.height = 30 - (h * 15);
            food.color = `rgb(${245 - h * 100}, ${158 - h * 100}, ${11})`;

            // Nutrient absorption in small intestine
            if (food.y > 350 && food.y < 430) {
                if (Math.random() < 0.2) {
                    absorptionParticles.push({
                        x: 400, y: food.y, vx: (Math.random()-0.5)*100, vy: (Math.random()-0.5)*100, life: 1
                    });
                }
            }

            const organ = organs.find(o => Math.abs(food.y - o.y) < 30);
            if (organ) {
                infoBox.classList.remove('hidden');
                organName.textContent = organ.name;
                organTask.textContent = organ.task;
                organColorTag.style.backgroundColor = organ.color;
                status.textContent = `Thức ăn đang đi qua ${organ.name}`;
                status.className = "text-xs font-black text-rose-500 uppercase tracking-widest";
            }
        }
    };

    resetBtn.onclick = () => {
        food.x = 400; food.y = 40;
        food.width = 35; food.height = 30;
        food.color = '#f59e0b';
        digestProgress.style.width = '0%';
        infoBox.classList.add('hidden');
        absorptionParticles = [];
        status.textContent = "Sẵn sàng";
    };

    engine.update = (dt) => {
        absorptionParticles.forEach((p, i) => {
            p.x += p.vx * dt; p.y += p.vy * dt;
            p.life -= dt;
            if (p.life < 0) absorptionParticles.splice(i, 1);
        });
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;
        const cx = 400;

        // Human Body Silhouette (Soft Shadow)
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.roundRect(cx - 100, 20, 200, 480, 50);
        ctx.fill();

        // Draw Organs with inner glow
        organs.forEach(o => {
            const grad = ctx.createRadialGradient(cx, o.y, 0, cx, o.y, 40);
            grad.addColorStop(0, o.color);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.globalAlpha = 0.3;
            ctx.beginPath(); ctx.arc(cx, o.y, 40, 0, Math.PI*2); ctx.fill();
            ctx.globalAlpha = 1.0;

            ctx.fillStyle = o.color;
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.arc(cx, o.y, 30, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            
            ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 8px Inter'; ctx.textAlign = 'right';
            ctx.fillText(o.name.toUpperCase(), cx - 50, o.y + 5);
        });

        // Absorption particles
        absorptionParticles.forEach(p => {
            ctx.fillStyle = `rgba(34, 197, 94, ${p.life})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2); ctx.fill();
        });

        this.objects.forEach(o => o.draw(ctx));
    };

    engine.start();
}

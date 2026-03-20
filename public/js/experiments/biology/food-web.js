function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    startBtn.textContent = "Kiểm tra lưới";
    let activeLinkStart = null;
    let establishedLinks = [];
    let mousePos = { x: 0, y: 0 };

    const species = [
        { id: 'algae', name: 'Tảo biển', icon: '🌿', level: 0, x: 100, y: 400 },
        { id: 'small_fish', name: 'Cá nhỏ', icon: '🐟', level: 1, x: 300, y: 300, eats: ['algae'] },
        { id: 'shrimp', name: 'Tôm', icon: '🦐', level: 1, x: 300, y: 150, eats: ['algae'] },
        { id: 'tuna', name: 'Cá ngừ', icon: '🍣', level: 2, x: 550, y: 250, eats: ['small_fish', 'shrimp'] },
        { id: 'shark', name: 'Cá mập', icon: '🦈', level: 3, x: 700, y: 100, eats: ['tuna', 'small_fish'] }
    ];

    const totalPossibleLinks = species.reduce((acc, s) => acc + (s.eats ? s.eats.length : 0), 0);

    params.innerHTML = `
        <div class="space-y-6">
            <div class="p-6 bg-slate-900 rounded-[24px] shadow-2xl relative overflow-hidden border border-white/10">
                <h4 class="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-4">Độ ổn định Hệ sinh thái</h4>
                <div class="flex justify-between items-end mb-2">
                    <span id="link-count" class="text-xs font-bold text-white">0 / ${totalPossibleLinks} Liên kết</span>
                    <span id="stability-percent" class="text-[10px] font-black text-emerald-500">0%</span>
                </div>
                <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div id="stability-bar" class="h-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-700" style="width: 0%"></div>
                </div>
            </div>

            <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 italic">
                <p class="text-[11px] font-bold text-indigo-700 mb-1">Cách chơi:</p>
                <p class="text-[10px] text-slate-500 leading-relaxed">
                    Nhấp vào một con vật, sau đó kéo đường nối tới thức ăn của nó. 
                    Tạo ra một mạng lưới chằng chịt để hệ sinh thái đạt độ ổn định 100%.
                </p>
            </div>

            <div id="web-feedback" class="p-4 bg-white rounded-2xl border-2 border-slate-100 hidden">
                <p id="feedback-text" class="text-[10px] text-slate-500 font-bold italic text-center"></p>
            </div>
        </div>
    `;

    const stabilityBar = document.getElementById('stability-bar');
    const stabilityPercent = document.getElementById('stability-percent');
    const linkCount = document.getElementById('link-count');
    const webFeedback = document.getElementById('web-feedback');
    const feedbackText = document.getElementById('feedback-text');

    class SpeciesNode extends LabObject {
        constructor(data) {
            super(data.x, data.y, 70, 70, '#ffffff', 'circle');
            this.id = data.id;
            this.name = data.name;
            this.icon = data.icon;
            this.eats = data.eats || [];
            this.draggable = true;
        }
        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            // Outer glow
            const grad = ctx.createRadialGradient(0,0,0,0,0,40);
            grad.addColorStop(0, 'rgba(255,255,255,1)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.arc(0,0,40,0,Math.PI*2); ctx.fill();

            // Circle body
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 15; ctx.shadowColor = 'rgba(0,0,0,0.1)';
            ctx.beginPath(); ctx.arc(0, 0, 35, 0, Math.PI*2); ctx.fill();

            ctx.font = '32px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.shadowBlur = 0;
            ctx.fillText(this.icon, 0, 0);

            ctx.fillStyle = '#475569'; ctx.font = '900 9px Inter';
            ctx.fillText(this.name.toUpperCase(), 0, 45);

            ctx.restore();
        }
    }

    const nodeObjects = species.map(s => new SpeciesNode(s));
    nodeObjects.forEach(n => engine.addObject(n));

    // Custom mouse interaction for linking
    engine.canvas.addEventListener('mousedown', (e) => {
        const pos = engine.getMousePos(e);
        const hit = nodeObjects.find(n => n.isPointInside(pos.x, pos.y));
        if (hit) {
            activeLinkStart = hit;
            engine.isDragging = false; // Disable default dragging when starting a link
        }
    });

    engine.canvas.addEventListener('mousemove', (e) => {
        mousePos = engine.getMousePos(e);
    });

    engine.canvas.addEventListener('mouseup', (e) => {
        if (activeLinkStart) {
            const hit = nodeObjects.find(n => n.isPointInside(mousePos.x, mousePos.y));
            if (hit && hit !== activeLinkStart) {
                // Check if link is valid (predator to prey)
                if (activeLinkStart.eats.includes(hit.id)) {
                    // Check if already exists
                    if (!establishedLinks.some(l => l.from === activeLinkStart && l.to === hit)) {
                        establishedLinks.push({ from: activeLinkStart, to: hit });
                        updateStability();
                        showFeedback(`✅ ${activeLinkStart.name} ăn ${hit.name}`, 'success');
                    }
                } else if (hit.eats.includes(activeLinkStart.id)) {
                    // Reversed link attempted
                    showFeedback(`❌ Ngược rồi! ${hit.name} mới ăn ${activeLinkStart.name}`, 'error');
                } else {
                    showFeedback(`❌ ${activeLinkStart.name} không ăn ${hit.name}`, 'error');
                }
            }
        }
        activeLinkStart = null;
    });

    function updateStability() {
        const count = establishedLinks.length;
        const percent = Math.round((count / totalPossibleLinks) * 100);
        stabilityBar.style.width = percent + '%';
        stabilityPercent.textContent = percent + '%';
        linkCount.textContent = `${count} / ${totalPossibleLinks} Liên kết`;
        
        if (percent === 100) {
            status.textContent = "Hệ sinh thái đạt trạng thái cân bằng tuyệt vời!";
            status.className = "text-xs font-black text-emerald-500 uppercase tracking-widest";
        }
    }

    function showFeedback(text, type) {
        webFeedback.classList.remove('hidden');
        feedbackText.textContent = text;
        feedbackText.className = `text-[10px] font-bold italic text-center ${type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`;
        setTimeout(() => webFeedback.classList.add('hidden'), 2000);
    }

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        // Draw Links
        establishedLinks.forEach(link => {
            ctx.strokeStyle = '#10b981'; ctx.lineWidth = 4; ctx.lineCap = 'round';
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(link.from.x, link.from.y);
            ctx.lineTo(link.to.x, link.to.y);
            ctx.stroke();

            // Energy Particles
            const time = Date.now() / 1000;
            const progress = (time) % 1;
            const px = link.to.x + (link.from.x - link.to.x) * progress; // Energy flows to predator
            const py = link.to.y + (link.from.y - link.to.y) * progress;
            ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI*2); ctx.fill();
        });

        // Active Linking Arrow
        if (activeLinkStart) {
            ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 3; ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(activeLinkStart.x, activeLinkStart.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        this.objects.forEach(o => o.draw(ctx));
    };

    resetBtn.onclick = () => {
        establishedLinks = [];
        updateStability();
        status.textContent = "Sẵn sàng";
    };

    engine.start();
}

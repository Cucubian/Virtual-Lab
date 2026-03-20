function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    engine.enableMatter(1.0);
    
    const { Bodies, Body, Composite } = Matter;
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    let pullForce = 20;
    let mu = 0.3;
    let mass = 5.0; // kg
    let isPulling = false;

    params.innerHTML = `
        <div class="space-y-6">
            <div class="glass-card p-5 border-none bg-slate-900 text-white shadow-xl">
                <h4 class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3 text-center">Thông số Động lực học</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-center">
                        <div class="text-[10px] text-rose-400 font-bold uppercase">Lực kéo (Fk)</div>
                        <div class="text-xl font-black italic tracking-tighter" id="valF">20 N</div>
                    </div>
                    <div class="text-center">
                        <div class="text-[10px] text-indigo-400 font-bold uppercase">Ma sát (Fms)</div>
                        <div class="text-xl font-black italic tracking-tighter" id="valFms">0 N</div>
                    </div>
                </div>
            </div>

            <div class="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-5">
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase text-slate-400">Lực kéo tác dụng (N)</label>
                    <input type="range" id="sliderF" min="0" max="100" value="20" class="w-full accent-rose-500">
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase text-slate-400">Hệ số ma sát (μ)</label>
                    <input type="range" id="sliderMu" min="0" max="1" step="0.05" value="0.3" class="w-full accent-indigo-500">
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase text-slate-400">Khối lượng vật (kg)</label>
                    <input type="range" id="sliderM" min="1" max="20" value="5" class="w-full accent-emerald-500">
                </div>
            </div>
        </div>
    `;

    const sliderF = document.getElementById('sliderF');
    const sliderMu = document.getElementById('sliderMu');
    const sliderM = document.getElementById('sliderM');
    const valF = document.getElementById('valF');
    const valFms = document.getElementById('valFms');

    const box = new LabObject(200, 360, 80, 50, '#f59e0b', 'rect');
    box.body = Bodies.rectangle(200, 360, 80, 50, { friction: 0, restitution: 0, label: 'box' });
    engine.addObject(box);

    const ground = Bodies.rectangle(400, 410, 800, 50, { isStatic: true });
    Composite.add(engine.matterEngine.world, ground);

    const updateParams = () => {
        pullForce = parseInt(sliderF.value);
        mu = parseFloat(sliderMu.value);
        mass = parseInt(sliderM.value);
        valF.textContent = pullForce + " N";
        Matter.Body.setMass(box.body, mass);
    };

    [sliderF, sliderMu, sliderM].forEach(s => s.oninput = updateParams);

    startBtn.onclick = () => {
        isPulling = !isPulling;
        startBtn.textContent = isPulling ? "🛑 Ngừng kéo" : "🚀 Tác dụng lực";
        startBtn.classList.toggle('bg-rose-500', isPulling);
        status.textContent = isPulling ? "Đang tác dụng lực kéo..." : "Đã ngừng lực kéo.";
    };

    resetBtn.onclick = () => {
        isPulling = false;
        startBtn.textContent = "🚀 Tác dụng lực";
        startBtn.classList.remove('bg-rose-500');
        Matter.Body.setPosition(box.body, { x: 200, y: 360 });
        Matter.Body.setVelocity(box.body, { x: 0, y: 0 });
        status.textContent = "Sẵn sàng";
    };

    engine.update = (dt) => {
        const b = box.body;
        const g = 9.8;
        const N = b.mass * g;
        const maxFms = mu * N;
        
        let currentFms = 0;
        if (isPulling) {
            // Apply Pulling Force
            Body.applyForce(b, b.position, { x: pullForce * 0.0005, y: 0 });
            
            // Apply Friction
            if (pullForce > maxFms || Math.abs(b.velocity.x) > 0.1) {
                currentFms = maxFms;
                Body.applyForce(b, b.position, { x: -currentFms * 0.0005 * Math.sign(b.velocity.x || 1), y: 0 });
            } else {
                currentFms = pullForce;
                Body.setVelocity(b, { x: 0, y: b.velocity.y });
            }
        } else if (Math.abs(b.velocity.x) > 0.1) {
            currentFms = maxFms;
            Body.applyForce(b, b.position, { x: -currentFms * 0.0005 * Math.sign(b.velocity.x), y: 0 });
        } else {
            Body.setVelocity(b, { x: 0, y: b.velocity.y });
        }

        valFms.textContent = currentFms.toFixed(1) + " N";

        // Boundary
        if (b.position.x > 750) Body.setPosition(b, { x: 50, y: b.position.y });
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;
        
        // Ground line
        ctx.fillStyle = '#475569';
        ctx.fillRect(0, 385, this.width, 100);

        this.objects.forEach(o => o.draw(ctx));

        // Draw Forces
        const b = box.body;
        const bx = b.position.x;
        const by = b.position.y;

        // Fk
        if (isPulling) {
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(bx + 40, by); ctx.lineTo(bx + 40 + pullForce, by); ctx.stroke();
            ctx.fillStyle = '#f43f5e'; ctx.fillText('Fk', bx + 45 + pullForce, by);
        }

        // Fms
        const fmsVal = parseFloat(valFms.textContent);
        if (fmsVal > 0) {
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(bx - 40, by + 10); ctx.lineTo(bx - 40 - fmsVal, by + 10); ctx.stroke();
            ctx.fillStyle = '#6366f1'; ctx.fillText('Fms', bx - 60 - fmsVal, by + 15);
        }
    };

    updateParams();
    engine.start();
}

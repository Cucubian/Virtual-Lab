function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    engine.enableMatter(0.5); // Slow gravity for measurement precision
    
    const { Bodies, Body, Composite, Constraint } = Matter;
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    startBtn.style.display = 'none'; // No start needed, real-time interactive

    let objDensity = 2.5; // g/cm3 (Iron/Stone)
    let liqDensity = 1.0; // Water
    let displacedVolume = 0;

    params.innerHTML = `
        <div class="space-y-6">
            <div class="glass-card p-5 border-none bg-slate-900 text-white shadow-xl">
                <h4 class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3 text-center">Bảng số liệu thực tế</h4>
                <div class="space-y-3">
                    <div class="flex justify-between text-xs">
                        <span class="text-slate-400">Trọng lượng (không khí):</span>
                        <span id="weight-air" class="font-bold text-rose-400">0.00 N</span>
                    </div>
                    <div class="flex justify-between text-xs">
                        <span class="text-slate-400">Trọng lượng (trong nước):</span>
                        <span id="weight-water" class="font-bold text-indigo-400">0.00 N</span>
                    </div>
                    <div class="h-px bg-slate-700 my-2"></div>
                    <div class="flex justify-between text-sm">
                        <span class="text-indigo-200 font-bold tracking-tight">Lực đẩy Archimedes:</span>
                        <span id="force-fa" class="font-black text-emerald-400 underline">0.00 N</span>
                    </div>
                </div>
            </div>

            <div class="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div class="space-y-3">
                    <div class="flex justify-between items-center text-rose-500 font-black text-[10px] tracking-widest uppercase px-1">
                        <span>Chất liệu vật thể</span>
                        <select id="material-select" class="bg-transparent font-bold cursor-pointer outline-none">
                            <option value="2.7">Nhôm (2.7)</option>
                            <option value="7.8">Sắt (7.8)</option>
                            <option value="0.6">Gỗ (0.6)</option>
                            <option value="0.2">Xốp (0.2)</option>
                        </select>
                    </div>
                    <input type="range" id="sliderD" min="0.1" max="10.0" step="0.1" value="2.7" class="w-full accent-rose-500">
                </div>

                <div class="space-y-3">
                    <div class="flex justify-between items-center text-indigo-500 font-black text-[10px] tracking-widest uppercase px-1">
                        <span>Dung dịch thí nghiệm</span>
                        <span id="valL">Nước (1.0)</span>
                    </div>
                    <select id="liq-select" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer">
                        <option value="1.0" selected>Nước nguyên chất (1.0)</option>
                        <option value="1.2">Nước muối đặc (1.2)</option>
                        <option value="0.8">Rượu cồn (0.8)</option>
                        <option value="13.6">Thủy ngân (13.6)</option>
                    </select>
                </div>
            </div>
        </div>
    `;

    const sliderD = document.getElementById('sliderD');
    const matSelect = document.getElementById('material-select');
    const liqSelect = document.getElementById('liq-select');
    const weightAirLabel = document.getElementById('weight-air');
    const weightWaterLabel = document.getElementById('weight-water');
    const faLabel = document.getElementById('force-fa');

    const updateParams = () => {
        objDensity = parseFloat(sliderD.value);
        if (box.body) {
            const vol = box.width * box.height;
            Matter.Body.setMass(box.body, vol * objDensity * 0.0001);
        }
    };

    sliderD.oninput = () => {
        matSelect.value = "custom";
        updateParams();
    };
    matSelect.onchange = (e) => {
        if (e.target.value !== "custom") {
            sliderD.value = e.target.value;
            updateParams();
        }
    };
    liqSelect.onchange = (e) => {
        liqDensity = parseFloat(e.target.value);
        document.getElementById('valL').textContent = liqSelect.options[liqSelect.selectedIndex].text.split(' ')[0] + ` (${liqDensity})`;
    };

    // Box to be measured
    const box = new LabObject(300, 150, 60, 60, '#f59e0b', 'rect');
    box.body = Bodies.rectangle(300, 150, 60, 60, { 
        frictionAir: 0.1, 
        label: 'object',
        mass: 3600 * objDensity * 0.0001
    });
    box.draggable = true;
    engine.addObject(box);

    const tankX = 300;
    const tankY = 400;
    const tankW = 200;
    const tankH = 180;
    const waterLevel = tankY - (tankH / 2) + 40;

    // Create Tank Physics
    // We add 3 thin static boxes for left, right and bottom
    const floor = Bodies.rectangle(tankX, tankY + tankH/2, tankW, 10, { isStatic: true });
    const wallL = Bodies.rectangle(tankX - tankW/2, tankY, 10, tankH, { isStatic: true });
    const wallR = Bodies.rectangle(tankX + tankW/2, tankY, 10, tankH, { isStatic: true });
    Composite.add(engine.matterEngine.world, [floor, wallL, wallR]);

    resetBtn.onclick = () => {
        Body.setPosition(box.body, { x: 300, y: 150 });
        Body.setVelocity(box.body, { x: 0, y: 0 });
        Body.setAngle(box.body, 0);
        status.textContent = "Kéo vật thả vào nước để đo.";
    };

    engine.update = (dt) => {
        const b = box.body;
        // Gravity force (calibrated for N units display)
        const g = 0.001 * b.mass * engine.matterEngine.gravity.y;
        const P = b.mass * 9.8; // Fictional N
        weightAirLabel.textContent = P.toFixed(2) + " N";

        let faN = 0;
        if (b.position.y + 30 > waterLevel) {
            // Percent submerged
            const submergedH = Math.max(0, Math.min(60, (b.position.y + 30) - waterLevel));
            const subRatio = submergedH / 60;
            
            // F_A = d_l * V_sub
            // To make it clear: FA = (V_obj * Ratio) * d_l
            const V = 60 * 60; // 3600
            faN = (V * subRatio * 0.001) * liqDensity * 9.8; 
            
            // Apply upward force in Matter world
            const faMatter = 0.0015 * subRatio * liqDensity; 
            Body.applyForce(b, b.position, { x: 0, y: -faMatter });
            
            // Water drag
            Body.setVelocity(b, { 
                x: b.velocity.x * 0.95, 
                y: b.velocity.y * 0.9 
            });
        }

        const displayedWeight = Math.max(0, P - faN);
        weightWaterLabel.textContent = displayedWeight.toFixed(2) + " N";
        faLabel.textContent = faN.toFixed(2) + " N";

        if (faN > 0.1) {
            status.textContent = faN >= P ? "Vật đang nổi" : "Vật đang chìm";
            status.className = faN >= P ? "text-emerald-500 font-bold" : "text-rose-500 font-bold";
        } else {
            status.textContent = "Sẵn sàng đo trong không khí";
            status.className = "text-slate-400 font-medium";
        }
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        // 1. Draw Displacement Beaker Setup
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        // Main Tank (Bình tràn)
        ctx.strokeRect(tankX - tankW/2, tankY - tankH/2, tankW, tankH);
        
        // Overflow spout
        ctx.beginPath();
        ctx.moveTo(tankX + tankW/2, waterLevel + 5);
        ctx.lineTo(tankX + tankW/2 + 30, waterLevel + 15);
        ctx.stroke();

        // Water in tank
        ctx.fillStyle = 'rgba(186, 230, 253, 0.6)';
        ctx.fillRect(tankX - tankW/2 + 2, waterLevel, tankW - 4, (tankY + tankH/2) - waterLevel - 2);

        // Small beaker to catch overflow (Bình chứa nước tràn)
        const catchX = tankX + tankW/2 + 40;
        ctx.strokeStyle = '#94a3b8';
        ctx.strokeRect(catchX, 380, 60, 80);
        
        // Displaced water animation
        const b = box.body;
        if (b.position.y + 30 > waterLevel) {
            const h = Math.min(60, (b.position.y + 30) - waterLevel);
            const fillH = (h / 60) * 40; // Max 40px fill
            ctx.fillStyle = 'rgba(186, 230, 253, 0.8)';
            ctx.fillRect(catchX + 2, 460 - fillH, 56, fillH);
        }

        // 2. Spring Scale (Lực kế)
        const scaleX = b.position.x;
        const scaleY = 50;
        const scaleH = 150;
        
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        ctx.strokeRect(scaleX - 15, scaleY, 30, scaleH); // Scale body
        
        // Spring and measuring rod
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(scaleX, scaleY + 10);
        ctx.lineTo(scaleX, b.position.y - 30);
        ctx.stroke();

        // Measurement markers
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#cbd5e1';
        for (let i=0; i<=10; i++) {
            const my = scaleY + 20 + i * 12;
            ctx.beginPath(); ctx.moveTo(scaleX-10, my); ctx.lineTo(scaleX-5, my); ctx.stroke();
            ctx.fillStyle = '#64748b';
            ctx.font = '8px Inter';
            if(i % 2 === 0) ctx.fillText(i, scaleX + 5, my + 3);
        }

        // Indicator
        const P = b.mass * 9.8;
        const submergedH = Math.max(0, Math.min(60, (b.position.y + 30) - waterLevel));
        const subRatio = submergedH / 60;
        const faN = (3600 * subRatio * 0.001) * liqDensity * 9.8;
        const netF = Math.max(0, P - faN);
        
        // Scale pos: 0N at Y+20, 10N at Y+20+120
        const forcePos = Math.min(10, netF); 
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(scaleX - 15, scaleY + 20 + forcePos * 12);
        ctx.lineTo(scaleX + 15, scaleY + 20 + forcePos * 12);
        ctx.stroke();

        // 3. Draw Object
        this.objects.forEach(o => o.draw(ctx));

        // Forces vectors on physical object
        if (b.position.y + 30 > waterLevel - 50) {
            const cx = b.position.x;
            const cy = b.position.y;
            // P
            ctx.setLineDash([]);
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + 50); ctx.stroke();
            // FA
            if (faN > 0.1) {
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - 50 * (faN/P)); ctx.stroke();
            }
        }
    };

    engine.start();
}

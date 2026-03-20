function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    startBtn.style.display = 'none'; // Not needed for discovery-based exp

    let type = 'plant';

    params.innerHTML = `
        <div class="space-y-6">
            <div class="param-row">
                <label class="text-[10px] font-black uppercase text-slate-400 block mb-2">Loại tế bào:</label>
                <select id="cell-type" class="w-full p-3 rounded-xl border-2 border-slate-100 bg-white font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all">
                    <option value="plant">Tế bào Thực vật (Plant Cell)</option>
                    <option value="animal">Tế bào Động vật (Animal Cell)</option>
                </select>
            </div>

            <div id="info-card" class="glass-card p-6 border-l-4 border-emerald-500 bg-white shadow-xl hidden animate-fade-in">
                <h4 id="org-name" class="text-sm font-black text-slate-900 mb-1">Tên bào quan</h4>
                <p id="org-desc" class="text-[10px] text-slate-500 leading-relaxed">Mô tả chức năng bào quan.</p>
            </div>

            <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 italic">
                <p class="text-[11px] font-bold text-emerald-700">Hướng dẫn:</p>
                <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">Di chuyển chuột hoặc chạm vào các bào quan trong tế bào để khám phá tên và chức năng của chúng.</p>
            </div>
        </div>
    `;

    const infoCard = document.getElementById('info-card');
    const orgName = document.getElementById('org-name');
    const orgDesc = document.getElementById('org-desc');

    document.getElementById('cell-type').onchange = (e) => {
        type = e.target.value;
        createCell();
        infoCard.style.display = 'none';
        status.textContent = "Đã đổi sang " + (type === 'plant' ? "Tế bào Thực vật" : "Tế bào Động vật");
        status.className = "text-xs font-black text-emerald-500 tracking-widest uppercase";
    };

    class Organelle extends LabObject {
        constructor(x, y, w, h, config) {
            super(x, y, w, h, config.color, config.shape || 'rect');
            this.name = config.name;
            this.desc = config.desc;
            this.drawFn = config.drawFn;
        }
        isPointInside(px, py) {
            const hit = super.isPointInside(px, py);
            if (hit) {
                infoCard.style.display = 'block';
                orgName.textContent = this.name;
                orgDesc.textContent = this.desc;
            }
            return hit;
        }
        draw(ctx) {
            if (this.drawFn) {
                this.drawFn(ctx, this.x, this.y, this.width, this.height);
            } else {
                super.draw(ctx);
            }
        }
    }

    function createCell() {
        engine.objects = [];
        const cx = 400; const cy = 250;
        
        if (type === 'plant') {
            // Cell Wall
            engine.addObject(new LabObject(cx, cy, 340, 420, '#065f46'));
            // Membrane
            engine.addObject(new LabObject(cx, cy, 310, 390, '#10b981'));
            
            // Vacuole
            engine.addObject(new Organelle(cx, cy + 40, 180, 200, {
                name: "Không bào trung tâm",
                desc: "Chứa dịch tế bào, tạo áp suất trương giúp tế bào cứng cáp và dự trữ chất dinh dưỡng.",
                color: '#bae6fd'
            }));

            // Nucleus
            engine.addObject(new Organelle(cx - 80, cy - 120, 80, 80, {
                name: "Nhân tế bào",
                desc: "Trung tâm điều khiển mọi hoạt động sống, chứa vật chất di truyền (DNA).",
                shape: 'circle',
                color: '#7c3aed',
                drawFn: (ctx, x, y, w) => {
                    const r = w/2;
                    ctx.fillStyle = '#7c3aed'; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
                    ctx.fillStyle = '#4c1d95'; ctx.beginPath(); ctx.arc(x,y,r/3,0,Math.PI*2); ctx.fill();
                }
            }));

            // Chloroplasts
            const addChloroplast = (x, y) => {
                engine.addObject(new Organelle(x, y, 60, 40, {
                    name: "Lục lạp",
                    desc: "Nơi thực hiện quá trình quang hợp, chuyển hóa năng lượng ánh sáng thành năng lượng hóa học.",
                    color: '#15803d',
                    drawFn: (ctx, x, y, w, h) => {
                        ctx.fillStyle = '#15803d'; ctx.beginPath(); ctx.ellipse(x,y,w/2,h/2,0,0,Math.PI*2); ctx.fill();
                        ctx.strokeStyle = '#052c14'; ctx.lineWidth = 1;
                        for(let i=-1; i<=1; i++) {
                            ctx.beginPath(); ctx.moveTo(x-w/3, y + i*5); ctx.lineTo(x+w/3, y + i*5); ctx.stroke();
                        }
                    }
                }));
            };
            addChloroplast(cx + 90, cy - 100);
            addChloroplast(cx + 100, cy + 20);
            addChloroplast(cx - 100, cy + 80);

        } else {
            // Animal Membrane
            engine.addObject(new LabObject(cx, cy, 380, 380, '#fca5a5', 'circle'));

            // Nucleus
            engine.addObject(new Organelle(cx, cy, 100, 100, {
                name: "Nhân tế bào",
                desc: "Cấu trúc lớn nhất, bao bọc bởi màng nhân, chứa nhiễm sắc thể.",
                shape: 'circle',
                color: '#7c3aed',
                drawFn: (ctx, x, y, w) => {
                    const r = w/2;
                    ctx.fillStyle = '#7c3aed'; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
                    ctx.fillStyle = '#4c1d95'; ctx.beginPath(); ctx.arc(x,y,r/3,0,Math.PI*2); ctx.fill();
                }
            }));

            // Mitochondria
            const addMito = (x, y, rot) => {
                engine.addObject(new Organelle(x, y, 50, 30, {
                    name: "Ti thể",
                    desc: "Trạm năng lượng của tế bào, thực hiện quá trình hô hấp tế bào để tạo ra ATP.",
                    color: '#ef4444',
                    drawFn: (ctx, x, y, w, h) => {
                        ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
                        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.ellipse(0,0,w/2,h/2,0,0,Math.PI*2); ctx.fill();
                        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(-w/3, 0); ctx.lineTo(w/3, 0); 
                        ctx.bezierCurveTo(0, -h/2, 0, h/2, -w/3, 0); ctx.stroke();
                        ctx.restore();
                    }
                }));
            };
            addMito(cx + 120, cy - 80, 0.5);
            addMito(cx - 110, cy + 90, -0.8);
            addMito(cx + 50, cy + 130, 2.1);
        }
    }

    createCell();
    engine.start();
    status.textContent = "Khám phá cấu trúc tế bào";
    status.className = "text-xs font-black text-slate-500 tracking-widest uppercase";
}

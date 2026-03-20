function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    startBtn.textContent = "Kiểm tra";

    let equation = {
        reactants: [
            { id: 'H2', name: 'H₂', count: 2, atoms: { H: 2 }, current: 1 },
            { id: 'O2', name: 'O₂', count: 2, atoms: { O: 2 }, current: 1 }
        ],
        products: [
            { id: 'H2O', name: 'H₂O', count: 3, atoms: { H: 2, O: 1 }, current: 1 }
        ],
        formula: 'H₂ + O₂ → H₂O'
    };

    function renderParams() {
        params.innerHTML = `
            <div class="space-y-6">
                <div class="p-6 bg-slate-50 rounded-[24px] border border-slate-100 shadow-inner">
                    <h4 class="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">Cân bằng phương trình</h4>
                    <div class="flex flex-col gap-6">
                        ${equation.reactants.map((r, i) => `
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-black text-slate-700">${r.name}</span>
                                <div class="flex items-center gap-3">
                                    <button onclick="updateCoef('react', ${i}, -1)" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">-</button>
                                    <span class="w-6 text-center font-mono font-black text-indigo-600">${r.current}</span>
                                    <button onclick="updateCoef('react', ${i}, 1)" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">+</button>
                                </div>
                            </div>
                        `).join('')}
                        <div class="h-px bg-slate-200 w-full my-2"></div>
                        ${equation.products.map((p, i) => `
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-black text-slate-700">${p.name}</span>
                                <div class="flex items-center gap-3">
                                    <button onclick="updateCoef('prod', ${i}, -1)" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">-</button>
                                    <span class="w-6 text-center font-mono font-black text-indigo-600">${p.current}</span>
                                    <button onclick="updateCoef('prod', ${i}, 1)" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">+</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 italic">
                    <p class="text-[11px] font-bold text-indigo-700">Định luật Bảo toàn khối lượng:</p>
                    <p class="text-[10px] text-slate-500 mt-1 leading-relaxed">Số nguyên tử của mỗi nguyên tố ở hai vế phải bằng nhau.</p>
                </div>
            </div>
        `;
    }

    window.updateCoef = (type, index, delta) => {
        const item = type === 'react' ? equation.reactants[index] : equation.products[index];
        item.current = Math.max(1, Math.min(10, item.current + delta));
        renderParams();
    };

    function checkEquality() {
        const reactAtoms = {};
        const prodAtoms = {};

        equation.reactants.forEach(r => {
            Object.entries(r.atoms).forEach(([atom, count]) => {
                reactAtoms[atom] = (reactAtoms[atom] || 0) + (count * r.current);
            });
        });

        equation.products.forEach(p => {
            Object.entries(p.atoms).forEach(([atom, count]) => {
                prodAtoms[atom] = (prodAtoms[atom] || 0) + (count * p.current);
            });
        });

        const atoms = new Set([...Object.keys(reactAtoms), ...Object.keys(prodAtoms)]);
        let balanced = true;
        atoms.forEach(atom => {
            if (reactAtoms[atom] !== prodAtoms[atom]) balanced = false;
        });

        if (balanced) {
            status.textContent = "Chính xác! Phương trình đã được cân bằng.";
            status.className = "text-xs font-black text-emerald-500 tracking-widest uppercase";
        } else {
            status.textContent = "Chưa chính xác - Hãy đếm lại số nguyên tử.";
            status.className = "text-xs font-black text-rose-500 tracking-widest uppercase animate-pulse";
        }
    }

    startBtn.onclick = checkEquality;
    resetBtn.onclick = () => {
        equation.reactants.forEach(r => r.current = 1);
        equation.products.forEach(p => p.current = 1);
        renderParams();
        status.textContent = "Sẵn sàng";
        status.className = "text-xs font-black text-slate-500 tracking-widest uppercase";
    };

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        // Draw visualizer of atoms
        const drawAtoms = (items, startX, startY) => {
            let curX = startX;
            items.forEach(item => {
                for (let c = 0; c < item.current; c++) {
                    const row = Math.floor(c / 2);
                    const col = c % 2;
                    const x = curX + col * 30;
                    const y = startY + row * 30;

                    // Molecule grouping
                    ctx.fillStyle = 'rgba(226, 232, 240, 0.5)';
                    ctx.beginPath();
                    ctx.arc(x, y, 15, 0, Math.PI * 2);
                    ctx.fill();

                    // Atoms
                    Object.entries(item.atoms).forEach(([atom, count], idx) => {
                        ctx.fillStyle = atom === 'H' ? '#fff' : (atom === 'O' ? '#ef4444' : '#fbbf24');
                        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
                        for (let a = 0; a < count; a++) {
                            const ax = x + (Math.cos(a * 2.5) * 8);
                            const ay = y + (Math.sin(a * 2.5) * 8);
                            ctx.beginPath(); ctx.arc(ax, ay, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                        }
                    });
                }
                curX += 80;
            });
        };

        ctx.font = 'bold 30px Inter';
        ctx.fillStyle = '#1e293b';
        ctx.fillText('Vế tham gia', 100, 100);
        ctx.fillText('→', 380, 250);
        ctx.fillText('Vế sản phẩm', 450, 100);

        drawAtoms(equation.reactants, 80, 150);
        drawAtoms(equation.products, 450, 150);
    };

    renderParams();
    engine.start();
}

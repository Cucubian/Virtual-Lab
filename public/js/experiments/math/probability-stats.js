function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Mờ nút bắt đầu vì đây là mô phỏng tương tác thời gian thực
    startBtn.disabled = true;
    startBtn.classList.add('opacity-50', 'cursor-not-allowed', 'grayscale');
    startBtn.title = "Mô phỏng này tự động cập nhật khi bạn nhập số";

    let n = 5;
    let k = 3;
    let mode = 'permutation'; // Default to A

    const factorial = (n) => {
        if (n < 0) return 0;
        if (n === 0) return 1;
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        return res;
    };

    const A = (n, k) => factorial(n) / factorial(n - k);
    const C = (n, k) => A(n, k) / factorial(k);

    params.innerHTML = `
        <div class="space-y-6 max-w-full overflow-hidden">
            <div class="glass-card p-5 bg-slate-900 border-none text-white shadow-xl text-center">
                <h4 class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3">Kết quả tính toán</h4>
                <div id="result-display" class="text-3xl font-black tracking-tighter text-indigo-400 truncate">
                    A⁵₃ = 60
                </div>
                <div id="formula-display" class="mt-2 text-[10px] text-slate-400 font-medium italic truncate">
                    n! / (n-k)! = 5! / 2!
                </div>
            </div>

            <div class="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-5">
                <!-- Modes -->
                <div class="grid grid-cols-1 gap-2">
                    <button class="mode-btn p-3 rounded-xl border-2 text-left font-bold transition-all text-[11px] flex items-center justify-between group h-12" data-mode="arrangement">
                        <span class="flex items-center gap-2 truncate"><span class="w-5 h-5 flex items-center justify-center bg-rose-100 text-rose-600 rounded-md text-[9px] group-[.active]:bg-white">P</span> Hoán vị (n!)</span>
                        <span class="text-xs">🔄</span>
                    </button>
                    <button class="mode-btn active p-3 rounded-xl border-2 text-left font-bold transition-all text-[11px] flex items-center justify-between group h-12" data-mode="permutation">
                        <span class="flex items-center gap-2 truncate"><span class="w-5 h-5 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-md text-[9px] group-[.active]:bg-white">A</span> Chỉnh hợp (A)</span>
                        <span class="text-xs">📋</span>
                    </button>
                    <button class="mode-btn p-3 rounded-xl border-2 text-left font-bold transition-all text-[11px] flex items-center justify-between group h-12" data-mode="combination">
                        <span class="flex items-center gap-2 truncate"><span class="w-5 h-5 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-md text-[9px] group-[.active]:bg-white">C</span> Tổ hợp (C)</span>
                        <span class="text-xs">📦</span>
                    </button>
                </div>

                <div class="space-y-4 pt-4 border-t border-slate-50">
                    <div class="space-y-2">
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng số phần tử (n)</label>
                        <div class="relative">
                            <input type="number" id="input-n" min="1" max="15" value="5" class="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                        </div>
                    </div>

                    <div id="k-control" class="space-y-2">
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Số chọn lựa (k)</label>
                        <div class="relative">
                            <input type="number" id="input-k" min="0" max="5" value="3" class="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-rose-600 focus:ring-2 focus:ring-rose-500 outline-none transition-all">
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="explanation-text" class="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[11px] text-indigo-700 leading-relaxed italic">
                <b>Chỉnh hợp:</b> Chọn k phần tử từ n phần tử <u>có phân biệt thứ tự</u>.
            </div>
        </div>
    `;

    const inputN = document.getElementById('input-n');
    const inputK = document.getElementById('input-k');
    const resultDisplay = document.getElementById('result-display');
    const formulaDisplay = document.getElementById('formula-display');
    const explanationText = document.getElementById('explanation-text');
    const modeBtns = document.querySelectorAll('.mode-btn');

    const updateUI = () => {
        n = parseInt(inputN.value) || 0;
        inputK.max = n;
        k = Math.min(parseInt(inputK.value) || 0, n);
        inputK.value = k;
        
        document.getElementById('k-control').style.display = (mode === 'arrangement') ? 'none' : 'block';

        if (mode === 'arrangement') {
            const res = factorial(n);
            resultDisplay.innerText = `P${n} = ${res}`;
            formulaDisplay.innerText = `${n}! = ${n} x ... x 1`;
            explanationText.innerHTML = `<b>Hoán vị:</b> Đổi chỗ <u>tất cả</u> n phần tử.`;
        } else if (mode === 'permutation') {
            const res = A(n, k);
            resultDisplay.innerHTML = `A<sup>${k}</sup><sub>${n}</sub> = ${res}`;
            formulaDisplay.innerText = `${n}! / (${n}-${k})!`;
            explanationText.innerHTML = `<b>Chỉnh hợp:</b> Chọn ${k} từ ${n} <u>có phân biệt thứ tự</u>. Tuyệt vời cho xếp hàng, trao giải.`;
        } else if (mode === 'combination') {
            const res = C(n, k);
            resultDisplay.innerHTML = `C<sup>${k}</sup><sub>${n}</sub> = ${res}`;
            formulaDisplay.innerText = `${n}! / (${k}! x (${n}-${k})!)`;
            explanationText.innerHTML = `<b>Tổ hợp:</b> Chọn ${k} từ ${n} <u>không phân biệt thứ tự</u>. Tuyệt vời cho chọn nhóm, bốc thăm.`;
        }
        
        modeBtns.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active', 'border-indigo-600', 'bg-indigo-50', 'text-indigo-600');
            } else {
                btn.classList.remove('active', 'border-indigo-600', 'bg-indigo-50', 'text-indigo-600');
            }
        });
    };

    modeBtns.forEach(btn => {
        btn.onclick = () => {
            mode = btn.dataset.mode;
            updateUI();
        };
    });

    [inputN, inputK].forEach(input => {
        input.oninput = updateUI;
    });

    resetBtn.onclick = () => {
        mode = 'permutation';
        inputN.value = 5;
        inputK.value = 3;
        updateUI();
        status.textContent = "Đã đặt lại mặc định.";
    };

    updateUI();

    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = 100;
        
        for (let i = 0; i < n; i++) {
            const angle = (i / n) * Math.PI * 2 - Math.PI/2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            const isSelected = (mode === 'arrangement') || (i < k);
            ctx.fillStyle = isSelected ? '#6366f1' : '#e2e8f0';
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fill();
            
            if (isSelected) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            
            ctx.fillStyle = isSelected ? '#fff' : '#94a3b8';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(i + 1, x, y + 5);
        }
    };

    engine.start();
    status.textContent = "Điều chỉnh n và k để xem kết quả tính toán tổ hợp xác suất.";
}

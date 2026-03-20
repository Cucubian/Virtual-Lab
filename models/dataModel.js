const subjects = [
    { id: 'math', name: 'Toán học', icon: '📐', color: 'bg-blue-500' },
    { id: 'physics', name: 'Vật lý', icon: '⚛️', color: 'bg-indigo-500' },
    { id: 'chemistry', name: 'Hóa học', icon: '🧪', color: 'bg-emerald-500' },
    { id: 'biology', name: 'Sinh học', icon: '🌿', color: 'bg-amber-500' }
];

const experiments = [
    // --- TOÁN HỌC ---
    {
        id: 'triangle-centers',
        subject: 'math',
        title: 'Bốn điểm đặc biệt',
        description: 'Trọng tâm, Trực tâm, Tâm ngoại tiếp & Nội tiếp.',
        goal: 'Khám phá các điểm đặc biệt trong tam giác và đường thẳng Euler.',
        theory: 'Mỗi điểm có tính chất hình học riêng biệt: giao điểm trung tuyến, đường cao, trung trực và phân giác.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4"> Các điểm đặc biệt trong Tam giác</h4>
                    <p class="text-slate-700 leading-relaxed border-b border-slate-100 pb-4">Một tam giác có 4 loại điểm hội tụ quan trọng, mỗi loại mang một ý nghĩa toán học sâu sắc:</p>
                </section>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="p-8 bg-white rounded-[32px] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group">
                        <div class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">🎯</div>
                        <h5 class="text-xl font-black text-slate-800 mb-3">Trọng tâm (G)</h5>
                        <p class="text-sm text-slate-500 leading-relaxed font-medium">Là giao điểm của 3 đường <b>Trung tuyến</b>. Trọng tâm chia mỗi đường trung tuyến thành 2 phần: phần từ đỉnh đến G bằng 2/3 độ dài đường đó.</p>
                    </div>

                    <div class="p-8 bg-white rounded-[32px] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group">
                        <div class="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">📐</div>
                        <h5 class="text-xl font-black text-slate-800 mb-3">Trực tâm (H)</h5>
                        <p class="text-sm text-slate-500 leading-relaxed font-medium">Là giao điểm của 3 đường <b>Cao</b>. Đối với tam giác tù, trực tâm nằm ngoài tam giác. Đối với tam giác vuông, trực tâm trùng với đỉnh góc vuông.</p>
                    </div>

                    <div class="p-8 bg-white rounded-[32px] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group">
                        <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">⭕</div>
                        <h5 class="text-xl font-black text-slate-800 mb-3">Tâm ngoại tiếp (O)</h5>
                        <p class="text-sm text-slate-500 leading-relaxed font-medium">Là giao điểm của 3 đường <b>Trung trực</b>. Điểm O cách đều 3 đỉnh của tam giác, là tâm của đường tròn đi qua 3 đỉnh.</p>
                    </div>

                    <div class="p-8 bg-white rounded-[32px] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group">
                        <div class="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">📍</div>
                        <h5 class="text-xl font-black text-slate-800 mb-3">Tâm nội tiếp (I)</h5>
                        <p class="text-sm text-slate-500 leading-relaxed font-medium">Là giao điểm của 3 đường <b>Phân giác</b>. Điểm I cách đều 3 cạnh của tam giác, là tâm của đường tròn tiếp xúc với 3 cạnh.</p>
                    </div>
                </div>

                <section class="p-10 bg-slate-900 text-white rounded-[40px] shadow-2xl relative overflow-hidden">
                    <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-3xl rotate-45"></div>
                    <h4 class="text-2xl font-black mb-6 text-indigo-400 underline underline-offset-8">✨ Đường thẳng Euler</h4>
                    <p class="text-sm opacity-90 leading-relaxed">Trong mọi tam giác, Trọng tâm G, Trực tâm H và Tâm ngoại tiếp O cùng nằm trên một đường thẳng, gọi là <b>Đường thẳng Euler</b>. Đặc biệt, HG = 2GO.</p>
                </section>
            </div>
        `,
        instructions: 'Kéo các đỉnh tam giác và bật từng chế độ để tìm các điểm G, H, O, I.',
        jsModule: 'math/triangle-centers.js'
    },
    {
        id: 'pythagoras',
        subject: 'math',
        title: 'Định lý Pythagoras',
        description: 'Chứng minh a² + b² = c².',
        goal: 'Hiểu mối quan hệ giữa các cạnh trong tam giác vuông.',
        theory: 'Trong một tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4">Phát biểu Định lý</h4>
                    <p class="text-slate-700 leading-relaxed border-b border-slate-100 pb-4">"Trong một tam giác vuông, bình phương của cạnh huyền bằng tổng bình phương của hai cạnh góc vuông."</p>
                </section>
                <div class="p-8 bg-slate-900 text-white rounded-[40px] text-center shadow-2xl">
                    <p class="text-4xl font-black tracking-widest text-indigo-400">a² + b² = c²</p>
                </div>
            </div>
        `,
        instructions: 'Thay đổi độ dài hai cạnh góc vuông và nhấn Bắt đầu để quan sát sự chuyển đổi diện tích.',
        jsModule: 'math/pythagoras.js'
    },
    {
        id: 'triangle-angles',
        subject: 'math',
        title: 'Tổng ba góc tam giác',
        description: 'Tổng ba góc luôn bằng 180°.',
        goal: 'Chứng minh định lý về tổng các góc trong một tam giác.',
        theory: 'Tổng số đo ba góc trong của một tam giác bất kỳ luôn bằng 180° (một góc bẹt).',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4">Định lý Tổng ba góc</h4>
                    <p class="text-slate-700 leading-relaxed border-b border-slate-100 pb-4">Với mọi tam giác ABC, ta luôn có: ∠A + ∠B + ∠C = 180°.</p>
                </section>
                <div class="p-8 bg-indigo-50 rounded-[40px] border border-indigo-100 text-center">
                    <p class="text-2xl font-black text-indigo-700">∠Internal = 180°</p>
                </div>
            </div>
        `,
        instructions: 'Kéo các đỉnh để thay đổi hình dạng tam giác, nhấn Bắt đầu để quan sát phép ghép góc.',
        jsModule: 'math/triangle-angles.js'
    },
    {
        id: 'inscribed-angle',
        subject: 'math',
        title: 'Góc nội tiếp & Ở tâm',
        description: 'Quan hệ giữa các loai góc trong đường tròn.',
        goal: 'Hiểu tính chất góc nội tiếp và góc ở tâm cùng chắn một cung.',
        theory: 'Số đo của góc nội tiếp bằng nửa số đo của góc ở tâm cùng chắn một cung.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4">Định nghĩa</h4>
                    <p class="text-slate-700 leading-relaxed">Góc có đỉnh nằm trên đường tròn và hai cạnh chứa hai dây cung của đường tròn đó gọi là góc nội tiếp.</p>
                </section>
                <section class="p-8 bg-indigo-50 rounded-[40px] border border-indigo-100">
                    <h5 class="font-black text-indigo-700 mb-4">📐 Tính chất:</h5>
                    <p class="text-sm font-bold text-slate-600">∠Nội_tiếp = 1/2 ∠Ở_tâm (Cùng chắn một cung)</p>
                </section>
            </div>
        `,
        instructions: 'Kéo các điểm A, B, M trên đường tròn để thay đổi số đo các góc.',
        jsModule: 'math/inscribed-angle.js'
    },
    {
        id: 'linear-graph',
        subject: 'math',
        title: 'Đồ thị y = ax + b',
        description: 'Khảo sát hàm số bậc nhất.',
        goal: 'Hiểu sự thay đổi của đường thẳng qua các hệ số đầu vào.',
        theory: 'a là hệ số góc (độ dốc), b là cao độ gốc (cắt trục tung).',
        theoryDetailed: `
            <div class="space-y-8">
                <section>
                    <h4 class="text-xl font-black text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4">Định nghĩa Hàm số bậc nhất</h4>
                    <p class="text-slate-700 leading-relaxed">Hàm số bậc nhất có dạng tổng quát <b>y = ax + b</b> (với a ≠ 0). Đồ thị của hàm số này luôn là một <b>đường thẳng</b> trong mặt phẳng tọa độ Oxy.</p>
                </section>
                <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <h5 class="font-black text-indigo-700 mb-2 underline decoration-2">Hệ số góc (a)</h5>
                        <p class="text-sm text-slate-600 italic leading-relaxed">Quyết định độ dốc của đường thẳng so với trục hoành:</p>
                        <ul class="mt-4 space-y-2 text-xs font-bold text-slate-500">
                            <li>• a > 0: Hàm số đồng biến (đi lên).</li>
                            <li>• a < 0: Hàm số nghịch biến (đi xuống).</li>
                            <li>• |a| càng lớn: Đường thẳng càng dốc.</li>
                        </ul>
                    </div>
                    <div class="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                        <h5 class="font-black text-rose-700 mb-2 underline decoration-2">Cao độ gốc (b)</h5>
                        <p class="text-sm text-slate-600 italic leading-relaxed">Quyết định vị trí cắt của đường thẳng với trục tung (Oy):</p>
                        <ul class="mt-4 space-y-2 text-xs font-bold text-slate-500">
                            <li>• Giao điểm luôn là (0, b).</li>
                            <li>• Nếu b = 0: Đường thẳng đi qua gốc tọa độ O(0,0).</li>
                        </ul>
                    </div>
                </section>
                <section class="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 class="font-black text-slate-800 mb-3">📍 Cách vẽ đồ thị</h4>
                    <p class="text-sm text-slate-700 leading-relaxed">Cách đơn giản nhất là xác định 2 điểm đặc biệt:</p>
                    <ol class="list-decimal ml-6 mt-2 text-sm text-slate-600 space-y-2 font-medium">
                        <li>Cho x = 0 ⇒ y = b (Điểm trên trục tung)</li>
                        <li>Cho y = 0 ⇒ x = -b/a (Điểm trên trục hoành)</li>
                    </ol>
                </section>
            </div>
        `,
        instructions: 'Nhập trực tiếp giá trị a và b để quan sát sự thay đổi của đồ thị.',
        jsModule: 'math/linear-graph.js'
    },
    {
        id: 'quadratic-graph',
        subject: 'math',
        title: 'Đồ thị y = ax² + bx + c',
        description: 'Khảo sát hàm số bậc hai (Parabol).',
        goal: 'Hiểu vai trò của hệ số a, b, c và biệt thức Delta.',
        theory: 'Đồ thị là một đường cong Parabol. Bề lõm phụ thuộc vào dấu của a.',
        theoryDetailed: `
            <div class="space-y-8">
                <section>
                    <h4 class="text-xl font-black text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4">Đặc điểm đường Parabol</h4>
                    <p class="text-slate-700 leading-relaxed">Đồ thị hàm số <b>y = ax² + bx + c</b> (a ≠ 0) là một đường cong đối xứng gọi là <b>Parabol</b>.</p>
                </section>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section class="p-6 bg-indigo-50 rounded-2xl shadow-sm border border-indigo-100">
                        <h5 class="font-black text-indigo-700 mb-3">Hệ số a & Bề lõm</h5>
                        <ul class="space-y-3 text-sm font-medium text-slate-600">
                            <li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-indigo-400"></span> a > 0: Bề lõm hướng lên (Dạng chữ U)</li>
                            <li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-indigo-400"></span> a < 0: Bề lõm hướng xuống (Dạng chữ n)</li>
                        </ul>
                    </section>
                    <section class="p-6 bg-rose-50 rounded-2xl shadow-sm border border-rose-100">
                        <h5 class="font-black text-rose-700 mb-3">Tọa độ Đỉnh (I)</h5>
                        <div class="bg-white p-4 rounded-xl text-center border border-rose-200">
                            <p class="font-black text-slate-800 tracking-widest italic">I ( -b/2a , -Δ/4a )</p>
                        </div>
                        <p class="text-xs text-rose-500 mt-2 italic text-center">Đỉnh I là điểm cực đại hoặc cực tiểu của hàm số.</p>
                    </section>
                </div>
                <section>
                    <h4 class="text-xl font-black text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4">2. Ý nghĩa của Biệt thức Delta (Δ)</h4>
                    <p class="text-sm text-slate-600 mb-4">Δ = b² - 4ac quyết định số giao điểm của Parabol với trục hoành (Ox):</p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="p-4 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                            <b class="text-emerald-700">Δ > 0</b><br/><span class="text-xs">2 giao điểm phân biệt</span>
                        </div>
                        <div class="p-4 bg-amber-50 rounded-xl text-center border border-amber-100">
                            <b class="text-amber-700">Δ = 0</b><br/><span class="text-xs">Tiếp xúc (1 điểm)</span>
                        </div>
                        <div class="p-4 bg-rose-50 rounded-xl text-center border border-rose-100">
                            <b class="text-rose-700">Δ < 0</b><br/><span class="text-xs">Không cắt trục hoành</span>
                        </div>
                    </div>
                </section>
            </div>
        `,
        instructions: 'Điều chỉnh thanh trượt các hệ số a, b, c và quan sát đỉnh của Parabol.',
        jsModule: 'math/quadratic-graph.js'
    },
    {
        id: 'probability-stats',
        subject: 'math',
        title: 'Hoán vị - Chỉnh hợp - Tổ hợp',
        description: 'Tính toán các phương cách chọn phần tử.',
        goal: 'Phân biệt ý nghĩa của P, A và C trong toán học.',
        theory: 'Hoán vị (n!), Chỉnh hợp (A) có thứ tự, Tổ hợp (C) không thứ tự.',
        theoryDetailed: `
            <div class="space-y-10">
                <section class="p-8 bg-indigo-900 text-white rounded-[32px] shadow-2xl relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-2xl"></div>
                    <h4 class="text-2xl font-black mb-6 flex items-center gap-3"><span class="bg-indigo-500 w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg">1</span> Hoán vị (Permutation)</h4>
                    <p class="opacity-80 leading-relaxed mb-6 italic">Sắp xếp <b>tất cả</b> n phần tử vào n vị trí khác nhau. Thứ tự thay đổi tạo ra cách sắp xếp mới.</p>
                    <div class="bg-indigo-800/50 p-6 rounded-2xl border border-indigo-400/30 text-center">
                        <p class="text-3xl font-black tracking-widest text-indigo-200">Pn = n!</p>
                        <p class="text-xs opacity-60 mt-2 uppercase tracking-widest">(n! = n x (n-1) x ... x 1)</p>
                    </div>
                </section>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section class="p-8 bg-white rounded-[32px] border border-slate-100 shadow-xl">
                        <h4 class="text-xl font-black text-slate-800 mb-4 flex items-center gap-3"><span class="bg-rose-100 text-rose-600 w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm">2</span> Chỉnh hợp</h4>
                        <p class="text-slate-500 text-sm leading-relaxed mb-6 font-medium">Chọn k phần tử từ n phần tử <b>có phân biệt thứ tự</b> sắp xếp.</p>
                        <div class="bg-rose-50 p-6 rounded-2xl border border-rose-100 text-center mb-6">
                            <p class="text-2xl font-black text-rose-600">A<sup>k</sup><sub>n</sub> = n! / (n-k)!</p>
                        </div>
                        <p class="text-[11px] text-slate-400 font-bold uppercase tracking-widest">💡 Ví dụ: Chọn 3 người chạy nhanh nhất trao giải Nhất, Nhì, Ba.</p>
                    </section>

                    <section class="p-8 bg-white rounded-[32px] border border-slate-100 shadow-xl">
                        <h4 class="text-xl font-black text-slate-800 mb-4 flex items-center gap-3"><span class="bg-emerald-100 text-emerald-600 w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm">3</span> Tổ hợp</h4>
                        <p class="text-slate-500 text-sm leading-relaxed mb-6 font-medium">Chọn k phần tử từ n phần tử <b>không quan tâm thứ tự</b>.</p>
                        <div class="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center mb-6">
                            <p class="text-2xl font-black text-emerald-600">C<sup>k</sup><sub>n</sub> = n! / (k!(n-k)!)</p>
                        </div>
                        <p class="text-[11px] text-slate-400 font-bold uppercase tracking-widest">💡 Ví dụ: Chọn ngẫu nhiên 5 bạn trong lớp đi lao động.</p>
                    </section>
                </div>

                <section class="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <h5 class="text-slate-800 font-black mb-2">📌 Phân biệt A và C:</h5>
                    <p class="text-sm text-slate-600 font-medium leading-relaxed">Hãy tự hỏi: <b>"Nếu đổi chỗ các phần tử đã chọn, kết quả có thay đổi không?"</b><br/>
                    • Có ⇒ Dùng Chỉnh hợp (A)<br/>
                    • Không ⇒ Dùng Tổ hợp (C)</p>
                </section>
            </div>
        `,
        instructions: 'Chọn chế độ và thay đổi n, k để xem công thức và kết quả tính toán.',
        jsModule: 'math/probability-stats.js'
    },
    {
        id: 'probability-coin',
        subject: 'math',
        title: 'Xác suất thực nghiệm',
        description: 'Tung đồng xu và luật số lớn.',
        goal: 'Quan sát tần suất xuất hiện mặt ngửa/sấp.',
        theory: 'Khi số lần thử tăng lên, xác suất thực nghiệm tiến gần đến lý thuyết (0.5).',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4">Luật Số Lớn </h4>
                    <p class="text-slate-700 leading-relaxed">Trong lý thuyết xác suất, luật số lớn diễn tả kết quả của việc thực hiện cùng một thí nghiệm nhiều lần.</p>
                </section>
                <div class="p-8 bg-indigo-50 rounded-[40px] border border-indigo-100 text-center">
                    <p class="text-lg text-indigo-700 font-black italic">"Khi n càng lớn, tần suất thực nghiệm càng tiến sát xác suất lý thuyết (50%)"</p>
                </div>
            </div>
        `,
        instructions: 'Nhấn tung xu hoặc tung 100 lần để thấy tỉ lệ phần trăm.',
        jsModule: 'math/probability-coin.js'
    },

    // --- VẬT LÝ ---
    {
        id: 'free-fall',
        subject: 'physics',
        title: 'Sự rơi tự do',
        description: 'Mọi vật rơi như nhau trong chân không.',
        goal: 'Học về sự rơi của các vật trong ống Niutơn.',
        theory: 'Mọi vật rơi như nhau trong chân không dưới tác động của trọng lực.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4">Thí nghiệm Ống Niutơn</h4>
                    <p class="text-slate-700 leading-relaxed border-b border-slate-100 pb-4">
                        Nhà bác học Isaac Newton đã dùng một ống thủy tinh kín, bên trong chứa một đồng tiền và một chiếc lông vũ để thí nghiệm. 
                    </p>
                </section>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section class="p-8 bg-indigo-50 rounded-[32px] border border-indigo-100">
                        <h5 class="font-black text-indigo-700 mb-4 flex items-center gap-2">🌬️ Trong không khí</h5>
                        <p class="text-sm text-slate-600 leading-relaxed">
                            Lực cản của không khí tác động lên vật nhẹ (lông vũ) lớn hơn nhiều so với vật nặng (đồng tiền). Kết quả là đồng tiền rơi nhanh hơn.
                        </p>
                    </section>
                    <section class="p-8 bg-slate-900 text-white rounded-[32px] shadow-xl">
                        <h5 class="font-black text-indigo-400 mb-4">🌌 Trong chân không</h5>
                        <p class="text-sm opacity-80 leading-relaxed">
                            Khi hút hết không khí, không còn lực cản. Mọi vật, dù nặng hay nhẹ, đều rơi với cùng một gia tốc <b>g ≈ 9.8 m/s²</b> và chạm đáy cùng lúc.
                        </p>
                    </section>
                </div>

                <div class="p-8 bg-rose-50 rounded-[40px] border border-rose-100 italic">
                    <p class="text-xs text-rose-700 font-bold uppercase tracking-widest mb-2">💡 Kết luận quan trọng:</p>
                    <p class="text-sm text-rose-600 font-medium">Sự rơi của các vật chỉ dưới tác dụng của trọng lực gọi là <b>Sự rơi tự do</b>. Gia tốc rơi tự do không phụ thuộc vào khối lượng của vật.</p>
                </div>
            </div>
        `,
        instructions: 'Nhấn nút "Hút chân không" để giảm áp suất, sau đó nhấn "Đảo ống" để bắt đầu rơi.',
        jsModule: 'physics/free-fall.js'
    },
    {
        id: 'pendulum',
        subject: 'physics',
        title: 'Con lắc đơn',
        description: 'Dao động của vật nặng treo dây.',
        goal: 'Khảo sát chu kỳ dao động phụ thuộc vào chiều dài dây.',
        theory: 'Chu kỳ T = 2π√(l/g) với l là chiều dài dây treo.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4">Cấu tạo và Dao động</h4>
                    <p class="text-slate-700 leading-relaxed">
                        Con lắc đơn gồm một vật nặng có khối lượng m, treo vào đầu một sợi dây nhẹ, không dãn có chiều dài l. Khi kéo vật lệch khỏi vị trí cân bằng rồi thả ra, nó sẽ thực hiện <b>dao động tuần hoàn</b>.
                    </p>
                </section>

                <section class="p-10 bg-indigo-900 text-white rounded-[40px] shadow-2xl relative overflow-hidden text-center">
                    <h5 class="text-xl font-black text-indigo-300 mb-6">⏳ Chu kỳ dao động (T)</h5>
                    <p class="text-4xl font-black italic tracking-widest text-white">T = 2π √(l/g)</p>
                </section>
            </div>
        `,
        instructions: 'Thay đổi chiều dài dây và khối lượng để xem chu kỳ thay đổi.',
        jsModule: 'physics/pendulum.js'
    },
    {
        id: 'simple-circuit',
        subject: 'physics',
        title: 'Mạch điện đơn giản',
        description: 'Lắp mạch Pin - Đèn - Khóa.',
        goal: 'Hiểu dòng điện chạy trong mạch kín và định luật Ohm.',
        theory: 'Dòng điện I = U/R chạy từ cực dương sang cực âm của nguồn.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4">Định luật Ohm</h4>
                    <p class="text-slate-700 leading-relaxed italic">Cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế giữa hai đầu dây và tỉ lệ nghịch với điện trở của dây.</p>
                </section>
                <div class="p-8 bg-slate-900 text-white rounded-[40px] shadow-2xl text-center">
                    <p class="text-3xl font-black text-indigo-400">I = U / R</p>
                </div>
            </div>
        `,
        instructions: 'Kết nối các linh kiện bằng cách kéo thả và bật công tắc đèn.',
        jsModule: 'physics/simple-circuit.js'
    },
    {
        id: 'light-reflection',
        subject: 'physics',
        title: 'Phản xạ ánh sáng',
        description: 'Định luật phản xạ gương phẳng.',
        goal: 'Xác định quan hệ góc tới và góc phản xạ.',
        theory: 'Góc phản xạ i\' luôn luôn bằng góc tới i.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4">Định luật Phản xạ Ánh sáng</h4>
                    <p class="text-slate-700 leading-relaxed mb-6">Ánh sáng khi gặp bề mặt nhẵn (như gương phẳng) sẽ bị hắt trở lại môi trường cũ theo một quy luật xác định.</p>
                </section>
                <div class="p-8 bg-indigo-50 rounded-[40px] border border-indigo-100 shadow-sm">
                    <h5 class="font-black text-indigo-700 mb-4 flex items-center gap-3">📐 Nội dung định luật:</h5>
                    <ul class="space-y-4 text-sm font-medium text-slate-700 italic">
                        <li>• Tia phản xạ nằm trong mặt phẳng tới.</li>
                        <li>• <b>Góc tới = Góc phản xạ (i = i')</b>.</li>
                    </ul>
                </div>
            </div>
        `,
        instructions: 'Xoay nguồn sáng và quan sát góc phản xạ trên thước đo.',
        jsModule: 'physics/light-reflection.js'
    },
    {
        id: 'friction',
        subject: 'physics',
        title: 'Lực ma sát',
        description: 'Khám phá lực cản trên bề mặt nằm ngang.',
        goal: 'Hiểu về ma sát nghỉ và ma sát trượt.',
        theory: 'Lực ma sát Fms = μ.N',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4">Lực ma sát và Chuyển động</h4>
                    <p class="text-slate-700 leading-relaxed border-b border-slate-100 pb-4">
                        Lực ma sát xuất hiện ở mặt tiếp xúc của vật đang trượt trên một bề mặt, có hướng ngược hướng vận tốc.
                    </p>
                </section>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section class="p-8 bg-amber-50 rounded-[32px] border border-amber-100">
                        <h5 class="font-black text-amber-700 mb-4">🛡️ Ma sát nghỉ</h5>
                        <p class="text-sm text-slate-600 leading-relaxed">
                            Khi tác dụng lực kéo nhưng vật chưa chuyển động, đó là lúc ma sát nghỉ đang cân bằng với lực kéo. Độ lớn cực đại của nó là <b>Fms_max = μ_n.N</b>.
                        </p>
                    </section>
                    <section class="p-8 bg-indigo-900 text-white rounded-[32px] shadow-xl">
                        <h5 class="font-black text-indigo-300 mb-4">🚀 Ma sát trượt</h5>
                        <p class="text-sm opacity-80 leading-relaxed">
                            Khi lực kéo thắng được ma sát nghỉ cực đại, vật bắt đầu trượt. Lực ma sát trượt lúc này gần như không đổi: <b>Fms = μ.N</b>.
                        </p>
                    </section>
                </div>

                <div class="p-8 bg-slate-50 rounded-[40px] border border-slate-200">
                    <p class="text-xs text-slate-500 font-bold uppercase mb-2">📐 Công thức tính:</p>
                    <p class="text-2xl font-black text-slate-800 tracking-tighter italic">F<sub>ms</sub> = μ . N = μ . m . g</p>
                </div>
            </div>
        `,
        instructions: 'Thay đổi lực kéo, khối lượng và hệ số ma sát để xem vật có chuyển động hay không.',
        jsModule: 'physics/friction.js'
    },
    {
        id: 'archimedes',
        subject: 'physics',
        title: 'Lực đẩy Archimedes',
        description: 'Vật bị đẩy lên khi chìm trong chất lỏng.',
        goal: 'Tìm hiểu độ lớn lực đẩy phụ thuộc vào phần thể tích vật chìm chỗ.',
        theory: 'FA = d.V',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4">Định luật Archimedes</h4>
                    <p class="text-slate-700 leading-relaxed border-b border-slate-100 pb-4">
                        Một vật nhúng vào chất lỏng bị chất lỏng đẩy thẳng đứng từ dưới lên với lực có độ lớn bằng trọng lượng của phần chất lỏng mà vật chiếm chỗ.
                    </p>
                </section>
                <div class="p-8 bg-indigo-50 rounded-[40px] border border-indigo-100 text-center">
                    <p class="text-3xl font-black text-indigo-700">FA = d . V</p>
                </div>
            </div>
        `,
        instructions: 'Thả các vật khác nhau và quan sát lực đẩy FA.',
        jsModule: 'physics/archimedes.js'
    },
    {
        id: 'friction-inclined',
        subject: 'physics',
        title: 'Lực ma sát',
        description: 'Khám phá lực cản trên mặt phẳng nghiêng.',
        goal: 'Tìm hiểu điều kiện để vật bắt đầu trượt.',
        theory: 'Vật bắt đầu trượt khi tan(α) > μ.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4">Phân tích lực trên mặt phẳng nghiêng</h4>
                    <p class="text-slate-700 leading-relaxed border-b border-slate-100 pb-4">
                        Khi một vật nằm trên mặt phẳng nghiêng góc α, trọng lực P được phân tích thành 2 thành phần:
                    </p>
                    <ul class="mt-4 space-y-3 text-sm font-medium text-slate-600">
                        <li>• <b>P1 = P.sin(α)</b>: Thành phần kéo vật trượt xuống.</li>
                        <li>• <b>P2 = P.cos(α)</b>: Thành phần nén vật xuống mặt phẳng (gây ra áp lực N).</li>
                    </ul>
                </section>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section class="p-8 bg-indigo-50 rounded-[32px] border border-indigo-100">
                        <h5 class="font-black text-indigo-700 mb-4 flex items-center gap-2">🛡️ Điều kiện đứng yên</h5>
                        <p class="text-sm text-slate-600 leading-relaxed">
                            Vật đứng yên khi lực kéo <b>P1 ≤ Fms_nghỉ_max</b>. Với Fms_max = μ.N = μ.P.cos(α).
                        </p>
                    </section>
                    <section class="p-8 bg-slate-900 text-white rounded-[32px] shadow-xl">
                        <h5 class="font-black text-indigo-400 mb-4">🚀 Điều kiện trượt</h5>
                        <p class="text-sm opacity-80 leading-relaxed">
                            Vật bắt đầu trượt khi <b>P.sin(α) > μ.P.cos(α)</b>. Rút gọn ta được: <b>tan(α) > μ</b>.
                        </p>
                    </section>
                </div>
            </div>
        `,
        instructions: 'Thay đổi góc nghiêng α và quan sát khi nào thì vật bắt đầu trượt.',
        jsModule: 'physics/friction.js'
    },
    {
        id: 'lever-balance',
        subject: 'physics',
        title: 'Cân bằng đòn bẩy',
        description: 'Quy tắc moment lực.',
        goal: 'Hiểu điều kiện để đòn bẩy cân bằng.',
        theory: 'M = F.d (Moment lực bằng lực nhân cánh tay đòn)',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-indigo-500 pl-4">Quy tắc Moment</h4>
                    <p class="text-slate-700 leading-relaxed">Một vật có trục quay cố định sẽ cân bằng khi tổng các moment lực làm vật quay theo chiều kim đồng hồ bằng tổng các moment lực làm vật quay ngược chiều kim đồng hồ.</p>
                </section>
                <div class="p-8 bg-slate-900 text-white rounded-[40px] text-center shadow-2xl">
                    <p class="text-3xl font-black tracking-widest text-indigo-400">M₁ = M₂ ⇔ F₁.d₁ = F₂.d₂</p>
                </div>
            </div>
        `,
        instructions: 'Thay đổi khối lượng và vị trí các vật treo để làm đòn bẩy thăng bằng.',
        jsModule: 'physics/lever-balance.js'
    },

    // --- HÓA HỌC ---
    {
        id: 'balancing-equations',
        subject: 'chemistry',
        title: 'Cân bằng phản ứng',
        description: 'Định luật bảo toàn khối lượng.',
        goal: 'Cân bằng số nguyên tử mỗi nguyên tố ở hai vế phản ứng.',
        theory: 'Số nguyên tử của mỗi nguyên tố trước và sau phản ứng phải bằng nhau.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-emerald-500 pl-4">Định luật Bảo toàn Khối lượng</h4>
                    <p class="text-slate-700 leading-relaxed border-b border-slate-100 pb-4">Phát biểu bởi Lavoisier: <i>"Trong một phản ứng hóa học, tổng khối lượng các chất sản phẩm bằng tổng khối lượng các chất tham gia phản ứng."</i></p>
                </section>
            </div>
        `,
        instructions: 'Thay đổi hệ số của các chất để hai vế phương trình bằng nhau.',
        jsModule: 'chemistry/balancing-equations.js'
    },
    {
        id: 'dilution',
        subject: 'chemistry',
        title: 'Pha loãng dung dịch',
        description: 'Thay đổi nồng độ chất tan.',
        goal: 'Hiểu mối quan hệ giữa thể tích và nồng độ mol.',
        theory: 'Khi thêm dung môi, số mol chất tan không đổi nhưng nồng độ C = n/V giảm xuống.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-emerald-500 pl-4">Nguyên tắc pha loãng</h4>
                    <p class="text-slate-700 leading-relaxed">Pha loãng là quá trình giảm nồng độ của một chất tan trong dung dịch bằng cách thêm dung môi.</p>
                </section>
                <div class="p-8 bg-emerald-50 rounded-[40px] text-center border border-emerald-100">
                    <p class="text-2xl font-black text-emerald-700">C₁V₁ = C₂V₂</p>
                </div>
            </div>
        `,
        instructions: 'Chọn nồng độ ban đầu, thêm nước và quan sát sự thay đổi màu sắc và nồng độ.',
        jsModule: 'chemistry/dilution.js'
    },
    {
        id: 'magnesium-burn',
        subject: 'chemistry',
        title: 'Đốt cháy Magie',
        description: 'Phản ứng của kim loại với Oxy.',
        goal: 'Quan sát hiện tượng và sản phẩm của phản ứng cháy.',
        theory: '2Mg + O₂ → 2MgO. Magie cháy trong không khí với ngọn lửa sáng chói.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-emerald-500 pl-4">Phản ứng Oxit hóa - Khử</h4>
                    <p class="text-slate-700 leading-relaxed">Magie phản ứng mãnh liệt với Oxy ở nhiệt độ cao tạo thành Magie Oxit (MgO) màu trắng.</p>
                </section>
            </div>
        `,
        instructions: 'Dùng kẹp gắp dây Magie đưa vào ngọn lửa đèn cồn.',
        jsModule: 'chemistry/magnesium-burn.js'
    },
    {
        id: 'precipitation',
        subject: 'chemistry',
        title: 'Phản ứng kết tủa',
        description: 'Sự hình thành chất không tan.',
        goal: 'Nhận biết các phản ứng tạo kết tủa đặc trưng.',
        theory: 'Phản ứng trao đổi ion trong dung dịch tạo ra chất không tan (kết tủa).',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-emerald-500 pl-4">Phản ứng trao đổi</h4>
                    <p class="text-slate-700 leading-relaxed">Ví dụ: AgNO₃ + NaCl → AgCl↓ + NaNO₃ (Kết tủa trắng AgCl).</p>
                </section>
            </div>
        `,
        instructions: 'Pha trộn hai loại dung dịch không màu để quan sát sự hình thành kết tủa.',
        jsModule: 'chemistry/precipitation.js'
    },
    {
        id: 'ph-scale',
        subject: 'chemistry',
        title: 'Thang đo pH',
        description: 'Độ Axit - Bazơ của chất lỏng.',
        goal: 'Nhận biết môi trường của các dung dịch phổ biến.',
        theory: 'Thang pH từ 0 (Axit mạnh) đến 14 (Bazơ mạnh), 7 là trung tính.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-amber-500 pl-4">Chỉ số pH là gì?</h4>
                    <p class="text-slate-700 leading-relaxed italic">pH là chỉ số đo hoạt độ của các ion hiđrô (H⁺), quyết định tính chất hóa học đặc trưng của một dung dịch.</p>
                </section>
            </div>
        `,
        instructions: 'Dùng ống nhỏ giọt thả dung dịch và quan sát sự đổi màu của giấy chỉ thị.',
        jsModule: 'chemistry/ph-scale.js'
    },
    {
        id: 'acid-base',
        subject: 'chemistry',
        title: 'Phản ứng trung hòa',
        description: 'Chuẩn độ HCl và NaOH.',
        goal: 'Sử dụng chỉ thị Phenolphthalein.',
        theory: 'Axit + Bazơ -> Muối + Nước. Màu hồng biến mất tại điểm tương đương.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-emerald-500 pl-4">Đặc điểm Phản ứng Trung hòa</h4>
                    <p class="text-slate-700 leading-relaxed text-center text-center">H⁺ + OH⁻ → H₂O</p>
                </section>
            </div>
        `,
        instructions: 'Nhỏ từng giọt Axit vào Bazơ đến khi hết màu hồng.',
        jsModule: 'chemistry/acid-base.js'
    },
    {
        id: 'litmus-test',
        subject: 'chemistry',
        title: 'Thử quỳ tím',
        description: 'Nhận biết môi trường chất lỏng.',
        goal: 'Phân loại Axit/Bazơ/Trung tính.',
        theory: 'Axit làm quỳ hóa Đỏ, Bazơ làm quỳ hóa Xanh.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-emerald-500 pl-4">Giấy quỳ tím (Indicator)</h4>
                    <p class="text-slate-700 leading-relaxed text-center">Quỳ ĐỎ: Axit | Quỳ XANH: Bazơ</p>
                </section>
            </div>
        `,
        instructions: 'Nhúng giấy quỳ vào các cốc hóa chất gia đình khau nhau.',
        jsModule: 'chemistry/litmus-test.js'
    },
    {
        id: 'acid-metal',
        subject: 'chemistry',
        title: 'Axit + Kim loại',
        description: 'Điều chế khí Hidro.',
        goal: 'Quan sát hiện tượng sủi bọt khí.',
        theory: 'Zn + 2HCl -> ZnCl2 + H2↑.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-emerald-500 pl-4">Phản ứng thế</h4>
                    <p class="text-slate-700 leading-relaxed text-center">Zn + 2HCl → ZnCl₂ + H₂↑</p>
                </section>
            </div>
        `,
        instructions: 'Thả kẽm vào ống nghiệm chứa axit và thấy bọt khí.',
        jsModule: 'chemistry/acid-metal.js'
    },

    // --- SINH HỌC ---
    {
        id: 'cell-structure',
        subject: 'biology',
        title: 'Cấu tạo tế bào',
        description: 'Thực vật vs Động vật.',
        goal: 'Phân biệt lục lạp và thành tế bào.',
        theory: 'Thực vật có lục lạp và thành xenlulozo. Động vật thì không.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-amber-600 pl-4">So sánh Tế bào Thực vật & Động vật</h4>
                    <p class="text-slate-700 leading-relaxed italic">Dù cùng là tế bào nhân thực, nhưng do lối sống khác nhau mà chúng có những bào quan riêng biệt.</p>
                </section>
            </div>
        `,
        instructions: 'Chọn loại tế bào và nhấn các bào quan để xem chức năng.',
        jsModule: 'biology/cell-structure.js'
    },
    {
        id: 'photosynthesis',
        subject: 'biology',
        title: 'Quang hợp',
        description: 'Cây tạo Oxy như thế nào?',
        goal: 'Hiểu sự cần thiết của ánh sáng.',
        theory: 'Ánh sáng + CO2 + Nước -> Đường + O2.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-amber-600 pl-4">Đồng hóa Năng lượng Ánh sáng</h4>
                    <p class="text-slate-700 leading-relaxed text-center">6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂↑</p>
                </section>
            </div>
        `,
        instructions: 'Chỉnh độ sáng và xem lượng bọt khí Oxy thoát ra.',
        jsModule: 'biology/photosynthesis.js'
    },
    {
        id: 'food-chain',
        subject: 'biology',
        title: 'Chuỗi thức ăn',
        description: 'Mối quan hệ ăn thịt.',
        goal: 'Xác định sinh vật sản xuất/tiêu thụ.',
        theory: 'Năng lượng đi từ sinh vật sản xuất -> bậc tiêu thụ.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-amber-600 pl-4">Dòng năng lượng Sinh thái</h4>
                    <p class="text-slate-700 leading-relaxed italic">Mỗi cá thể trong chuỗi là một mắt xích, năng lượng được truyền từ bậc thấp lên bậc cao.</p>
                </section>
            </div>
        `,
        instructions: 'Kéo thả sinh vật vào đúng vị trí trong chuỗi.',
        jsModule: 'biology/food-chain.js'
    },
    {
        id: 'food-web',
        subject: 'biology',
        title: 'Lưới thức ăn',
        description: 'Tập hợp các chuỗi thức ăn giao nhau.',
        goal: 'Hiểu sự phức tạp và cân bằng của hệ sinh thái.',
        theory: 'Lưới thức ăn gồm nhiều chuỗi thức ăn có chung mắt xích, mô tả mối quan hệ dinh dưỡng đa chiều.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-amber-600 pl-4">Cấu trúc Lưới thức ăn</h4>
                    <p class="text-slate-700 leading-relaxed">Một loài sinh vật có thể ăn nhiều loài khác nhau và bị nhiều loài khác nhau ăn thịt.</p>
                </section>
            </div>
        `,
        instructions: 'Kết nối các con vật với nhau để tạo thành một lưới thức ăn hoàn chỉnh.',
        jsModule: 'biology/food-web.js'
    },
    {
        id: 'digestion',
        subject: 'biology',
        title: 'Hệ tiêu hóa',
        description: 'Hành trình của thức ăn trong cơ thể.',
        goal: 'Nhận biết các cơ quan và chức năng trong hệ tiêu hóa.',
        theory: 'Tiêu hóa là quá trình biến đổi thức ăn thành các chất dinh dưỡng mà cơ thể có thể hấp thụ.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-amber-600 pl-4">Các giai đoạn tiêu hóa</h4>
                    <ul class="list-disc ml-6 space-y-2 text-slate-700">
                        <li>Tiêu hóa cơ học (nhai, co bóp dạ dày).</li>
                        <li>Tiêu hóa hóa học (enzyme, dịch vị).</li>
                    </ul>
                </section>
            </div>
        `,
        instructions: 'Nhấn vào các cơ quan trên sơ đồ để xem vai trò của chúng đối với thức ăn.',
        jsModule: 'biology/digestion.js'
    },
    {
        id: 'heart-pump',
        subject: 'biology',
        title: 'Cơ chế hoạt động của Tim',
        description: 'Hệ tuần hoàn máu.',
        goal: 'Quan sát cách tim bơm máu đi khắp cơ thể.',
        theory: 'Tim là một khối cơ rỗng có tác dụng như một chiếc bơm, đẩy máu qua các mạch máu.',
        theoryDetailed: `
            <div class="space-y-10">
                <section>
                    <h4 class="text-2xl font-black text-slate-900 mb-4 border-l-4 border-amber-600 pl-4">Chu kỳ tim</h4>
                    <p class="text-slate-700 leading-relaxed">Gồm pha co tâm nhĩ, pha co tâm thất và pha dãn chung.</p>
                </section>
            </div>
        `,
        instructions: 'Điều chỉnh nhịp tim và quan sát dòng máu chảy trong các ngăn tim.',
        jsModule: 'biology/heart-pump.js'
    }
];

module.exports = {
    getSubjects: () => subjects,
    getAllExperiments: () => experiments,
    getSubjectById: (id) => subjects.find(s => s.id === id),
    getExperimentsBySubject: (subjectId) => experiments.filter(e => e.subject === subjectId),
    getExperimentById: (id) => {
        const experiment = experiments.find(e => e.id === id);
        return experiment ? { ...experiment } : null;
    }
};

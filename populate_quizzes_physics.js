const db = require('./config/db');

async function populatePhysicsQuizzes() {
    const physicsQuizzes = {
        'free-fall': [
            { q: 'Sự rơi tự do là sự rơi chỉ dưới tác dụng của:', a: 'Lực cản không khí', b: 'Lòng bàn tay', c: 'Trọng lực', d: 'Lực đẩy Archimedes', r: 'C' },
            { q: 'Trong chân không, một đồng tiền và một chiếc lông vũ sẽ rơi như thế nào?', a: 'Đồng tiền rơi nhanh hơn', b: 'Chiếc lông vũ rơi nhanh hơn', c: 'Cả hai rơi như nhau', d: 'Cả hai không rơi', r: 'C' },
            { q: 'Gia tốc rơi tự do (g) tại bề mặt Trái Đất xấp xỉ bằng bao nhiêu?', a: '5.0 m/s²', b: '9.8 m/s²', c: '15.0 m/s²', d: '20.0 m/s²', r: 'B' },
            { q: 'Khi hút hết không khí trong ống Newton, sự rơi của các vật bên trong là:', a: 'Rơi tự do', b: 'Rơi chậm dần đều', c: 'Không rơi', d: 'Bay lơ lửng', r: 'A' },
            { q: 'Đồ thị vận tốc theo thời gian của vật rơi tự do là một đường:', a: 'Thẳng đi qua gốc tọa độ', b: 'Parabol', c: 'Cong tròn', d: 'Ngang song song với trục thời gian', r: 'A' },
            { q: 'Vận tốc của vật rơi tự do tăng dần theo quy luật nào?', a: 'v = g/t', b: 'v = g.t', c: 'v = 0.5.g.t²', d: 'v = g + t', r: 'B' },
            { q: 'Quãng đường vật rơi tự do sau thời gian t được tính bằng công thức:', a: 's = g.t', b: 's = 0.5.g.t²', c: 's = v.t', d: 's = g.t²', r: 'B' },
            { q: 'Nếu thời gian rơi tăng gấp đôi, quãng đường rơi sẽ tăng gấp mấy lần?', a: '2', b: '3', c: '4', d: '1.414', r: 'C' },
            { q: 'Trong không khí, vì sao quả tạ rơi nhanh hơn chiếc lá?', a: 'Vì quả tạ nặng hơn', b: 'Vì quả tạ có ít lực cản hơn tỉ lệ với khối lượng', c: 'Vì quả tạ to hơn', d: 'Vì quả tạ chịu trọng lực lớn hơn nhiều lần', r: 'B' },
            { q: 'Gia tốc rơi tự do tại Mặt Trăng so với Trái Đất như thế nào?', a: 'Bằng nhau', b: 'Lớn hơn', c: 'Nhỏ hơn (bằng khoảng 1/6)', d: 'Không có gia tốc rơi tự do', r: 'C' }
        ],
        'pendulum': [
            { q: 'Chu kỳ dao động của con lắc đơn (T) phụ thuộc vào yếu tố nào?', a: 'Khối lượng quả nặng', b: 'Chiều dài dây treo (l)', c: 'Biên độ dao động lớn', d: 'Cách kéo vật ra', r: 'B' },
            { q: 'Công thức tính chu kỳ con lắc đơn là gì?', a: 'T = 2π√(l/g)', b: 'T = 2π√(g/l)', c: 'T = 2π√(m/k)', d: 'T = 2π√(l.g)', r: 'A' },
            { q: 'Nếu tăng chiều dài dây treo lên 4 lần, chu kỳ sẽ:', a: 'Tăng 4 lần', b: 'Tăng 2 lần', c: 'Giảm 2 lần', d: 'Không đổi', r: 'B' },
            { q: 'Tần số dao động (f) quan hệ với chu kỳ (T) qua công thức nào?', a: 'f = T', b: 'f = 1/T', c: 'f = 2π/T', d: 'f = T²', r: 'B' },
            { q: 'Đơn vị đo chu kỳ T là gì?', a: 'Hertz (Hz)', b: 'Mét (m)', c: 'Giây (s)', d: 'Kilôgam (kg)', r: 'C' },
            { q: 'Con lắc đồng hồ quả lắc là ứng dụng của:', a: 'Con lắc đơn', b: 'Con lắc vĩnh cửu', c: 'Con lắc tự do', d: 'Cả A và C', r: 'A' },
            { q: 'Khi đưa con lắc lên núi cao (g giảm), chu kỳ sẽ:', a: 'Tăng lên', b: 'Giảm đi', c: 'Không đổi', d: 'Dừng hẳn', r: 'A' },
            { q: 'Li độ góc α là:', a: 'Độ dài cung vật đi được', b: 'Góc lệch của dây treo so với phương thẳng đứng', c: 'Khối lượng của vật', d: 'Gia tốc của vật', r: 'B' },
            { q: 'Động năng của con lắc lớn nhất khi nó ở vị trí nào?', a: 'Vị trí biên trái', b: 'Vị trí biên phải', c: 'Vị trí cân bằng', d: 'Mọi vị trí bằng nhau', r: 'C' },
            { q: 'Tại vị trí biên, thế năng của con lắc:', a: 'Bằng 0', b: 'Đạt cực đại', c: 'Bằng động năng', d: 'Nhỏ nhất', r: 'B' }
        ],
        'simple-circuit': [
            { q: 'Dòng điện là dòng dịch chuyển có hướng của các:', a: 'Nguyên tử', b: 'Phân tử', c: 'Hạt mang điện (như electron)', d: 'Vật thể', r: 'C' },
            { q: 'Nguồn điện (như Pin) có tác dụng gì?', a: 'Tạo ra và duy trì hiệu điện thế', b: 'Làm nóng mạch', c: 'Cản trở dòng điện', d: 'Cung cấp electron mới', r: 'A' },
            { q: 'Định luật Ohm cho đoạn mạch là gì?', a: 'U = I + R', b: 'I = U/R', c: 'R = U+I', d: 'P = U.I', r: 'B' },
            { q: 'Đơn vị của cường độ dòng điện (I) là:', a: 'Volt (V)', b: 'Ohm (Ω)', c: 'Ampere (A)', d: 'Watt (W)', r: 'C' },
            { q: 'Đơn vị của hiệu điện thế (U) là:', a: 'Volt (V)', b: 'Ohm (Ω)', c: 'Ampere (A)', d: 'Watt (W)', r: 'A' },
            { q: 'Khi một mạch điện bị "ngắt", dòng điện sẽ:', a: 'Chạy nhanh hơn', b: 'Dừng lại', c: 'Không thay đổi', d: 'Gây ra nổ', r: 'B' },
            { q: 'Dòng điện trong mạch kín có chiều đi như thế nào?', a: 'Từ cực âm sang cực dương của nguồn', b: 'Từ cực dương sang cực âm của nguồn (quy ước)', c: 'Ngẫu nhiên', d: 'Không có chiều nhất định', r: 'B' },
            { q: 'Vật liệu nào sau đây dẫn điện tốt?', a: 'Gỗ khô', b: 'Nhựa', c: 'Đồng', d: 'Thủy tinh', r: 'C' },
            { q: 'Vật liệu cách điện là vật liệu:', a: 'Cho dòng điện chạy qua dễ dàng', b: 'Ngăn cản dòng điện chạy qua', c: 'Làm dòng điện chạy ngược lại', d: 'Chứa rất nhiều electron tự do', r: 'B' },
            { q: 'Cầu chì có tác dụng gì?', a: 'Tăng cường dòng điện', b: 'Bảo vệ mạch khi quá tải', c: 'Đo hiệu điện thế', d: 'Làm sáng bóng đèn', r: 'B' }
        ],
        'light-reflection': [
            { q: 'Định luật phản xạ ánh sáng phát biểu rằng góc phản xạ (i\') so với góc tới (i) như thế nào?', a: 'i\' > i', b: 'i\' < i', c: 'i\' = i', d: 'i\' + i = 90°', r: 'C' },
            { q: 'Đường thẳng vuông góc với mặt gương tại điểm tới gọi là đường gì?', a: 'Tia tới', b: 'Tia phản xạ', c: 'Pháp tuyến', d: 'Dây cung', r: 'C' },
            { q: 'Ảnh của một vật tạo bởi gương phẳng có tính chất gì?', a: 'Ảnh thật, bằng vật', b: 'Ảnh ảo, bằng vật', c: 'Ảnh ảo, nhỏ hơn vật', d: 'Ảnh thật, lớn hơn vật', r: 'B' },
            { q: 'Nếu góc tới là 30°, góc phản xạ bằng bao nhiêu?', a: '15°', b: '30°', c: '60°', d: '90°', r: 'B' },
            { q: 'Nếu góc hợp bởi tia tới và mặt gương là 20°, góc tới bằng bao nhiêu?', a: '20°', b: '70°', c: '110°', d: '160°', r: 'B' },
            { q: 'Tia tới và tia phản xạ nằm ở:', a: 'Cùng một phía so với pháp tuyến', b: 'Hai phía đối diện so với pháp tuyến', c: 'Trùng nhau', d: 'Không xác định được', r: 'B' },
            { q: 'Phản xạ khuếch tán xảy ra khi ánh sáng chiếu vào:', a: 'Gương phẳng nhẵn', b: 'Mặt hồ phẳng lặng', c: 'Bề mặt gồ ghề (như tờ giấy)', d: 'Thấu kính hội tụ', r: 'C' },
            { q: 'Vật có màu đen là vì:', a: 'Nó phản xạ tất cả ánh sáng', b: 'Nó hấp thụ tất cả ánh sáng và không phản xạ lại', c: 'Nó tự phát ra ánh sáng đen', d: 'Mắt ta không nhìn thấy nó', r: 'B' },
            { q: 'Ảo ảnh trên mặt đường nhựa nóng là do hiện tượng:', a: 'Phản xạ toàn phần', b: 'Phản xạ gương', c: 'Hấp thụ ánh sáng', d: 'Tán xạ', r: 'A' },
            { q: 'Khoảng cách từ vật đến gương phẳng bằng bao nhiêu lần khoảng cách từ ảnh đến gương?', a: '1/2', b: '1', c: '2', d: 'Nhiều lần', r: 'B' }
        ],
        'friction': [
            { q: 'Lực ma sát xuất hiện khi nào?', a: 'Vật đứng yên tuyệt đối', b: 'Một vật trượt hoặc định trượt trên bề mặt vật khác', c: 'Vật rơi trong chân không', d: 'Vật bay trong không gian', r: 'B' },
            { q: 'Lực ma sát trượt có hướng như thế nào?', a: 'Cùng hướng chuyển động', b: 'Ngược hướng chuyển động', c: 'Vuông góc với mặt tiếp xúc', d: 'Thẳng đứng lên trên', r: 'B' },
            { q: 'Công thức tính lực ma sát trượt là:', a: 'Fms = μ.N', b: 'Fms = m.g', c: 'Fms = μ.m', d: 'Fms = m.a', r: 'A' },
            { q: 'Lực ma sát phụ thuộc vào yếu tố nào?', a: 'Diện tích mặt tiếp xúc', b: 'Áp lực lên mặt tiếp xúc (N)', c: 'Tốc độ của vật', d: 'Cả A và C', r: 'B' },
            { q: 'Đơn vị của lực ma sát là:', a: 'Kilôgam (kg)', b: 'Mét trên giây (m/s)', c: 'Newton (N)', d: 'Ohm (Ω)', r: 'C' },
            { q: 'Lực ma sát nghỉ giúp ta làm việc gì?', a: 'Đi bộ mà không bị trượt ngã', b: 'Cầm nắm vật', c: 'Xe phanh lại', d: 'Cả A và B', r: 'D' },
            { q: 'Để giảm ma sát, người ta thường dùng:', a: 'Dầu mỡ bôi trơn', b: 'Làm nhám bề mặt', c: 'Thay ổ bi', d: 'Cả A và C', r: 'D' },
            { q: 'Tại sao lốp xe có khía rãnh?', a: 'Để đẹp hơn', b: 'Để tăng ma sát, chống trượt', c: 'Để giảm ma sát, đi nhanh hơn', d: 'Để thoát nhiệt nhanh hơn', r: 'B' },
            { q: 'Nếu vật đang trượt mà ta ép vật mạnh hơn xuống sàn, lực ma sát sẽ:', a: 'Tăng lên', b: 'Giảm đi', c: 'Không đổi', d: 'Biến mất', r: 'A' },
            { q: 'Hệ số ma sát μ phụ thuộc vào:', a: 'Khối lượng vật', b: 'Tính chất và tình trạng của hai mặt tiếp xúc', c: 'Vận tốc vật', d: 'Góc nghiêng của sàn', r: 'B' }
        ],
        'friction-inclined': [
            { q: 'Trên mặt phẳng nghiêng, thành phần trọng lực nào kéo vật trượt xuống?', a: 'P.cos(α)', b: 'P.sin(α)', c: 'P', d: 'Phản lực N', r: 'B' },
            { q: 'Góc nghiêng α càng lớn thì thành phần kéo vật xuống (P.sinα) sẽ:', a: 'Tăng lên', b: 'Giảm đi', c: 'Không đổi', d: 'Bằng 0', r: 'A' },
            { q: 'Phản lực N trên mặt phẳng nghiêng bằng:', a: 'P', b: 'P.sin(α)', c: 'P.cos(α)', d: 'μ.P', r: 'C' },
            { q: 'Vật bắt đầu trượt trên mặt nghiêng khi tan(α) như thế nào so với hệ số ma sát μ?', a: 'tan(α) < μ', b: 'tan(α) > μ', c: 'tan(α) = 0', d: 'α = 90°', r: 'B' },
            { q: 'Ma sát trượt trên mặt phẳng nghiêng được tính bằng:', a: 'μ.P.sin(α)', b: 'μ.P.cos(α)', c: 'μ.P', d: 'P.tan(α)', r: 'B' },
            { q: 'Tại sao leo dốc cao (α lớn) lại mệt hơn?', a: 'Vì quãng đường dài hơn', b: 'Vì phải thắng thành phần trọng lực P.sinα lớn hơn', c: 'Vì ma sát lớn hơn', d: 'Vì áp suất không khí giảm', r: 'B' },
            { q: 'Khi góc nghiêng bằng 90° (thẳng đứng), phản lực N bằng:', a: 'P', b: 'P/2', c: '0', d: 'Vô cùng', r: 'C' },
            { q: 'Mặt phẳng nghiêng là một loại:', a: 'Máy cơ đơn giản', b: 'Động cơ nhiệt', c: 'Nguồn điện', d: 'Vật liệu cách điện', r: 'A' },
            { q: 'Tại sao các con đường lên núi thường làm lượn vòng (quanh co) thay vì lên thẳng?', a: 'Để ngắm cảnh đẹp', b: 'Để giảm độ nghiêng α, giúp xe leo dốc nhẹ nhàng hơn', c: 'Để tăng ma sát', d: 'Để tránh đá lở', r: 'B' },
            { q: 'Nếu bề mặt có hệ số ma sát μ = 0 (trơn tuyệt đối), vật sẽ trượt khi:', a: 'α > 0', b: 'α > 45°', c: 'α = 90°', d: 'Không bao giờ trượt', r: 'A' }
        ],
        'archimedes': [
            { q: 'Công thức tính lực đẩy Archimedes là gì?', a: 'FA = d . V', b: 'FA = m . g', c: 'FA = P / S', d: 'FA = d / V', r: 'A' },
            { q: 'Trong công thức FA = d.V, V là gì?', a: 'Thể tích của toàn bộ vật', b: 'Thể tích phần chất lỏng bị vật chiếm chỗ', c: 'Trọng lượng của vật', d: 'Tốc độ của vật', r: 'B' },
            { q: 'Lực đẩy Archimedes có hướng như thế nào?', a: 'Thẳng đứng từ trên xuống', b: 'Thẳng đứng từ dưới lên', c: 'Nằm ngang', d: 'Theo mọi hướng', r: 'B' },
            { q: 'Một vật nổi trên mặt nước khi nào?', a: 'P > FA', b: 'P < FA (lúc vật chìm hoàn toàn)', c: 'P = FA', d: 'P là khối lượng', r: 'C' },
            { q: 'Một vật chìm xuống đáy chất lỏng khi nào?', a: 'Trọng lượng P > Lực đẩy FA', b: 'P < FA', c: 'P = FA', d: 'Vật có hình dạng vuông', r: 'A' },
            { q: 'Tại sao một tàu thép nặng hàng nghìn tấn lại nổi được trên mặt nước?', a: 'Vì thép nhẹ hơn nước', b: 'Vì tàu có dạng rỗng, thể tích chiếm chỗ lớn nên tạo ra lực đẩy Archimedes lớn', c: 'Vì nước ở biển mặn', d: 'Vì có động cơ đẩy lên', r: 'B' },
            { q: 'Đơn vị của lực đẩy Archimedes là:', a: 'Pascal (Pa)', b: 'Newton (N)', c: 'Kilôgam (kg)', d: 'Lít (l)', r: 'B' },
            { q: 'Khi nhúng vật sâu hơn trong chất lỏng (nhưng vẫn ngập hoàn toàn), lực đẩy FA sẽ:', a: 'Tăng lên', b: 'Giảm đi', c: 'Không thay đổi', d: 'Biến mất', r: 'C' },
            { q: 'Nếu nhúng một vật vào rượu (d_rượu < d_nước), lực đẩy Archimedes sẽ:', a: 'Lớn hơn so với khi nhúng vào nước', b: 'Nhỏ hơn so với khi nhúng vào nước', c: 'Bằng nhau', d: 'Bằng 0', r: 'B' },
            { q: 'Tại sao quả bóng bay chứa khí Heli lại bay lên được?', a: 'Vì khí Heli lạnh', b: 'Vì lực đẩy Archimedes của không khí lớn hơn trọng lượng quả bóng', c: 'Vì nó nhẹ', d: 'Vì Trái đất không hút Heli', r: 'B' }
        ],
        'lever-balance': [
            { q: 'Quy tắc moment lực dùng cho vật có:', a: 'Trọng lượng lớn', b: 'Trục quay cố định', c: 'Chuyển động thẳng', d: 'Tốc độ cao', r: 'B' },
            { q: 'Moment lực M được tính bằng công thức:', a: 'M = F + d', b: 'M = F / d', c: 'M = F . d', d: 'M = m . g', r: 'C' },
            { q: 'Cánh tay đòn d là khoảng cách từ trục quay đến:', a: 'Điểm đặt của lực', b: 'Giá của lực (vuông góc)', c: 'Trọng tâm vật', d: 'Mặt đất', r: 'B' },
            { q: 'Điều kiện cân bằng của một đòn bẩy là:', a: 'F1 = F2', b: 'd1 = d2', c: 'F1.d1 = F2.d2', d: 'F1 + d1 = F2 + d2', r: 'C' },
            { q: 'Để bẻ gãy một cành cây cứng, ta nên cầm ở vị trí nào để tốn ít lực nhất?', a: 'Cầm gần sát gốc (d nhỏ)', b: 'Cầm ở xa gốc (d lớn)', c: 'Cầm ở giữa', d: 'Cầm chỗ nào cũng như nhau', r: 'B' },
            { q: 'Cái bập bênh đứng thăng bằng khi hai người có trọng lượng bằng nhau ngồi:', a: 'Cách đều trục quay', b: 'Một người gần, một người xa', c: 'Cùng một bên', d: 'Trên cao', r: 'A' },
            { q: 'Đơn vị của moment lực là:', a: 'Newton (N)', b: 'Newton mét (N.m)', c: 'Watt (W)', d: 'Joule (J)', r: 'B' },
            { q: 'Nếu lực F tăng gấp đôi và cánh tay đòn d giảm một nửa, moment lực sẽ:', a: 'Tăng gấp đôi', b: 'Tăng gấp 4', c: 'Không đổi', d: 'Giảm một nửa', r: 'C' },
            { q: 'Kìm, kéo, xe cút kít là ứng dụng của:', a: 'Mạch điện', b: 'Đòn bẩy', c: 'Sự rơi tự do', d: 'Thấu kính', r: 'B' },
            { q: 'Tại sao tay nắm cửa thường được đặt xa bản lề?', a: 'Để trang trí', b: 'Để tăng cánh tay đòn, giúp mở cửa nhẹ nhàng hơn', c: 'Để dễ cầm', d: 'Để tránh va đập', r: 'B' }
        ]
    };

    try {
        for (const [expId, quizzes] of Object.entries(physicsQuizzes)) {
            await db.execute('DELETE FROM quizzes WHERE experiment_id = ?', [expId]);
            for (const q of quizzes) {
                await db.execute(
                    'INSERT INTO quizzes (experiment_id, question, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [expId, q.q, q.a, q.b, q.c, q.d, q.r]
                );
            }
            console.log(`Đã nạp 10 câu hỏi cho: ${expId}`);
        }
        process.exit();
    } catch (err) {
        console.error('Lỗi khi nạp câu hỏi Vật lý:', err);
        process.exit(1);
    }
}

populatePhysicsQuizzes();

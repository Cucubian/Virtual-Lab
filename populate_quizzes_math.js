const db = require('./config/db');

async function populateMathQuizzes() {
    const mathQuizzes = {
        'triangle-centers': [
            { q: 'Trọng tâm của tam giác là giao điểm của ba đường nào?', a: 'Đường cao', b: 'Đường trung tuyến', c: 'Đường phân giác', d: 'Đường trung trực', r: 'B' },
            { q: 'Trực tâm của tam giác là giao điểm của ba đường nào?', a: 'Đường cao', b: 'Đường trung tuyến', c: 'Đường phân giác', d: 'Đường trung trực', r: 'A' },
            { q: 'Tâm đường tròn ngoại tiếp tam giác là giao điểm của ba đường nào?', a: 'Đường cao', b: 'Đường trung tuyến', c: 'Đường phân giác', d: 'Đường trung trực', r: 'D' },
            { q: 'Tâm đường tròn nội tiếp tam giác là giao điểm của ba đường nào?', a: 'Đường cao', b: 'Đường trung tuyến', c: 'Đường phân giác', d: 'Đường trung trực', r: 'C' },
            { q: 'Trong tam giác vuông, trực tâm nằm ở đâu?', a: 'Bên trong tam giác', b: 'Bên ngoài tam giác', c: 'Trùng với đỉnh góc vuông', d: 'Tại trung điểm cạnh huyền', r: 'C' },
            { q: 'Khoảng cách từ trọng tâm đến đỉnh bằng bao nhiêu lần độ dài đường trung tuyến tương ứng?', a: '1/2', b: '1/3', c: '2/3', d: '3/4', r: 'C' },
            { q: 'Đường thẳng Euler đi qua những điểm nào sau đây?', a: 'Trọng tâm, Trực tâm, Tâm nội tiếp', b: 'Trọng tâm, Trực tâm, Tâm ngoại tiếp', c: 'Trực tâm, Tâm nội tiếp, Tâm ngoại tiếp', d: 'Trọng tâm, Tâm nội tiếp, Tâm ngoại tiếp', r: 'B' },
            { q: 'Trong tam giác tù, trực tâm nằm ở đâu?', a: 'Bên trong tam giác', b: 'Bên ngoài tam giác', c: 'Trên một cạnh của tam giác', d: 'Trùng với một đỉnh', r: 'B' },
            { q: 'Tâm đường tròn nội tiếp cách đều ba yếu tố nào của tam giác?', a: 'Ba đỉnh', b: 'Ba cạnh', c: 'Ba đường cao', d: 'Ba đường trung tuyến', r: 'B' },
            { q: 'Trong tam giác đều, bốn điểm (Trọng tâm, Trực tâm, Tâm ngoại tiếp, Tâm nội tiếp) có quan hệ như thế nào?', a: 'Thẳng hàng', b: 'Tạo thành hình vuông', c: 'Trùng nhau', d: 'Không có quan hệ gì', r: 'C' }
        ],
        'pythagoras': [
            { q: 'Định lý Pythagoras áp dụng cho loại tam giác nào?', a: 'Tam giác cân', b: 'Tam giác đều', c: 'Tam giác vuông', d: 'Tam giác nhọn', r: 'C' },
            { q: 'Công thức của định lý Pythagoras là gì (c là cạnh huyền)?', a: 'a + b = c', b: 'a² + b² = c²', c: 'a² - b² = c²', d: 'a² + b² = c', r: 'B' },
            { q: 'Nếu hai cạnh góc vuông là 3 và 4, cạnh huyền bằng bao nhiêu?', a: '5', b: '6', c: '7', d: '25', r: 'A' },
            { q: 'Bộ ba số nào sau đây là bộ ba số Pythagoras?', a: '1, 2, 3', b: '5, 12, 13', c: '2, 3, 4', d: '4, 5, 6', r: 'B' },
            { q: 'Trong tam giác vuông, cạnh nào là cạnh dài nhất?', a: 'Cạnh đối diện góc nhọn thứ nhất', b: 'Cạnh đối diện góc nhọn thứ hai', c: 'Cạnh huyền', d: 'Hai cạnh góc vuông bằng nhau', r: 'C' },
            { q: 'Nếu một tam giác có các cạnh là 6, 8, 10 thì đó là tam giác gì?', a: 'Tam giác nhọn', b: 'Tam giác tù', c: 'Tam giác vuông', d: 'Tam giác cân', r: 'C' },
            { q: 'Cạnh huyền là cạnh đối diện với góc nào?', a: 'Góc nhọn', b: 'Góc tù', c: 'Góc vuông', d: 'Góc bẹt', r: 'C' },
            { q: 'Diện tích hình vuông dựng trên cạnh huyền bằng:', a: 'Tổng diện tích hai hình vuông dựng trên hai cạnh góc vuông', b: 'Hiệu diện tích hai hình vuông dựng trên hai cạnh góc vuông', c: 'Tích diện tích hai hình vuông dựng trên hai cạnh góc vuông', d: 'Gấp đôi tổng diện tích hai hình vuông đó', r: 'A' },
            { q: 'Nếu cạnh huyền bằng 13 và một cạnh góc vuông bằng 5, cạnh còn lại là:', a: '8', b: '12', c: '11', d: '10', r: 'B' },
            { q: 'Pythagoras là nhà toán học người nước nào?', a: 'Ai Cập', b: 'La Mã', c: 'Hy Lạp', d: 'Ấn Độ', r: 'C' }
        ],
        'triangle-angles': [
            { q: 'Tổng ba góc trong của một tam giác luôn bằng bao nhiêu?', a: '90°', b: '180°', c: '270°', d: '360°', r: 'B' },
            { q: 'Trong một tam giác vuông, tổng hai góc nhọn bằng bao nhiêu?', a: '45°', b: '60°', c: '90°', d: '180°', r: 'C' },
            { q: 'Tam giác đều có mỗi góc bằng bao nhiêu?', a: '30°', b: '45°', c: '60°', d: '90°', r: 'C' },
            { q: 'Một tam giác có thể có tối đa bao nhiêu góc tù?', a: '0', b: '1', c: '2', d: '3', r: 'B' },
            { q: 'Góc ngoài của một tam giác bằng:', a: 'Tổng hai góc trong không kề với nó', b: 'Hiệu hai góc trong không kề với nó', c: 'Tổng ba góc trong', d: '90°', r: 'A' },
            { q: 'Tam giác cân có hai góc ở đáy như thế nào?', a: 'Phụ nhau', b: 'Bù nhau', c: 'Bằng nhau', d: 'Lớn hơn 90°', r: 'C' },
            { q: 'Nếu một tam giác có hai góc lần lượt là 50° và 60°, góc thứ ba là:', a: '70°', b: '80°', c: '90°', d: '100°', r: 'A' },
            { q: 'Tam giác vuông cân có hai góc nhọn bằng bao nhiêu?', a: '30°', b: '45°', c: '60°', d: '90°', r: 'B' },
            { q: 'Một tam giác có ba góc bằng nhau là tam giác gì?', a: 'Tam giác cân', b: 'Tam giác vuông', c: 'Tam giác đều', d: 'Tam giác tù', r: 'C' },
            { q: 'Tổng bốn góc của một tứ giác là bao nhiêu?', a: '180°', b: '360°', c: '540°', d: '720°', r: 'B' }
        ],
        'inscribed-angle': [
            { q: 'Góc có đỉnh trùng với tâm đường tròn gọi là góc gì?', a: 'Góc nội tiếp', b: 'Góc ở tâm', c: 'Góc tạo bởi tia tiếp tuyến và dây cung', d: 'Góc ngoài', r: 'B' },
            { q: 'Góc có đỉnh nằm trên đường tròn và hai cạnh chứa hai dây cung là góc gì?', a: 'Góc nội tiếp', b: 'Góc ở tâm', c: 'Góc cố định', d: 'Góc xoay', r: 'A' },
            { q: 'Số đo góc nội tiếp bằng bao nhiêu lần số đo góc ở tâm cùng chắn một cung?', a: 'Gấp đôi', b: 'Bằng nhau', c: 'Bằng một nửa', d: 'Bằng 1/4', r: 'C' },
            { q: 'Góc nội tiếp chắn nửa đường tròn là góc gì?', a: 'Góc nhọn', b: 'Góc tù', c: 'Góc vuông', d: 'Góc bẹt', r: 'C' },
            { q: 'Các góc nội tiếp cùng chắn một cung thì:', a: 'Phụ nhau', b: 'Bù nhau', c: 'Bằng nhau', d: 'Tổng bằng 180°', r: 'C' },
            { q: 'Số đo của góc ở tâm bằng:', a: 'Số đo cung bị chắn', b: 'Nửa số đo cung bị chắn', c: 'Gấp đôi số đo cung bị chắn', d: '90°', r: 'A' },
            { q: 'Nếu góc ở tâm chắn cung AB bằng 100°, góc nội tiếp chắn cung AB bằng:', a: '50°', b: '100°', c: '200°', d: '25°', r: 'A' },
            { q: 'Góc tạo bởi tia tiếp tuyến và dây cung có số đo bằng:', a: 'Số đo cung bị chắn', b: 'Nửa số đo cung bị chắn', c: 'Gấp đôi số đo cung bị chắn', d: 'Bằng góc ở tâm', r: 'B' },
            { q: 'Trong một đường tròn, góc nội tiếp nhỏ hơn hoặc bằng 90° có số đo bằng nửa số đo của:', a: 'Cung bị chắn', b: 'Góc ở tâm cùng chắn cung đó', c: 'Cả A và B đều đúng', d: 'Cả A và B đều sai', r: 'C' },
            { q: 'Đường kính vuông góc với một dây cung thì:', a: 'Đi qua trung điểm của dây cung đó', b: 'Song song với dây cung đó', c: 'Cắt dây cung tại một điểm bất kỳ', d: 'Không có tính chất đặc biệt', r: 'A' }
        ],
        'linear-graph': [
            { q: 'Hàm số bậc nhất có dạng tổng quát nào?', a: 'y = ax + b (a ≠ 0)', b: 'y = ax² + b', c: 'y = ax + b (a = 0)', d: 'y = a/x + b', r: 'A' },
            { q: 'Đồ thị của hàm số y = ax + b là một đường gì?', a: 'Đường cong Parabol', b: 'Đường thẳng', c: 'Đường tròn', d: 'Đường gấp khúc', r: 'B' },
            { q: 'Hệ số a trong y = ax + b được gọi là gì?', a: 'Cao độ gốc', b: 'Hệ số tự do', c: 'Hệ số góc', d: 'Biến số', r: 'C' },
            { q: 'Hệ số b trong y = ax + b được gọi là gì?', a: 'Hệ số góc', b: 'Cao độ gốc (tung độ gốc)', c: 'Hoành độ gốc', d: 'Độ dốc', r: 'B' },
            { q: 'Nếu a > 0, hàm số bậc nhất y = ax + b là hàm số:', a: 'Đồng biến', b: 'Nghịch biến', c: 'Hằng số', d: 'Không xác định', r: 'A' },
            { q: 'Nếu a < 0, hàm số bậc nhất y = ax + b là hàm số:', a: 'Đồng biến', b: 'Nghịch biến', c: 'Hằng số', d: 'Vừa đồng biến vừa nghịch biến', r: 'B' },
            { q: 'Đồ thị hàm số y = ax + b cắt trục tung tại điểm có tọa độ nào?', a: '(b, 0)', b: '(0, b)', c: '(a, 0)', d: '(0, a)', r: 'B' },
            { q: 'Hai đường thẳng y = ax + b và y = a\'x + b\' song song với nhau khi:', a: 'a = a\'', b: 'a = a\' và b ≠ b\'', c: 'b = b\'', d: 'a.a\' = -1', r: 'B' },
            { q: 'Hai đường thẳng y = ax + b và y = a\'x + b\' vuông góc với nhau khi:', a: 'a = a\'', b: 'a.a\' = 1', c: 'a.a\' = -1', d: 'a + a\' = 0', r: 'C' },
            { q: 'Để vẽ đồ thị hàm số y = ax + b, ta cần xác định ít nhất bao nhiêu điểm?', a: '1', b: '2', c: '3', d: '4', r: 'B' }
        ],
        'quadratic-graph': [
            { q: 'Hàm số bậc hai có dạng tổng quát nào?', a: 'y = ax + b', b: 'y = ax² + bx + c (a ≠ 0)', c: 'y = ax³ + bx + c', d: 'y = a/x²', r: 'B' },
            { q: 'Đồ thị hàm số bậc hai y = ax² + bx + c là một đường gì?', a: 'Đường thẳng', b: 'Đường tròn', c: 'Đường Parabol', d: 'Đường Elip', r: 'C' },
            { q: 'Nếu a > 0, bề lõm của Parabol hướng về phía nào?', a: 'Hướng lên trên', b: 'Hướng xuống dưới', c: 'Hướng sang trái', d: 'Hướng sang phải', r: 'A' },
            { q: 'Nếu a < 0, bề lõm của Parabol hướng về phía nào?', a: 'Hướng lên trên', b: 'Hướng xuống dưới', c: 'Hướng sang trái', d: 'Hướng sang phải', r: 'B' },
            { q: 'Công thức tính biệt thức Delta (Δ) là gì?', a: 'Δ = b - 4ac', b: 'Δ = b² - 4ac', c: 'Δ = b² + 4ac', d: 'Δ = a² - 4bc', r: 'B' },
            { q: 'Nếu Δ > 0, đồ thị hàm số bậc hai cắt trục hoành tại bao nhiêu điểm?', a: '0', b: '1', c: '2', d: '3', r: 'C' },
            { q: 'Nếu Δ = 0, đồ thị hàm số bậc hai có quan hệ gì với trục hoành?', a: 'Không cắt', b: 'Tiếp xúc tại một điểm', c: 'Cắt tại hai điểm', d: 'Nằm hoàn toàn phía trên', r: 'B' },
            { q: 'Tòa độ đỉnh của Parabol y = ax² + bx + c là:', a: '(-b/a, -Δ/4a)', b: '(-b/2a, -Δ/4a)', c: '(b/2a, Δ/4a)', d: '(-b/2a, Δ/2a)', r: 'B' },
            { q: 'Trục đối xứng của Parabol y = ax² + bx + c là đường thẳng:', a: 'x = -b/a', b: 'x = -b/2a', c: 'y = -Δ/4a', d: 'x = b/2a', r: 'B' },
            { q: 'Hàm số y = ax² (a > 0) đạt giá trị nhỏ nhất bằng 0 khi nào?', a: 'x = 1', b: 'x = -1', c: 'x = 0', d: 'x tùy ý', r: 'C' }
        ],
        'probability-stats': [
            { q: 'Hoán vị của n phần tử ký hiệu là Pn, có công thức là gì?', a: 'n!', b: 'n²', c: '2n', d: 'n(n-1)', r: 'A' },
            { q: 'Chỉnh hợp chập k của n phần tử (A) dùng khi nào?', a: 'Chọn k phần tử và có xếp thứ tự', b: 'Chọn k phần tử và không xếp thứ tự', c: 'Chọn tất cả n phần tử', d: 'Sắp xếp n phần tử theo vòng tròn', r: 'A' },
            { q: 'Tổ hợp chập k của n phần tử (C) dùng khi nào?', a: 'Chọn k phần tử và có xếp thứ tự', b: 'Chọn k phần tử và không xếp thứ tự', c: 'Thay đổi vị trí các phần tử', d: 'Tính giai thừa của k', r: 'B' },
            { q: 'Nếu đổi chỗ 2 phần tử trong một tổ hợp, ta được:', a: 'Một tổ hợp mới', b: 'Vẫn là tổ hợp đó', c: 'Một chỉnh hợp', d: 'Một hoán vị', r: 'B' },
            { q: 'Công thức tính Chỉnh hợp A(n,k) là:', a: 'n! / (n-k)!', b: 'n! / k!', c: 'n! / (k!(n-k)!)', d: '(n-k)!', r: 'A' },
            { q: 'Công thức tính Tổ hợp C(n,k) là:', a: 'n! / (n-k)!', b: 'n! / (k!(n-k)!)', c: 'n! / k!', d: 'k! / n!', r: 'B' },
            { q: '0! bằng bao nhiêu?', a: '0', b: '1', c: 'Vô cực', d: 'Không xác định', r: 'B' },
            { q: 'Số cách chọn 2 học sinh từ 10 học sinh đi trực nhật là:', a: 'Chỉnh hợp chập 2 của 10', b: 'Tổ hợp chập 2 của 10', c: 'Hoán vị của 10', d: 'Hoán vị của 2', r: 'B' },
            { q: 'Số cách xếp 5 người vào 5 ghế hàng ngang là:', a: '5!', b: 'C(5,5)', c: 'A(5,5)', d: 'Cả A và C đều đúng', r: 'D' },
            { q: 'C(n,k) luôn như thế nào so với A(n,k) (với n > k > 1)?', a: 'Bằng nhau', b: 'Lớn hơn', c: 'Nhỏ hơn', d: 'Không so sánh được', r: 'C' }
        ],
        'probability-coin': [
            { q: 'Xác suất lý thuyết để một đồng xu cân đối hiện mặt Ngửa là bao nhiêu?', a: '0.25', b: '0.5', c: '0.75', d: '1.0', r: 'B' },
            { q: 'Khi tung đồng xu rất nhiều lần, tần suất thực nghiệm sẽ:', a: 'Trở nên hỗn loạn', b: 'Càng xa rời xác suất lý thuyết', c: 'Càng tiến gần đến xác suất lý thuyết', d: 'Luôn luôn bằng 0.5', r: 'C' },
            { q: 'Luật nào phát biểu về việc kết quả thực nghiệm tiến gần đến lý thuyết khi số lần thử tăng lên?', a: 'Luật số lớn', b: 'Luật vạn vật hấp dẫn', c: 'Luật bảo toàn khối lượng', d: 'Luật số nhỏ', r: 'A' },
            { q: 'Nếu tung đồng xu 10 lần mà cả 10 lần đều Ngửa, xác suất lần thứ 11 ra Ngửa là:', a: 'Gần như bằng 0', b: 'Rất cao', c: 'Vẫn là 0.5', d: 'Bằng 1', r: 'C' },
            { q: 'Tung 2 đồng xu cùng lúc. Có bao nhiêu kết quả có thể xảy ra?', a: '2', b: '3', c: '4', d: '8', r: 'C' },
            { q: 'Xác suất để tung 2 đồng xu đều ra mặt Sấp là:', a: '1/2', b: '1/3', c: '1/4', d: '1/8', r: 'C' },
            { q: 'Xác suất để tung 2 đồng xu có ít nhất một mặt Ngửa là:', a: '1/4', b: '1/2', c: '3/4', d: '1', r: 'C' },
            { q: 'Nếu tung 100 lần thấy 52 lần Ngửa, tần suất thực nghiệm mặt Ngửa là:', a: '52%', b: '48%', c: '50%', d: '100%', r: 'A' },
            { q: 'Không gian mẫu khi tung một đồng xu là:', a: '{Ngửa}', b: '{Sấp}', c: '{Ngửa, Sấp}', d: '{1, 2, 3, 4, 5, 6}', r: 'C' },
            { q: 'Một sự kiện không bao giờ xảy ra có xác suất bằng bao nhiêu?', a: '0', b: '1', c: '-1', d: '0.5', r: 'A' }
        ]
    };

    try {
        for (const [expId, quizzes] of Object.entries(mathQuizzes)) {
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
        console.error('Lỗi khi nạp câu hỏi Toán học:');
        console.error(err);
        process.exit(1);
    }
}

populateMathQuizzes();

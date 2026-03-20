const db = require('./config/db');

async function populateBiologyQuizzes() {
    const biologyQuizzes = {
        'cell-structure': [
            { q: 'Cấu tạo cơ bản của tế bào nhân thực gồm những thành phần nào?', a: 'Màng sinh chất, Tế bào chất, Nhân', b: 'Vỏ capsid, ADN', c: 'Thành xenlulozo, Diệp lục', d: 'Màng protein, Ribosome', r: 'A' },
            { q: 'Tế bào thực vật có đặc điểm gì khác biệt so với tế bào động vật?', a: 'Có nhân thực', b: 'Có thành tế bào và lục lạp', c: 'Có ty thể', d: 'Có màng tế bào', r: 'B' },
            { q: 'Bào quan nào là "nhà máy năng lượng" của tế bào (nơi diễn ra hô hấp tế bào)?', a: 'Nhân', b: 'Ty thể', c: 'Bộ máy Golgi', d: 'Lưới nội chất', r: 'B' },
            { q: 'Lục lạp có chức năng gì trong tế bào thực vật?', a: 'Lưu trữ di truyền', b: 'Quang hợp tạo chất hữu cơ', c: 'Tổng hợp protein', d: 'Tiêu hóa chất bẩn', r: 'B' },
            { q: 'Màng sinh chất có vai trò gì?', a: 'Bảo vệ và trao đổi chất có chọn lọc', b: 'Làm cứng tế bào', c: 'Chứa thông tin di truyền', d: 'Tạo hình dạng cho cây', r: 'A' },
            { q: 'Nhân tế bào chứa đại lượng nào đóng vai trò di truyền?', a: 'Lipid', b: 'Đường', c: 'ADN (Acid Deoxyribonucleic)', d: 'Vitamin', r: 'C' },
            { q: 'Thành tế bào thực vật cấu tạo chủ yếu từ:', a: 'Protein', b: 'Xenlulozo', c: 'Tinh bột', d: 'Chất béo', r: 'B' },
            { q: 'Không bào ở tế bào thực vật thường có kích thước như thế nào?', a: 'Rất nhỏ hoặc không có', b: 'Lớn, chứa dịch tế bào', c: 'Nằm bên trong nhân', d: 'Có màu đỏ', r: 'B' },
            { q: 'Đơn vị cấu tạo nên mọi cơ thể sống là gì?', a: 'Các cơ quan', b: 'Mô', c: 'Tế bào', d: 'Phân tử nước', r: 'C' },
            { q: 'Tại sao động vật có thể di chuyển còn thực vật thì thường đứng yên?', a: 'Vì động vật có chân', b: 'Vì tế bào động vật không có thành xenlulozo cứng nhắc', c: 'Vì thực vật không có ty thể', d: 'Vì động vật thông minh hơn', r: 'B' }
        ],
        'photosynthesis': [
            { q: 'Quang hợp là quá trình cây xanh sử dụng năng lượng nào?', a: 'Nhiệt năng', b: 'Năng lượng ánh sáng Mặt Trời', c: 'Năng lượng hóa học', d: 'Điện năng', r: 'B' },
            { q: 'Phương trình tổng quát của quang hợp là:', a: 'Cacbonic + Nước -> Chất hữu cơ + Oxy', b: 'Oxy + Nước -> Chất hữu cơ + Cacbonic', c: 'Chất hữu cơ + Oxy -> Cacbonic + Nước', d: 'Đường + Oxy -> Nước', r: 'A' },
            { q: 'Sắc tố màu xanh đóng vai trò quan trọng nhất trong quang hợp là:', a: 'Carotenoid', b: 'Diệp lục (Chlorophyll)', c: 'Hemoglobin', d: 'Melanin', r: 'B' },
            { q: 'Khí nào được thải ra ngoài môi trường sau quá trình quang hợp?', a: 'Khí CO2', b: 'Khí Oxy (O2)', c: 'Khí Nito', d: 'Hơi nước nóng', r: 'B' },
            { q: 'Quá trình quang hợp diễn ra chủ yếu ở bộ phận nào của cây?', a: 'Rễ', b: 'Thân', c: 'Lá', d: 'Hoa', r: 'C' },
            { q: 'Ánh sáng Mặt Trời cung cấp yếu tố gì cho quang hợp?', a: 'Nước', b: 'Năng lượng', c: 'Khoáng chất', d: 'Oxy', r: 'B' },
            { q: 'Sản phẩm hữu cơ đầu tiên của quang hợp là:', a: 'Protein', b: 'Đường (Glucôzo)', c: 'Dầu ăn', d: 'Sáp', r: 'B' },
            { q: 'Tại sao quang hợp có ý nghĩa sống còn đối với sinh giới?', a: 'Cung cấp thức ăn (chất hữu cơ)', b: 'Cung cấp Oxy cho sự hô hấp', c: 'Làm giảm Hiệu ứng nhà kính', d: 'Tất cả các ý trên', r: 'D' },
            { q: 'Cây thường quang hợp mạnh nhất vào thời điểm nào?', a: 'Ban đêm', b: 'Khi có ánh sáng đầy đủ', c: 'Lúc trời mưa', d: 'Lúc trời tối', r: 'B' },
            { q: 'Hô hấp của thực vật diễn ra vào lúc nào?', a: 'Chỉ ban đêm', b: 'Chỉ ban ngày', c: 'Cả ngày lẫn đêm', d: 'Không bao giờ', r: 'C' }
        ],
        'food-chain': [
            { q: 'Trong một chuỗi thức ăn, sinh vật nào luôn đứng ở vị trí đầu tiên?', a: 'Sinh vật sản xuất (Cây xanh)', b: 'Sinh vật tiêu thụ bậc 1', c: 'Sinh vật tiêu thụ bậc cuối', d: 'Vi sinh vật phân giải', r: 'A' },
            { q: 'Dòng năng lượng trong chuỗi thức ăn truyền theo hướng nào?', a: 'Từ sinh vật sản xuất lên các bậc tiêu thụ cao hơn', b: 'Từ động vật ăn thịt xuống thực vật', c: 'Xoay vòng liên tục', d: 'Ngẫu nhiên', r: 'A' },
            { q: 'Nguồn năng lượng sơ cấp cho mọi chuỗi thức ăn trên Trái Đất là:', a: 'Năng lượng lòng đất', b: 'Năng lượng gió', c: 'Năng lượng mặt trời', d: 'Năng lượng hóa học', r: 'C' },
            { q: 'Động vật ăn cỏ thường được gọi là gì trong chuỗi thức ăn?', a: 'Sinh vật sản xuất', b: 'Sinh vật tiêu thụ bậc 1', c: 'Sinh vật tiêu thụ bậc 2', d: 'Kẻ săn mồi', r: 'B' },
            { q: 'Vi sinh vật phân giải (nấm, vi khuẩn) có vai trò gì?', a: 'Tạo ra oxy cho cây', b: 'Phân hủy chất hữu cơ xác chết thành chất vô cơ cho cây xanh', c: 'Săn mồi các động vật lớn', d: 'Ăn các sinh vật sản xuất', r: 'B' },
            { q: 'Chuỗi thức ăn: Cỏ -> Châu chấu -> Ếch -> Rắn. Ếch thuộc bậc tiêu thụ mấy?', a: 'Bậc 1', b: 'Bậc 2', c: 'Bậc 3', d: 'Sinh vật sản xuất', r: 'B' },
            { q: 'Trong chuỗi Cỏ -> Thỏ -> Cáo, nếu Thỏ biến mất thì Cáo sẽ:', a: 'Tăng số lượng', b: 'Giảm số lượng hoặc chết đói', c: 'Không bị ảnh hưởng', d: 'Chuyển sang ăn Cỏ', r: 'B' },
            { q: 'Dấu mũi tên (->) trong chuỗi thức ăn có nghĩa là gì?', a: 'Đuổi theo', b: 'Bị ăn bởi', c: 'Sinh ra bởi', d: 'Chống lại', r: 'B' },
            { q: 'Bậc dinh dưỡng cao nhất trong chuỗi thức ăn thường là:', a: 'Các loài thú săn mồi lớn (như Hổ, Đại bàng)', b: 'Côn trùng nhỏ', c: 'Rêu', d: 'Giun đất', r: 'A' },
            { q: 'Tại sao một chuỗi thức ăn thường không quá dài (thường < 5-6 mắt xích)?', a: 'Vì sinh vật quá to', b: 'Vì năng lượng bị thất thoát dần qua các bậc (khoảng 90%)', c: 'Vì sinh vật lười săn mồi', d: 'Vì không có đủ động vật', r: 'B' }
        ],
        'food-web': [
            { q: 'Lưới thức ăn là gì?', a: 'Tập hợp các chuỗi thức ăn có chung mắt xích', b: 'Một mạng lưới dùng để đánh cá', c: 'Danh sách các loài động vật', d: 'Chuỗi thức ăn chỉ gồm thực vật', r: 'A' },
            { q: 'Tại sao lưới thức ăn trong tự nhiên lại phức tạp?', a: 'Vì một loài sinh vật có thể ăn nhiều loài khác nhau', b: 'Vì sinh vật rất thông minh', c: 'Vì có quá nhiều oxy', d: 'Để trang trí cho rừng xanh', r: 'A' },
            { q: 'Tính ổn định của hệ sinh thái phụ thuộc vào yếu tố nào?', a: 'Độ đa dạng (càng nhiều mắt xích, lưới càng phức tạp thì càng ổn định)', b: 'Kích thước của rừng', c: 'Số lượng sông ngòi', d: 'Nhiệt độ môi trường', r: 'A' },
            { q: 'Nếu một mắt xích trong lưới thức ăn bị mất đi:', a: 'Toàn bộ lưới sụp đổ ngay lập tức', b: 'Ảnh hưởng đến nhiều loài khác có liên quan', c: 'Không có ảnh hưởng gì', d: 'Chỉ có sinh vật sản xuất bị ảnh hưởng', r: 'B' },
            { q: 'Con người nằm ở vị trí nào trong lưới thức ăn?', a: 'Chỉ là sinh vật sản xuất', b: 'Mắt xích cuối cùng (sinh vật tiêu thụ bậc cao)', c: 'Không thuộc hệ sinh thái', d: 'Sinh vật phân giải', r: 'B' },
            { q: 'Một loài đóng vai trò là sinh vật tiêu thụ bậc 1 trong chuỗi này, có thể là bậc 2 trong chuỗi khác không?', a: 'Có thể', b: 'Không thể', c: 'Chỉ có thực vật mới làm được', d: 'Tùy vào thời tiết', r: 'A' },
            { q: 'Quần xã sinh vật có lưới thức ăn càng phức tạp thì:', a: 'Càng dễ bị diệt vong', b: 'Càng bền vững trước các thay đổi môi trường', c: 'Càng có ít sinh vật', d: 'Càng nghèo nàn', r: 'B' },
            { q: 'Sinh vật nào có mặt trong hầu hết các lưới thức ăn?', a: 'Sư tử', b: 'Cây xanh (Cỏ)', c: 'Cá mập', d: 'Chim ưng', r: 'B' },
            { q: 'Sự truyền năng lượng trong lưới thức ăn cũng giống chuỗi thức ăn ở điểm:', a: 'Luôn bị hao hụt khi đi qua các bậc', b: 'Năng lượng tăng dần', c: 'Không bị mất mát', d: 'Chỉ truyền trong các động vật ăn cỏ', r: 'A' },
            { q: 'Sinh vật ăn tạp (ăn cả thực vật và động vật) có vai trò gì?', a: 'Giúp lưới thức ăn trở nên kết nối chặt chẽ hơn', b: 'Làm sụt giảm số lượng sinh vật sản xuất nhanh chóng', c: 'Chỉ ăn các xác thối', d: 'Không có vai trò gì', r: 'A' }
        ],
        'digestion': [
            { q: 'Hệ tiêu hóa ở người bắt đầu từ đâu và kết thúc ở đâu?', a: 'Miệng đến Dạ dày', b: 'Miệng đến Hậu môn', c: 'Thực quản đến Dạ dày', d: 'Mũi đến Phổi', r: 'B' },
            { q: 'Quá trình tiêu hóa cơ học quan trọng nhất diễn ra ở đâu?', a: 'Thực quản', b: 'Miệng (nhai) và Dạ dày (co bóp)', c: 'Gan', d: 'Tụy', r: 'B' },
            { q: 'Enzyme trong nước bọt giúp biến đổi tinh bột chín thành đường là gì?', a: 'Amylase (Amilaza)', b: 'Pepsin', c: 'Lipase', d: 'Trypsin', r: 'A' },
            { q: 'Dạ dày tiết ra dịch gì để tiêu hóa protein?', a: 'Mật', b: 'Dịch vị (như HCl và Pepsin)', c: 'Nước lã', d: 'Dịch tụy', r: 'B' },
            { q: 'Ruột non có vai trò chính là gì?', a: 'Hấp thụ hầu hết các chất dinh dưỡng vào máu', b: 'Chỉ chứa phân', c: 'Hô hấp', d: 'Nghiền nát thức ăn lần cuối', r: 'A' },
            { q: 'Gan tiết ra dịch gì giúp tiêu hóa (nhũ hóa) chất béo?', a: 'Dịch vị', b: 'Dịch mật', c: 'Dịch tụy', d: 'Axit clohydric', r: 'B' },
            { q: 'Ruột già chủ yếu có chức năng gì?', a: 'Hấp thụ nước và tạo phân', b: 'Tiêu hóa protein', c: 'Lọc máu', d: 'Bơm máu', r: 'A' },
            { q: 'Thức ăn sau khi xuống thực quản sẽ vào:', a: 'Phổi', b: 'Dạ dày', c: 'Gan', d: 'Tim', r: 'B' },
            { q: 'Tại sao nhai kỹ lại giúp tiêu hóa tốt hơn?', a: 'Làm nhỏ thức ăn tăng diện tích tiếp xúc với enzyme', b: 'Cho đỡ mỏi miệng', c: 'Để thức ăn nhanh nguội', d: 'Để phân biệt vị ngon', r: 'A' },
            { q: 'Hành trình của thức ăn trong ống tiêu hóa lần lượt qua:', a: 'Miệng, Dạ dày, Thực quản, Ruột', b: 'Miệng, Thực quản, Dạ dày, Ruột non, Ruột già', c: 'Thực quản, Miệng, Ruột, Dạ dày', d: 'Dạ dày, Miệng, Thực quản, Ruột', r: 'B' }
        ],
        'heart-pump': [
            { q: 'Tim người có cấu tạo gồm mấy ngăn?', a: '2 ngăn', b: '3 ngăn', c: '4 ngăn', d: '1 ngăn', r: 'C' },
            { q: 'Máu từ Tim đi nuôi cơ thể chứa nhiều khí gì?', a: 'Khí Cacbonic (CO2)', b: 'Khí Oxy (O2)', c: 'Khí Nito', d: 'Khí Hidro', r: 'B' },
            { q: 'Ngăn nào của tim đẩy máu đi nuôi khắp cơ thể?', a: 'Tâm nhĩ phải', b: 'Tâm nhĩ trái', c: 'Tâm thất phải', d: 'Tâm thất trái (thành cơ dày nhất)', r: 'D' },
            { q: 'Mạch máu dẫn máu TỪ tim đi gọi là gì?', a: 'Động mạch', b: 'Tĩnh mạch', c: 'Mao mạch', d: 'Hạch bạch huyết', r: 'A' },
            { q: 'Mạch máu dẫn máu VỀ tim gọi là gì?', a: 'Động mạch', b: 'Tĩnh mạch', c: 'Phế nang', d: 'Cuống phổi', r: 'B' },
            { q: 'Tim hoạt động như một cái gì?', a: 'Cái lọc', b: 'Cái bơm', c: 'Cái loa', d: 'Cái gương', r: 'B' },
            { q: 'Nhịp tim của người trưởng thành lúc nghỉ ngơi trung bình khoảng bao nhiêu?', a: '20-30 lần/phút', b: '70-80 lần/phút', c: '150-200 lần/phút', d: '500 lần/phút', r: 'B' },
            { q: 'Khi vận động mạnh, nhịp tim sẽ:', a: 'Tăng lên để cung cấp thêm oxy cho cơ bắp', b: 'Giảm đi cho đỡ mệt', c: 'Không thay đổi', d: 'Dừng lại hít thở', r: 'A' },
            { q: 'Huyết áp là gì?', a: 'Trọng lượng của máu', b: 'Áp lực của máu lên thành mạch', c: 'Tốc độ máu chảy', d: 'Nhiệt độ của máu', r: 'B' },
            { q: 'Hệ tuần hoàn gồm những thành phần chính nào?', a: 'Tim, Mạch máu và Máu', b: 'Phổi và Tim', c: 'Dạ dày và Ruột', d: 'Xương và Cơ', r: 'A' }
        ]
    };

    try {
        for (const [expId, quizzes] of Object.entries(biologyQuizzes)) {
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
        console.error('Lỗi khi nạp câu hỏi Sinh học:', err);
        process.exit(1);
    }
}

populateBiologyQuizzes();

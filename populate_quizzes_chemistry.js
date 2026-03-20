const db = require('./config/db');

async function populateChemistryQuizzes() {
    const chemistryQuizzes = {
        'balancing-equations': [
            { q: 'Phản ứng nào sau đây được cân bằng đúng?', a: 'H2 + O2 -> H2O', b: '2H2 + O2 -> 2H2O', c: 'H2 + 2O2 -> H2O', d: 'H + O -> HO', r: 'B' },
            { q: 'Trong phản ứng Fe + Cl2 -> FeCl3, hệ số của Fe và Cl2 lần lượt là bao nhiêu để cân bằng?', a: '1, 1', b: '2, 3', c: '3, 2', d: '2, 2', r: 'B' },
            { q: 'Định luật nào là cơ sở của việc cân bằng phương trình hóa học?', a: 'Định luật Ohm', b: 'Định luật bảo toàn khối lượng', c: 'Định luật vạn vật hấp dẫn', d: 'Định luật Archimedes', r: 'B' },
            { q: 'Chất tham gia phản ứng nằm ở phía nào của mũi tên?', a: 'Bên phải', b: 'Bên trái', c: 'Trên mũi tên', d: 'Dưới mũi tên', r: 'B' },
            { q: 'Chất sản phẩm nằm ở phía nào của mũi tên?', a: 'Bên trái', b: 'Bên phải', c: 'Trước khi phản ứng', d: 'Không xác định', r: 'B' },
            { q: 'Hệ số đứng trước mỗi chất trong phương trình cho biết:', a: 'Khối lượng chất', b: 'Số mol/số phân tử tham gia', c: 'Nhiệt độ phản ứng', d: 'Thể tích chất lỏng', r: 'B' },
            { q: 'Cân bằng phản ứng Al + O2 -> Al2O3. Hệ số của Al là:', a: '2', b: '3', c: '4', d: '5', r: 'C' },
            { q: 'Nếu một phương trình chưa cân bằng, ta có:', a: 'Số nguyên tử mỗi nguyên tố ở hai vế không bằng nhau', b: 'Khối lượng vế trái không bằng vế phải', c: 'Cả A và B đều đúng', d: 'Cả A và B đều sai', r: 'C' },
            { q: 'Phản ứng 2Mg + O2 -> 2MgO thuộc loại phản ứng gì?', a: 'Hóa hợp', b: 'Phân hủy', c: 'Thế', d: 'Trao đổi', r: 'A' },
            { q: 'Nhà khoa học nào đã phát biểu định luật bảo toàn khối lượng?', a: 'Newton', b: 'Lavoisier', c: 'Einstein', d: 'Mendeleev', r: 'B' }
        ],
        'dilution': [
            { q: 'Khi pha loãng một dung dịch bằng cách thêm dung môi (nước), nồng độ mol của nó sẽ:', a: 'Tăng lên', b: 'Giảm đi', c: 'Không đổi', d: 'Tùy loại chất', r: 'B' },
            { q: 'Công thức pha loãng dung dịch là:', a: 'C1.V1 = C2.V2', b: 'C1/V1 = C2/V2', c: 'C1 + V1 = C2 + V2', d: 'C1.V2 = C2.V1', r: 'A' },
            { q: 'Trong phản ứng pha loãng, đại lượng nào sau đây không thay đổi?', a: 'Thể tích dung dịch', b: 'Số mol chất tan', c: 'Nồng độ mol', d: 'Khối lượng riêng', r: 'B' },
            { q: 'Nồng độ mol (CM) có đơn vị là:', a: 'g/ml', b: 'Mol/lit (M)', c: 'Kilôgam (kg)', d: 'Phần trăm (%)', r: 'B' },
            { q: 'Để pha loãng Axit Sunfuric (H2SO4) đặc an toàn, ta phải làm thế nào?', a: 'Đổ nước nhanh vào axit', b: 'Đổ từ từ axit vào nước và khuấy nhẹ', c: 'Đổ hai chất vào cùng lúc', d: 'Lắc mạnh chai axit', r: 'B' },
            { q: 'Dung môi phổ biến nhất trong hóa học là:', a: 'Cồn', b: 'Benzen', c: 'Nước', d: 'Dầu ăn', r: 'C' },
            { q: 'Nếu pha loãng một dung dịch có nồng độ 1M lên gấp đôi thể tích, nồng độ mới là:', a: '2M', b: '0.5M', c: '1M', d: '0.2M', r: 'B' },
            { q: 'Khi pha loãng, màu sắc của dung dịch (nếu có màu) thường:', a: 'Đậm lên', b: 'Nhạt đi', c: 'Biến mất hoàn toàn', d: 'Chuyển sang màu khác', r: 'B' },
            { q: 'Pha chế 500ml dung dịch NaCl 1M cần bao nhiêu mol NaCl?', a: '0.5 mol', b: '1 mol', c: '2 mol', d: '500 mol', r: 'A' },
            { q: 'Để tăng nồng độ của một dung dịch loãng, ta có thể:', a: 'Thêm dung môi', b: 'Làm bay hơi bớt dung môi hoặc thêm chất tan', c: 'Làm lạnh dung dịch', d: 'Lắc mạnh', r: 'B' }
        ],
        'magnesium-burn': [
            { q: 'Hiện tượng khi đốt dây Magie (Mg) trong không khí là gì?', a: 'Cháy với ngọn lửa xanh nhạt', b: 'Cháy với ngọn lửa sáng chói (trắng)', c: 'Không cháy, chỉ nóng chảy', d: 'Tạo ra khói đen', r: 'B' },
            { q: 'Sản phẩm sau khi đốt cháy Mg là chất gì?', a: 'MgO (Magie Oxit)', b: 'Mg(OH)2', c: 'MgCl2', d: 'Mg(NO3)2', r: 'A' },
            { q: 'Bột (tro) thu được sau khi đốt Mg có màu gì?', a: 'Màu xám', b: 'Màu đen', c: 'Màu trắng', d: 'Màu vàng', r: 'C' },
            { q: 'Phương trình hóa học của phản ứng là:', a: 'Mg + O2 -> MgO', b: '2Mg + O2 -> 2MgO', c: 'Mg + O -> MgO', d: 'Mg2 + O2 -> 2MgO', r: 'B' },
            { q: 'Phản ứng của Mg với O2 thuộc loại phản ứng gì?', a: 'Oxy hóa - khử', b: 'Phân hủy', c: 'Trao đổi', d: 'Trung hòa', r: 'A' },
            { q: 'Tại sao không nên nhìn trực tiếp vào dây Magie đang cháy?', a: 'Vì khói độc', b: 'Vì ánh sáng quá mạnh có thể làm hỏng mắt', c: 'Vì nó sẽ nổ', d: 'Vì nó rất nóng', r: 'B' },
            { q: 'Khối lượng tro thu được so với khối lượng dây Mg ban đầu như thế nào?', a: 'Lớn hơn (do kết hợp thêm Oxy)', b: 'Nhỏ hơn', c: 'Bằng nhau', d: 'Bằng một nửa', r: 'A' },
            { q: 'Oxy đóng vai trò gì trong phản ứng này?', a: 'Chất khử', b: 'Chất oxy hóa', c: 'Chất xúc tác', d: 'Dung môi', r: 'B' },
            { q: 'Mg đóng vai trò gì trong phản ứng?', a: 'Chất khử', b: 'Chất oxy hóa', c: 'Môi trường', d: 'Chất chỉ thị', r: 'A' },
            { q: 'Ứng dụng của phản ứng này trong thực tế là:', a: 'Làm đèn flash chụp ảnh thời xưa', b: 'Làm pháo hoa', c: 'Cả A và B', d: 'Làm pin điện thoại', r: 'C' }
        ],
        'precipitation': [
            { q: 'Kết tủa là gì?', a: 'Chất lỏng bay hơi', b: 'Chất rắn không tan được hình thành trong dung dịch', c: 'Chất khí thoát ra', d: 'Dung dịch đổi màu', r: 'B' },
            { q: 'Khi cho AgNO3 (Bạc nitrat) vào NaCl (Muối ăn), kết tủa thu được là:', a: 'AgCl (Bạc clorua)', b: 'NaNO3', c: 'AgNO3', d: 'Không có kết tủa', r: 'A' },
            { q: 'Kết tủa AgCl có màu gì đặc trưng?', a: 'Màu xanh', b: 'Màu trắng', c: 'Màu vàng', d: 'Màu đỏ', r: 'B' },
            { q: 'Ký hiệu nào thường được dùng sau công thức của một chất kết tủa?', a: 'Mũi tên lên (↑)', b: 'Mũi tên xuống (↓)', c: 'Dấu cộng (+)', d: 'Dấu bằng (=)', r: 'B' },
            { q: 'Phản ứng BaCl2 + Na2SO4 -> BaSO4 + 2NaCl tạo ra kết tủa nào?', a: 'BaCl2', b: 'Na2SO4', c: 'BaSO4', d: 'NaCl', r: 'C' },
            { q: 'Kết tủa BaSO4 có tính chất gì đặc biệt?', a: 'Tan trong axit mạnh', b: 'Không tan trong nước và các axit thông thường', c: 'Có màu tím', d: 'Dễ bay hơi', r: 'B' },
            { q: 'Khi cho NaOH vào dung dịch CuSO4, kết tủa thu được có màu:', a: 'Trắng', b: 'Xanh lam', c: 'Nâu đỏ', d: 'Đen', r: 'B' },
            { q: 'Kết tủa Cu(OH)2 có màu xanh lam là của nguyên tố nào?', a: 'Natri', b: 'Oxy', c: 'Đồng (Cu)', d: 'Hydro', r: 'C' },
            { q: 'Để tách kết tủa ra khỏi dung dịch, người ta dùng phương pháp gì?', a: 'Chưng cất', b: 'Lọc', b: 'Bay hơi', d: 'Chiết', r: 'B' },
            { q: 'Phản ứng tạo kết tủa thường là loại phản ứng:', a: 'Hóa hợp', b: 'Phân hủy', c: 'Trao đổi ion', d: 'Oxy hóa khử', r: 'C' }
        ],
        'ph-scale': [
            { q: 'Thang đo pH dùng để làm gì?', a: 'Đo độ nóng của dung dịch', b: 'Đo độ Axit hoặc Bazơ của dung dịch', c: 'Đo độ dẫn điện', d: 'Đo khối lượng', r: 'B' },
            { q: 'Thang đo pH thường có giá trị từ bao nhiêu đến bao nhiêu?', a: '0 đến 7', b: '7 đến 14', c: '0 đến 14', d: '-7 đến 7', r: 'C' },
            { q: 'Dung dịch trung tính (như nước tinh khiết) có pH bằng bao nhiêu?', a: '0', b: '7', c: '14', d: '3.5', r: 'B' },
            { q: 'Dung dịch có pH < 7 thuộc môi trường nào?', a: 'Axit', b: 'Bazơ (Kiềm)', c: 'Trung tính', d: 'Đệm', r: 'A' },
            { q: 'Dung dịch có pH > 7 thuộc môi trường nào?', a: 'Axit', b: 'Bazơ (Kiềm)', c: 'Trung tính', d: 'Nước muối', r: 'B' },
            { q: 'Nước chanh thường có pH vào khoảng bao nhiêu?', a: 'pH = 2 (Axit mạnh)', b: 'pH = 7 (Trung tính)', c: 'pH = 12 (Bazơ)', d: 'pH = 14', r: 'A' },
            { q: 'Dung dịch nào có tính Bazơ mạnh nhất?', a: 'Nước tinh khiết', b: 'Sữa', c: 'Dung dịch NaOH', d: 'Nước cam', r: 'C' },
            { q: 'Đồ ăn có tính axit thường có vị gì?', a: 'Đắng', b: 'Ngọt', c: 'Chua', d: 'Mặn', r: 'C' },
            { q: 'Các chất tẩy rửa như xà phòng thường có độ pH như thế nào?', a: 'pH < 7', b: 'pH > 7', c: 'pH = 7', d: 'pH = 0', r: 'B' },
            { q: 'Để đo pH chính xác nhất, người ta dùng thiết bị gì?', a: 'Nhiệt kế', b: 'Máy đo pH', c: 'Cân điện tử', d: 'Ống đong', r: 'B' }
        ],
        'acid-base': [
            { q: 'Phản ứng giữa Axit và Bazơ gọi là phản ứng gì?', a: 'Phản ứng cháy', b: 'Phản ứng trung hòa', c: 'Phản ứng phân hủy', d: 'Phản ứng kết tủa', r: 'B' },
            { q: 'Sản phẩm của phản ứng trung hòa luôn gồm chất nào?', a: 'Muối và Nước', b: 'Khí Hydro', c: 'Kết tủa đen', d: 'Dung dịch màu tím', r: 'A' },
            { q: 'Phương trình thu gọn của phản ứng trung hòa là:', a: 'H+ + OH- -> H2O', b: 'Na + Cl -> NaCl', c: 'H2 + O2 -> H2O', d: 'H + Cl -> HCl', r: 'A' },
            { q: 'Chất chỉ thị Phenolphthalein chuyển sang màu gì trong môi trường Bazơ?', a: 'Màu xanh', b: 'Màu hồng (tím)', c: 'Màu vàng', d: 'Không màu', r: 'B' },
            { q: 'Axit mạnh thường dùng trong phòng thí nghiệm là:', a: 'HCl', b: 'NaOH', c: 'NaCl', d: 'H2O', r: 'A' },
            { q: 'Bazơ mạnh thường dùng trong phòng thí nghiệm là:', a: 'H2SO4', b: 'NaOH', c: 'KNO3', d: 'CH3COOH', r: 'B' },
            { q: 'Nếu cho dư Axit vào hỗn hợp trung hòa, dung dịch sẽ có pH:', a: 'Bằng 7', b: 'Lớn hơn 7', c: 'Nhỏ hơn 7', d: 'Bằng 14', r: 'C' },
            { q: 'Ứng dụng của phản ứng trung hòa trong thực tế là:', a: 'Dùng thuốc đau dạ dày (chứa bazơ) để giảm axit', b: 'Xử lý nước thải axit bằng vôi bột', c: 'Cả A và B', d: 'Tạo ra lửa', r: 'C' },
            { q: 'Tại sao khi bị ong đốt (có axit) người ta thường bôi vôi hoặc xà phòng (bazơ)?', a: 'Để làm sạch', b: 'Để trung hòa nọc độc axit', c: 'Để vết thương mau khô', d: 'Để trang trí', r: 'B' },
            { q: 'Phản ứng trung hòa có tỏa nhiệt không?', a: 'Có, tỏa nhiệt', b: 'Không, làm lạnh đi', c: 'Nhiệt độ không đổi', d: 'Hấp thụ nhiệt mạnh', r: 'A' }
        ],
        'litmus-test': [
            { q: 'Giấy quỳ tím khi gặp dung dịch Axit sẽ chuyển sang màu gì?', a: 'Xanh', b: 'Đỏ (Hồng)', c: 'Tím', d: 'Vàng', r: 'B' },
            { q: 'Giấy quỳ tím khi gặp dung dịch Bazơ sẽ chuyển sang màu gì?', a: 'Đỏ', b: 'Xanh', c: 'Vàng', d: 'Cam', r: 'B' },
            { q: 'Dung dịch nước muối (NaCl) làm quỳ tím đổi sang màu gì?', a: 'Xanh', b: 'Đỏ', c: 'Không đổi màu (vẫn tím)', d: 'Trắng', r: 'C' },
            { q: 'Giấm ăn làm quỳ tím chuyển sang màu gì?', a: 'Xanh', b: 'Đỏ', c: 'Không đổi màu', d: 'Đen', r: 'B' },
            { q: 'Nước vôi trong làm quỳ tím chuyển sang màu gì?', a: 'Đỏ', b: 'Xanh', c: 'Vàng', d: 'Tím', r: 'B' },
            { q: 'Quỳ tím là một loại chất gì?', a: 'Chất xúc tác', b: 'Chất chỉ thị màu', c: 'Chất phản ứng', d: 'Chất tẩy rửa', r: 'B' },
            { q: 'Tại sao quỳ tím là công cụ phổ biến?', a: 'Vì nó rẻ, dễ dùng và nhận biết nhanh', b: 'Vì nó đắt tiền', c: 'Vì nó có thể ăn được', d: 'Vì nó đo được nhiệt độ', r: 'A' },
            { q: 'Nếu nhỏ một giọt nước tinh khiết vào giấy quỳ tím khô, màu của nó sẽ:', a: 'Chuyển sang đỏ', b: 'Chuyển sang xanh', c: 'Thấm ướt nhưng giữ nguyên màu tím', d: 'Hóa đen', r: 'C' },
            { q: 'So với máy đo pH, quỳ tím có nhược điểm gì?', a: 'Khó dùng hơn', b: 'Chỉ biết là axit/bazơ chứ không biết độ mạnh yếu chính xác bằng số', c: 'Gây nổ', d: 'Làm hỏng dung dịch', r: 'B' },
            { q: 'Nước xà phòng thường làm quỳ tím hóa màu gì?', a: 'Đỏ', b: 'Xanh', c: 'Không đổi màu', d: 'Màu vàng', r: 'B' }
        ],
        'acid-metal': [
            { q: 'Khi cho kim loại kẽm (Zn) vào axit HCl, hiện tượng quan sát được là:', a: 'Kim loại tan ra và có bọt khí thoát ra', b: 'Kim loại bốc cháy', c: 'Dung dịch kết tủa đen', d: 'Không có hiện tượng gì', r: 'A' },
            { q: 'Khí thoát ra trong phản ứng giữa Zn và HCl là khí gì?', a: 'Oxy (O2)', b: 'Hidro (H2)', c: 'Cacbonic (CO2)', d: 'Clo (Cl2)', r: 'B' },
            { q: 'Tính chất nào của khí Hidro (H2) giúp nhận biết nó?', a: 'Làm đục nước vôi trong', b: 'Làm tàn đốm đỏ bùng cháy', c: 'Cháy với tiếng nổ "pép" nhỏ hoặc ngọn lửa xanh nhạt', d: 'Có mùi trứng thối', r: 'C' },
            { q: 'Phương trình hóa học nào đúng cho phản ứng giữa kẽm và axit clohydric?', a: 'Zn + HCl -> ZnCl + H', b: 'Zn + 2HCl -> ZnCl2 + H2', c: '2Zn + HCl -> Zn2Cl + H2', d: 'Zn + HCl2 -> ZnCl2 + H', r: 'B' },
            { q: 'Kim loại nào sau đây KHÔNG phản ứng với axit HCl loãng?', a: 'Sắt (Fe)', b: 'Nhôm (Al)', c: 'Đồng (Cu)', d: 'Magie (Mg)', r: 'C' },
            { q: 'Phản ứng giữa kim loại và axit là loại phản ứng gì?', a: 'Hóa hợp', b: 'Phân hủy', c: 'Thế', d: 'Trung hòa', r: 'C' },
            { q: 'Để điều chế khí Hidro trong phòng thí nghiệm, người ta thường dùng cặp chất nào?', a: 'Zn và HCl', b: 'Cu và H2SO4 loãng', c: 'NaOH và HCl', d: 'CaCO3 và HCl', r: 'A' },
            { q: 'Khí Hidro nhẹ hay nặng hơn không khí?', a: 'Nặng hơn nhiều', b: 'Nhẹ hơn rất nhiều', c: 'Bằng nhau', d: 'Không xác định', r: 'B' },
            { q: 'Sau phản ứng, muối thu được tan trong dung dịch là muối gì (trong thí nghiệm Zn + HCl)?', a: 'ZnCl2 (Kẽm clorua)', b: 'ZnSO4', c: 'ZnO', d: 'H2O', r: 'A' },
            { q: 'Vì sao không dùng Đồng để điều chế Hidro theo cách này?', a: 'Vì Đồng quá đắt', b: 'Vì Đồng đứng sau Hidro trong dãy hoạt động hóa học, không đẩy được H ra khỏi axit loãng', c: 'Vì Đồng phản ứng quá mạnh gây nổ', d: 'Vì Đồng tạo ra khí CO2', r: 'B' }
        ]
    };

    try {
        for (const [expId, quizzes] of Object.entries(chemistryQuizzes)) {
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
        console.error('Lỗi khi nạp câu hỏi Hóa học:', err);
        process.exit(1);
    }
}

populateChemistryQuizzes();

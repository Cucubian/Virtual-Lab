# 🔬 Virtual Science Lab - Nền tảng Thí nghiệm Ảo STEM

![Banner](https://github.com/Cucubian/Virtual-Lab/raw/main/public/images/readme-banner.png)

## 🌟 Giới thiệu
**Virtual Science Lab** là một nền tảng giáo dục mô phỏng hiện đại, được thiết kế đặc biệt để giúp học sinh trung học cơ sở (THCS) tại Việt Nam tiếp cận tri thức khoa học thông qua các thực nghiệm số hóa. 

Dự án này ra đời nhằm xóa nhòa rào cản về cơ sở vật chất, giúp mọi học sinh — dù ở bất cứ đâu — đều có thể thực hiện những thí nghiệm vật lý, hóa học, sinh học một cách an toàn, chính xác và đầy hứng khởi.

---

## 🚀 Tính năng nổi bật

### 1. Hệ thống Thí nghiệm Tương tác
*   **Vật lý (Physics):** Mô phỏng Rơi tự do, Ma sát, Định luật động lực học... sử dụng engine vật lý chuẩn mực.
*   **Sinh học (Biology):** Khám phá Chuỗi thức ăn, Chu trình dinh dưỡng, Giải phẫu tim... với hình ảnh trực quan.
*   **Hóa học (Chemistry):** Thực hiện các phản ứng mà không lo rủi ro cháy nổ.

### 2. Hệ thống Trắc nghiệm (Quizzes)
*   Ngân hàng câu hỏi đa dạng theo từng môn học.
*   Chấm điểm tức thì, ghi nhận tiến bộ và lịch sử làm bài.

### 3. Trang Quản trị (Admin Dashboard)
*   Quản lý người dùng, theo dõi số liệu thống kê.
*   Giám sát hành trình học tập và kết quả của học sinh.
*   Tài khoản admin : admin
*   Mật khẩu admin : admin123

### 4. Giao diện Hiện đại
*   Thiết kế chuẩn STEM, tối giản nhưng cao cấp (High-end Editorial Layout).
*   Tương thích đa thiết bị (Responsive), hỗ trợ cả chế độ sáng/tối.

---

## 🛠️ Công nghệ sử dụng
Dự án được xây dựng dựa trên các công nghệ mạnh mẽ và ổn định:

*   **Backend:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
*   **Frontend:** [EJS](https://ejs.co/) (Templating Engine) & [Tailwind CSS](https://tailwindcss.com/)
*   **Database:** [MySQL](https://www.mysql.com/)
*   **Physics Engine:** [Matter-js](https://brm.io/matter-js/) (Cho các mô phỏng vật lý)
*   **Other Tools:** Chart.js, Bcrypt, Dotenv...

---

## 💻 Hướng dẫn cài đặt & Chạy ứng dụng

### Yêu cầu hệ thống
*   Đã cài đặt **Node.js** (Phiên bản v16 trở lên).
*   Đã cài đặt **MySQL Server**.

### Các bước thực hiện
1. **Clone repository:**
   ```bash
   git clone https://github.com/Cucubian/Virtual-Lab.git
   cd Virtual-Lab
   ```

2. **Cài đặt thư viện (Dependencies):**
   ```bash
   npm install
   ```

3. **Cấu hình môi trường (`.env`):**
   Tạo file `.env` tại thư mục gốc và điền thông tin Database của bạn:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=mật_khẩu_mysql
   DB_NAME=virtual_science_lab
   PORT=3000
   ```

4. **Biên dịch CSS:**
   ```bash
   npm run build:css
   ```

5. **Khởi chạy ứng dụng:**
   ```bash
   npm start
   ```
   Truy cập tại: `http://localhost:3000`

---

## 🌐 Tác giả & Liên hệ
Dự án được phát triển với niềm đam mê nâng tầm giáo dục STEM tại Việt Nam.

*   **Phát triển bởi:** STEM LAB VIỆT NAM
*   **Đơn vị:** [Tên trường của bạn]
*   **Email:** contact@stemlabvn.edu.vn
*   **Website:** [Link đến website nếu có]

---
*© 2026 Virtual Science Lab Project. All Rights Reserved.*

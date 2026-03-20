const db = require('./config/db');

async function updateQuizzes() {
    try {
        await db.execute('DELETE FROM quizzes WHERE experiment_id = ?', ['circle-area']);

        const newQuizzes = [
            {
                question: 'Trong một đường tròn, số đo góc nội tiếp bằng bao nhiêu lần số đo góc ở tâm cùng chắn một cung?',
                option_a: 'Bằng nhau',
                option_b: 'Gấp đôi',
                option_c: 'Bằng một nửa',
                option_d: 'Bằng một phần ba',
                correct_option: 'C'
            },
            {
                question: 'Nếu góc ở tâm chắn cung AB có số đo là 80 độ, thì góc nội tiếp chắn cung AB có số đo là:',
                option_a: '40 độ',
                option_b: '80 độ',
                option_c: '160 độ',
                option_d: '20 độ',
                correct_option: 'A'
            },
            {
                question: 'Góc nội tiếp chắn nửa đường tròn là góc gì?',
                option_a: 'Góc nhọn',
                option_b: 'Góc tù',
                option_c: 'Góc bẹt',
                option_d: 'Góc vuông',
                correct_option: 'D'
            }
        ];

        for (const q of newQuizzes) {
            await db.execute(
                'INSERT INTO quizzes (experiment_id, question, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)',
                ['circle-area', q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option]
            );
        }

        console.log('Đã cập nhật bộ câu hỏi mới cho bài Góc nội tiếp & Ở tâm.');
        process.exit();
    } catch (err) {
        console.error('Lỗi khi cập nhật câu hỏi:', err);
        process.exit(1);
    }
}

updateQuizzes();

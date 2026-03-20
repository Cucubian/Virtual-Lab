class QuizEngine {
    constructor(config) {
        this.questions = config.questions || [];
        this.container = document.getElementById(config.containerId);
        this.resultsId = config.resultsId;
        this.introId = config.introId;
        this.startBtnId = config.startBtnId;
        this.experimentId = config.experimentId;
        
        this.currentIndex = 0;
        this.score = 0;
        this.userAnswers = [];

        this.init();
    }

    init() {
        const startBtn = document.getElementById(this.startBtnId);
        if (startBtn) {
            startBtn.onclick = () => this.startQuiz();
        }
    }

    startQuiz() {
        if (this.questions.length === 0) {
            alert("Chưa có câu hỏi cho thí nghiệm này.");
            return;
        }
        document.getElementById(this.introId).style.display = 'none';
        this.container.style.display = 'block';
        this.renderQuestion();
    }

    renderQuestion() {
        const q = this.questions[this.currentIndex];
        const progress = ((this.currentIndex + 1) / this.questions.length) * 100;
        
        this.container.innerHTML = `
            <div class="quiz-header mb-12">
                <div class="flex justify-between items-end mb-4">
                    <span class="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Đang làm bài tập</span>
                    <span class="text-sm font-black text-slate-400">Câu ${this.currentIndex + 1} / ${this.questions.length}</span>
                </div>
                <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-primary transition-all duration-500" style="width: ${progress}%"></div>
                </div>
            </div>

            <h3 class="text-3xl md:text-4xl font-black text-slate-800 mb-12 leading-tight tracking-tight">${q.q}</h3>
            
            <div class="options-grid grid grid-cols-1 gap-4">
                ${q.a.map((opt, i) => `
                    <button class="option-btn glass-card p-6 md:p-8 flex items-center justify-between group/opt hover:border-primary/30 transition-all duration-300 border-2 border-transparent" data-idx="${i}">
                        <div class="flex items-center gap-6">
                            <span class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-sm font-black text-slate-400 group-hover/opt:bg-primary group-hover/opt:text-white transition-colors">
                                ${String.fromCharCode(65 + i)}
                            </span>
                            <span class="text-lg font-bold text-slate-600 group-hover/opt:text-slate-900 transition-colors">${opt}</span>
                        </div>
                    </button>
                `).join('')}
            </div>
        `;

        const btns = this.container.querySelectorAll('.option-btn');
        btns.forEach(btn => {
            btn.onclick = () => this.handleAnswer(parseInt(btn.dataset.idx));
        });
    }

    handleAnswer(idx) {
        if (this.isAnswering) return;
        this.isAnswering = true;

        const q = this.questions[this.currentIndex];
        const isCorrect = idx === q.correct;
        
        if (isCorrect) this.score++;
        this.userAnswers.push({ question: q.q, selected: idx, correct: q.correct, isCorrect });

        const btns = this.container.querySelectorAll('.option-btn');

        btns[idx].classList.add(isCorrect ? 'correct' : 'wrong');
        btns[idx].querySelectorAll('span').forEach(s => s.classList.add('!text-white'));
        
        if (!isCorrect) {
            btns[q.correct].classList.add('correct');
            btns[q.correct].querySelectorAll('span').forEach(s => s.classList.add('!text-white'));
        }

        setTimeout(() => {
            this.isAnswering = false;
            this.currentIndex++;
            if (this.currentIndex < this.questions.length) {
                this.renderQuestion();
            } else {
                this.showResults();
            }
        }, 1200);
    }

    showResults() {
        if (this.container) this.container.style.display = 'none';
        const resultsBox = document.getElementById(this.resultsId);
        if (!resultsBox) return;
        resultsBox.style.display = 'block';
        resultsBox.classList.add('animate-fade-in');
        
        const percent = Math.round((this.score / this.questions.length) * 100);
        let feedback = "Hãy cố gắng ôn tập thêm nhé!";
        let emoji = '📚';
        let colorClass = 'text-amber-500';
        let borderClass = 'border-amber-100';
        let bgClass = 'bg-amber-50/30';

        if (percent >= 80) { 
            feedback = "Tuyệt vời! Bạn đã nắm vững kiến thức."; 
            emoji = '🏆'; 
            colorClass = 'text-emerald-500';
            borderClass = 'border-emerald-100';
            bgClass = 'bg-emerald-50/30';
        } else if (percent >= 50) { 
            feedback = "Khá tốt! Bạn đang tiến bộ rất nhanh."; 
            emoji = '🌟'; 
            colorClass = 'text-indigo-500';
            borderClass = 'border-indigo-100';
            bgClass = 'bg-indigo-50/30';
        }

        resultsBox.innerHTML = `
            <div class="results-card glass-card p-12 md:p-16 text-center relative overflow-hidden flex flex-col items-center">
                <h2 class="text-4xl font-black text-slate-900 mb-4 tracking-tight">Hoàn thành bài tập!</h2>
                <p class="text-lg text-slate-500 mb-10 font-medium">Bạn đã trả lời đúng <span class="text-slate-900 font-black">${this.score}/${this.questions.length}</span> câu hỏi.</p>
                
                <!-- Score Display -->
                <div class="w-full max-w-sm mb-12 p-8 rounded-[32px] border ${borderClass} ${bgClass} backdrop-blur-md">
                    <div class="flex items-end justify-center gap-1 mb-2">
                        <span class="text-6xl font-black ${colorClass} tracking-tighter">${percent}</span>
                        <span class="text-2xl font-black ${colorClass} mb-2">%</span>
                    </div>
                    <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Tỉ lệ chính xác</p>
                    
                    <div class="w-full h-3 bg-white/50 rounded-full overflow-hidden p-0.5 border border-white/50">
                        <div class="progress-bar-fill h-full rounded-full transition-all duration-1000 ease-out" style="width: 0%; background: linear-gradient(90deg, #4f46e5, #818cf8);"></div>
                    </div>
                </div>

                <p class="text-xl font-bold text-slate-700 mb-12 max-w-md italic">"${feedback}"</p>
                
                <div class="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <button class="btn btn-primary px-12 py-5 text-lg rounded-2xl shadow-xl shadow-indigo-100/50 group" onclick="location.reload()">
                        Làm lại ngay 
                    </button>
                    <a href="/quizzes" class="btn bg-white text-slate-700 border border-slate-100 px-12 py-5 text-lg rounded-2xl hover:bg-slate-50"> Các bài học khác </a>
                </div>
            </div>
        `;

        // Send results to server
        this.sendResults(percent);

        // Animate progress bar
        setTimeout(() => {
            const fill = resultsBox.querySelector('.progress-bar-fill');
            if (fill) {
                fill.style.width = `${percent}%`;
                // If special score, change bar color
                if (percent >= 80) fill.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
                if (percent < 50) fill.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
            }
        }, 300);
    }

    async sendResults(percent) {
        try {
            const response = await fetch('/api/quiz-result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    experiment_id: this.experimentId,
                    score: percent,
                    total_questions: this.questions.length,
                    correct_answers: this.score
                })
            });
            const data = await response.json();
            if (data.success) {
                console.log('Results saved successfully');
            }
        } catch (err) {
            console.warn('Could not save results - user might not be logged in', err);
        }
    }
}
window.QuizEngine = QuizEngine;

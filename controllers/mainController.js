const dataModel = require('../models/dataModel');
const Quiz = require('../models/quizModel');
const History = require('../models/historyModel');

exports.getHome = (req, res) => {
    const subjects = dataModel.getSubjects();
    res.render('home', { subjects, title: 'Trang chủ' });
};

exports.getSubject = (req, res) => {
    const subjectId = req.params.name;
    const subject = dataModel.getSubjectById(subjectId);
    if (!subject) return res.status(404).send('Không tìm thấy môn học');
    
    const experiments = dataModel.getExperimentsBySubject(subjectId);
    res.render('subject', { subject, experiments, title: subject.name });
};

exports.getExperiment = async (req, res) => {
    const experimentId = req.params.id;
    const experiment = dataModel.getExperimentById(experimentId);
    if (!experiment) return res.status(404).send('Không tìm thấy thí nghiệm');
    
    // Fetch quizzes from DB for this experiment
    try {
        const dbQuizzes = await Quiz.getByExperimentId(experimentId);
        // Map DB options to existing frontend expected format if needed
        const formattedQuizzes = dbQuizzes.map(q => ({
            q: q.question,
            a: [q.option_a, q.option_b, q.option_c, q.option_d],
            correct: ['A', 'B', 'C', 'D'].indexOf(q.correct_option)
        }));

        const subject = dataModel.getSubjectById(experiment.subject);
        res.render('experiment', { 
            experiment: { ...experiment, quiz: formattedQuizzes }, 
            subject, 
            title: experiment.title 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi Server');
    }
};

exports.getQuizzes = async (req, res) => {
    try {
        // Fetch all experiments and check if they have quizzes in DB
        const allExperiments = dataModel.getAllExperiments();
        const quizzesInDb = await Quiz.getAll();
        
        // Filter experiments that have at least one quiz in DB
        const experimentIdsWithQuizzes = [...new Set(quizzesInDb.map(q => q.experiment_id))];
        const quizzes = allExperiments.filter(e => experimentIdsWithQuizzes.includes(e.id));
        
        // Enrich experiment with count and subject info
        const quizzesWithCounts = quizzes.map(e => {
            const subject = dataModel.getSubjectById(e.subject);
            return {
                ...e,
                quizCount: quizzesInDb.filter(q => q.experiment_id === e.id).length,
                subjectIcon: subject ? subject.icon : '❓',
                subjectName: subject ? subject.name : 'Khác',
                subjectLogo: subject ? subject.logo : ''
            };
        });

        const subjects = dataModel.getSubjects();
        res.render('quizzes', { 
            quizzes: quizzesWithCounts, 
            subjects,
            title: 'Hệ thống Trắc nghiệm' 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi Server');
    }
};

exports.postQuizResult = async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Chưa đăng nhập' });
    
    try {
        const { experiment_id, score, total_questions, correct_answers } = req.body;
        await History.add({
            user_id: req.session.userId,
            experiment_id,
            score,
            total_questions,
            correct_answers
        });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi khi lưu kết quả' });
    }
};

exports.getProfile = async (req, res) => {
    if (!req.session.userId) return res.redirect('/auth/login');
    
    try {
        const User = require('../models/userModel');
        const page = parseInt(req.query.page) || 1;
        const limit = 10; // 10 results per page as requested
        const offset = (page - 1) * limit;

        const [user, history, total, stats] = await Promise.all([
            User.findById(req.session.userId),
            History.getByUserIdPaginated(req.session.userId, limit, offset),
            History.countByUserId(req.session.userId),
            History.getStats(req.session.userId)
        ]);

        const totalPages = Math.ceil(total / limit);
        const experiments = dataModel.getAllExperiments();

        res.render('profile', { 
            title: 'Trang cá nhân', 
            user, 
            history, 
            stats,
            experiments,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi Server');
    }
};

exports.postUpdateProfile = async (req, res) => {
    if (!req.session.userId) return res.status(401).send('Unauthorized');
    
    try {
        const User = require('../models/userModel');
        await User.update(req.session.userId, req.body);
        res.redirect('/profile?success=profile_updated');
    } catch (err) {
        console.error(err);
        res.redirect('/profile?error=update_failed');
    }
};

exports.getAbout = (req, res) => {
    res.render('about', { title: 'Về chúng tôi' });
};

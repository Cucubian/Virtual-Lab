const Quiz = require('../models/quizModel');
const User = require('../models/userModel');
const History = require('../models/historyModel');
const dataModel = require('../models/dataModel'); // For experiments list
const db = require('../config/db');

exports.getDashboard = async (req, res) => {
    try {
        const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
        const [quizCount] = await db.execute('SELECT COUNT(*) as count FROM quizzes');
        const experiments = dataModel.getAllExperiments(); // Static list

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            stats: {
                users: userCount[0].count,
                quizzes: quizCount[0].count,
                experiments: experiments.length
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { title: '500', message: 'Lỗi khi tải Dashboard.' });
    }
};

exports.getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.getAll();
        const experiments = dataModel.getAllExperiments();
        res.render('admin/quizzes', { title: 'Quản lý Trắc nghiệm', quizzes, experiments });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi Server');
    }
};

exports.postAddQuiz = async (req, res) => {
    try {
        await Quiz.add(req.body);
        res.redirect('/admin/quizzes?success=add');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/quizzes?error=add');
    }
};

exports.postEditQuiz = async (req, res) => {
    try {
        await Quiz.update(req.params.id, req.body);
        res.redirect('/admin/quizzes?success=edit');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/quizzes?error=edit');
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        await Quiz.delete(req.params.id);
        res.redirect('/admin/quizzes?success=delete');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/quizzes?error=delete');
    }
};

exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || '';
        const limit = 10;
        const offset = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.findPaginated(limit, offset, search),
            User.count(search)
        ]);

        const totalPages = Math.ceil(total / limit);

        res.render('admin/users', { 
            title: 'Quản lý Người dùng', 
            users,
            search: search || '',
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

exports.deleteUser = async (req, res) => {
    try {
        await User.delete(req.params.id);
        res.redirect('/admin/users?success=delete');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/users?error=delete');
    }
};

exports.getStatistics = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const [history, total, globalStats] = await Promise.all([
            History.getAllPaginated(limit, offset),
            History.countAll(),
            History.getGlobalStats()
        ]);

        const totalPages = Math.ceil(total / limit);
        const experiments = dataModel.getAllExperiments();
        
        // Enrich history with experiment names
        const enrichedHistory = history.map(h => {
            const exp = experiments.find(e => e.id === h.experiment_id);
            return {
                ...h,
                experiment_title: exp ? exp.title : 'N/A'
            };
        });

        res.render('admin/statistics', { 
            title: 'Thống kê điểm số', 
            history: enrichedHistory,
            stats: {
                total: globalStats.total,
                avgScore: Math.round(globalStats.avgScore || 0)
            },
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

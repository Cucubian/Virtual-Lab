exports.isAdmin = (req, res, next) => {
    if (req.session.userId && req.session.userRole === 'admin') {
        next();
    } else {
        res.status(403).render('error', { title: '403', message: 'Bạn không có quyền truy cập trang này.' });
    }
};

exports.isLoggedIn = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

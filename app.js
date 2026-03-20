const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
require('dotenv').config();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session Setup
app.use(session({
    secret: 'stem-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Global Variables middleware
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.userId;
    res.locals.userRole = req.session.userRole || null;
    res.locals.username = req.session.username || null;
    next();
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// Error handling
app.use((req, res) => {
    res.status(404).render('error', { title: '404', message: 'Không tìm thấy trang' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Virtual Science Lab running at http://localhost:${PORT}`);
});

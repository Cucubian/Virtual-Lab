const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Transporter for sending emails
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.getLogin = (req, res) => {
    res.render('auth/login', { title: 'Đăng nhập', error: null });
};

exports.getRegister = (req, res) => {
    res.render('auth/register', { title: 'Đăng ký', error: null });
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.render('auth/login', { title: 'Đăng nhập', error: 'Tài khoản không tồn tại.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('auth/login', { title: 'Đăng nhập', error: 'Mật khẩu không chính xác.' });
        }

        // Set session
        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.username = user.username;

        if (user.role === 'admin') {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        res.render('auth/login', { title: 'Đăng nhập', error: 'Đã có lỗi xảy ra.' });
    }
};

exports.postRegister = async (req, res) => {
    let { username, email, password, full_name } = req.body;
    username = username ? username.trim() : '';
    email = email ? email.trim() : '';
    full_name = full_name ? full_name.trim() : '';
    try {
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.render('auth/register', { title: 'Đăng ký', error: 'Tên đăng nhập đã tồn tại.' });
        }

        await User.create({ username, email, password, full_name, role: 'student' });
        res.redirect('/auth/login?registered=true');
    } catch (err) {
        console.error(err);
        res.render('auth/register', { title: 'Đăng ký', error: 'Đã có lỗi xảy ra.' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

// Forgot Password
exports.getForgotPassword = (req, res) => {
    let error = null;
    if (req.query.error === 'invalid_session') {
        error = 'Phiên làm việc không hợp lệ hoặc đã hết hạn.';
    } else if (req.query.error) {
        error = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
    }
    res.render('auth/forgot-password', { title: 'Quên mật khẩu', error: error });
};

exports.postForgotPassword = async (req, res) => {
    const email = req.body.email ? req.body.email.trim() : '';
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.render('auth/forgot-password', { title: 'Quên mật khẩu', error: 'Email không tồn tại trong hệ thống.' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await User.setOtp(email, otp, expiresAt);

        // Send Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '[Virtual Lab] Mã xác thực khôi phục mật khẩu',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                    <h2 style="color: #4f46e5; text-align: center;">Xác thực tài khoản</h2>
                    <p>Chào bạn,</p>
                    <p>Bạn đã yêu cầu khôi phục mật khẩu. Dưới đây là mã xác thực <b>OTP</b> của bạn:</p>
                    <div style="background: #f3f4f6; padding: 15px; text-align: center; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #111827;">
                        ${otp}
                    </div>
                    <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Mã này sẽ hết hạn sau 10 phút. Vui lòng không cung cấp mã này cho bất kỳ ai.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #9ca3af; text-align: center;">Phòng Thí Nghiệm Ảo - STEM Project © 2026</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
        res.render('auth/verify-otp', { title: 'Xác thực OTP', email, error: null });
    } catch (err) {
        console.error('Error in postForgotPassword:', err);
        res.render('auth/forgot-password', { title: 'Quên mật khẩu', error: 'Lỗi khi gửi mail. Vui lòng thử lại sau.' });
    }
};

exports.postResendOtp = async (req, res) => {
    const email = req.body.email ? req.body.email.trim() : '';
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.json({ success: false, message: 'Email không tồn tại.' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await User.setOtp(email, otp, expiresAt);

        // Send Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '[Virtual Lab] Mã xác thực mới',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                    <h2 style="color: #4f46e5; text-align: center;">Mã xác thực mới</h2>
                    <p>Chào bạn,</p>
                    <p>Bạn đã yêu cầu gửi lại mã xác thực. Dưới đây là mã <b>OTP</b> mới của bạn:</p>
                    <div style="background: #f3f4f6; padding: 15px; text-align: center; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #111827;">
                        ${otp}
                    </div>
                    <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Mã này sẽ hết hạn sau 10 phút. Vui lòng không cung cấp mã này cho bất kỳ ai.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP resent to ${email}`);
        res.json({ success: true, message: 'Mã OTP mới đã được gửi.' });
    } catch (err) {
        console.error('Error in postResendOtp:', err);
        res.json({ success: false, message: 'Lỗi khi gửi lại mail.' });
    }
};

exports.getVerifyOtp = (req, res) => {
    const { email } = req.query;
    if (!email) return res.redirect('/auth/forgot-password');
    res.render('auth/verify-otp', { title: 'Xác thực OTP', email, error: null });
};

exports.postVerifyOtp = async (req, res) => {
    const email = req.body.email ? req.body.email.trim() : '';
    const otp = req.body.otp ? req.body.otp.trim() : '';
    
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            console.warn(`Verify OTP failed: User not found for email ${email}`);
            return res.render('auth/forgot-password', { title: 'Quên mật khẩu', error: 'Phiên làm việc đã hết hạn. Vui lòng thử lại.' });
        }

        if (user.otp_code !== otp) {
            console.warn(`Verify OTP failed: Wrong OTP for ${email}. Expected: ${user.otp_code}, Got: ${otp}`);
            return res.render('auth/verify-otp', { title: 'Xác thực OTP', email, error: 'Mã OTP không chính xác.' });
        }

        // Handle Date object or string from DB
        const expiryDate = user.otp_expires instanceof Date ? user.otp_expires : new Date(user.otp_expires);
        if (new Date() > expiryDate) {
            console.warn(`Verify OTP failed: OTP expired for ${email}. Expiry: ${expiryDate}, Now: ${new Date()}`);
            return res.render('auth/verify-otp', { title: 'Xác thực OTP', email, error: 'Mã OTP đã hết hạn.' });
        }

        res.render('auth/reset-password', { title: 'Mật khẩu mới', email, otp, error: null });
    } catch (err) {
        console.error('Error in postVerifyOtp:', err);
        res.status(500).send('Lỗi Server');
    }
};

exports.getResetPassword = (req, res) => {
    const { email, otp } = req.query;
    if (!email || !otp) return res.redirect('/auth/forgot-password');
    res.render('auth/reset-password', { title: 'Mật khẩu mới', email, otp, error: null });
};

exports.postResetPassword = async (req, res) => {
    const email = req.body.email ? req.body.email.trim() : '';
    const otp = req.body.otp ? req.body.otp.trim() : '';
    const { newPassword, confirmPassword } = req.body;
    
    if (newPassword !== confirmPassword) {
        return res.render('auth/reset-password', { title: 'Mật khẩu mới', email, otp, error: 'Mật khẩu xác nhận không khớp.' });
    }

    try {
        const user = await User.findByEmail(email);
        if (!user || user.otp_code !== otp) {
            console.warn(`Invalid reset attempt for ${email}. User found: ${!!user}, OTP match: ${user ? user.otp_code === otp : 'N/A'}`);
            return res.redirect('/auth/forgot-password?error=invalid_session');
        }

        // Optional: Check expiration again for safety
        if (new Date() > new Date(user.otp_expires)) {
            return res.render('auth/forgot-password', { title: 'Quên mật khẩu', error: 'Mã OTP đã hết hạn. Vui lòng bắt đầu lại.' });
        }

        await User.updatePassword(email, newPassword);
        await User.clearOtp(email);
        res.redirect('/auth/login?success=password_reset');
    } catch (err) {
        console.error('Error in postResetPassword:', err);
        res.render('auth/reset-password', { title: 'Mật khẩu mới', email, otp, error: 'Lỗi khi đặt lại mật khẩu.' });
    }
};

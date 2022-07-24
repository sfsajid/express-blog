const router = require('express').Router();
const {
    signupValidator,
    signinValidator,
    forgotPasswordValidator,
    passwordResetValidator,
} = require('../validators/authValidator');
const { isUnauthenticated, isUser, isVerified } = require('../middleware/authMiddleware');

const {
    getSignUp,
    postSignUp,
    getSignIn,
    postSignIn,
    signOut,
    verifyEmail,
    getForgotPassword,
    postForgotPassword,
    getResetPassword,
    postResetPassword,
    getVerifyEmail,
    postVerifyEmail,
} = require('../controllers/authController');

// SignUp
router.get('/signup', isUnauthenticated, getSignUp);
router.post('/signup', isUnauthenticated, signupValidator, postSignUp);

// Verify Email
router.get('/verify/:userId/:token', isUnauthenticated, verifyEmail);

// SignIn
router.get('/login', isUnauthenticated, getSignIn);
router.post('/login', isUnauthenticated, signinValidator, postSignIn);

// SignOut
router.get('/logout', signOut);

// Forgot Password
router.get('/recover', isUnauthenticated, getForgotPassword);
router.post('/recover', isUnauthenticated, forgotPasswordValidator, postForgotPassword);

// Reset Password
router.get('/recover/:userId/:token', isUnauthenticated, getResetPassword);
router.post(
    '/recover/:userId/:token',
    isUnauthenticated,
    passwordResetValidator,
    postResetPassword
);

// Verify Email
router.get('/verify', isUser, isVerified, getVerifyEmail);
router.post('/verify', isUser, isVerified, postVerifyEmail);

module.exports = router;

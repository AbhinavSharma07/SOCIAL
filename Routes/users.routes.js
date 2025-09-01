const express = require('express');
const { body, param } = require('express-validator');
const rateLimit = require('express-rate-limit');

const checkAuth = require('../Middleware/checkAuth.middleware');
const userControllers = require('../Controllers/users.controllers');

const router = express.Router();

// Rate limiter (applied to sensitive routes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: 'Too many attempts, try again later.'
});

// ========================= Auth =========================
router.post(
  '/signup',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('username').notEmpty().withMessage('Username required')
  ],
  userControllers.userRegister
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  userControllers.userLogin
);

// Optional 2FA route
router.post('/login/2fa', checkAuth, userControllers.verifyTwoFactor);

// ========================= User Profile =========================
router.get('/home', checkAuth, userControllers.get_post);

router.get('/user/:username', 
  checkAuth, 
  param('username').notEmpty().withMessage('Username required'), 
  userControllers.getMe
);

router.put(
  '/editprofile',
  checkAuth,
  [
    body('bio').optional().isLength({ max: 200 }).withMessage('Bio too long'),
    body('location').optional().isString()
  ],
  userControllers.updateProfile
);

// Get all users (for admin or explore page)
router.get('/users', checkAuth, userControllers.getAllUsers);

// Search users by username
router.get('/search', checkAuth, userControllers.searchUsers);

// Follow/Unfollow user
router.post('/follow/:userId', checkAuth, userControllers.followUser);
router.post('/unfollow/:userId', checkAuth, userControllers.unfollowUser);

// ========================= Posts =========================
router.post(
  '/newpost',
  checkAuth,
  [body('content').notEmpty().withMessage('Post content required')],
  userControllers.newpost
);

router.delete(
  '/deletePost/:post_id',
  checkAuth,
  param('post_id').isMongoId().withMessage('Invalid Post ID'),
  userControllers.deletePost
);

router.put(
  '/editPost/:post_id',
  checkAuth,
  param('post_id').isMongoId().withMessage('Invalid Post ID'),
  body('content').notEmpty().withMessage('Content required'),
  userControllers.editPost
);

// Like & Unlike Post
router.post('/like/:post_id', checkAuth, userControllers.likePost);
router.post('/unlike/:post_id', checkAuth, userControllers.unlikePost);

// Add Comment
router.post(
  '/comment/:post_id',
  checkAuth,
  [body('text').notEmpty().withMessage('Comment cannot be empty')],
  userControllers.addComment
);

// ========================= Password =========================
router.post('/forgotpassword', userControllers.forgotP);
router.post('/reset/:token', userControllers.resetP);

module.exports = router;

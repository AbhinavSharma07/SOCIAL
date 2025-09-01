const express = require('express');
const checkAuth = require('../Middleware/checkAuth.middleware');
const friendControllers = require('../Controllers/friend.controllers');

const router = express.Router();

/**
 * @route   POST /friends/send-request/:fId
 * @desc    Send a friend request
 * @access  Private
 */
router.post('/send-request/:fId', checkAuth, friendControllers.sendRequest);

/**
 * @route   POST /friends/:action/:fId
 * @desc    Handle friend request action (accept/decline/cancel)
 * @access  Private
 */
router.post('/:action/:fId', checkAuth, friendControllers.handleRequestAction);

/**
 * @route   GET /friends/list
 * @desc    Get user’s friend list
 * @access  Private
 */
router.get('/list', checkAuth, friendControllers.getFriendList);

module.exports = router;

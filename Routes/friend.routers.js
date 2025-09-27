const express = require('express');
const checkAuth = require('../Middleware/checkAuth.middleware');
const friendControllers = require('../Controllers/friendR.controllers');
const router = express.Router();

router.post('/sendReq/:fId', checkAuth, friendControllers.sendReq);

router.post('/:Action/:fId', checkAuth, friendControllers.Frirequest);

router.get('/friendlist', checkAuth, friendControllers.friendlist);


module.exports = router
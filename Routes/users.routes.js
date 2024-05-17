const express = require('express');
const checkAuth = require('../Middleware/checkAuth.middleware');
const userControllers = require('../Controllers/users.controllers');
const router = express.Router();

router.post('/signup', userControllers.userRegister);
router.post('/login', userControllers.userLogin);
router.get('/home', checkAuth, userControllers.get_post);
router.get('/user/:username', checkAuth, userControllers.getMe);
router.post('/forgotpassword', userControllers.forgotP);
router.post('/reset',userControllers.resetP)
router.post('/newpost', checkAuth, userControllers.newpost);
router.delete('/deletePost/:post_id', checkAuth, userControllers.deletePost)
router.put('/editprofile', checkAuth, userControllers.updateProfile)
 
module.exports = router
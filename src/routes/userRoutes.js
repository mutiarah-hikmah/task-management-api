
    const express = require('express');
    const router = express.Router();
    const userController = require('../controllers/userController');
    const authMiddleware = require('../middleware/authMiddleware'); 
    const upload = require('../middleware/uploadMiddleware'); 

    router.post('/register', userController.register);
    router.post('/login', userController.login);
    router.get('/me', authMiddleware, userController.getMe);
    router.put('/me', authMiddleware, upload.single('avatar'), userController.updateMe);me
    router.delete('/me', authMiddleware, userController.deleteMe);

    module.exports = router;

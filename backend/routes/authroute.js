const express = require('express');
const router = express.Router();
const authcontroller= require('../controllers/authcontroller');

router.post('/signup', authcontroller.registeruser);

router.post('/login' , authcontroller.loginuser);

module.exports = router;
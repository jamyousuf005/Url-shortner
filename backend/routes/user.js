const express = require('express')
const {hanldeUserSignup, hanldeUserLogin, handleUserLogout}= require('../controllers/user')
const router = express.Router()


router.post('/signup',hanldeUserSignup)
router.post('/login',hanldeUserLogin)
router.post('/logout',handleUserLogout)

module.exports=router
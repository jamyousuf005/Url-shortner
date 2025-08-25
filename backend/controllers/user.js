const { v4: uuidv4 } = require('uuid')
const User = require('../models/users')
const { setUser } = require('../service/auth')

async function hanldeUserSignup(req, res) {
    const { name, email, password } = req.body
    const newUser = await User.create({
        name,
        email,
        password
    })

    return res.json({ msg: 'user created', newUser })
}

async function hanldeUserLogin(req, res) {
    const { email, password } = req.body
    const user = await User.findOne({ email, password })
    if (!user) {
        return res.status(404).json({ msg: 'user not found' })
    }
   const token= setUser(user)
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    })

    return res.json({ msg: 'user loggedIn', token })
}

async function handleUserLogout(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    });
    return res.json({ msg: 'user logged out' });
}

module.exports = {
    hanldeUserSignup,
    hanldeUserLogin,
    handleUserLogout
}
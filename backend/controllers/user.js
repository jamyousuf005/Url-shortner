const User = require('../models/users');
const { setUser } = require('../service/auth');
const bcrypt = require('bcrypt');

async function hanldeUserSignup(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({ msg: 'User created successfully', userId: newUser._id });
    } catch (error) {
        console.error('Signup Error:', error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}

async function hanldeUserLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Incorrect password' });
        }

        const token = setUser(user);

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path : '/'
        })

        return res.json({ msg: 'User logged in', token , role:user.role});
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}

async function handleUserLogout(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path:'/'
    });
    return res.json({ msg: 'User logged out' });
}

module.exports = {
    hanldeUserSignup,
    hanldeUserLogin,
    handleUserLogout
};

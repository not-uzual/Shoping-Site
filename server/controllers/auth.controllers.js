const bcrypt = require('bcrypt');

const User = require('../models/user.model');
const generateToken = require('../config/genToken')

async function signup(req, res){

    const {name, email, password} = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
    })

    await newUser.save()

    const token = await generateToken(newUser._id)

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: none,
        secure: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
    })
    
    return res.status(201).json({ 
        message: 'User signed up',
        "token": token
    });
}

async function login(req, res){
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password)
        if (!isCorrectPassword) {
            return res.status(400).json({ message: "Password Incorret" });
        }
        
        const token = await generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: none,
            secure: true,
            maxAge: 15 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ 
            message: "User Logged in",
            "token": token
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error",
            error
         });
    }
}

function logout(req, res){
    try {
        res.cookie('token', '', {
            httpOnly: true,
            sameSite: none,
            secure: true,
            expires: new Date(0), 
            maxAge: 0 
        });

        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = { signup, login, logout }
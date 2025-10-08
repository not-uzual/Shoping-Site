const User = require('../models/user.model');

async function validateResponse(req, res, next){
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        const existingUserEmail = await User.findOne({ email });

        if(existingUserEmail){
            return res.status(400).json({ message: "Email already in use" });
        }

        if(password.length<6){
            return res.status(400).json({message: "Password must be at least 6 charecters"})
        }

        next()
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
}

module.exports = validateResponse
const User = require('../models/user.model')

async function getCurrentUser(req, res){
    const userId = req.userId;
    
    try {
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User Not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Server error" });
        
    }
};

module.exports = getCurrentUser;
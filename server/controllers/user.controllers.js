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

async function addNewAddress(req, res){
    try {
        const address = req.body;
        const userId = req.userId;

        if (!address.street || !address.city || 
            !address.state || !address.zipCode || !address.country || !address.type){
            return res.status(400).json({ message: "All required fields must be provided" });
        }
        
        const user = await User.findById(userId);
        if (!user){
            return res.status(404).json({ message: "User not found" });
        }
        
        if (!user.addresses) {
            user.addresses = [];
        }
        
        user.addresses.push(address);
        
        await user.save();

        return res.status(201).json({ 
            message: "Address added successfully", 
            address: user.addresses[user.addresses.length - 1] 
        });

    } catch (error) {
        console.error("Error adding address:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
}


module.exports = { getCurrentUser, addNewAddress };
const jwt = require('jsonwebtoken')

async function generateToken(id){    
    try {
        const token = jwt.sign({ id }, process.env.JWTSECRET, {
            expiresIn: '15d',
        });

        return token;
    } catch (error) {
        throw new Error("Error in generating token");
    }
}

module.exports = generateToken;
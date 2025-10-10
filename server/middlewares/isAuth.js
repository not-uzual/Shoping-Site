const jwt = require("jsonwebtoken");

async function isAuthenticated(req, res, next) {
  const token = req.cookies.token;
    
  if (!token) {
    return res.status(404).json({ message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET); 

    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not Valid" });
  }
}

module.exports = isAuthenticated;
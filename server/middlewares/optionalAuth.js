const jwt = require("jsonwebtoken");

async function optionalAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    req.userId = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET); 
    req.userId = decoded.id;
    next();
  } catch (error) {
    req.userId = null;
    next();
  }
}

module.exports = optionalAuth;

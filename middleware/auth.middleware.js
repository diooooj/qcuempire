const jwt = require("jsonwebtoken");

// Middleware to authenticate users (students or entrepreneurs)
const authenticateToken = (req, res, next) => {
  const token = req.cookies.auth_token; 

  if (!token) {
    return res.redirect("/login");
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "entrepreneur") {
      req.entrep = decoded;
    } else {
      req.user = decoded; 
    }

    next();
  } catch (error) {
    return res.redirect("/login");
  }
};

module.exports = authenticateToken;

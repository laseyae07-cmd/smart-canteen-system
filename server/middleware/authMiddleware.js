const jwt = require('jsonwebtoken');

// 1. Verify if the user is logged in (has a valid token)
const protect = (req, res, next) => {
  let token;

  // Check if the request headers contain an Authorization token formatted as "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the header (split 'Bearer' and the token string)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key. 
      // If valid, this decodes the payload we created during login { id, role }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded user data to the request object so the next function can use it
      req.user = decoded;

      // Move on to the actual route handler
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 2. Verify if the logged-in user is a staff member
const admin = (req, res, next) => {
  // We check req.user because the 'protect' middleware runs first and attaches it
  if (req.user && req.user.role === 'staff') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as staff' });
  }
};

module.exports = { protect, admin };
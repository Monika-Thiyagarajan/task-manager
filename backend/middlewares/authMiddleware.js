const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization'); // Get token from header

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const tokenValue = token.split(' ')[1]; // Extract actual token after "Bearer "
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.user = decoded.id; // Attach user ID to request
    next(); // Continue to next function
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

module.exports = authMiddleware;

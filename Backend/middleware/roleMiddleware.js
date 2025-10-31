// middleware/roleMiddleware.js
const User = require('../models/User');

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const userEmail = req.user.email; // from Firebase decoded token
      const dbUser = await User.findOne({ email: userEmail });

      if (!dbUser || !roles.includes(dbUser.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
      }

      req.dbUser = dbUser; // attach db user for later use
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error during role check' });
    }
  };
};

module.exports = { checkRole };

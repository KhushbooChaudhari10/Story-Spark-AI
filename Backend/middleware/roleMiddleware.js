// middleware/roleMiddleware.js
const User = require('../models/User');

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      // Firebase token only proves identity — not domain role
      // so we load user from MongoDB to enforce application-specific permissions
      const userEmail = req.user.email; 
      const dbUser = await User.findOne({ email: userEmail });

      // prevents child accounts from calling parent-only endpoints
      // also prevents random crafted tokens from bypassing authorization logic
      if (!dbUser || !roles.includes(dbUser.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
      }

      // make DB user accessible further down in the request pipeline
      // so controllers do not need to query user again
      req.dbUser = dbUser;

      next();
    } catch (err) {
      // logging server-side keeps debugging possible in production environments
      console.error(err);
      res.status(500).json({ message: 'Server error during role check' });
    }
  };
};

module.exports = { checkRole };

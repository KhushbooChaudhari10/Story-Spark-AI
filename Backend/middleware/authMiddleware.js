// middleware/authMiddleware.js
const admin = require("../config/firebase");

const verifyFirebaseToken = async (req, res, next) => {
  // extracting token from header lets us authenticate statelessly
  // server does not need to store session — frontend just sends token each request
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    // verifying token server-side prevents forged identities
    // even if someone manipulates frontend code, token must still be real + unexpired
    const decoded = await admin.auth().verifyIdToken(token);

    // attaching decoded info to req allows downstream handlers to know "who" called the endpoint
    // avoids re-checking Firebase for every subsequent step
    req.user = decoded;

    next(); // proceed to route execution
  } catch (error) {
    // logging helps track auth failures in deployment environments where frontend won't show stack traces
    console.error("Firebase token verification failed:", error);

    // sending 403 signals the token existed but could not be trusted/validated
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyFirebaseToken;

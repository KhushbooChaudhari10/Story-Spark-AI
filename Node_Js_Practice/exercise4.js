// Load environment variables from .env file for better security and configurability
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');     // For hashing passwords securely
const jwt = require('jsonwebtoken');    // For creating/verifying JWT tokens
const session = require('express-session'); // For server-side session management

const app = express();
const PORT = 3000;

/* -------------------------------------------------------
   Secrets and Configuration
   Secrets should always be stored in environment variables
   to prevent them from being exposed in version control.
------------------------------------------------------- */
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_demo_key';
const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecret_session_key';

app.use(express.json());

/* -------------------------------------------------------
   Session Middleware
   Enables session-based authentication for clients that
   prefer cookies over JWTs (e.g., browsers). 
   Note: "secure" should be true in HTTPS production environments.
------------------------------------------------------- */
app.use(session({
  secret: SESSION_SECRET,
  resave: false,                // Avoid resaving session if not modified
  saveUninitialized: false,     // Don’t save empty sessions
  cookie: { 
    secure: false,              // Set to true in production (requires HTTPS)
    maxAge: 3600000             // Auto-expire sessions after 1 hour
  }
}));

/* -------------------------------------------------------
   In-memory Database (for demo only)
   Keeps data during runtime, but not persistent.
   Replace this with a real database (MongoDB, PostgreSQL, etc.)
   in a production app.
------------------------------------------------------- */
let users = [];

/* -------------------------------------------------------
   Helper Function: generateToken
   Creates a short-lived (1h) JWT with minimal user data
   to keep it lightweight and secure (avoid sensitive info).
------------------------------------------------------- */
function generateToken(user) {
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

/* -------------------------------------------------------
   Hybrid Authentication Middleware
   Allows flexibility — validates users via either
   active session OR JWT token, depending on client type.
   This enables both web (cookie) and API (token) usage.
------------------------------------------------------- */
function authenticateHybrid(req, res, next) {
  // Check session first (server-stored authentication)
  if (req.session.userId) {
    req.userId = req.session.userId;
    return next();
  }

  // Fallback: JWT authentication (for APIs or mobile clients)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) return res.status(403).json({ message: 'Invalid or expired token' });
      req.userId = payload.id;
      next();
    });
  } else {
    // Neither session nor token found
    return res.status(401).json({ message: 'Not authenticated' });
  }
}

/* -------------------------------------------------------
   AUTHENTICATION ENDPOINTS
------------------------------------------------------- */

// Register new user
// Handles user creation and hashes password before storage to enhance security.
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ message: 'name, email and password are required' });

  // Prevent duplicate accounts for the same email
  const existing = users.find(u => u.email === email.toLowerCase());
  if (existing)
    return res.status(409).json({ message: 'User with this email already exists' });

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email: email.toLowerCase(),
      passwordHash
    };
    users.push(newUser);

    // Return JWT for immediate access after registration
    const token = generateToken(newUser);
    res.status(201).json({ id: newUser.id, email: newUser.email, name: newUser.name, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// JWT Login
// Stateless login — returns a token for clients that store it locally (e.g., mobile apps).
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'email and password required' });

  const user = users.find(u => u.email === email.toLowerCase());
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user);
  res.json({ token, expiresIn: '1h' });
});

// Session Login
// Traditional login flow for web clients using cookies instead of JWTs.
app.post('/auth/session-login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'email and password required' });

  const user = users.find(u => u.email === email.toLowerCase());
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  // Store user ID in session for automatic re-authentication
  req.session.userId = user.id;
  res.json({ message: 'Logged in successfully', user: { id: user.id, name: user.name, email: user.email } });
});

// Logout session
// Destroys session to log user out securely and clear cookies.
app.post('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

/* -------------------------------------------------------
   PUBLIC ENDPOINT
------------------------------------------------------- */
app.get('/', (req, res) => {
  res.send('Welcome to Simple REST API with JWT & Session auth!');
});

/* -------------------------------------------------------
   PROTECTED ENDPOINTS
   Require authentication (either session or JWT).
------------------------------------------------------- */

// Get current user profile
// Returns user info excluding password for security.
app.get('/profile', authenticateHybrid, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email });
});

// Update user profile
// Allows user to modify details while ensuring unique emails and secure password re-hashing.
app.put('/profile', authenticateHybrid, async (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { name, email, password } = req.body;

  if (name) user.name = name;
  
  if (email) {
    const existing = users.find(u => u.email === email.toLowerCase() && u.id !== user.id);
    if (existing) return res.status(409).json({ message: 'Email already in use' });
    user.email = email.toLowerCase();
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
  }

  res.json({ id: user.id, name: user.name, email: user.email, message: 'Profile updated successfully' });
});

// Delete user profile
// Removes user account from memory and destroys session if active.
app.delete('/profile', authenticateHybrid, (req, res) => {
  const index = users.findIndex(u => u.id === req.userId);
  if (index === -1) return res.status(404).json({ message: 'User not found' });

  const deleted = users.splice(index, 1)[0];

  // End session if the user was logged in via session
  if (req.session.userId) req.session.destroy();

  res.json({ id: deleted.id, name: deleted.name, email: deleted.email, message: 'Profile deleted successfully' });
});

// Get all users (demo only)
// Exposes safe user list (without passwords). For demonstration, not production use.
app.get('/users', authenticateHybrid, (req, res) => {
  const safeUsers = users.map(u => ({ id: u.id, name: u.name, email: u.email }));
  res.json(safeUsers);
});

/* -------------------------------------------------------
   START SERVER
   Launch Express app and log access URL for quick testing.
------------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

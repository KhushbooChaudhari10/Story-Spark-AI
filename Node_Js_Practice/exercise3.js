require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Use a secret key from environment variables in production to avoid exposure in code.
// Fallback key is for demo purposes only (not secure for real-world use).
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_demo_key';

app.use(express.json());

// Simulated in-memory database.
// This is temporary and resets every time the server restarts.
// In production, this would be replaced with a persistent database like MongoDB or PostgreSQL.
let users = [
  // Example: { id:1, email: 'demo@example.com', name: 'Demo', passwordHash: '<bcrypt-hash>' }
];

// -------------------------------------------------------
// Helper functions
// -------------------------------------------------------

function generateToken(user) {
  // Include only minimal identifying information (id & email) to keep the JWT small and avoid leaking sensitive details such as passwords or roles.
  const payload = { id: user.id, email: user.email };
  
  // Set a reasonable expiry time (1 hour) to reduce the risk of token misuse.
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

// Middleware to protect routes by verifying JWT tokens.
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Expect tokens in the standard format “Bearer <token>” for compatibility.
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  // Verify token integrity and expiry. If invalid, block access to protected endpoints.
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = payload; // Attach decoded user info to request for downstream handlers.
    next();
  });
}

/* -------------------------------------------------------
   AUTHENTICATION ENDPOINTS
------------------------------------------------------- */

// Register new user
// This endpoint handles user creation and immediately issues a JWT for convenience.
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ message: 'name, email and password are required' });

  // Prevent duplicate registrations with the same email (case-insensitive check).
  const existing = users.find(u => u.email === email.toLowerCase());
  if (existing)
    return res.status(409).json({ message: 'User with this email already exists' });

  try {
    // Hash passwords before storing them to prevent credential leaks if data is exposed.
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email: email.toLowerCase(),
      passwordHash
    };
    users.push(newUser);

    // Return a JWT so the user doesn’t need to log in again immediately after registering.
    const token = generateToken(newUser);
    res.status(201).json({ id: newUser.id, email: newUser.email, name: newUser.name, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login existing user
// Authenticate users by verifying email/password and return a short-lived JWT.
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'email and password required' });

  const user = users.find(u => u.email === email.toLowerCase());
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // Compare hashed password securely using bcrypt (never decrypt stored hashes).
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  // Send a new token on every login to maintain session freshness.
  const token = generateToken(user);
  res.json({ token, expiresIn: '1h' });
});

/* -------------------------------------------------------
   PUBLIC ENDPOINTS (No authentication required)
------------------------------------------------------- */

app.get('/', (req, res) => {
  res.send('Welcome to Simple REST API with JWT auth!');
});

/* -------------------------------------------------------
   PROTECTED ENDPOINTS (Require valid JWT)
------------------------------------------------------- */

// Get user profile
// Fetch user details safely — exclude passwordHash to avoid exposure.
app.get('/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ id: user.id, name: user.name, email: user.email });
});

// Get list of all users
// This route is just for demonstration — in real systems, only admins should access this.
app.get('/users', authenticateToken, (req, res) => {
  const safeUsers = users.map(u => ({ id: u.id, name: u.name, email: u.email }));
  res.json(safeUsers);
});

// Update user profile
// Allow users to update their information securely; rehash password if changed.
app.put('/profile', authenticateToken, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, password } = req.body;

    // Update name if provided
    if (name) user.name = name;

    // Ensure new email is unique and case-insensitive.
    if (email) {
      const existing = users.find(u => u.email === email.toLowerCase() && u.id !== user.id);
      if (existing) return res.status(409).json({ message: 'Email already in use' });
      user.email = email.toLowerCase();
    }

    // Re-hash password to keep security consistent even on updates.
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    res.json({ id: user.id, name: user.name, email: user.email, message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user profile
// Allow users to remove their data; this permanently deletes them from memory.
app.delete('/profile', authenticateToken, (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    const deletedUser = users.splice(userIndex, 1)[0];
    res.json({ id: deletedUser.id, name: deletedUser.name, email: deletedUser.email, message: 'Profile deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// -------------------------------------------------------
// Server startup
// Start Express server and log endpoint info for testing.
// -------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

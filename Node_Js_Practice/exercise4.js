const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Secrets
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_demo_key';
const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecret_session_key';

app.use(express.json());

// Session middleware
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 3600000 } // 1 hour, set secure:true in production with HTTPS
}));

// In-memory "DB"
let users = [];

// Helper: generate JWT token
function generateToken(user) {
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

// Hybrid authentication middleware (session OR JWT)
function authenticateHybrid(req, res, next) {
  // Session first
  if (req.session.userId) {
    req.userId = req.session.userId;
    return next();
  }

  // JWT fallback
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) return res.status(403).json({ message: 'Invalid or expired token' });
      req.userId = payload.id;
      next();
    });
  } else {
    return res.status(401).json({ message: 'Not authenticated' });
  }
}

/* ------- Auth Endpoints ------- */

// Register
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) return res.status(400).json({ message: 'name, email and password are required' });

  const existing = users.find(u => u.email === email.toLowerCase());
  if (existing) return res.status(409).json({ message: 'User with this email already exists' });

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

    const token = generateToken(newUser); // JWT token
    res.status(201).json({ id: newUser.id, email: newUser.email, name: newUser.name, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// JWT Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });

  const user = users.find(u => u.email === email.toLowerCase());
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user);
  res.json({ token, expiresIn: '1h' });
});

// Session Login
app.post('/auth/session-login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });

  const user = users.find(u => u.email === email.toLowerCase());
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  req.session.userId = user.id;
  res.json({ message: 'Logged in successfully', user: { id: user.id, name: user.name, email: user.email } });
});

// Session logout
app.post('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

/* ------- Public Endpoint ------- */
app.get('/', (req, res) => {
  res.send('Welcome to Simple REST API with JWT & Session auth!');
});

/* ------- Protected Endpoints ------- */

// Get current user profile
app.get('/profile', authenticateHybrid, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email });
});

// Update profile
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

// Delete profile
app.delete('/profile', authenticateHybrid, (req, res) => {
  const index = users.findIndex(u => u.id === req.userId);
  if (index === -1) return res.status(404).json({ message: 'User not found' });

  const deleted = users.splice(index, 1)[0];

  if (req.session.userId) req.session.destroy();

  res.json({ id: deleted.id, name: deleted.name, email: deleted.email, message: 'Profile deleted successfully' });
});

// Get all users (demo)
app.get('/users', authenticateHybrid, (req, res) => {
  const safeUsers = users.map(u => ({ id: u.id, name: u.name, email: u.email }));
  res.json(safeUsers);
});

/* ------- Start Server ------- */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

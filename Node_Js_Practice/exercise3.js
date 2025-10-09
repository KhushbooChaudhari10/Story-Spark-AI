require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Use a proper secret in production (store in ENV). Fallback for demo:
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_demo_key';

app.use(express.json());

// In-memory "DB"
let users = [
  // Example pre-hashed password (for demonstration); don't include in production.
  // { id:1, email: 'demo@example.com', name: 'Demo', passwordHash: '<bcrypt-hash>' }
];

// Helpers
function generateToken(user) {
  // Include minimal info in token; avoid putting sensitive data
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Expect header: Authorization: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = payload; // { id, email }
    next();
  });
}

/* ------- Auth endpoints ------- */

// Register: POST /auth/register
// body: { "name": "Khush", "email": "k@example.com", "password": "pass123" }
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

    // Return token immediately (optional)
    const token = generateToken(newUser);
    res.status(201).json({ id: newUser.id, email: newUser.email, name: newUser.name, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login: POST /auth/login
// body: { "email": "k@example.com", "password": "pass123" }
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

/* ------- Public endpoints ------- */

app.get('/', (req, res) => {
  res.send('Welcome to Simple REST API with JWT auth!');
});

/* ------- Protected endpoints ------- */

// Example: get current user profile
app.get('/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // don't return passwordHash
  res.json({ id: user.id, name: user.name, email: user.email });
});

// Example: protected users list (only for demo; in real apps restrict this!)
app.get('/users', authenticateToken, (req, res) => {
  const safeUsers = users.map(u => ({ id: u.id, name: u.name, email: u.email }));
  res.json(safeUsers);
});


// Update user profile: PUT /profile
// body: { "name": "New Name", "email": "new@example.com", "password": "newpass123" }
app.put('/profile', authenticateToken, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, password } = req.body;

    // Update name if provided
    if (name) user.name = name;

    // Update email if provided and not already taken
    if (email) {
      const existing = users.find(u => u.email === email.toLowerCase() && u.id !== user.id);
      if (existing) return res.status(409).json({ message: 'Email already in use' });
      user.email = email.toLowerCase();
    }

    // Update password if provided
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

// Delete user profile: DELETE /profile
app.delete('/profile', authenticateToken, (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    // Remove user from "database"
    const deletedUser = users.splice(userIndex, 1)[0];

    res.json({ id: deletedUser.id, name: deletedUser.name, email: deletedUser.email, message: 'Profile deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

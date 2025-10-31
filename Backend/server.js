const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");
const verifyFirebaseToken = require("./middleware/authMiddleware");

require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const characterRoutes = require('./routes/characterRoutes');
const storybookRoutes = require('./routes/storybookRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const drawingRoutes = require('./routes/drawingRoutes');



const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // allow your Live Server frontend
  methods: ["GET", "POST"],
}));
// Middleware to parse JSON
app.use(bodyParser.json());


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/storybooks', storybookRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/drawings', drawingRoutes);



app.post("/api/children", verifyFirebaseToken, (req, res) => {
  const { name } = req.body;
  const parentId = req.user.uid;

  // Store child profile in DB (MongoDB, etc.)
  res.json({ message: "Child added", name, parentId });
});



// Root route
app.get('/', (req, res) => {
  res.send('User Profile API is running!');
});

app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});

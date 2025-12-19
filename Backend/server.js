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
const storyStatusRoutes = require("./routes/storyStatusRoutes");
const storybookDownloadRoutes = require("./routes/storybookdownloadRoutes");


const app = express();

// enabling cross-origin access so the frontend (Next.js on localhost:3000) can communicate with this backend
// without this, browser would block requests due to CORS security policy
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST"],
}));

// using a JSON parser ensures requests are handled consistently — prevents manual parsing per endpoint
app.use(bodyParser.json());

// connecting MongoDB once at start, so DB is shared across requests — prevents opening multiple DB connections per request
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());

// organizing endpoints as modular route files keeps main server clean and avoids "server.js becoming a giant file"
app.use('/api/users', userRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/storybooks', storybookRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/drawings', drawingRoutes);
app.use("/api/story", storyStatusRoutes);
app.use("/api/storybook", storybookDownloadRoutes);





// protecting this route ensures only authenticated Firebase parents can create a child profile
// token verification middleware extracts parent UID to link children to correct parent
app.post("/api/children", verifyFirebaseToken, (req, res) => {
  const { name } = req.body;
  const parentId = req.user.uid;

  // would normally store child data here — returning parent ID allows frontend to confirm ownership
  res.json({ message: "Child added", name, parentId });
});

// root route used as a simple health check — allows quick confirmation that server is running 
app.get('/', (req, res) => {
  res.send('User Profile API is running!');
});

// single centralized server listen — makes it consistent when deploying / changing port configs later
app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});

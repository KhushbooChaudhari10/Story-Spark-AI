const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  // email is stored only for parent accounts — kids login by name only,
  // so marking email sparse allows child docs to exist without unique email conflict
  email: { type: String, unique: true, sparse: true },

  // password stays optional because Firebase handles auth — password may not exist on our DB at all
  password: { type: String, required: false },

  // storing Firebase UID allows us to link backend user to Firebase identity without saving tokens or secrets
  firebaseUid: { type: String },

  // role controls access boundaries (parent vs kid) — used by middleware to restrict protected endpoints
  role: { type: String, enum: ['parent', 'kid'], required: true },

  // a child account references its parent so we can retrieve all children belonging to one parent easily
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // age stored only for kids — can be used later for age-based story tailoring
  age: { type: Number },

  // parent stores list of children — helps with quick population & retrieving entire child set in one call
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', userSchema);

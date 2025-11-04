const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true }, // only required for parent
  password: { type: String, required: false },
  firebaseUid: { type: String },
  role: { type: String, enum: ['parent', 'kid'], required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  age: { type: Number },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});


module.exports = mongoose.model('User', userSchema);

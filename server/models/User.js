const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // For shared tasks
  sharedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo'
  }]
});

module.exports = mongoose.model('User', UserSchema);

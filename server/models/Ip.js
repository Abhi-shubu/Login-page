const mongoose = require('mongoose');

const ipSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  failedAttempts: { type: Number, default: 0 },
  firstAttempt: { type: Date, default: Date.now },
  blockUntil: { type: Date }
});

module.exports = mongoose.model('Ip', ipSchema);

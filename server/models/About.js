const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  stats: [
    {
      label: { type: String, required: true },
      value: { type: String, required: true }
    }
  ],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('About', AboutSchema);


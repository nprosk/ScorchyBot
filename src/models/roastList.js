const { Schema, model } = require('mongoose');

const roastListSchema = new Schema({
  user: { type: String, required: true },
  server: { type: String, required: true },
  prompt: { type: String, required: false },
  keywords: { type: [String], required: false },
});

module.exports = model('Roast', roastListSchema);
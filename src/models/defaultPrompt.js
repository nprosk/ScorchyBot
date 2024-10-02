const { Schema, model } = require('mongoose');

const defaultPromptSchema = new Schema({
  server: { type: String, required: true },
  prompt: { type: String, required: false },
});

module.exports = model('DefaultPrompt', defaultPromptSchema);
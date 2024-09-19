const { Events } = require("discord.js");
const OpenAI = require("openai");
const {
  checkMessageForArrayMatch,
  parseDatabase,
  queryOpenAIRoastUser,
} = require("../utils/functions");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    let db = parseDatabase();

    if (!db) return;

    if (db.length === 0) return;

    for (const item of db) {
      if (item.keywords && checkMessageForArrayMatch(message, item.keywords)) {
        if (!item.prompt || !item.user) continue;
        const completion = await queryOpenAIRoastUser(item.prompt, item.user);
        message.reply(completion.choices[0].message.content);
        return;
      }
    }
  },
};

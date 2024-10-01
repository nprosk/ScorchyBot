const { Events } = require("discord.js");
const OpenAI = require("openai");
const {
  checkMessageForArrayMatch,
  parseDatabase,
  queryOpenAIRoastUser,
  replaceAll,
} = require("../utils/functions");
const Roast = require("../models/roastList");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    const db = parseDatabase();
    const roastList = await Roast.find({}, {}, { lean: true });

    if (!db) return;

    if (!roastList || roastList.length === 0) return;

    for (const item of roastList) {
      if (item.keywords && checkMessageForArrayMatch(message, item.keywords)) {
        if (!item.user) continue;
        const newPrompt = item.prompt ? item.prompt : db.defaultPrompt;
        if (!newPrompt) continue;
        const completion = await queryOpenAIRoastUser(newPrompt, item.user);
        const response = replaceAll(completion.choices[0].message.content, item.user, `<@${item.user}>`);
        await message.reply(response);
        return;
      }
    }
  },
};

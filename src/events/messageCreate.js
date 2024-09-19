const { Events } = require("discord.js");
const OpenAI = require("openai");
const {
  checkMessageForArrayMatch,
  parseDatabase,
  queryOpenAIRoastUser,
  replaceAll,
} = require("../utils/functions");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    const db = parseDatabase();

    if (!db) return;

    const roastList = db.roastList;

    if (!roastList || roastList.length === 0) return;

    for (const item of roastList) {
      if (item.keywords && checkMessageForArrayMatch(message, item.keywords)) {
        if (!item.user) continue;
        const newPrompt = item.prompt ? item.prompt : db.defaultPrompt;
        if (!newPrompt) continue;
        const completion = await queryOpenAIRoastUser(newPrompt, item.user);
        const response = replaceAll(completion.choices[0].message.content, item.user, `<@${item.user}>`);
        message.reply(response);
        return;
      }
    }
  },
};

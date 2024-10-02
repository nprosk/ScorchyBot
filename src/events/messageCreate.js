const { Events, Message } = require("discord.js");
const OpenAI = require("openai");
const {
  checkMessageForArrayMatch,
  parseDatabase,
  queryOpenAIRoastUser,
  replaceAll,
} = require("../utils/functions");
const Roast = require("../models/roastList");
const DefaultPrompt = require("../models/defaultPrompt");

module.exports = {
  name: Events.MessageCreate,
  /**
   * 
   * @param {Message} message 
   * @returns 
   */
  async execute(message) {
    if (message.author.bot) return;

    const db = parseDatabase();
    if (!db) return;

    const roastList = await Roast.find({ server: message.guild.id }, {}, { lean: true });

    const defaultPromptLocal = await Roast.findOne({ server: message.guild.id }, {}, { lean: true });
    const defaultPrompt = defaultPromptLocal.prompt || db.defaultPrompt;

    if (!roastList || roastList.length === 0) return;

    for (const item of roastList) {
      if (item.keywords && checkMessageForArrayMatch(message, item.keywords)) {
        if (!item.user) continue;
        const newPrompt = item.prompt ? item.prompt : defaultPrompt;
        if (!newPrompt) continue;
        const completion = await queryOpenAIRoastUser(newPrompt, item.user);
        const response = replaceAll(completion.choices[0].message.content, item.user, `<@${item.user}>`);
        await message.reply(response);
        return;
      }
    }
  },
};

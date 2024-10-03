const { Events, Message } = require("discord.js");
const {
  checkMessageForArrayMatch,
  parseDatabase,
  queryOpenAIRoastUser,
  replaceAll,
} = require("../utils/functions");
const DefaultPrompt = require("../models/defaultPrompt");
const Roast = require("../models/roastList");

module.exports = {
  name: Events.MessageCreate,
  /**
   *
   * @param {Message} message
   * @returns
   */
  async execute(message) {
    if (message.author.bot) return;

    const roastList = await Roast.find(
      { server: message.guild.id },
      {},
      { lean: true }
    ).catch(console.error);
    if (!roastList || roastList.length === 0) return;

    for (const item of roastList) {
      if (item.keywords && checkMessageForArrayMatch(message, item.keywords)) {
        if (!item.user) continue;

        let newPrompt;
        if (item.prompt) {
          newPrompt = item.prompt;
        } else {
          const defaultPromptLocal = await DefaultPrompt.findOne(
            { server: message.guild.id },
            {},
            { lean: true }
          )
            .then((doc) => doc.prompt)
            .catch(console.error);
          if (!defaultPromptLocal) {
            const db = parseDatabase();
            if (!db || !db.defaultPromptGlobal) continue;
            newPrompt = db.defaultPromptGlobal;
          } else {
            newPrompt = defaultPromptLocal;
          }
        }
        if (!newPrompt) continue;
        const completion = await queryOpenAIRoastUser(newPrompt, item.user);
        const response = replaceAll(
          completion.choices[0].message.content,
          item.user,
          `<@${item.user}>`
        );
        await message.reply(response);
        return;
      }
    }
  },
};

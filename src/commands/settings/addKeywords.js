const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { parseDatabase, writeDatabase } = require("../../utils/functions");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("add-keywords")
  .setDescription("Add keywords to a user in the roast list (keywords should be separated by commas with no spaces)!")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to add keywords to")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("keywords")
      .setDescription("The keywords to add")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    let db = parseDatabase();
    const user = interaction.options.getUser("user");
    const keywords = interaction.options.getString("keywords").split(",");

    if (!db) {
      db = { defaultPrompt: null, roastList: [] };
    }

    if (!db.roastList) {
      db.roastList = [];
    }

    if (db.roastList.some((item) => item.user === user.id)) {
      db.roastList = db.roastList.map((item) => {
        if (item.user === user.id) {
          item.keywords = [...item.keywords, ...keywords];
        }

        return item;
      });

      writeDatabase(db);

      await interaction.reply({
        content: `Keywords have been added to user ${user}!`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `The user is not in the roast list!`,
        ephemeral: true,
      });
    }
  },
};
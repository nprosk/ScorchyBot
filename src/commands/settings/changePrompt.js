const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { parseDatabase, writeDatabase } = require("../../utils/functions");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("change-prompt")
    .setDescription("Change the prompt for a user in the roast list!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to change the prompt for")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("The new prompt to use")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    let db = parseDatabase();
    const user = interaction.options.getUser("user");
    const prompt = interaction.options.getString("prompt");

    if (!db) {
      db = { defaultPrompt: null, roastList: [] };
    }

    if (!db.roastList) {
      db.roastList = [];
    }

    if (db.roastList.some((item) => item.user === user.id)) {
      db.roastList = db.roastList.map((item) => {
        if (item.user === user.id) {
          item.prompt = prompt;
        }

        return item;
      });

      writeDatabase(db);

      await interaction.reply({
        content: `User ${user} has had their prompt changed to: ${prompt}`,
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

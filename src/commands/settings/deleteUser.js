const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { parseDatabase, writeDatabase } = require("../../utils/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-user")
    .setDescription("Remove a user from the roast list!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to remove")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    let db = parseDatabase();
    const user = interaction.options.getUser("user");

    if (!db) {
      db = { defaultPrompt: null, roastList: [] };
    }

    if (!db.roastList) {
      db.roastList = [];
    }

    if (db.roastList.some((item) => item.user === user.id)) {
      db.roastList = db.roastList.filter((item) => item.user !== user.id);

      writeDatabase(db);

      await interaction.reply({
        content: `User ${user} has been removed from the roast list!`,
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

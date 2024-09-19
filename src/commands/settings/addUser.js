const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { parseDatabase, writeDatabase } = require("../../utils/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-user")
    .setDescription("Adds a new user to be roasted!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to add to the roast list")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("The prompt to use for this user")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("keywords")
        .setDescription(
          "Keywords to trigger the roast, separated by commas (no spaces)"
        )
        .setRequired(false)
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
      return await interaction.reply({
        content: `The user is already in the roast list!
        Change their prompt/add keywords by using the other commands.`,
        ephemeral: true,
      });
    } else {
      db.roastList.push({
        user: user.id,
        prompt: interaction.options.getString("prompt"),
        keywords: interaction.options.getString("keywords")
          ? interaction.options.getString("keywords").split(",")
          : [],
      });

      writeDatabase(db);

      await interaction.reply({
        content: `User ${user} has been added to the roast list!`,
        ephemeral: true,
      });
    }
  },
};

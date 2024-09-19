const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { parseDatabase, writeDatabase } = require("../../utils/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("change-default-prompt")
    .setDescription("Change the default prompt used for roasts!")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("The new prompt to use")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    let db = parseDatabase();
    const prompt = interaction.options.getString("prompt");

    if (!db) {
      db = { defaultPrompt: null, roastList: [] };
    }

    db.defaultPrompt = prompt;

    writeDatabase(db);

    await interaction.reply({
      content: `The default prompt has been updated to: ${prompt}`,
      ephemeral: true,
    });
  },
};
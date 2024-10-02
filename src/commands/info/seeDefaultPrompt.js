const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Roast = require("../../models/roastList");
const { parseDatabase } = require("../../utils/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("see-default-prompt")
    .setDescription("See the current default prompt!")
    .addBooleanOption((option) =>
      option
        .setName("global")
        .setDescription("See the global default prompt")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const global = interaction.options.getBoolean("global");

    const defaultPromptLocal = await Roast.findOne(
      { server: interaction.guild.id },
      {},
      { lean: true }
    );

    const db = parseDatabase();
    const defaultPromptGlobal = db ? db.defaultPrompt : null;

    const defaultPrompt = global ? defaultPromptGlobal : defaultPromptLocal.prompt;

    return interaction.reply({
      content: `The current default ` + (global ? `global ` : ``) + `prompt is: ${defaultPrompt}`,
      ephemeral: true,
    });
  },
};

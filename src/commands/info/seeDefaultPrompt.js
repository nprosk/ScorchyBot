const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const DefaultPrompt = require("../../models/defaultPrompt");
const { parseDatabase } = require("../../utils/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("see-default-prompt")
    .setDescription("See the current default prompt!")
    .addBooleanOption((option) =>
      option
        .setName("global")
        .setDescription("True for global prompt, false for server-specific prompt")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const global = interaction.options.getBoolean("global");

    if (!global) {
      await DefaultPrompt.findOne({ server: interaction.guild.id }, {}, { lean: true })
      .then((doc) => {
        if (!doc || !doc.prompt) {
          return interaction.reply({
            content: `There is no default prompt set for this server!`,
            ephemeral: true,
          });
        } else {
          return interaction.reply({
            content: `The current default prompt for this server is: ${doc.prompt}`,
            ephemeral: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        return interaction.reply({
          content: "There was an error finding the default prompt!",
          ephemeral: true,
        });
      });
    } else {
      const db = parseDatabase();
      if (!db || !db.defaultPromptGlobal) {
        return interaction.reply({
          content: `There is no default global prompt set!`,
          ephemeral: true,
        });
      } else {
        return interaction.reply({
          content: `The current default global prompt is: ${db.defaultPromptGlobal}`,
          ephemeral: true,
        });
      }
    }
  },
};

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const DefaultPrompt = require("../../models/defaultPrompt");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("change-default-prompt")
    .setDescription("Change the default prompt used for roasts in this server")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("The new prompt to use (null to remove local default prompt)")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const prompt = interaction.options.getString("prompt") === "null" ? null : interaction.options.getString("prompt");

    await DefaultPrompt.findOneAndUpdate(
      { server: interaction.guild.id },
      { prompt: prompt },
      { new: true, runValidators: true, upsert: true }
    )
      .then(() => {
        return interaction.reply({
          content: `The default prompt has been updated to: ${prompt}`,
          ephemeral: true,
        });
      })
      .catch((error) => {
        console.error(error);
        return interaction.reply({
          content: "There was an error changing the default prompt!",
          ephemeral: true,
        });
      });
  },
};

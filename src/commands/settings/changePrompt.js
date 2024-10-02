const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Roast = require("../../models/roastList");

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
        .setDescription("The new prompt to use (null to remove prompt)")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    let prompt = interaction.options.getString("prompt");
    prompt === "null" ? (prompt = null) : prompt;

    await Roast.findOneAndUpdate(
      { user: user.id, server: interaction.guild.id },
      { prompt: prompt },
      { new: true, runValidators: true, upsert: false }
    )
      .then((updatedDoc) => {
        if (!updatedDoc) {
          return interaction.reply({
            content: `The user is not in the roast list! Add them with /add-user first!`,
            ephemeral: true,
          });
        } else {
          return interaction.reply({
            content: `Prompt has been changed for user ${user} to: ${prompt}`,
            ephemeral: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        return interaction.reply({
          content: "There was an error changing the prompt!",
          ephemeral: true,
        });
      });
  },
};

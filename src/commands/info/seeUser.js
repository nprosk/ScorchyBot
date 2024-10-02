const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Roast = require("../../models/roastList");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("see-user")
    .setDescription("See info about a user in the roast list!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to see info about")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const user = interaction.user;

    const roast = await Roast.findOne({ user: user.id, server: interaction.guild.id }, {}, { lean: true });
    if (!roast) {
      return interaction.reply({
        content: `User ${user} is not in the roast list!`,
        ephemeral: true,
      });
    } else {
      return interaction.reply({
        content: `User: ${user} | Prompt: ${roast.prompt ? roast.prompt : "None"} | Keywords: ${roast.keywords.join(", ")}`,
        ephemeral: true,
      });
    }
  },
};

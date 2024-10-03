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

    await Roast.findOne(
      { user: user.id, server: interaction.guild.id },
      {},
      { lean: true }
    )
      .then((doc) => {
        if (!doc) {
          return interaction.reply({
            content: `The user is not in the roast list! Add them with /add-user first!`,
            ephemeral: true,
          });
        } else {
          return interaction.reply({
            content: `User: <@${doc.user}>\nPrompt: ${
              doc.prompt
            }\nKeywords: ${doc.keywords.join(", ")}`,
            ephemeral: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        return interaction.reply({
          content: "There was an error finding the user!",
          ephemeral: true,
        });
      });
  },
};

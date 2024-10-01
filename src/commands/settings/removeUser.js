const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Roast = require("../../models/roastList");

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
    const user = interaction.options.getUser("user");

    await Roast.deleteOne({ user: user.id })
      .then((result) => {
        if (result.deletedCount === 0) {
          return interaction.reply({
            content: `The user is not in the roast list!`,
            ephemeral: true,
          });
        } else {
          return interaction.reply({
            content: `User ${user} has been removed from the roast list!`,
            ephemeral: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        return interaction.reply({
          content: "There was an error removing the user!",
          ephemeral: true,
        });
      });
  },
};

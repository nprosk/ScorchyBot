const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Roast = require("../../models/roastList");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-keywords")
    .setDescription(
      "Add keywords to a user in the roast list (keywords should be separated by commas with no spaces)!"
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to add keywords to")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("keywords")
        .setDescription("The keywords to add")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const keywords = interaction.options.getString("keywords").split(",");

    await Roast.findOneAndUpdate(
      { user: user.id, server: interaction.guild.id },
      { $addToSet: { keywords: { $each: keywords } } },
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
            content: `Keywords ${keywords.join(
              ", "
            )} have been added to user ${user}!`,
            ephemeral: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        return interaction.reply({
          content: "There was an error adding the keywords!",
          ephemeral: true,
        });
      });
  },
};

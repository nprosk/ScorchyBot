const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } = require("discord.js");
const Roast = require("../../models/roastList");

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
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @returns 
     */
  async execute(interaction) {
    const user = interaction.options.getUser("user");

    const existingUser = await Roast.findOne({ user: user.id, server: interaction.guild.id }).catch(console.error);
    if (existingUser) {
      return interaction.reply({
        content: "The user is already in the roast list!" +
        "Change their prompt/add keywords by using the other commands.",
        ephemeral: true,
      });
    } else {
      const newRoast = new Roast({
        user: user.id,
        server: interaction.guild.id,
        prompt: interaction.options.getString("prompt"),
        keywords: interaction.options.getString("keywords")
          ? interaction.options.getString("keywords").split(",")
          : [],
      });

      newRoast.save().catch((error) => {
        console.error(error);
        return interaction.reply({
          content: "There was an error adding the user!",
          ephemeral: true,
        });
      });

      return interaction.reply({
        content: `User ${user} has been added to the roast list!`,
        ephemeral: true,
      });
    }
  },
};

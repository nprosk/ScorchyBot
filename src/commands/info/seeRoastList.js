const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Roast = require("../../models/roastList");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("see-roast-list")
    .setDescription("See the current roast list!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const roastList = await Roast.find({ server: interaction.guild.id }, {}, { lean: true });
    if (!roastList || roastList.length === 0) {
      return interaction.reply({
        content: "There are no users in the roast list!",
        ephemeral: true,
      });
    } else {
      const roastListString = roastList.map((user) => {
        return `User: <@${user.user}> | Prompt: ${
          user.prompt ? user.prompt : "None"
        } | Keywords: ${user.keywords.join(", ")}`;
      });
      return interaction.reply({
        content: roastListString.join("\n"),
        ephemeral: true,
      });
    }
  },
};

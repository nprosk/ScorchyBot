const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Roast = require("../../models/roastList");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("see-roast-list")
    .setDescription("See the current roast list!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    await Roast.find({ server: interaction.guild.id }, {}, { lean: true })
      .then((roastList) => {
        if (!roastList || roastList.length === 0) {
          return interaction.reply({
            content: "The roast list is empty!",
            ephemeral: true,
          });
        } else {
          const roastListString = roastList.map((item) => {
            return `User: <@${item.user}>\nPrompt: ${
              item.prompt
            }\nKeywords: ${item.keywords.join(", ")}`;
          });
          return interaction.reply({
            content: roastListString.join("\n\n"),
            ephemeral: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        return interaction.reply({
          content: "There was an error finding the roast list!",
          ephemeral: true,
        });
      });
  },
};

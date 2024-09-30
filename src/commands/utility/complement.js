const { SlashCommandBuilder } = require("discord.js");
const { queryOpenAIRoastUser, replaceAll } = require("../../utils/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("complement")
    .setDescription("Complement a specific user!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to complement")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("The prompt to use")
        .setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const prompt = interaction.options.getString("prompt");

    newPrompt = prompt
      ? prompt + "Make sure this is a complement, if it isn't make it one."
      : "Come up with a clever, random, fun, sweet complement for a friend.";

    const completion = await queryOpenAIRoastUser(newPrompt, user.id);
    const response = replaceAll(
      completion.choices[0].message.content,
      user.id,
      `<@${user.id}>`
    );
    await interaction.reply(response);
  },
};

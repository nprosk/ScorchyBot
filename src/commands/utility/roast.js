const { SlashCommandBuilder } = require("discord.js");
const { queryOpenAIRoastUser, replaceAll } = require("../../utils/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roast")
    .setDescription("Roast a specific user!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to roast")
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
      ? prompt + "Make sure this is a roast, if it isn't make it one."
      : "Come up with a brutal, clever, random, fun insult for a friend.";

    const completion = await queryOpenAIRoastUser(newPrompt, user.id);
    const response = replaceAll(
      completion.choices[0].message.content,
      user.id,
      `<@${user.id}>`
    );
    await interaction.reply(response);
  },
};

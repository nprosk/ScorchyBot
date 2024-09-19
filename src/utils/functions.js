const fs = require("node:fs");
const OpenAI = require("openai");

const checkMessageForStringMatch = (message, text) => {
  return message.content.toLowerCase().includes(text.toLowerCase());
};

const queryOpenAI = async (prompt, model) => {
  const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });
  return await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
}

module.exports = {
  parseDatabase() {
    try {
      const data = fs.readFileSync("db.json", "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  writeDatabase(data) {
    try {
      fs.writeFileSync("db.json", JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  },
  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
  },
  checkMessageForArrayMatch(message, array) {
    return array.some((text) => checkMessageForStringMatch(message, text));
  },
  async queryOpenAIRoastUser(prompt, user, model = "gpt-3.5-turbo") {
    const newPrompt =
      prompt +
      ` Make sure that every time you refer to this person, you refer to them as ${user}. 
      Also, refer to them at least 1 time in the message. Give me just the message to them, nothing else, they can handle it. 
      Don't talk in first person, for example use makes people feel instead of makes me feel, but direct the message at them.`;
    return await queryOpenAI(newPrompt, model);
  },
};

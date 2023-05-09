const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

exports.askChatGPT = askChatGPT;

async function askChatGPT(prompt) {
  let result = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 1024,
    n: 1,
    temperature: 0.5,
  });
  return result.data.choices[0].text;
}

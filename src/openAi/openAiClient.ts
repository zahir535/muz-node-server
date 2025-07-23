import OpenAI from "openai";

export const openAiClient = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

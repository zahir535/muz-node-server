import { openAiClient } from "../openAi";

// eg curl
// curl https://api.openai.com/v1/chat/completions \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer xxx" \
//   -d '{
//     "model": "gpt-4o-mini",
//     "store": true,
//     "messages": [
//       {"role": "user", "content": "write a haiku about ai"}
//     ]
//   }'

export const openApiV1 = async (req: any, res: any) => {
  const customCommand = req?.body?.command;
  const selectedAiModel = req?.body?.model || "gpt-4o"; // GPT-4.1 mini, gpt-4o-mini

  try {
    if (!customCommand)
      return res.status(403).json({ error: "API require command key in body" });

    const response = await openAiClient.chat.completions.create({
      model: selectedAiModel,
      messages: [{ role: "user", content: customCommand }],
    });

    if (response) return res.status(200).send(response);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return res.status(500).send("Internal server error.");
};

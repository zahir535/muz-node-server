/**
 * Pass command & text to selected AI model & returned a string response.
 * Make sure there's a local ollama server running locally as ollama server will expose API http://localhost:11434/api/generate to communicate.
 *
 * Function to be paired with POST REST API.
 *
 * @param req.body {analyzedText: string, command?: string , model?: string (defaulted to mistral)}
 * @param res
 * @returns
 */
export const ollamaApiV1 = async (req: any, res: any) => {
  const genericCommand = "Give come context for this.";
  const customCommand = req?.body?.command || genericCommand;

  const analyzedText = req?.body?.analyzedText || "";
  const selectedAiModel = req?.body?.model || "mistral";

  if (!analyzedText)
    return res
      .status(403)
      .json({ error: "API require analyzedText as string in body" });

  const instructionPrompt = `${customCommand} ${analyzedText}`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      body: JSON.stringify({
        model: selectedAiModel,
        prompt: instructionPrompt,
        stream: false,
      }),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return res.status(500).send("Internal server error.");
};

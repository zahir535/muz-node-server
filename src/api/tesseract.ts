import { createWorker } from "tesseract.js";

export const tesseractV1 = async (req: any, res: any) => {
  try {
    const imageUrl = req?.query?.imageUrl;

    if (!imageUrl)
      return res
        .status(403)
        .json({ error: "API require imageUrl as string in query" });

    const testConnection = await fetch(imageUrl, { method: "GET" });

    if (testConnection?.status !== 200)
      return res.status(403).json({ error: "Invalid imageUrl" });

    const worker = await createWorker("eng");
    const ret = await worker.recognize(
      imageUrl || "https://tesseract.projectnaptha.com/img/eng_bw.png"
    );
    await worker.terminate();

    if (ret?.data?.text && ret?.data?.confidence) {
      return res.status(200).json({
        text: ret.data.text,
        confidence: ret.data.confidence,
      });
    }
  } catch (error) {
    console.log("error", error);
  }

  return res.status(500).send("Internal server error.");
};

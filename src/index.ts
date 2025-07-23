import "dotenv/config"; // configure dotenv
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ollamaApiV1, openApiV1, presignedUrlApiV1 } from "./api";

const app = express();

const corsOptions = {
  origin: "http://localhost:8080",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  return res.send("Express Typescript on Vercel");
});

// OLLAMA API & OPENAI API
app.post("/v1/ollama", ollamaApiV1);
app.post("/v1/openapi", openApiV1);

// AWS S3 PRESIGNED URL
app.post("/v1/get-presigned-url", presignedUrlApiV1);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});

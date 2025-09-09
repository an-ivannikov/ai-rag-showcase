import OpenAI from "openai";
import { config } from "@ai-rag-showcase/utils";



const client = new OpenAI({ apiKey: config.get("openaiApiKey") });

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return res.data.map(e => e.embedding);
}

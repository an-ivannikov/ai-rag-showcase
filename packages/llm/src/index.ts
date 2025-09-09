import OpenAI from "openai";
import { config } from "@ai-rag-showcase/utils";



const client = new OpenAI({ apiKey: config.get("openaiApiKey") });

export async function generateAnswer(prompt: string): Promise<string> {
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });
  return res.choices[0].message.content ?? "";
}

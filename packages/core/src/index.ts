import fs from "node:fs/promises";
import path from "node:path";
import { embedTexts } from "@ai-rag-showcase/embeddings";
import { upsertPoints, search } from "@ai-rag-showcase/vectorstore";
import { randomUUID } from 'node:crypto';



export function chunk(text: string, size = 1200, overlap = 150): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += (size - overlap)) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

export async function ingestDir(dir: string, meta: Record<string, any>) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const texts: { id: string; text: string; payload: any }[] = [];

  for (const e of entries) {
    if (!e.isFile()) continue;
    const filePath = path.join(dir, e.name);
    const raw = await fs.readFile(filePath, "utf-8");
    const parts = chunk(raw);
    parts.forEach((t, i) => {
      texts.push({
        id: randomUUID(),
        text: t,
        payload: { ...meta, file: e.name, idx: i }
      });
    });
  }

  const vectors = await embedTexts(texts.map(t => t.text));
  await upsertPoints(texts.map((t, i) => ({ id: t.id, vector: vectors[i], payload: { ...t.payload, text: t.text } })));
}

export async function retrieve(queryEmbedding: number[], k = 6, filter?: any) {
  const res = await search(queryEmbedding, k, filter);
  // нормализуем результат
  return res.map((r: any) => ({ score: r.score ?? 0, payload: r.payload as any }));
}

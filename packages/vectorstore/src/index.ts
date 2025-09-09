import { QdrantClient } from "@qdrant/js-client-rest";
import { config, log } from "@ai-rag-showcase/utils";



export const qdrant = new QdrantClient({
  url: config.get("qdrantUrl"),
  apiKey: config.get("qdrantKey") || undefined
});

export type Point = {
  id: string | number;
  vector: number[];
  payload: Record<string, any>;
};

export async function ensureCollection(name = config.get("qdrantCollection")) {
  const exists = await qdrant.getCollections().then(r => r.collections?.some(c => c.name === name));
  if (!exists) {
    await qdrant.createCollection(name, { vectors: { size: 1536, distance: "Cosine" } });
    log.info(`Created Qdrant collection: ${name}`);
  }
}

export async function upsertPoints(points: Point[], name = config.get("qdrantCollection")) {
  await ensureCollection(name);
  await qdrant.upsert(name, { points });
}

export async function search(query: number[], k = 6, filter?: any, name = config.get("qdrantCollection")) {
  return qdrant.search(name, { vector: query, limit: k, filter });
}

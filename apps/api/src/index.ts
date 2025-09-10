import express from "express";
import mongoose from "mongoose";
import { Queue } from "bullmq";
import IORedis from "ioredis";
import { config, log } from "@ai-rag-showcase/utils";
import { embedTexts } from "@ai-rag-showcase/embeddings";
import { retrieve } from "@ai-rag-showcase/core";
import { generateAnswer } from "@ai-rag-showcase/llm";



const PORT = Number(process.env.PORT || 3001);

const app = express();
app.use(express.json());


// Redis queue
const connection = new IORedis({
  host: config.get("redisHost"),
  port: config.get("redisPort"),
  db: config.get("redisDb"),
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
});
const ingestQueue = new Queue("ingest", { connection, });


mongoose.connect(config.get("mongoUri"));


app.get("/health", (_req, res) => {
  res.json({ ok: true, });
});


/** 
 * POST /ingest { dir: string, meta?: object }
 */
app.post("/ingest", async (req, res) => {
  const { dir, meta = {} } = req.body || {};
  const job = await ingestQueue.add("ingest_dir",
    { dir, meta, },
    { attempts: 2, removeOnComplete: true, removeOnFail: 100, }
  );
  res.json({ jobId: job.id, });
});


/**
 * POST /ask { query: string, filter?: any 
 */
app.post("/ask", async (req, res) => {
  const { query, filter } = req.body || {};
  if (!query) {
    return res.status(400).json({ error: "query required", });
  }

  const [embedding] = await embedTexts([query]);
  const hits = await retrieve(embedding, 6, filter);

  const context = hits
    .map((h: any, i: number) => `# Source ${i + 1} (score ${h.score.toFixed(3)}):\n${h.payload.text}\n`)
    .join("\n");

  const prompt = `You are a concise documentation assistant. Answer the user"s question using ONLY the context below. If the answer isn"t present, say you don"t know and suggest a relevant chapter.\n\nContext:\n${context}\n\nQuestion: ${query}\nAnswer:`;

  const answer = await generateAnswer(prompt);

  res.json({
    answer,
    sources: hits.map((h: any) => ({
      score: h.score,
      file: h.payload.file,
      idx: h.payload.idx,
    })),
  });
});


app.listen(PORT, '0.0.0.0', () => {
  log.info(`API listening on :${PORT}`);
});

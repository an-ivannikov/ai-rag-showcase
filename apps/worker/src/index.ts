import { Worker } from "bullmq";
import IORedis from "ioredis";
import { config, log } from "@ai-rag-showcase/utils";
import { ingestDir } from "@ai-rag-showcase/core";



const connection = new IORedis({
  host: config.get("redisHost"),
  port: config.get("redisPort"),
  db: config.get("redisDb"),
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
});

const worker = new Worker("ingest", async job => {
  if (job.name === "ingest_dir") {
    const { dir, meta } = job.data as { dir: string, meta: Record<string, any> };
    log.info(`Ingesting directory: ${dir}`);
    await ingestDir(dir, meta);
    return { ok: true, };
  }
}, { connection, });

worker.on("completed", (job) => {
  log.info(`job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  log.error(`job ${job?.id} failed`, err);
});

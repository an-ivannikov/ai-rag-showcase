import dotenv from "dotenv";
import convict from "convict";
import log4js from "log4js";



dotenv.config();


export const config = convict({
  openaiApiKey: {
    doc: "OpenAI API key",
    format: String,
    default: "",
    env: "OPENAI_API_KEY",
  },

  qdrantUrl: {
    format: String,
    default: "http://localhost:6333",
    env: "QDRANT_URL",
  },

  qdrantKey: {
    format: String,
    default: "",
    env: "QDRANT_API_KEY",
  },

  qdrantCollection: {
    format: String,
    default: "rust_docs",
    env: "QDRANT_COLLECTION",
  },

  mongoUri: {
    format: String,
    default: "mongodb://localhost:27017/ai_rag",
    env: "MONGO_URI",
  },

  redisHost: {
    format: String,
    default: "localhost",
    env: "REDIS_HOST",
  },

  redisPort: {
    format: "port",
    default: 6379,
    env: "REDIS_PORT",
  },

  redisDb: {
    format: "nat",
    default: 0,
    env: "REDIS_DB",
  }
}).validate({ allowed: "strict", });


log4js.configure({
  appenders: {
    out: { type: "stdout", },
  },

  categories: {
    default: {
      level: "info",
      appenders: ["out"],
    },
  },
});

export const log = log4js.getLogger("app");

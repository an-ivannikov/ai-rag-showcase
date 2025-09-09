import { Telegraf } from "telegraf";
import axios from "axios";
import { config, log } from "@ai-rag-showcase/utils";



const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string);

bot.start((ctx) => {
  return ctx.reply("Hi! Ask me Rust questions. Send a message and I will answer using RAG.");
});


bot.on("text", async (ctx) => {
  await ctx.reply("⏳ Searching...");

  const q = ctx.message.text.trim();
  try {
    const { data } = await axios.post("http://localhost:3001/ask", { query: q, });
    const sources = (data.sources as any[]).slice(0, 3).map((s, i) => `#${i + 1} ${s.file} [${s.idx}] (score ${s.score.toFixed(3)})`).join("\n");
    await ctx.reply(`💡 *Answer*\n${data.answer}\n\n📖 *Sources*\n${sources}`, { parse_mode: "Markdown", });
  } catch (e) {
    log.error(e);
    await ctx.reply("❌ Error. Please try again later.");
  }
});


bot.launch().then(() => {
  log.info("Telegram bot started");
});

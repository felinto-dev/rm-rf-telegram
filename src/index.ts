import { Bot } from "grammy";
import "dotenv/config";
import { Context } from "./types/context";
import { handleBot } from "./handle";

if (process.env.BANNED_WORDS?.split(",").length === 0) {
  throw new Error("BANNED_WORDS is required");
}

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Bot<Context>(BOT_TOKEN);
bot.use(handleBot);
bot.start();

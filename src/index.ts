import { Bot } from "grammy";
import "dotenv/config";
import { Context } from "./types/context";
import { hydrateFiles } from "@grammyjs/files";
import { useFluent } from "@grammyjs/fluent";
import { Fluent } from "@moebius/fluent";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import { handleBot } from "./handle";

const fluent = new Fluent();
fluent.addTranslation({
  locales: "pt_br",
  filePath: [`${process.cwd()}/src/translations/translation.pt_br.ftl`],
});

if (process.env.BANNED_WORDS?.split(",").length === 0) {
  throw new Error("BANNED_WORDS is required");
}

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Bot<Context>(BOT_TOKEN);
bot.use(useFluent({ fluent, defaultLocale: "pt_br" }));
bot.api.config.use(hydrateFiles(BOT_TOKEN));
const throttler = apiThrottler();
bot.api.config.use(throttler);
bot.use(handleBot);
bot.start();

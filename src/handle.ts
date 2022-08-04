import { Composer } from "grammy";
import { ChatMember } from "grammy/out/platform.node";
import { Context } from "./types/context";

export const handleBot = new Composer<Context>();

export const shouldBanUser = (member: ChatMember) => {
  const memberFullName = member.user.first_name.concat(
    " ",
    member.user.last_name || ""
  );

  const bannedWords = process.env.BANNED_WORDS?.split(",") || [];

  const shouldBanByFullName = bannedWords.some((word) => {
    word = word.toLowerCase().trim();
    return (
      memberFullName.toLowerCase().includes(word) ||
      memberFullName.toLowerCase().includes(word.replace(/\s/g, ""))
    );
  });

  const shouldBanByUsername = bannedWords.some((word) =>
    member.user.username?.replace(/_/g, " ").includes(word.toLowerCase())
  );

  return shouldBanByFullName || shouldBanByUsername;
};

handleBot.on(":new_chat_members", async (ctx) => {
  const isShouldBanUser = shouldBanUser(await ctx.getAuthor());
  return isShouldBanUser && ctx.banAuthor();
});

handleBot.on("message").filter(
  (ctx) => {
    return ["group", "supergroup"].includes(ctx.chat.type);
  },
  async (ctx) => {
    const isShouldBanUser = shouldBanUser(await ctx.getAuthor());
    return isShouldBanUser && ctx.banAuthor();
  }
);

import { Context as GrammyContext } from "grammy";
import { FileFlavor } from "@grammyjs/files";
import { FluentContextFlavor } from "@grammyjs/fluent";

export type Context = FileFlavor<GrammyContext> & FluentContextFlavor;

import { Telegraf } from "telegraf";
import express from "express";
import "dotenv/config";
import { oc } from "./src/commands/oc.js";
import { ocinfo } from "./src/commands/ocinfo.js";
import { stats } from "./src/commands/stats.js";
import { top } from "./src/commands/top.js";
import { vip } from "./src/commands/vip.js";

export const bot = new Telegraf(process.env.TOKEN || "");

bot.command("oc", oc);
bot.command("ocinfo", ocinfo);
bot.command("stats", stats);
bot.command("top", top);
bot.command("vip", vip);

if (process.env.PRODUCTION) {
    const app = express();
    app.use(express.json());
    app.use(bot.webhookCallback());
    app.listen(process.env.PORT || 8888);
} else {
    bot.launch();
}
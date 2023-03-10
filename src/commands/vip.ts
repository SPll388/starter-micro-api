import { getCard, getCardRare, getChance, getEmoji, getRare } from "../../api/api.js";
import { cardsForms, localData } from "../../api/data.js";
import { addToDB, cards, getAllData, getData, isAdmin, setData } from "../../api/db.js";
import { CmdContext, User } from "../../api/types.js";
import { bot } from "../../main.js";

export async function vip(ctx: CmdContext) {
    await addToDB(ctx.message.from.id, ctx.message.from.first_name, ctx.message.from.username || "");

    if (localData.isMaintenance && !isAdmin({
        id: ctx.message.from.id,
    })) return;

    try {
        bot.action(`vbuy${ctx.message.from.id}`, async ctx2 => {
        })

        await ctx.reply(`Вы открыли Вип-Меню ⭐️`, {
            reply_to_message_id: ctx.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{text: "Купить вип", callback_data: `vbuy${ctx.message.from.id}`}, {text: "Улучшить вип", callback_data: `vupgr${ctx.message.from.id}`}],
                    [{text: "Информация о випе", callback_data: `vinfo${ctx.message.from.id}`}]
                ]
            },
            parse_mode: "HTML"
        })
    } catch (e) {
        console.log(e);
    }
}
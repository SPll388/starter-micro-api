import { getCard, getCardRare, getChance, getEmoji, getRare } from "../../api/api.js";
import { cardsForms, localData } from "../../api/data.js";
import { addToDB, cards, getAllData, getData, isAdmin, setData } from "../../api/db.js";
import { CmdContext, User } from "../../api/types.js";
import { bot } from "../../main.js";

export async function top(ctx: CmdContext) {
    await addToDB(ctx.message.from.id, ctx.message.from.first_name, ctx.message.from.username || "");

    if (localData.isMaintenance && !isAdmin({
        id: ctx.message.from.id,
    })) return;

    try {
        const data = await getAllData() as User[];
        let position = -1;
        const arr: User[][] = []

        for (let i in data) {
            if (Number(i) % 10 === 0) arr.push([] as User[]);
            arr.at(-1)?.push(data[i])
            if (Number(data[i].id) === ctx.message.from.id) {
                position = Number(i);
            }
        }

        let message = `<b>🔗 Рейтинг игроков по количеству Баллов: </b>\n`;

        let id = 0;

        arr[id].forEach((v, i) => {
            message+= `${i === 0 || id === 0 ? "🧬 " : ""}${i+1}. <a href="tg://user?id=${v.id}">${v.name} ${v.vip - Date.now() > 0 ? "⭐️" : ""}</a> — ${v.bals} Баллов 📂\n`
        })

        await ctx.reply(message, {
            reply_to_message_id: ctx.message.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{text: "⬅️", callback_data: "topback" + ctx.message.from.id}, {text: `${id+1}/${arr.length}`, callback_data: "none"}, {text: "➡️", callback_data: "topto" + ctx.message.from.id}]
                ]
            }
        })

        bot.action("topback" + ctx.message.from.id,async ctx2 => {
            id--;
            if (id < 0 || id >= arr.length ) {
                id++;
                return await ctx2.answerCbQuery(`Вы не можете выходить за предел!`);
            }
            let message = `<b>🔗 Рейтинг игроков по количеству Баллов: </b>\n`;

            arr[id].forEach((v, i) => {
                message+= `${i === 0 || id === 0 ? "🧬 " : ""}${i+1}. <a href="tg://user?id=${v.id}">${v.name} ${v.vip - Date.now() > 0 ? "⭐️" : ""}</a> — ${v.bals} Баллов 📂\n`
            })

            return await ctx2.editMessageText(message, {
                reply_markup: {
                    inline_keyboard: [
                        [{text: "⬅️", callback_data: "topback" + ctx.message.from.id}, {text: `${id+1}/${arr.length}`, callback_data: "none"}, {text: "➡️", callback_data: "topto" + ctx.message.from.id}]
                    ]
                },
                parse_mode: "HTML",
            })
        })
        bot.action("topto" + ctx.message.from.id,async ctx2 => {
            id++;
            if (id < 0 || id >= arr.length ) {
                id--;
                return await ctx2.answerCbQuery(`Вы не можете выходить за предел!`);
            }
            let message = `<b>🔗 Рейтинг игроков по количеству Баллов: </b>\n`;

            arr[id].forEach((v, i) => {
                message+= `${i === 0 || id === 0 ? "🧬 " : ""}${i+1}. <a href="tg://user?id=${v.id}">${v.name} ${v.vip - Date.now() > 0 ? "⭐️" : ""}</a> — ${v.bals} Баллов 📂\n`
            })

            return await ctx2.editMessageText(message, {
                reply_markup: {
                    inline_keyboard: [
                        [{text: "⬅️", callback_data: "topback" + ctx.message.from.id}, {text: `${id+1}/${arr.length}`, callback_data: "none"}, {text: "➡️", callback_data: "topto" + ctx.message.from.id}]
                    ]
                },
                parse_mode: "HTML",
            })
        })
    } catch (e) {
        console.log(e);
    }
}
import { getCard, getCardRare, getChance, getEmoji, getRare } from "../../api/api.js";
import { cardsForms, localData } from "../../api/data.js";
import { addToDB, cards, getAllData, getData, isAdmin, setData } from "../../api/db.js";
import { CmdContext, User } from "../../api/types.js";
import { bot } from "../../main.js";

export async function stats(ctx: CmdContext) {
    await addToDB(ctx.message.from.id, ctx.message.from.first_name, ctx.message.from.username || "");

    if (localData.isMaintenance && !isAdmin({
        id: ctx.message.from.id,
    })) return;

    try {
        const data = await getAllData() as User[];
        let position = -1;

        for (let i in data) {
            if (Number(data[i].id) === ctx.message.from.id) {
                position = Number(i);
            }
        }

        await ctx.reply(`<b>Статистика вашего профиля:</b>

Место в топе: ${position+1} 🏆
Баллы: ${data[position].bals} 📂
ДрагенКоины: ${data[position].coins} 🍒
ВипКоины: ${data[position].vipcoins} 🍷
Уровень: ${data[position].level}  🧬
Побед на арене: ${data[position].vins} 🎖
Вип: ${data[position].vip - Date.now() > 0 ? `${Math.floor((data[position].vip - Date.now()) / 60000 / 60 / 24)}д ${Math.floor((data[position].vip - Date.now()) / 60000 / 60 % 24)}ч ${Math.floor((data[position].vip - Date.now()) / 60000 % 60)}м ⭐️` : "Нет ❌"}
Открыто карт: ${data[position].cards.length} из ${cards.length} 🃏`, {
            reply_to_message_id: ctx.message.message_id,
            parse_mode: "HTML",
        })
    } catch (e) {
        console.log(e);
    }
}
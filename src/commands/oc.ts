import { getCard, getCardRare, getChance, getEmoji, getRare, needBals } from "../../api/api.js";
import { cardsForms, localData } from "../../api/data.js";
import { addToDB, cards, getData, isAdmin, setData } from "../../api/db.js";
import { CmdContext } from "../../api/types.js";
import { bot } from "../../main.js";

export async function oc(ctx: CmdContext) {
    await addToDB(ctx.message.from.id, ctx.message.from.first_name, ctx.message.from.username || "");

    if (localData.isMaintenance && !isAdmin({
        id: ctx.message.from.id,
    })) return;

    try {
        await ctx.reply("Выберите сундук:", {
            reply_markup: {
                inline_keyboard: cardsForms.map((v, i) => {
                    bot.action(v.name + `${ctx.message.from.id}`, async ctx2 => {
                        if (ctx2.from?.id !== ctx.message.from.id) return ctx2.answerCbQuery("Эта кнопка предназначена не вам!");
                        bot.action(`back${ctx.message.from.id}`, async ctx3 => {
                            await ctx3.deleteMessage();
                            await oc(ctx);
                        })
                        bot.action(`close${ctx.message.from.id}`, async ctx3 => {
                            await ctx3.deleteMessage();
                        })
                        const data = await getData({
                            id: ctx.message.from.id,
                        });
                        if (!data) return;
                        if (data.level < v.level) return await ctx2.editMessageText(`Этот сундук вам недоступен! Необходимый уровень: ${v.level} ⚓️`) && await ctx2.editMessageReplyMarkup({
                                                    inline_keyboard: [
                                                        [{text: "Назад ⬅️", callback_data: `back${ctx.message.from.id}`}],
                                                        [{text: "Закрыть ❌", callback_data: `close${ctx.message.from.id}`}]
                                                    ]
                                                });
                        if (data.coins < v.cost) return await ctx2.editMessageText(`У вас недостаточно валюты что-бы открыть Редкий сундук. [Цена: ${v.cost} ДрагенКоинов]
Не хватает ДрагенКоинов: ${v.cost - data.coins} 🍒`) && await ctx2.editMessageReplyMarkup({
                            inline_keyboard: [
                                [{text: "Назад ⬅️", callback_data: "back" + `${ctx.message.from.id}`}],
                                [{text: "Закрыть ❌", callback_data: "close" + `${ctx.message.from.id}`}]
                            ]
                        });
                        const timeX = data.vip - Date.now() > 0 ? 0.2 : 1;
                        const time = v.cooldown * timeX;
                        if (Date.now() - data.date[i] < time * 60000) return await ctx2.editMessageText(`Вы уже использовали бота.
Использование доступно раз в ${time} минут.
                            
— Что-бы использовать бота, вам нужно подождать ещё ${Math.floor((Number(data.date[i])+time*60000 - Date.now())/1000/60)} минут ${Math.floor((Number(data.date[i])+time*60000 - Date.now())/1000%60)} секунд ⏳`) && await ctx2.editMessageReplyMarkup({
                            inline_keyboard: [
                                [{text: "Назад ⬅️", callback_data: `back${ctx.message.from.id}`}],
                                [{text: "Закрыть ❌", callback_data: `close${ctx.message.from.id}`}]
                            ]
                        });
                
                        const rare = getRare(v.chance);
                        const card = getCard(rare);
                        const copy = new Set(data.cards);
                        copy.add(card.id);

                        const xBals = v.bx * (3 - 2 * data.cards.length / cards.length) * (data.cards.includes(card.id) ? (
                            rare === "c" ? 1 : 2
                        ) : 1);
                        const xCoins = v.cx * (2 - data.cards.length / cards.length) * (data.cards.includes(card.id) ? (
                            rare === "c" ? 1 : 1.5
                        ) : 1);;

                        const bals = Math.floor(((
                            rare === "c" ? 50 :
                            rare === "u" ? 80 :
                            rare === "m" ? 130 :
                            rare === "l" ? 200 :
                            rare === "i" ? 170 : 500 
                        ) + Math.random() * (rare === "p" ? 500 : 20)) * xBals);
                        const coins = Math.floor(((
                            rare === "c" ? 1 :
                            rare === "u" ? 20 :
                            rare === "m" ? 50 :
                            rare === "l" ? 50 :
                            rare === "i" ? 70 :
                            rare === "p" ? 200 : 0
                        ) + Math.random() * (
                            rare === "c" ? 10 :
                            rare === "u" ? 10 :
                            rare === "m" ? 0 :
                            rare === "l" ? 20 :
                            rare === "i" ? 20 :
                            rare === "p" ? 300 : 0
                        )) * xCoins);
                        const vipcoins = rare === "i" ? Math.floor(10 + Math.random() * 20) : 
                        rare === "s" ? Math.floor(50 + Math.random() * 50) : 
                        rare === "p" ? Math.floor(300 + Math.random() * 500) : 0;

                        let caption = `• Вы открыли Набор Карт, вам выпала: ${getCardRare(rare)} Карта ${getEmoji(rare)} [Шанс: ${getChance(v.chance, rare)}%] Вы собрали ${bals} Баллов и ${coins} Драгенкоинов.
${vipcoins ? `\n<i>Вы получили дополнительные ${vipcoins} випкоинов 🍷</i>\n` : ''}
— Текущее количество баллов: ${data.bals + bals} 📂
                    
— Текущее количество ДрагенКоинов: ${data.coins + coins-v.cost} 🍒
                    
— На данный момент у вас открыто ${copy.size} карт из ${cards.length} 🃏`

                        await ctx.replyWithPhoto({
                            source: Buffer.from(JSON.parse(card.data))
                        }, {
                            caption: caption,
                            parse_mode: "HTML",
                            reply_to_message_id: ctx.message.message_id,
                        });

                        await ctx2.deleteMessage();

                        const date = data.date;

                        date[i] = Date.now();

                        if (needBals(data.level)-bals>0) {
                            if (data.level+1<=60) {
                                await ctx.reply(`<a href="tg://user?id=${ctx.message.from.id}"${ctx.message.from.first_name}, вы достигли ${data.level+1} уровня 🧬
Вы получили ${data.level+1<=20 ? 300 :
    data.level+1<=40 ? 1000 :
    data.level+1<=50 ? 3000 :
    data.level+1<=60 ? 5000 : 15000} драгенКоинов 🍒`, {
        reply_to_message_id: ctx.message.message_id
    });
                            } else {
                                await ctx.reply(`<a href="tg://user?id=${ctx.message.from.id}"${ctx.message.from.first_name}, вы достигли следующего уровня 🧬
Вы получили 15000 драгенКоинов 🍒 и увеличили множитель баллов в 1.2 раза 📂`, {
        reply_to_message_id: ctx.message.message_id
    });
                            }
                        }

                        return await setData({
                            id: ctx.message.from.id,
                        }, {
                            bals: data.bals + bals,
                            coins: data.coins + coins-v.cost + (data.level)-bals>0 ? (
                                data.level+1<=20 ? 300 :
                                data.level+1<=40 ? 1000 :
                                data.level+1<=50 ? 3000 :
                                data.level+1<=60 ? 5000 : 15000
                            ) : 0,
                            vipcoins: data.vipcoins + vipcoins,
                            date: date,
                            cards: Array.from(copy),
                            level: data.level + needBals(data.level)-bals>0 ? 1 : 0,
                        })
                    });
                    return [{text: v.name + " сундук " + v.emoji, callback_data: v.name + `${ctx.message.from.id}`}];
                })
            },
            reply_to_message_id: ctx.message.message_id,
        })
    } catch (e) {
        console.log(e);
    }
}
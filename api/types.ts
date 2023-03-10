import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";

export interface User {
    name: string,
    username: string,
    id: number,
    bals: number,
    coins: number,
    vipcoins: number,
    cards: number[],
    vip: number,
    vins: number,
    packs: number[],
    level: number,
    date: number[],
    isadmin: boolean,
}

export type CmdContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
}>;

export interface Card {
    id: number,
    data: string,
    rare: Rare
}

export type Rare = "c" | "u" | "m" | "l" | "i" | "s" | "p";

export interface Chance {
    c: number,
    u: number,
    m: number,
    l: number,
    i: number,
    s: number,
    p: number,
}

export interface CardForm {
    id: string,
    name: string,
    cost: number,
    chance: Chance,
    cooldown: number,
    bx: number,
    cx: number,
    level: number,
    emoji: string,
}
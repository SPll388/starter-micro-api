import { CardForm } from "./types";

export const cardsForms: CardForm[] = [
    {
        id: "c",
        name: "Обычный",
        cost: 0,
        chance: {
            c: 90, 
            u: 5,
            m: 3,
            l: 1.19,
            i: 0.8,
            s: 0,
            p: 0.01,
        },
        cooldown: 30,
        bx: 1,
        cx: 1,
        level: 0,
        emoji: "🐺"
    },
    {
        id: "r",
        name: "Редкий",
        cost: 1000,
        chance: {
            c: 0, 
            u: 80,
            m: 10,
            l: 5,
            i: 1.9,
            s: 3,
            p: 0.1,
        },
        cooldown: 5,
        level: 10,
        bx: 3,
        cx: 0.2,
        emoji: "🐟"
    },
    {
        id: "u",
        name: "Рубиновый",
        cost: 2500,
        chance: {
            c: 0, 
            u: 30,
            m: 50,
            l: 10,
            i: 4.5,
            s: 5,
            p: 0.5,
        },
        cooldown: 0,
        bx: 5,
        cx: 0.7,
        level: 30,
        emoji: "♨️"
    },
    {
        id: "t",
        name: "Титановый",
        cost: 5000,
        chance: {
            c: 0, 
            u: 0,
            m: 70,
            l: 15,
            i: 5.5,
            s: 8,
            p: 1.5,
        },
        cooldown: 0,
        bx: 8,
        cx: 0.5,
        level: 50,
        emoji: "🇦🇱"
    },
];

export const localData = {
    isMaintenance: false,
    usersInDB: new Set(),
}
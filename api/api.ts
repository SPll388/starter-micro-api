import { cards } from "./db.js";
import { Card, Chance, Rare } from "./types";

export function getRare(chance: Chance): Rare {
    let min = 101;

    for (let i in chance) {
        if (min > chance[i as keyof Chance] && chance[i as keyof Chance] !== 0) min = chance[i as keyof Chance];
    }

    let max = 1 / (min / 100);
    const obj: {
        [key: string]: number
    } = {

    };
    let last = 0;
    for (let i in chance) {
        obj[i] = chance[i as keyof Chance] * max / 100 + last;
        last = obj[i];
    }
    const random = Math.floor(max * Math.random());

    for (let i in obj) {
        let elem = obj[i];
        if (random < elem) return i as Rare;
    }
    return "c";
}

export function getCard(rare: Rare) {
    const cardsForRare: Card[] = [];
    cards.forEach(v => {
        if (v.rare === rare) cardsForRare.push(v);
    });
    return cardsForRare[Math.floor(Math.random() * cardsForRare.length)];
}

export function getCardRare(rare: Rare) {
    return rare === "c" ? "Обычная" :
    rare === "u" ? "Средняя" :
    rare === "m" ? "Магическая" :
    rare === "l" ? "Легендарная" :
    rare === "i" ? "Мифическая" :
    rare === "s" ? "Специальная" : "Первосходная"
}

export function getEmoji(rare: Rare) {
    return rare === "c" ? "♟️" :
    rare === "u" ? "🌀" :
    rare === "m" ? "🦚" :
    rare === "l" ? "🎃" :
    rare === "i" ? "🍒" :
    rare === "s" ? "🎋" : "👑";
}

export function getChance(chance: Chance, rare: Rare) {
    return chance[rare];
}
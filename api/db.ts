import pg from "pg";
import "dotenv/config";
import { Card, User } from "./types";
import { localData } from "./data.js";

const client = new pg.Client({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DB,
    password: process.env.PASSWORD
})

await client.connect();

export const cards: Card[] = (await client.query(`select * from cards`)).rows;

export async function getAllData() {
    try {
        return (await client.query("select * from users order by bals desc")).rows as User[];
    } catch {};
}

export async function getData(search: Partial<User>) {
    try {
        let query = "select * from users where";
        
        for (let elem in search) {
            query+= ` ${elem}=${search[elem as keyof User]},`
        }
        query = query.substring(0, query.length - 1);

        return (await client.query(query)).rows[0] as User;
    } catch {};
}

export async function setData(search: Partial<User>, data: Partial<User>) {
    try {
        let query = "update users set";

        for (let elem in data) {
            query+= ` ${elem}=${(typeof data[elem as keyof User] === "object" ? `ARRAY${JSON.stringify((data[elem as keyof User] as number[]).map(Number))}` : data[elem as keyof User])},`;
        }

        query = query.substring(0, query.length - 1) + " where";

        for (let elem in search) {
            query+= ` ${elem}=${search[elem as keyof User]},`;
        }

        query = query.substring(0, query.length - 1);

        console.log(query)

        return (await client.query(query));
    } catch (e) {
        console.log(e)
    };
}

export async function isAdmin(user: Partial<User>) {
    try {
        const data = await getData(user);
        if (!data) return data;
        return data.isadmin;
    } catch {};
}

export async function addToDB(id: number, name: string, username: string) {
    if (localData.usersInDB.has(id)) return;
    try {
        return await client.query(`insert into users (name, username, id, bals, coins, vipcoins, cards, vip, vins, packs, level, date, isadmin) values('${name}', '${username}', ${id}, 0, 0, 0, ARRAY[]::integer[], 0, 0, ARRAY[]::integer[], 1, ARRAY[]::bigint[], false)`);
    } catch {} finally {
        localData.usersInDB.add(id);
    };
}
import TelegramBot from "node-telegram-bot-api";
import { Database as DB } from "sqlite-async";
const log = console.log;

const db = await DB.open('./data.sql3');

let query = `CREATE TABLE IF NOT EXISTS Users (
    id integer primary key autoincrement,
    name text unique not null,
    nickname text,
    birthdate text
)`;
await db.exec(query);

query = `INSERT INTO Users (name, nickname, birthdate) VALUES (
    "Amir", "amir_is_the_best", "2001-03-24"
)`;
try { await db.exec(query); }
catch { log("Такой пользователь уже есть"); }


query = "SELECT * FROM Users";
let rows = await db.all(query);
log(rows);


db.close();





/*

const TOKEN = "1769606709:AAHNfGKuUsXL2hLgEOXy-gta-1zDGgODJR4";
const bot = new TelegramBot(TOKEN, {polling: true});

bot.on("text", msg => {
    switch(msg.text.toLocaleLowerCase()) {
        case "/start":
            chat_id = msg.chat.id;
            break;
    }
});

bot.on("callback_query", msg => {
    log(msg);
})
*/
import { Database as DB } from "sqlite-async";
const log = console.log;

export class Database {
    db = null;
    constructor(config) {
        this.config = config;
    }

    async start() {
        this.db = await DB.open(this.config.file);
        await this.createUsers();
        await this.createEvents();
    }

    async stop() {
        await this.db.close();
    }

    async createUsers() {
        let query = `CREATE TABLE IF NOT EXISTS Users (
            id              integer primary key autoincrement,
            telegram_url    text,
            telegram_id     integer unique not null,
            chat_id         integer unique not null,
            name            text
        )`;
        await this.db.exec(query);
    }

    async createEvents() {
        let query = `CREATE TABLE IF NOT EXISTS Events (
            id              integer primary key autoincrement,
            name            text not null,
            city            text not null,
            address         text,
            date            text not null,
            time            text,
            type            text,
            isRegular       integer,
            price           text,
            contact         text,
            org_id          integer not null,
            poster_url      text  
        )`;
        await this.db.exec(query);
    }

    async addUser(telegram_id, chat_id, name = "", telegram_url = "") {
        let query = `INSERT INTO Users (name, telegram_id, chat_id, telegram_url) VALUES (?,?,?,?)`;
        try { await this.db.run(query, name, telegram_id, chat_id, telegram_url); }
        catch { log("Такой пользователь уже есть"); }
    }

    async addEvent(name, city, date, org_id, isRegular, address = "", poster_url = "", time = "", price = "", contact = "") {
        let query = `SELECT * FROM Events WHERE name=? AND city=? AND date=?`;
        let existingEvent = await this.db.get(query, [name, city, date]);
    
        if (existingEvent) {
            log("Такое событие уже есть");
            return;
        }
    
        query = `INSERT INTO Events (name, city, date, org_id, isRegular, address, poster_url, time, price, contact) VALUES (?,?,?,?,?,?,?,?,?,?)`;
        await this.db.run(query, [name, city, date, org_id, isRegular, address, poster_url, time, price, contact]);
    }
      

    async getEvents(city, date) {
        let query = `SELECT * FROM Events WHERE city=? AND date=?`;
        try { return await this.db.all(query, city, date); }
        catch { log("Что-то не так с запросом getEvent"); }
    }

    async test() {

        this.addUser(22, 25, "Nikita");
        this.addUser(25, 22, "Egor");
        this.addEvent("Party", "Almaty", "25-06-2022", 12, 0, "Abay st.");
        this.addEvent("Disco", "Almaty", "01-07.2023", 13, 0, "Altynsarin st.", "https://cdn2.vectorstock.com/i/1000x1000/91/31/disco-poster-background-vector-1849131.jpg", "18:00", 5000);

        let query = "SELECT * FROM Users";
        let rows = await this.db.all(query);
        log("Юзеры: ", rows);

        let queryEv = "SELECT * FROM Events";
        let rowsEv = await this.db.all(queryEv);
        log("События: ", rowsEv);

        let events = await this.getEvents('Almaty', '25-06-2022');
        log("Выбранное событие:", events);
    }
}

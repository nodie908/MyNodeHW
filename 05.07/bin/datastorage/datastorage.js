import sqlite3 from 'sqlite3';
//
export class DataStorage {
    constructor(database) {
        this.db = new sqlite3.Database(database.file);
        this.createTables();
    }

    createTables() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                login TEXT,
                passw TEXT,
                email TEXT
            )
        `);
    }

    getUser = (id) => {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT login, email FROM users WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(`${row.login}, ${row.email}`);
                }
            });
        });
    }

    addUser = (login, passw, email) => {
        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO users (login, passw, email) VALUES (?, ?, ?)', [login, passw, email], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    loginUser = (login, passw) => {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT id FROM users WHERE login = ? AND passw = ?', [login, passw], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? row.id : null);
                }
            });
        });
    }
}
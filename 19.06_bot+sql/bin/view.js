import TelegramBot from "node-telegram-bot-api";
import EventEmitter from "events";
import { Database } from "./model.js";
const log = console.log;

export class Telegram extends EventEmitter {
    users = { "id": { state: "", event: {}, chatId: 0 } }

    constructor(config) {
        super();
        this.config = config;
        this.bot = new TelegramBot(this.config.token, { polling: true });
        this.users = {};
        this.database = new Database(config);
        this.addEvent = this.database.addEvent.bind(this.database);
    }

    start() {
        this.textHandler = this._textHandler.bind(this);
        this.buttonHandler = this._buttonHandler.bind(this);
        this.bot.on('text', this.textHandler);
        this.bot.on('callback_query', this.buttonHandler);
        this.searchHandler = this._searchHandler.bind(this);
        this.on("search", this.searchHandler);
    }

    stop() {
        this.bot.off('text', this.textHandler);
        this.bot.off('callback_query', this.buttonHandler);
        this.off("search", this.searchHandler);
    }

    async process(user, message) {
        switch (user.state) {
            case "wait_command":
                if (message === "find_events") {
                    this.bot.sendMessage(user.chatId, "В каком городе?");
                    user.state = "wait_city";
                } else if (message === "create_events") {
                    user.state = "create_event";
                    user.event = {};
                    this.bot.sendMessage(user.chatId, "Введите название события:");
                }
                break;

            case "wait_city":
                user.event.city = message;
                this.bot.sendMessage(user.chatId, "В какой день (напр. 12-04-2024)?");
                user.state = "wait_date";
                break;

            case "wait_date":
                user.event.date = message;
                this.bot.sendMessage(user.chatId, "Сейчас скажу...");
                user.state = null;
                await this._searchHandler(user.chatId, user.event.city, user.event.date);
                break;

            case "create_event":
                if (!user.event.name) {
                    user.event.name = message;
                    this.bot.sendMessage(user.chatId, "Введите город:");
                } else if (!user.event.city) {
                    user.event.city = message;
                    this.bot.sendMessage(user.chatId, "Введите дату (напр. 12-01-2024):");
                } else if (!user.event.date) {
                    user.event.date = message;
                    this.bot.sendMessage(user.chatId, "Введите организатора (ID):");
                } else if (!user.event.org_id) {
                    user.event.org_id = parseInt(message);
                    this.bot.sendMessage(user.chatId, "Это регулярное событие? (0 - нет, 1 - да)");
                } else if (user.event.isRegular === undefined) {
                    user.event.isRegular = parseInt(message);
                    this.bot.sendMessage(user.chatId, "Введите адрес:");
                } else if (!user.event.address) {
                    user.event.address = message;
                    this.bot.sendMessage(user.chatId, "Введите URL постера (опционально):");
                } else if (!user.event.poster_url) {
                    user.event.poster_url = message;
                    this.bot.sendMessage(user.chatId, "Введите время (опционально):");
                } else if (!user.event.time) {
                    user.event.time = message;
                    this.bot.sendMessage(user.chatId, "Введите цену (опционально):");
                } else if (!user.event.price) {
                    user.event.price = message;
                    this.bot.sendMessage(user.chatId, "Введите контактную информацию (опционально):");
                } else if (!user.event.contact) {
                    user.event.contact = message;
                    this.bot.sendMessage(user.chatId, `Подтвердите создание события:
Название: ${user.event.name}
Город: ${user.event.city}
Дата: ${user.event.date}
Организатор: ${user.event.org_id}
Адрес: ${user.event.address}
URL постера: ${user.event.poster_url}
Время: ${user.event.time}
Цена: ${user.event.price}
Контактная информация: ${user.event.contact}
Всё верно? (да/нет)`);
                } else if (message.toLowerCase() === "да") {
                    this.addEvent(user.event.name, user.event.city, user.event.date, user.event.org_id, user.event.isRegular, user.event.address, user.event.poster_url, user.event.time, user.event.price, user.event.contact);
                    this.bot.sendMessage(user.chatId, "Событие опубликовано");
                    user.state = null;
                } else if (message.toLowerCase() === "нет") {
                    this.bot.sendMessage(user.chatId, "Отмена создания события");
                    user.state = null;
                } else {
                    this.bot.sendMessage(user.chatId, "Пожалуйста, подтвердите создание события (да/нет):");
                }
                break;
        }
    }

    _textHandler(message) {
        let user = this.users[message.chat.id.toString()];
        switch (message.text) {
            case "/start":
                this.users[message.chat.id.toString()] = {
                    state: "wait_command",
                    event: {},
                    chatId: message.chat.id
                };
                this.bot.sendMessage(message.chat.id, "Здравствуйте, что хотите сделать?", {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Узнать о событиях", callback_data: "/find_events" }],
                            [{ text: "Создать событие", callback_data: "/create_events" }],
                        ]
                    }
                });
                break;

            case "create_events":
                if (user) {
                    this.process(user, "create_events");
                } else {
                    this.bot.sendMessage(message.chat.id, "Отправьте /start");
                }
                break;

            default:
                if (user) {
                    this.process(user, message.text);
                } else {
                    this.bot.sendMessage(message.chat.id, "Отправьте /start");
                }
        }
    }

    _buttonHandler(message) {
        let user = this.users[message.from.id.toString()];
        if (message.data === "/find_events") {
            this.process(user, "find_events");
        } else if (message.data === "/create_events") {
            this.process(user, "create_events");
        }
    }

    async _searchHandler(chatId, city, date) {
        try {
            const events = await this.database.getEvents(city, date);

            if (events === null) {
                await this.bot.sendMessage(chatId, "К сожалению, в выбранном городе и дате нет событий.");
            } else {
                await this.sendEvents(chatId, events);
            }
        } catch (error) {
            log("Ошибка при выполнении поиска событий:", error);
            await this.bot.sendMessage(chatId, "Произошла ошибка при выполнении поиска событий.");
        }
    }

    async sendEvents(chatId, eventList) {
        for (const event of eventList) {
            let message = `Название события: ${event.name}\nГород: ${event.city}\nДата: ${event.date}\nОрганизатор: ${event.org_id}\nАдрес: ${event.address}\nURL постера: ${event.poster_url}\nВремя: ${event.time}\nЦена: ${event.price}\nКонтактная информация: ${event.contact}`;
            await this.bot.sendMessage(chatId, message);
        }
    }
}

import { Database } from "./model.js";
import { Telegram } from "./view.js";

export class Application {
    constructor(config) {
        this.config = config;
        this.model = new Database(config.database);
        this.view = new Telegram(config.telegram);
    }

    async start() {
        this.view.start();
        await this.model.start();
        await this.model.test();

        this.view.on('search', async (id,city, date) => {
            let response = await this.model.getEvents(city, date);
            this.view.sendEvents(id,response);
        });
    }

    async stop() {
        this.view.stop();
        this.model.stop();
    }
}


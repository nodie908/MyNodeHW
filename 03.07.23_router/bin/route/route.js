import express from "express";

export default class Router {
    constructor(controller, config) {
        this.controller = controller;
        this.config = config;
        this.app = express();
    }

    start() {
        this.server = this.app.listen(this.config.port, () => {
            console.log("Server started at", this.config.port);
        });
        this.createRoutes()
    }

    stop() {
        this.server.close();
    }

    createRoutes() {
        this.app.get("/", (req, res) => {
            if (this.controller.isSession(req, res)) {
                this.controller.mainUserPage(req, res);
            } else {
                this.controller.mainPageGeneral(req, res);
            }
        });

        this.app.get("/register", (req, res) => {
            if (this.controller.isSession(req, res)) {
                this.controller.mainUserPage(req, res);
            } else {
                this.controller.registrationPage(req, res);
            }
        });

        this.app.get("/login", (req, res) => {
            if (this.controller.isSession(req, res)) {
                this.controller.mainUserPage(req, res);
            } else {
                this.controller.loginPage(req, res);
            }
        });

        this.app.post("/login", (req, res) => {
            if (this.controller.isSession(req, res)) {
                this.controller.mainUserPage(req, res);
            } else {
                this.controller.login(req, res);
            }
        });

        this.app.post("/confirm", (req, res) => {
            if (this.controller.isSession(req, res)) {
                this.controller.mainUserPage(req, res);
            } else {
                this.controller.confirm(req, res);
            }
        });

        this.app.post("/confirmed", (req, res) => {
            if (this.controller.isSession(req, res)) {
                this.controller.mainUserPage(req, res);
            } else {
                this.controller.confirmed(req, res);
            }
        });

    }
}
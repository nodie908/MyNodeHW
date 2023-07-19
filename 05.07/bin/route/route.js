import express from 'express';
import bodyParser from 'body-parser';

export class Router {
    constructor(controller, config) {
        this.controller = controller;
        this.config = config;
        this.app = express();
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    start() {
        this.server = this.app.listen(this.config.port, () => {
            console.log('Server started at', this.config.port);
        });
        this.createRoutes();
    }

    stop() {
        this.server.close();
    }

    createRoutes() {
        this.app.get('/',
            this.controller.mainUserPage,
            this.controller.mainGeneralPage
        );

        this.app.get('/register',
            this.controller.mainUserPage,
            this.controller.registrationPage
        );

        this.app.get('/captcha.pic', this.controller.sendCaptcha);

        this.app.get('/login',
            this.controller.mainUserPage,
            this.controller.loginPage
        );

        this.app.post('/login',
            this.controller.checkLogin,
            this.controller.redirToUserPage
        );

        this.app.post('/confirm',
            this.controller.generateConfirmCode,
            this.controller.registrationPage
        );

        this.app.post("/confirmed",
            this.controller.mainUserPage,
            this.controller.checkConfirmCode,
            this.controller.redirToUserPage);
    }
}
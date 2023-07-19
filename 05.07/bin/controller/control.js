import path from 'path';
import fs, { read } from 'fs';

export class Controller {
    sidAge = 220;

    constructor(service) {
        this.service = service;
        this.dir = process.cwd();
    }

    getSid = (req) => {
        const cookies = getCookies(req.header("Cookie"));
        return cookies.sid;
    }

    mainUserPage = (req, res, next) => {
        let sid = this.getSid(req);

        if (sid && this.service.isLogged(sid)) {
            const userData = this.service.getUserData(sid);
            const fname = path.join(this.dir, 'public', 'user.html');
            fs.readFile(fname, 'utf-8', (err, data) => {
                if (data) {
                    const html = data.replace('%userData%', userData);
                    res.status(200).send(html);
                } else {
                    res.status(404).send("<h2>Page not found :(</h2>");
                }
            });
        } else {
            next();
        }
    }

    checkSid = (req, res, step) => {
        let sid = this.getSid(req);
        console.log("Session ID:", sid, "on", req.originalUrl);
        if (!sid) {
            sid = this.service.newSid(this.sidAge);
            res.setHeader('Set-Cookie', `sid=${sid}; Max-Age=${this.sidAge}; HttpOnly`);
        }
        this.service.updateSession(sid, step, this.sidAge);
        return sid;
    }

    mainGeneralPage = (req, res) => {
        this.checkSid(req, res, 'index');
        const fname = path.join(this.dir, 'public', 'index.html');
        res.sendFile(fname);
    }

    registrationPage = async (req, res) => {
        const sid = this.checkSid(req, res, 'registration');
        const captcha = await this.service.newCaptcha(sid);
        const fname = path.join(this.dir, 'public', 'register.html');
        res.sendFile(fname);
    }

    loginPage = (req, res) => {
        this.checkSid(req, res, 'login');
        const fname = path.join(this.dir, 'public', 'login.html');
        res.sendFile(fname);
    }

    confirmPage = (req, res) => {
        this.checkSid(req, res, 'confirm');
        const fname = path.join(this.dir, 'public', 'confirm.html');
        res.sendFile(fname);
    }

    redirToUserPage = (req, res) => {
        this.checkSid(req, res, 'logged');
        res.redirect('/');
    }

    checkLogin = (req, res, next) => {
        const sid = this.getSid(req);
        const login = req.body['login'];  // input name='login' в форме регистрации
        const passw = req.body['passw'];
        const logged = this.service.login(sid, login, passw);
        if (logged) {
            next();
        } else {
            res.status(400).send('Incorrect login or password');
        }
    }

    sendCaptcha = (req, res) => {
        const sid = this.getSid(req);
        const captchaFile = this.service.getCaptchaFile(sid);
        if (captchaFile) {
            const fname = path.join(this.dir, captchaFile);
            res.sendFile(fname);
        } else {
            res.status(404).send("File not found");
        }
    }

    checkCaptcha = (req, res, next) => {
        const sid = this.getSid(req);
        const login = req.body['login']; // input name='login' в форме регистрации
        const passw = req.body['passw'];
        const email = req.body['email'];
        const captcha = req.body['captcha'];
        const isOk = this.service.checkCaptcha(sid, login, passw, email, captcha);
        if (isOk) {
            next();
        } else {
            res.status(400).send('Bad registration data');
        }
    }

    generateConfirmCode = (req, res, next) => {
        const confirmCode = Math.floor(Math.random() * 10000);
        console.log('Confirmation Code:', confirmCode);
        const fname = path.join(this.dir, 'public', 'confirm.html');
        res.sendFile(fname);
        next();
    }

    checkConfirmCode = (req, res, next) => {
        const sid = this.getSid(req);
        const code = req.body['confirmCode'];
        const isOk = this.service.checkConfirmCode(sid, code);
        if (isOk) {
            next();
        } else {
            res.status(400).send('Bad confirm code');
        }
    }

}

function getCookies(cookieString) {
    let cookies = {};
    if (cookieString) {
        const cookieArray = cookieString.split(';');
        for (let x of cookieArray) {
            const [key, value] = x.trim().split('=');
            cookies[key] = value;
        }
    }
    return cookies;
}
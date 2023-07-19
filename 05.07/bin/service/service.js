import { Session } from './session.js';
import { CaptchaService } from './captcha.js';

export class Service {
    sessions = {};

    constructor(dataStorage) {
        this.dataStorage = dataStorage;
        this.captcha = new CaptchaService(this.session);
        //this.confirm = new ConfirmService(this.session);
    }

    isLogged = (sid) => {
        let session = this.sessions[sid];
        return session?.step === 'logged';
    }

    getUserData = (sid) => {
        let session = this.sessions[sid];
        let data = this.dataStorage.getUser(session.userId);
        return data;
    }

    newSid = (expireSeconds) => {
        let session = new Session(expireSeconds);
        let sid = Session.newSid(Object.keys(this.sessions).length);
        this.sessions[sid] = session;
        console.log(this.sessions);
        return sid;
    }

    updateSession = (sid, step, expireSeconds) => {
        let session = this.sessions[sid];
        if (!session) {
            session = new Session(expireSeconds);
            this.sessions[sid] = session;
        }
        this.sessions[sid].step = step;
        //TODO: сделать update поля expired
    }

    login = (sid, login, passw) => {
        if (this.sessions[sid].step === 'logged') return true;
        let userId = this.dataStorage.loginUser(login, passw);
        if (userId) {
            this.sessions[sid].step = 'logged';
            this.sessions[sid].userId = userId;
            return true;
        }
        return false;
    }

    newCaptcha = async (sid) => {
        let session = this.sessions[sid];
        session.captcha.file = "tmp/captcha/" + sid + ".png";
        session.captcha.value = await this.captcha.create(session.captcha.file);
        return session.captcha.file;
    }

    getCaptchaFile = (sid) => {
        let session = this.sessions[sid];
        return session?.captcha.file;
    }

    checkCaptcha = (sid, login, passw, email, captcha) => {
        let session = this.sessions[sid];
        let isOk = session.captcha.value === captcha;
        if (isOk) {
            session.userId = this.dataStorage.addUser(login, passw, email);
        }
        // капчу нужно в любом случае удалить
        this.captcha.remove(session.captcha.file);
        session.captcha.value = null;
        return isOk;
    }

    sendConfirmCode(sid) {
        let session = this.sessions[sid];
        session.confirmCode = getRandomInt();
        log(`Код для подтверждения регистрации: ${session.confirmCode}`);
    }

    generateConfirmCode(sid, code) {
        let session = this.sessions[sid];
        if (session.confirmCode == code) {
            session.confirmCode = null;
            return true;
        }
        return false;
    }

}

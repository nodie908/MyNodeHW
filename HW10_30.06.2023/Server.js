import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import Session from './Session.js';
import Captcha from './Captcha.js';
import Cookie from './Cookie.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const session = new Session();
const captcha = new Captcha();
const cookie = new Cookie();

app.get('/', (req, res) => {
    let sid = session.getSID();
    console.log("  New SID =", sid);

    let { captchaValue, captchaFile } = captcha.generateCaptcha();
    res.setHeader('Set-Cookie', `sid=${sid}; Max-Age=220; HttpOnly`);
    res.setHeader('Content-Type', 'text/html');

    res.end(`
    <img src="${captchaFile}"/><br>
    <form action="/register" method="post">
    <label for="login">Логин: </label>
    <input name="login" type="text"><br>

    <label for="email">E-mail: </label>
    <input name="email" type="text"><br>

    <label for="passwd">Пароль: </label>
    <input name="passwd" type="password"><br>

    <label for="passwd">Повторите пароль: </label>
    <input name="confirmPasswd" type="password"><br>

    <input type="hidden" name="captchaSid" value="${sid}">
    <input type="hidden" name="captchaValue" value="${captchaValue}">

    <label for="captcha">Введите код с картинки: </label>
    <input name="captcha" type="text"><br>

    <input type="submit" title="Зарегистрироваться">
  </form>
`);
});

app.get('/login', (req, res) => {
    let filePath = path.join(process.cwd(), "public/login.html");
    res.sendFile(filePath);
});

app.post('/register', (req, res) => {
    const { login, email, passwd, confirmPasswd, captcha, captchaSid } = req.body;
    const captchaValid = captcha.validateCaptcha(captchaSid, captcha);

    if (!captchaValid) {
        res.status(400).send('Неверный код с картинки');
        return;
    }

    captcha.deleteCaptchaFile(captchaSid);

    res.redirect('/user');
});

app.post('/login', (req, res) => {
    const cookies = cookie.getCookies(req.header('Cookie'));
    const sid = cookies.sid;

    if (sid) {
        let solved = captcha.validateCaptcha(sid, req.body['captchaValue']);

        if (captchas[sid].file) {
            captcha.deleteCaptchaFile(sid);
        }

        res.type('html');
        res.end(`
    <p>CAPTCHA VALID: ${solved}</p>
  `);
    }
});

app.get('/register', (req, res) => {
    let filePath = path.join(process.cwd(), 'public/register.html');
    res.sendFile(filePath);
});

app.post('/confirm', (req, res) => {
    let filePath = path.join(process.cwd(), 'public/confirm.html');
    res.sendFile(filePath);
});

app.post('/confirmed', (req, res) => {
    const { code } = req.body;
    if (code === '123456') {
        session.user_id = '123';
        const filePath = path.join(process.cwd(), 'public/index.html');
        res.sendFile(filePath);
    } else {
        const errorMessage = 'Неправильный код подтверждения. Попробуйте снова.';
        res.send(errorMessage);
    }
});

app.listen(3001, () => {
    console.log('Сервер запущен на порту 3001');
});

export default app;

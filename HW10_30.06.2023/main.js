// 1. "/"             Главная страница общая (кнопка "Вход"  и "Регистрация")
// 2. "/" + sid       Главная страница пользователя (Имя пользователя, кнопка "Выход")
// 3. "/register"     Форма регистрации (имя, email, пароль, подтверждение пароля, капча <img>)
// 4. "/confirm"      Форма подтверждения регистрации (поле для ввода кода)
// 5. "/login"        Форма входа (логин, пароль)


import app from './Server.js';

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});


import express from 'express';
import bodyParser from 'body-parser';
import svgCaptcha from 'svg-captcha';
import path from 'path';
import fs from 'fs';

let session = { '752583': { status: null, captcha: { value: 0, file: '' } }, user_id: null };
let captchas = {};

function getSID() {
    let time = new Date().getTime();
    let salt = Math.trunc(Math.random() * 1000000000);
    return salt.toString(16) + Object.keys(session).length.toString(16) + time.toString(16);
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/', (req, res) => {
    let sid = getSID();
    console.log("  New SID =", sid);

    let captcha = svgCaptcha.create();
    let captcha_id = Object.keys(captchas).length;
    let captchaSvg = captcha.data;
    let captchaValue = captcha.text;
    let captchaFile = path.join(process.cwd(), 'public', 'captcha', `${captcha_id}.svg`);
    captchas[sid] = { value: captchaValue, file: captchaFile };
    fs.writeFileSync(captchaFile, captchaSvg);

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


function getCookies(cookieString) {
    let cookies = {};
    const cookieArray = cookieString.split(';');
    for (let x of cookieArray) {
        const [key, value] = x.trim().split('=');
        cookies[key] = value;
    }
    return cookies;
}

app.get('/login', (req, res) => {
    let filePath = path.join(process.cwd(), "public/login.html");
    res.sendFile(filePath);
  });
  

app.post('/register', (req, res) => {
    const { login, email, passwd, confirmPasswd, captcha, captchaSid } = req.body;
    const captchaValue = captchas[captchaSid]?.value;

    if (captcha !== captchaValue) {

        res.status(400).send('Неверный код с картинки');
        return;
    }
    delete captchas[captchaSid];

    res.redirect('/user');
});

app.post('/login', (req, res) => {
    const cookies = getCookies(req.header("Cookie"));
    const sid = cookies.sid;

    if (sid) {
        console.log(captchas[sid].value);
        let solved = captchas[sid].value === req.body['captchaValue'];

        if (captchas[sid].file) {
            fs.unlink(captchas[sid].file, err => console.log(err));

            captchas[sid].value = null;
            captchas[sid].file = null;
        }
        res.type('html');
        res.end(`
            <p>CAPTCHA VALID: ${solved}</p>
        `);
    }
});

app.get('/register', (req, res) => {
    let filePath = path.join(process.cwd(), "public/register.html");
    res.sendFile(filePath);
});

app.post('/confirm', (req, res) => {
    let filePath = path.join(process.cwd(), "public/confirm.html");
    res.sendFile(filePath);
});

app.post('/confirmed', (req, res) => {
    const { code } = req.body;
    if (code === '123456') {
        session.user_id = '123';
        const filePath = path.join(process.cwd(), "public/index.html");
        res.sendFile(filePath);
    } else {
        const errorMessage = 'Неправильный код подтверждения. Попробуйте снова.';
        res.send(errorMessage);
    }
});

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});

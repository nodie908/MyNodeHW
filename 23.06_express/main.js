import express from "express";
import fs from "fs";

const app = express();
const port = 3000;

const users = [];
fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8");


app.get('/', async (req, res) => {
    try {
        const data = await fs.promises.readFile("./index.html", "utf-8");
        res.status(200).send(data);
    } catch (error) {
        console.error("error", error);
        res.status(500).send("error");
    }
});


app.get('/register', (req, res) => {
    const data = fs.readFileSync("./register.html", "utf-8");
    res.status(200).send(data);
});

app.post('/users', (req, res) => {
    let body = [];
    req.on("data", (chunk) => {
        body.push(chunk);
    }).on("end", () => {
        body = Buffer.concat(body).toString();
        let userData = JSON.parse(body);
        let users = JSON.parse(fs.readFileSync("./users.json", "utf-8"));
        users.push(userData);
        fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8");
        let redirectUrl = "/users?name=" + userData.name;
        res.redirect(302, redirectUrl);
    });
});

app.get('/users', (req, res) => {
    const name = req.query.name;
    if (name) {
        let data = fs.readFileSync('./users.html', 'utf-8');
        data = data.replace("%name", name);
        res.status(200).send(data);
    } else {
        res.status(403).send(`Name is not found`);
    }
});

app.get('/feedback', (req, res) => {
    const data = fs.readFileSync("./feedback.html", "utf-8");
    res.status(200).send(data);
});

app.use((req, res) => {
    res.status(404).send("Страница не найдена");
});

app.listen(port, () => {
    console.log(`Server workaet na porte ${port}`);
})

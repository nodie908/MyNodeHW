import { createServer } from "http";
import url from "url";
import fs from "fs";

const users = [];
fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8");

function worker(request, response) {
    let currentUrl = url.parse(request.url, true);
    let data;

    switch (currentUrl.pathname) {
        case "/":
            data = fs.readFileSync("./index.html", "utf-8");
            response.statusCode = 200;
            response.setHeader("Content-Type", "text/html");
            response.write(data);
            response.end();
            return;

        case "/register":
            if (request.method === "GET") {
                data = fs.readFileSync("./register.html", "utf-8");
                response.statusCode = 200;
                response.setHeader("Content-Type", "text/html");
                response.write(data);
            } else {
                response.statusCode = 403;
                response.statusMessage = "Invalid request method";
            }
            break;

        case "/users":
            if (request.method === "GET") {
                let name = currentUrl.query.name;
                if (name) {
                    data = fs.readFileSync("./users.html", "utf-8");
                    data = data.replace("%name%", name);
                    response.statusCode = 200;
                    response.setHeader("Content-Type", "text/html");
                    response.write(data);
                } else {
                    response.statusCode = 403;
                    response.statusMessage = "name is not specified";
                }
            } else if (request.method === "POST") {
                let body = [];
                request.on("data", (chunk) => {
                    body.push(chunk);
                }).on("end", () => {
                    body = Buffer.concat(body).toString();
                    let userData = JSON.parse(body);
                    let users = JSON.parse(fs.readFileSync("./users.json", "utf-8"));
                    users.push(userData);
                    fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8");
                    let redirectUrl = "/users?name=" + userData.name;
                    response.statusCode = 302;
                    response.setHeader("Location", redirectUrl);
                    response.end();
                    return;
                });
            } else {
                response.statusCode = 403;
                response.statusMessage = "Invalid request method";
            }
            break;

        case "/feedback":
            data = fs.readFileSync("./feedback.html", "utf-8");
            response.statusCode = 200;
            response.write(data);
            break;

        case "/favicon.ico":
            data = fs.readFileSync("./favicon.ico");
            response.statusCode = 200;
            response.setHeader("Content-Type", "image/x-icon");
            response.write(data);
            response.end();
            return;

        default:
            response.statusCode = 404;
            response.statusMessage = "Page not found";
            response.end();
            return;
    }

    response.end();
}

const server = createServer(worker);
server.listen(3000, () => {
    console.log("Сервер запущен, порт 3000");
});

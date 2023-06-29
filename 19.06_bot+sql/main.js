import { Application } from "./bin/app.js";
import fs from 'fs';
import ini from 'ini';

const cfg_file = fs.readFileSync("./config.ini", "utf-8");
const config = ini.parse(cfg_file);

const app = new Application(config);
app.start();
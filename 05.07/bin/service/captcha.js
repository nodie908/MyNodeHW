import Captcha from 'captcha-generator-alphanumeric';
import path from 'path';
import fs from 'fs';

export class CaptchaService {

    create = async (filename) => {
        let captcha = new Captcha.default();
        let captchaFile = path.join(process.cwd(), `${filename}`);
        let captchaOut = fs.createWriteStream(captchaFile);
        captcha.PNGStream.pipe(captchaOut);
        let captchaFinished = new Promise((good, bad) => {
            captchaOut.on('finish', () => {
                good(captcha.value)
            });
            captchaOut.on("error", (err) => {
                console.log("Ошибка капчи:", err)
                bad();
            })
        });
        return await captchaFinished;
    }

    remove = (filename) => {
        let captchaFile = path.join(process.cwd(), `${filename}`);
        fs.rm(captchaFile, (err) => {
            if (err) console.log("Не могу удалить", captchaFile);
        });
    }

}
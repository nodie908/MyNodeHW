import svgCaptcha from 'svg-captcha';
import path from 'path';
import fs from 'fs';

class Captcha {
    constructor() {
        this.captchas = {};
    }

    generateCaptcha() {
        let captcha = svgCaptcha.create();
        let captcha_id = Object.keys(this.captchas).length;
        let captchaSvg = captcha.data;
        let captchaValue = captcha.text;
        let captchaFile = path.join(process.cwd(), 'public', 'captcha', `${captcha_id}.svg`);
        this.captchas[sid] = { value: captchaValue, file: captchaFile };
        fs.writeFileSync(captchaFile, captchaSvg);

        return {
            captchaValue,
            captchaFile
        };
    }

    validateCaptcha(sid, userInput) {
        const captchaValue = this.captchas[sid]?.value;
        delete this.captchas[sid];
        return captchaValue === userInput;
    }

    deleteCaptchaFile(sid) {
        if (this.captchas[sid].file) {
            fs.unlink(this.captchas[sid].file, err => console.log(err));
            this.captchas[sid].value = null;
            this.captchas[sid].file = null;
        }
    }
}

export default Captcha;

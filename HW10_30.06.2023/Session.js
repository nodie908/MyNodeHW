class Session {
    constructor() {
        this.sessions = { '752583': { status: null, captcha: { value: 0, file: '' } }, user_id: null };
    }

    getSID() {
        let time = new Date().getTime();
        let salt = Math.trunc(Math.random() * 1000000000);
        return salt.toString(16) + Object.keys(this.sessions).length.toString(16) + time.toString(16);
    }
}

export default Session;

class Cookie {
    getCookies(cookieString) {
        let cookies = {};
        const cookieArray = cookieString.split(';');
        for (let x of cookieArray) {
            const [key, value] = x.trim().split('=');
            cookies[key] = value;
        }
        return cookies;
    }
}

export default Cookie;

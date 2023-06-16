const log = console.log;
import fs from "fs";

process.stdin.on('data', (buffer) => {
    let prmt = buffer.toString().trim();
    log(buffer.toString());

    if (prmt === '/html') {

        fs.readFile('index.html', 'utf-8', (err, data) => {
            if (err) throw err;
            log(data.toString());
        })
    } else if (prmt === '/text') {
        let data = fs.readFileSync('text.txt', 'utf-8')
        log(data);
    } else if (prmt === "/dir") {
            fs.readdir(".", (err, fileList) => {
                for (let x of fileList) {
                    log(x);
            
                }
            })
    } else if (prmt.includes('/text?')) {
        let newText = prmt.slice(6);
        let keyVal = newText.split('=');
        log(keyVal);
        let key = keyVal[0];
        let val = keyVal[1];
        fs.appendFile('text.txt', `${key}:${val}\n`, (err) => {
            if (err) throw err;
            log(key);
        });

    }

});






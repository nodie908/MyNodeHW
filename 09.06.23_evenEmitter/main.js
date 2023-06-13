
const Events = require('events');
const log = console.log;

class EventEmitter extends Events {
    constructor() {
        super()
    };

    start() {

        process.stdin.on('data', (input) => this.processInput(input));
    }

    stop() {
        process.stdin.removeAllListeners('data');
    }

    processInput(input) {

        const trimInput = String(input).trim();

        if (trimInput === 'exit') {
            this.emit('exit');
        } else if (trimInput.startsWith('solve')) {
            const expression = trimInput.slice(6).trim();
            this.emit('solve',expression);
        } else {
            this.emit('input', trimInput);
        }
    }
}

const procInp = new EventEmitter;

procInp.on('input', (input) => {
    log(input);
});

procInp.on('solve', (expression) =>{
    try {
        const res = eval(expression);
        log(res);
    } catch (error) {
        log('Не могу вычислить');
    }
});

procInp.on('exit', () => {
    procInp.stop();
    process.exit();
});

procInp.start();

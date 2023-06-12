// process.stdout.write("Hello, what's yoyr name? ");

// user_ask_lastname = false;

// process.stdin.on('data', (data) => {
//     uname = data.toString();
//     log("your name is ", uname);
//     process.stdin.pause();
//     user_ask_lastname = true;
// });

// setTimeout(() => {
//     if (user_ask_lastname) {
//         process.stdout.write("So what's your last name? ");
//         process.stdin.resume();
//     }
// }, 10000);

// process.stderr.write("ERRORR!!");

const log = console.log;

async function prompt(message, defaultValue) {
    return new Promise((resolve) => {
        process.stdout.write(message);

        process.stdin.once('data', (data) => {
            const input = data.toString().trim();
            let value;

            if (defaultValue !== undefined) {
                try {
                    if (typeof defaultValue === 'boolean') {
                        value = input ? Boolean(input) : defaultValue;
                    } else if (typeof defaultValue === 'number') {
                        value = input ? Number(input) : defaultValue;
                    } else if (typeof defaultValue === 'string') {
                        value = input || defaultValue
                    } else if (Array.isArray(defaultValue)) {
                        value = input ? JSON.parse(input) : defaultValue;
                    } else {
                        value = input;
                    }

                } catch (error) {
                    value = defaultValue;
                }
            } else {
                value = input;
            }
            resolve(value);
        });
    });
}

module.exports = prompt;
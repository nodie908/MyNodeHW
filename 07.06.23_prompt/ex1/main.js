const log = console.log;

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

const prompt = require('./prompt')

  prompt("Сколько вам лет?")
    .then(Number)
    .then((userAge) => {
      log(`Возраст пользователя: ${userAge}`);
      return prompt("Как вас зовут?");
    })
    .then((userName) => {
      console.log(`Имя пользователя: ${userName}`);
      process.exit();
    });

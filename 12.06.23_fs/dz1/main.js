import fs from "fs";

function promptUser(question) {
    return new Promise((resolve) => {
        process.stdout.write(question);
        process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
}

function isValidDate(dateString) {
    const regex = /^\d{2}\.\d{2}\.\d{4}$/;
    return regex.test(dateString);
}

async function foo() {
    try {
        const userData = {};

        userData.name = await promptUser('Введите ваше имя: ');
        userData.surname = await promptUser('Введите вашу фамилию: ');

        let birthDate = await promptUser('Введите вашу дату рождения (дд.мм.гггг): ');
        while (!isValidDate(birthDate)) {
            console.log('Некорректный формат даты. Попробуйте еще раз.');
            birthDate = await promptUser('Введите вашу дату рождения (дд.мм.гггг): ');
        }
        userData.birthDate = birthDate;

        userData.filename = await promptUser('Введите имя файла для записи: ');

        const data = ` Имя: ${userData.name}\n Фамилия: ${userData.surname}\n Дата рождения: ${userData.birthDate}`;

        fs.writeFile(userData.filename, data, (err) => {
            if (err) {
                console.error('Ошибка при записи файла:', err);
            } else {
                console.log('Информация успешно записана в файл.');
            }
        });
    } catch (error) {
        console.error('Произошла ошибка:', error);
    } 
}

foo();

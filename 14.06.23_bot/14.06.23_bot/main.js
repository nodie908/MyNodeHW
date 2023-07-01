import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

const log = console.log;
const TOKEN = '6295520632:AAHjPghF6shzCvT-X15YzYka-3RZ0mVM_9I';
const weatherApiKey = '40f447f6cbf04bf4af345110230206';

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Введите название города, для которого вы хотите узнать о погоде', {
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [['Прогноз на 3 дня']],
            one_time_keyboard: true,
        },
    });
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const city = msg.text;

    if (msg.text === "Прогноз на 3 дня") {
        try {
            const forecast = await getThreeDayWeather(city);
            const message = formatForecastMessage(forecast);
            bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
        }  catch (error) {
            console.error(error); // Вывести ошибку в консоль для отладки
            bot.sendMessage(chatId, "Произошла ошибка. Пожалуйста, попробуйте еще раз позже");
        }
        
    } else {
        try {
            const weather = await getWeather(city);
            const message = formatWeatherMessage(weather);
            bot.sendMessage(chatId, message);
        } catch (error) {
            bot.sendMessage(chatId, "Не удалось узнать информацию о погоде")
        }
    }
});

async function getThreeDayWeather(city) {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${city}&days=3&aqi=no&alerts=no&lang=ru`;
    const response = await axios.get(url);
    return response.data;
}

async function getWeather(city) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${encodeURIComponent(city)}`;
    const response = await axios.get(url);
    return response.data;
}

function formatForecastMessage(forecast) {
    const days = forecast.forecast.days.slice(0, 3);
    const messages = [];

    messages.push('<b>Прогноз погоды на 3 дня:</b>');
    for (const day of days) {
        const date = day.date;
        const temperature = day.temperature;
        const weather = day.weather;

        const message = `<b>${date}</b>\nТемпература: ${temperature}\nПогода: ${weather}`;
        messages.push(message);
    }

    const formattedMessage = messages.join('\n\n');
    return formattedMessage;
}


function formatWeatherMessage(weather) {
    const location = weather.location.name;
    const dateTime = weather.location.localtime;
    const condition = weather.current.condition.text;
    const temperature = weather.current.temp_c;
    const feelsLike = weather.current.feelslike_c;
    const humidity = weather.current.humidity;
    const windSpeed = weather.current.wind_kph;
    const windDirection = weather.current.wind_dir;

    const message = `
      Город: <b>${location}</b>
      Дата и время: ${dateTime}
      Погода: ${getWeatherEmoji(condition)} ${condition}
      Температура: ${temperature}°C
      Ощущается как: ${feelsLike}°C
      Влажность: ${humidity}%
      Скорость ветра: ${windSpeed} км/ч
      Направление ветра: ${windDirection}
    `;

    return message;
}

function getWeatherEmoji(condition) {
    let emoji = '';

    switch (condition) {
        case 'Sunny':
            emoji = '☀️';
            break;
        case 'Clear':
            emoji = '☀️';
            break;
        case 'Partly cloudy':
            emoji = '🌤️';
            break;
        case 'Overcast':
            emoji = '☁️';
            break;
        case 'Rain':
            emoji = '🌧️';
            break;
        case 'Light rain':
            emoji = '🌧️';
            break;
        case 'Thunderstorm':
            emoji = '⛈';
            break;
        case 'Snow':
            emoji = '❄️';
            break;
        default:
            emoji = '❓';
            break;
    }

    return emoji;
}

console.log('Бот запущен');

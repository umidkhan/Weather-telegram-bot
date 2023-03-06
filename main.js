const TelegramApi = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

const token = process.env.TOKEN;
const bot = new TelegramApi(token, { polling: true });
const API = process.env.API;
const myId = process.env.MY_CHAT_ID;

bot.setMyCommands([{ command: "/start", description: "Launch the bot" }]);

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text === "/start") {
    await bot.sendMessage(
      chatId,
      `Hello ${msg.chat.first_name}
Please enter the name of the city ❗️`
    );
    console.log("Bot is started");
  } else {
      bot.sendMessage(myId, `@${msg.chat.username} wrote ${text}`);
    // axios
    //   .get(
    //     API + text
    //   )
    //   .then((res) => console.log(res.data.current));
    axios
      .get(API + text)
      .then((res) => {
        const current = res.data.current;
        const weatherText = current.condition.text;
          const weatherPhoto = `https:${current.condition.icon}`;
          const weatherSpeed = current.wind_kph;
          const location = res.data.location;
          bot.sendPhoto(chatId, weatherPhoto, {
caption: `<b>Location name:</b> ${location.name}
<b>Location country:</b> ${location.country}
<b>Region or state:</b> ${location.region}
<b>Condition:</b> ${weatherText}
<b>Temperature:</b> ${current.temp_c}°C
<b>Wind speed:</b> ${weatherSpeed}kph
<b>Cloud cover:</b> ${current.cloud}%
<b>Humidity:</b> ${current.humidity}%`,
          parse_mode: 'HTML'});
      })
      .catch((err) => {
        bot.sendMessage(chatId, `Shahar topilmadi\nTekshirib qaytadan urining`);
        console.error(err);
      });
  }
});

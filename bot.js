const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });
let motivations = null;

fs.readFile('./resources/motivations.json', 'utf8', (err, data) => {
  if (err) {
    console.log('File read failed:', err);
    return;
  }
  motivations = JSON.parse(data).motivations;
});


const getPhoto = async () => {
  const response = await axios.get(`https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_TOKEN}`, {
    params: {
      query: 'motivational quotes',
      content_filter: 'low',
      topics: 'motivational quotes',
      orientation: 'landscape'
    },
  })
  return response.data.urls.small
}


bot.onText(/\/motiv/, async (msg) => {
  const imageUrl =  await getPhoto()
  
  const chatId = msg.chat.id;

  const motiv = motivations[Math.floor(Math.random() * motivations.length) + 1].phrase;
  const resp = `
💡😊💪
${motiv}
`
  // bot.sendMessage(chatId, response);
  bot.sendPhoto(chatId, imageUrl, { caption: "Motivation 💡😊💪" })
  .catch((error) => console.error('Error:', error));
});

require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const cron = require('node-cron');

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

  // bot.sendMessage(chatId, response);
  bot.sendPhoto(chatId, imageUrl, { caption: "Motivation 💡😊💪" })
  .catch((error) => console.error('Error:', error));
});


cron.schedule('0 15 * * *', async () => {
  const imageUrl =  await getPhoto()  
  const chatId = msg.chat.id;
  // Specify the chat ID where you want to send the message
  bot.sendPhoto(chatId, imageUrl, { caption: "Motivation 💡😊💪" })
  .catch((error) => console.error('Error:', error));
});
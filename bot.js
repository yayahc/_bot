require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const axios = require('axios');
const express = require("express");
const app = express();

// Telegram config
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Get random photo from unsplash
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


// Match /motiv then send motivation
bot.onText(/\/motiv/, async (msg) => {
  const imageUrl = await getPhoto()
  const chatId = msg.chat.id;

  // bot.sendMessage(chatId, response);
  bot.sendPhoto(chatId, imageUrl, { caption: `Motivation 💡😊💪` })
    .catch((error) => console.error('Error:', error));
});

// Send motivation every 1h
cron.schedule('* */1 * * *', async () => {
  const imageUrl = await getPhoto()
  const chatId = '-1001924777323';

  // Specify the chat ID where you want to send the message
  bot.sendPhoto(chatId, imageUrl, { caption: "Motivation 💡😊💪" })
    .catch((error) => console.error('Error:', error));
});


// Express server
app.get('/', (req, res) => {
  res.send("Hello World!");
})
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

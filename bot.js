const fs = require('fs');
require('dotenv').config();


const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
let motivations = null;

fs.readFile('./resources/motivations.json', 'utf8', (err, data) => {
  if (err) {
    console.log('File read failed:', err);
    return;
  }
  motivations = JSON.parse(data).motivations;
});



// Matches "/motiv"
bot.onText(/\/motiv/, (msg) => {

  const chatId = msg.chat.id;

  const motiv = motivations[Math.floor(Math.random() * motivations.length) + 1].phrase;
  const resp = `
💡😊💪
${motiv}
`
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

var TelegramBot = require('node-telegram-bot-api');
var token = '1119562512:AAFi6Tl1umIcYcRty-ifaVN8jww2fmjKUlw';
var bot = new TelegramBot(token, {polling:true});
bot.onText(/\/echo (.+)/,function(msg,match){
    var chatId = msg.chat.id;
    var echo = match[1];
    bot.sendMessage(chatId,echo);
});
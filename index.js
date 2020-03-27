var TelegramBot = require('node-telegram-bot-api');
var token = '1119562512:AAFi6Tl1umIcYcRty-ifaVN8jww2fmjKUlw';
var bot = new TelegramBot(token, {polling:true});
bot.onText(/\/echo (.+)/,function(msg,match){
    var chatId = msg.chat.id;
    var echo = match[1];
    bot.sendMessage(chatId,echo);
});

bot.onText(/\/movie (.+)/,function(msg,match){
    var movie = match[1];
    var chatId = msg.chat.id;
    request('http://www.omdbapi.com/?apikey=59022c1b&t=${movie}',function(error,response,body){
        if(!error && response.statusCode == 200){
            bot.sendMessage(chatId, 'Looking for _' + movie + '...', {parse_mode: 'Markdown'})
            bot.sendMessage(chatId, 'Result:\n ' + body)
        }
    });
});
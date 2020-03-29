const TelegramBot = require('node-telegram-bot-api');
const token = '1119562512:AAFi6Tl1umIcYcRty-ifaVN8jww2fmjKUlw';
const bot = new TelegramBot(token, {polling:true});
const request = require('request')

var opts = {
  reply_markup: JSON.stringify({ force_reply: true }
)};

bot.onText(/\/echo (.+)/,function(msg,match){
  var chatId = msg.chat.id;
  var echo = match[1];
  bot.sendMessage(chatId,echo);
});

bot.onText(/\/search/, function (msg) {
  var fromId = msg.from.id;
  bot.sendMessage(fromId, 'What should I search for?', opts)
      .then(function(sended) {
          var chatId = sended.chat.id;
          var messageId = sended.message_id;
          bot.onReplyToMessage(chatId, messageId, function (message) {
              console.log('OK. I\'ll search for %s', message.text);
          });
      })
});

bot.onText(/\/movie/,function(msg,match){
  
  var mensaje = msg.text.toLocaleLowerCase()
  mensaje = mensaje.replace('\/movie ', '');
  mensaje = mensaje.replace('\/movie', '');

  //Recibo el parámetro /movie asecas
  if(match[0] != undefined && mensaje == ''){
  var fromId = msg.from.id;
  bot.sendMessage(fromId, 'Qué película quieres que busque?', opts)
    .then(function(sended) {
      var chatId = sended.chat.id;
      var messageId = sended.message_id;
      bot.onReplyToMessage(chatId, messageId, function (message) {

          //Busco la pelicula
          var movie = message.text

          var chatId = msg.chat.id;
          var url = 'http://www.omdbapi.com/?apikey=59022c1b&t='+movie
              request.get( {
                  url : url,
                  headers : {
                      "Acceptt-Language" : "es; q=1.0, en; q=0.5"
                  }
              }, function(error, response, body) {
                  var res = JSON.parse(body);
              if(!error && response.statusCode == 200 && res.Response != 'False'){
                  bot.sendMessage(chatId, '_Buscando_ ' + movie + '...', {parse_mode: 'Markdown'})
                  .then(function(msg){
                      var res = JSON.parse(body);
                      var Year = res.Year
                      var uri = '(https://www.imdb.com/title/' + res.imdbID + '/)'
                      uri = '[Ficha IMDB]' + uri
                      //bot.sendPhoto(chatId, res.Poster)
                      bot.sendMessage(chatId, '\n\*Titulo: *' + res.Title + '\n\*Fecha estreno: *' + res.Released + '\n\*Duración: *' + res.Runtime + '\n\*Genero: *' + res.Genre + '\n\*Director: *' + res.Director + '\n\*Actores: *' + res.Actors + '\n\*Argumento: *' + res.Plot + '\n\*Pais: *' + res.Country + '\n\*IMDB: *' + res.imdbRating + '\n\n' + uri,{parse_mode: 'Markdown'})
                      
                      //Trailer de youtube
                      var {google} = require('googleapis');
                      var youtube = google.youtube({
                      version: 'v3',
                      auth: "AIzaSyCcOItWFNvrJipevanmYR2uhBI5H1adnzs"
                      });
        
                      youtube.search.list({
                          part: 'snippet',
                          q: movie + ' ' + Year +' trailer español españa',
                          type: 'video',
                          reqgionCode: '34'
                      }, function (err, data) {
                          if (err) {
                          console.error('Error: ' + err);
                          }
                          if (data) {
                          var videoID = data.data.items[0].id.videoId
                          videoID = '[TRAILER](https://www.youtube.com/watch?v=' + videoID + ')'
                          bot.sendMessage(chatId, videoID, {parse_mode: 'Markdown'})
                          }
                      });
        
                  })
              }else{
                  bot.sendMessage(chatId, "No se encontró la película _"+movie+"_", {parse_mode: 'Markdown'})
              }
          })

      });
    })
  
  }
});

bot.onText(/\/movie (.+)/,function(msg,match){
  var movie = match[1];
  var chatId = msg.chat.id;
  var url = 'http://www.omdbapi.com/?apikey=59022c1b&t='+movie
      request.get( {
          url : url,
          headers : {
              "Acceptt-Language" : "es; q=1.0, en; q=0.5"
          }
      }, function(error, response, body) {
          var res = JSON.parse(body);
      if(!error && response.statusCode == 200 && res.Response != 'False'){
          bot.sendMessage(chatId, '_Buscando_ ' + movie + '...', {parse_mode: 'Markdown'})
          .then(function(msg){
              var res = JSON.parse(body);
              var Year = res.Year
              var uri = '(https://www.imdb.com/title/' + res.imdbID + '/)'
              uri = '[Ficha IMDB]' + uri
              //bot.sendPhoto(chatId, res.Poster)
              bot.sendMessage(chatId, '\n\*Titulo: *' + res.Title + '\n\*Fecha estreno: *' + res.Released + '\n\*Duración: *' + res.Runtime + '\n\*Genero: *' + res.Genre + '\n\*Director: *' + res.Director + '\n\*Actores: *' + res.Actors + '\n\*Argumento: *' + res.Plot + '\n\*Pais: *' + res.Country + '\n\*IMDB: *' + res.imdbRating + '\n\n' + uri,{parse_mode: 'Markdown'})
              
              //Trailer de youtube
              var {google} = require('googleapis');
              var youtube = google.youtube({
              version: 'v3',
              auth: "AIzaSyCcOItWFNvrJipevanmYR2uhBI5H1adnzs"
              });

              youtube.search.list({
                  part: 'snippet',
                  q: movie + ' ' + Year +' trailer español españa',
                  type: 'video',
                  reqgionCode: '34'
              }, function (err, data) {
                  if (err) {
                  console.error('Error: ' + err);
                  }
                  if (data) {
                  var videoID = data.data.items[0].id.videoId
                  videoID = '[TRAILER](https://www.youtube.com/watch?v=' + videoID + ')'
                  bot.sendMessage(chatId, videoID, {parse_mode: 'Markdown'})
                  }
              });

          })
      }else{
          bot.sendMessage(chatId, "No se encontró la película _"+movie+"_", {parse_mode: 'Markdown'})
      }
  });
});

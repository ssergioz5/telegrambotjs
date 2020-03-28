var TelegramBot = require('node-telegram-bot-api');
var token = '1119562512:AAFi6Tl1umIcYcRty-ifaVN8jww2fmjKUlw';
var bot = new TelegramBot(token, {polling:true});
var request = require('request')
bot.onText(/\/movie (.+)/,function(msg,match){
    var movie = match[1];
    var chatId = msg.chat.id;
    request(`http://www.omdbapi.com/?apikey=59022c1b&t=${movie}`,function(error,response,body){
        if(!error && response.statusCode == 200){
            bot.sendMessage(chatId, '_Buscando_ ' + movie + '...', {parse_mode: 'Markdown'})
            .then(function(msg){
                var res = JSON.parse(body);
                //bot.sendMessage(chatId, 'Result:' + body);  
                bot.sendPhoto(chatId, res.Poster,{caption: 'Titulo: ' + res.Title + '\nAno: ' + res.Year + '\nGenero: ' + res.Genre + '\nDirector: ' + res.Director + '\nActores: ' + res.Actors + '\nArgumento: ' + res.Plot + '\nPais: ' + res.Country + '\nIMDB: ' + res.imdbRating})
            })
        }
    });
});
bot.onText(/\/echo (.+)/,function(msg,match){
    var chatId = msg.chat.id;
    var echo = match[1];
    bot.sendMessage(chatId,echo);
});
bot.onText(/\/cancion (.+)/,function(msg,match){
    var cancion = match[1];
    var chatId = msg.chat.id;
    var auth = 'Bearer BQD4IWZhKGtfMmfe8h6rQa3QxcgTkra3w0pfOL_qMT8x3ISvVQ-LehONmtQJ8mkL_GZ7L0e_twPtRj0nI6n-tNAu_TOaKKCCXE9XjNNL-Io-md3NgAZQxsHzsVjPMkvlFfWXSRuHtMlfvJTVYb4lG2HzuJE';
    var request = require('request');
    var url = "https://api.spotify.com/v1/search?q="+cancion+"&type=track&market=ES&limit=1";
    
    request.get( {
        url : url,
        headers : {
            'Content-Type': 'application/json',
            "Authorization" : auth
        }
      }, function(error, response, body) {
          var res = JSON.parse(body);
          var artista = res.tracks.items[0].artists[0].name
          var album = res.tracks.items[0].album.name
          var album_numero = res.tracks.items[0].disc_number
          var cancion = res.tracks.items[0].name
          var cancion_numero = res.tracks.items[0].track_number
          var uri = res.tracks.items[0].uri
          var imagen = res.tracks.items[0].album.images[0].url
          bot.sendPhoto(chatId, imagen,{caption: "\nArtista: " + artista + "\nAlbum: " + album + "\nAlbum numero: " + album_numero + "\nCancion: " + cancion + "\nCancion numero: " + cancion_numero + "\nURL Spotify: " + uri})
          //console.log('body : \nArtista:', artista + "\nAlbum: " + album + "\nAlbum numero: " + album_numero + "\nCancion: " + cancion + "\nCancion numero: " + cancion_numero + "\nURL Spotify: " + uri + "\nImagen: " + imagen);
      } );
});
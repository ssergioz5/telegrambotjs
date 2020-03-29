var TelegramBot = require('node-telegram-bot-api');
var token = '1119562512:AAFi6Tl1umIcYcRty-ifaVN8jww2fmjKUlw';
var bot = new TelegramBot(token, {polling:true});
var request = require('request')
bot.onText(/\/movie (.+)/,function(msg,match){
    var movie = match[1];
    var chatId = msg.chat.id;
    //request(`http://www.omdbapi.com/?apikey=59022c1b&t=${movie}`,function(error,response,body){
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
                var uri = '(https://www.imdb.com/title/' + res.imdbID + '/)'
                uri = '[Ver en IMDB]' + uri
                //bot.sendPhoto(chatId, res.Poster)
                bot.sendMessage(chatId, '\n\*Titulo: *' + res.Title + '\n\*Fecha estreno: *' + res.Released + '\n\*Duración: *' + res.Runtime + '\n\*Genero: *' + res.Genre + '\n\*Director: *' + res.Director + '\n\*Actores: *' + res.Actors + '\n\*Argumento: *' + res.Plot + '\n\*Pais: *' + res.Country + '\n\*IMDB: *' + res.imdbRating + '\n\n' + uri,{parse_mode: 'Markdown'})
                
            })
        }else{
            bot.sendMessage(chatId, "No se encontró la película _"+movie+"_", {parse_mode: 'Markdown'})
        }
    });
});
bot.onText(/\/echo (.+)/,function(msg,match){
    var chatId = msg.chat.id;
    var echo = match[1];
    bot.sendMessage(chatId,echo);
});
bot.onText(/\/music (.+)/,function(msg,match){

    //Pillo el token de spotify//
    var request = require('request');

        request(`http://localhost:3000/spotify/d500f38bff664b8fb519c6c631fe19c7/87d74298d0864eeda8fbea3dc98abc49`,function(error,response,body){
            if(!error && response.statusCode == 200){
                var res = JSON.parse(body);
                var token = 'Bearer ' + res.access_token;

                //Ya tengo el token, sigo
                
                var cancion = match[1];
                var chatId = msg.chat.id;
                var auth = token;
                var request = require('request');
                var url = "https://api.spotify.com/v1/search?q="+cancion+"&type=track&market=ES&limit=1";
                
                request.get( {
                    url : url,
                    headers : {
                        'Content-Type': 'application/json',
                        "Authorization" : auth
                    }
                }, function(error, response, body) {
                    if(!error && response.statusCode == 200){
                    var res = JSON.parse(body);
                    if(res.tracks.items[0] != undefined){
                        var artista = res.tracks.items[0].artists[0].name
                        var album = res.tracks.items[0].album.name
                        var album_numero = res.tracks.items[0].disc_number
                        var album_id = res.tracks.items[0].album.id
                        var cancion = res.tracks.items[0].name
                        var cancion_numero = res.tracks.items[0].track_number
                        var uri = res.tracks.items[0].uri
                        uri = uri.replace(':track:', '');
                        uri = uri.replace('spotify', '');
                        uri = '['+cancion+'](https://open.spotify.com/track/'+uri+')'
                        var imagen = res.tracks.items[0].album.images[0].url

                        bot.sendMessage(chatId, '_Buscando_ ' + cancion + '...', {parse_mode: 'Markdown'})
                        .then(function(msg){
                        bot.sendMessage(chatId, uri + "\n\n\*Artista*: " + artista + '\n\*Album: *' + album + "\n\*Album numero: *" + album_numero + "\n\*Cancion: *" + cancion + "\n\*Cancion numero: *" + cancion_numero, {parse_mode: 'Markdown'})
                        })
                    }else{
                        bot.sendMessage(chatId, "Sin resultados para '"+match[1]+"'.");
                    }
                    }
                    } );

            }
        });

});
var TelegramBot = require('node-telegram-bot-api');
var token = '1119562512:AAFi6Tl1umIcYcRty-ifaVN8jww2fmjKUlw';
var bot = new TelegramBot(token, {polling:true});
var request = require('request')

var opts = {
    reply_markup: JSON.stringify({ force_reply: true }
  )};

bot.onText(/\/echo (.+)/,function(msg,match){
    var chatId = msg.chat.id;
    var echo = match[1];
    bot.sendMessage(chatId,echo);
});

bot.onText(/\/start/,function(msg,match){
    var chatId = msg.chat.id;
    var echo = match[1];
    bot.sendMessage(chatId, "Esto es un BOT de Prueba de Sergio. \n\nOpciones: \n\n - \/movie \n - \/music, \n - \/recipe",{
    "reply_markup":{
        "keyboard": [[ 
            {
                text: 'Buscar una pelicula/serie',
                callback_data: "\/movie thor"
            },{ 
                text: 'Buscar una canción',
                callback_data: "\/music" 
            },{
                text: 'Buscar una receta',
                callback_data: "\/recipe" 
            }
        ]],
        resize_keyboard: true,
        one_time_keyboard: true,
       }
    })
});
//" keyboard " : [[ " Sample text " , " Second sample " ], [ " Keyboard " ], [ " I'm robot " ]]

///////COMANDOS ASECAS
//PELICULAS ASECAS
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

  //MUSICA ASECAS
  bot.onText(/\/music/,function(msg,match){
  
    var mensaje = msg.text.toLocaleLowerCase()
    mensaje = mensaje.replace('\/music ', '');
    mensaje = mensaje.replace('\/music', '');
  
    //Recibo el parámetro /movie asecas
    if(match[0] != undefined && mensaje == ''){
    var fromId = msg.from.id;
    bot.sendMessage(fromId, 'Qué canción quieres que busque?', opts)
      .then(function(sended) {
        var chatId = sended.chat.id;
        var messageId = sended.message_id;
        bot.onReplyToMessage(chatId, messageId, function (message) {
  
            //Busco la canción
            var cancion = message.text
            
            //Pillo el token de spotify//
            var request = require('request');

            request(`http://localhost:3000/spotify/d500f38bff664b8fb519c6c631fe19c7/87d74298d0864eeda8fbea3dc98abc49`,function(error,response,body){
                if(!error && response.statusCode == 200){
                    var res = JSON.parse(body);
                    var token = 'Bearer ' + res.access_token;

                    //Ya tengo el token, sigo
                    
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
    })
  
  }
});

  //RECETAS ASECAS
  bot.onText(/\/recipe/,function(msg,match){
  
    var mensaje = msg.text.toLocaleLowerCase()
    mensaje = mensaje.replace('\/recipe ', '');
    mensaje = mensaje.replace('\/recipe', '');
  
    //Recibo el parámetro /movie asecas
    if(match[0] != undefined && mensaje == ''){
    var fromId = msg.from.id;
    bot.sendMessage(fromId, 'Qué receta quieres que busque?', opts)
      .then(function(sended) {
        var chatId = sended.chat.id;
        var messageId = sended.message_id;
        bot.onReplyToMessage(chatId, messageId, function (message) {
  
            //Busco las recetas
            var texto = message.text

            var request = require('request');
            var chatId1 = msg.chat.id;
            var chatId2 = msg.chat.id;
            var chatId3 = msg.chat.id;
            
            request(`https://api.edamam.com/search?app_id=c15511b1&app_key=404a5f0346c51e437e3e04a6fc4fd3ff&q=${texto}`,function(error,response,body){
                if(!error && response.statusCode == 200){
                    var res = JSON.parse(body);
                    var uri1 = res.hits[0].recipe.url
                    uri1 = '[RECETA 1]('+ uri1 + ')'
                    var uri2 = res.hits[1].recipe.url
                    uri2 = '[RECETA 2]('+ uri2 + ')'
                    var uri3 = res.hits[2].recipe.url
                    uri3 = '[RECETA 3]('+ uri3 + ')'
                    bot.sendMessage(chatId1, uri1, {parse_mode: 'Markdown'})
                    bot.sendMessage(chatId2, uri2, {parse_mode: 'Markdown'})
                    bot.sendMessage(chatId3, uri3, {parse_mode: 'Markdown'})
                }else{
                    bot.sendMessage(chatId1, "No se encontró receta para _" + texto + '_', {parse_mode: 'Markdown'})
                }
            })


        });
    })
  
  }
});

///////COMANDOS CON PARAMETRO
//PELICULAS
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

//MUSICA
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

//RECETAS
bot.onText(/\/recipe (.+)/,function(msg,match){
    var request = require('request');
    var chatId1 = msg.chat.id;
    var chatId2 = msg.chat.id;
    var chatId3 = msg.chat.id;
    var texto = match[1];
    
    request(`https://api.edamam.com/search?app_id=c15511b1&app_key=404a5f0346c51e437e3e04a6fc4fd3ff&q=${texto}`,function(error,response,body){
        if(!error && response.statusCode == 200){
            var res = JSON.parse(body);
            var uri1 = res.hits[0].recipe.url
            uri1 = '[RECETA 1]('+ uri1 + ')'
            var uri2 = res.hits[1].recipe.url
            uri2 = '[RECETA 2]('+ uri2 + ')'
            var uri3 = res.hits[2].recipe.url
            uri3 = '[RECETA 3]('+ uri3 + ')'
            bot.sendMessage(chatId1, uri1, {parse_mode: 'Markdown'})
            bot.sendMessage(chatId2, uri2, {parse_mode: 'Markdown'})
            bot.sendMessage(chatId3, uri3, {parse_mode: 'Markdown'})
        }else{
            bot.sendMessage(chatId1, "No se encontró receta para _" + texto + '_', {parse_mode: 'Markdown'})
        }
      })
});

/*var username = 'Test';
var password = '123';
var auth = 'Bearer BQA96EZhJbz6I1VXoWgXn5rkf5Wx1CXO68alq7XEsVw9vmnhJWtQKy1u56WKdzAmjjdHIDwjHrnSo0fiz0hrzf1BnkF0zZ-i0K7UBwM1yEox6rlUWrqstdkdpl-NbaTw2v3LDKQwlhijkHILvaTcLMKgXQ4';

var header = {'Host': 'https://api.spotify.com/v1/search?q=la%20calle%20es%20tuya&type=track&market=ES', 'Authorization': auth};
var request = client.request('GET', '/', header);
console.log(request)
*/
var auth = 'Bearer BQA96EZhJbz6I1VXoWgXn5rkf5Wx1CXO68alq7XEsVw9vmnhJWtQKy1u56WKdzAmjjdHIDwjHrnSo0fiz0hrzf1BnkF0zZ-i0K7UBwM1yEox6rlUWrqstdkdpl-NbaTw2v3LDKQwlhijkHILvaTcLMKgXQ4';

var request = require('request');
var url = "https://api.spotify.com/v1/search?q=suma%20y%20sigue&type=track&market=ES&limit=1";

request.get( {
    url : url,
    headers : {
        'Content-Type': 'application/json',
        "Authorization" : auth
    }
  }, function(error, response, body) {
      var res = JSON.parse(body);
      //console.log(res.tracks.items[0].album.external_urls.spotify);
      var artista = res.tracks.items[0].artists[0].name
      var album = res.tracks.items[0].album.name
      var album_numero = res.tracks.items[0].disc_number
      var cancion = res.tracks.items[0].name
      var cancion_numero = res.tracks.items[0].track_number
      var uri = res.tracks.items[0].uri
      var imagen = res.tracks.items[0].album.images[0].url
      console.log('body : \nArtista:', artista + "\nAlbum: " + album + "\nAlbum numero: " + album_numero + "\nCancion: " + cancion + "\nCancion numero: " + cancion_numero + "\nURL Spotify: " + uri + "\nImagen: " + imagen);
  } );

var {google} = require('googleapis');
var youtube = google.youtube({
   version: 'v3',
   auth: "AIzaSyCcOItWFNvrJipevanmYR2uhBI5H1adnzs"
});


youtube.search.list({
    part: 'snippet',
    q: 'deadpool trailer español españa',
    type: 'video',
    reqgionCode: '34'
  }, function (err, data) {
    if (err) {
      console.error('Error: ' + err);
    }
    if (data) {
      var videoID = data.data.items[0].id.videoId
      console.log(data.data.items[0].snippet.thumbnails.high.url)
    }
  });
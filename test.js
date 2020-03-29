var request = require('request');

var texto = 'chicken enchilada'

request(`https://api.edamam.com/search?app_id=c15511b1&app_key=404a5f0346c51e437e3e04a6fc4fd3ff&q=${texto}`,function(error,response,body){
    if(!error && response.statusCode == 200){
        var res = JSON.parse(body);
        console.log(res)
        console.log(res.hits[0])
        console.log(res.hits[0].recipe.url)
        console.log(res.hits[1].recipe.url)
        console.log(res.hits[2].recipe.url)
    }
  })

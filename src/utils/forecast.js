const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=06056d9ce930069b12528fb2c83ecd97&query=' + latitude + ', ' + longitude;
    request({url, json: true}, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined);
        } else if (body.error){
            callback('Unable to find location', undefined);
        } else {
            // callback(undefined, {
            //     name: body.location.name,
            //     forecast: body.current.weather_descriptions[0],
            //     temperature: body.current.temperature,
            //     feelsLike: body.current.feelslike
            // })
            callback(undefined, body.current.weather_descriptions[0] + '. It is currently ' + body.current.temperature + ' degress out. It feels like ' + body.current.feelslike + '.')
        }
    });
}

// request ({url: url, json: true}, (error, response)=> {
    
//     //console.log(response);
//     //console.log(response.body);
//     //const data = JSON.parse(response.body);  // Only after parsing, you can access current, 
//     //console.log(data);                        // as the response.body will have become like an object.
//     //console.log(data.current)                  // Otherwise, it was just a string.
//     //console.log(response.body.current);       //setting json:true in request option, parses automatically.
// })

module.exports = {
    forecast: forecast
}
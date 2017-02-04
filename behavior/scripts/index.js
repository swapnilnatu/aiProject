'use strict'

const getCurrentWeather = require('./lib/getCurrentWeather')

exports.handle = function handle(client) {
  

 
  const collectCity = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().weatherCity)
    },

    extractInfo() {
     const city = client.getFirstEntityWithRole(client.getMessagePart(), 'city')
      if (city) {
        client.updateConversationState({
          weatherCity: city,
        })
        console.log('User wants the weather in:', city.value)
      }
    },

    prompt() {
      client.addResponse('prompt/weather_city')
      client.done()
    },
  })

  const provideWeather = client.createStep({
    satisfied() {
      return false
    },

    prompt(callback) {
      //getCurrentWeather(client.getConversationState().weatherCity.value, resultBody => {
        // if (!resultBody || resultBody.cod !== 200) {
        //   console.log('Error getting weather.')
        //   callback()
        //   return
        // }

        // const weatherDescription = (
        //   resultBody.weather.length > 0 ?
        //   resultBody.weather[0].description :
        //   null
        // )
        const city = client.getConversationState().weatherCity.value;

        client.updateConversationState({
          weatherCity: undefined,
        });

        const weatherData = {
          temperature: '86',
          condition: 'rainy',
          city: city,
        };

        console.log('sending real weather:', weatherData)
        client.addResponse('provide_weather/current', weatherData)
        client.done()
        
       
      //})
    },
  })

  client.runFlow({
    classifications: {},
    streams: {
      main: 'getWeather',
      getWeather: [collectCity, provideWeather],
    }
  })
}
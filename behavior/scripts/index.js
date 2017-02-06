'use strict'

const getCurrentWeather = require('./lib/getCurrentWeather')

exports.handle = function handle(client) {
  

 
 

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


const collectUserName = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().userFname)
    },

    extractInfo() {
     const fname = client.getFirstEntityWithRole(client.getMessagePart(), 'fname')
     const lname = client.getFirstEntityWithRole(client.getMessagePart(), 'lname')
      if (fname) {
        client.updateConversationState({
          userFname: fname,
          userLname:lname
        })
      }
    },

    prompt() {
      client.addResponse('ask_user_detail/name')
      client.done()
    },
  })


const collectHeight = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().userHeight)
    },

    extractInfo() {
     const userHeight = client.getFirstEntityWithRole(client.getMessagePart(), 'height')
    
      if (userHeight) {
        client.updateConversationState({
          userHeight: height
        })
      }
    },

    prompt() {
      client.addResponse('ask_vitals/height')
      client.done()
    },
  })






const isPromtWelocome = client.createStep({
    satisfied() {
       return Boolean(client.getConversationState().isWelecomePromt)
    },

    extractInfo() {
     
    },

    prompt() {
      client.done()
    },
  })





  const handleWelocomeEvent = function (eventType, payload) {
    client.updateConversationState({
          isWelecomePromt: true,
        });
     client.addResponse('prompt/welcome_siya');
     client.addResponse('ask_user_detail/name');
    client.done();

  };

  client.runFlow({
    classifications: {
     'prompt/welcome_siya':'getVital'
    },
     eventHandlers: {
      // '*' Acts as a catch-all and will map all events not included in this
      // object to the assigned function
      'welcome:siya': handleWelocomeEvent
    },
    streams: {
      main:'getVital',
      getVital:[isPromtWelocome,collectUserName,collectHeight],
      // getWeather: [collectCity, provideWeather],
    }
  })
}
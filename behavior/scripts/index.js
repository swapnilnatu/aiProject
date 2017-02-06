'use strict'

exports.handle = function handle(client) {


    const handleWelocomeEvent = function(eventType, payload) {
        client.updateConversationState({
            isWelecomePromt: true
        });
        client.addResponse('prompt/welcome_siya');
        client.addResponse('ask_user_detail/name');
        client.done();

    };



    const collectHeight = client.createStep({
        satisfied() {

            return Boolean(client.getConversationState().userHeight)
        },

        extractInfo() {
            const userHeight = client.getFirstEntityWithRole(client.getMessagePart(), 'height')
            if (userHeight) {
                client.updateConversationState({
                    'userHeight': userHeight
                })
            }
        },

        prompt() {
            client.addResponse('ask_vitals/height')
            client.done()
        },
    });

    // const collectHeight = client.createStep({
    //     satisfied() {
    //         return Boolean(client.getConversationState().userHeight);
    //     },

    //     extractInfo() {
    //         const userHeight = client.getFirstEntityWithRole(client.getMessagePart(), 'height');
    //         console.log('swapnil userHeight:' + userHeight);
    //         if (userHeight) {
    //             client.updateConversationState({
    //                 userHeight: userHeight
    //             })
    //         }
    //     },

    //     prompt() {
    //         client.addResponse('ask_vitals/height')
    //         client.done()
    //     },
    // });




    const isPromtWelocome = client.createStep({
        satisfied() {
            return Boolean(client.getConversationState().isWelecomePromt)
        },

        extractInfo() {

        },

        prompt() {
            client.done()
        },
    });


    const promptNeedSomeInformation = client.createStep({
        satisfied() {
            return Boolean(client.getConversationState().isPromtNeedSomeInfo)
        },

        extractInfo() {



        },

        prompt() {

            client.addResponse('prompt/need_some_information')

            client.done()
        },
    });

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
                    userLname: lname
                })
            }
        },

        prompt() {
            client.addResponse('ask_user_detail/name')
            client.done()
        },
    });






    const collectWeight = client.createStep({
        satisfied() {
            return Boolean(client.getConversationState().userWeight);
        },

        extractInfo() {
            const userWeight = client.getFirstEntityWithRole(client.getMessagePart(), 'weight')

            if (userWeight) {
                client.updateConversationState({
                    userWeight: userWeight
                })
            }
        },

        prompt() {
            client.addResponse('ask_vitals/weight')
            client.done()
        },
    });

    client.runFlow({
        classifications: {
            'prompt/welcome_siya': 'promptMessage',
            'ask_vitals/weight': 'getWeight'

        },
        eventHandlers: {
            // '*' Acts as a catch-all and will map all events not included in this
            // object to the assigned function
            'welcome:siya': handleWelocomeEvent
        },
        streams: {
            main: 'promptMessage',
            promptMessage: [isPromtWelocome, collectUserName, promptNeedSomeInformation, 'getHeight'],
            getHeight: [collectHeight, 'getWeight'],
            getWeight: [collectWeight]
                // getWeather: [collectCity, provideWeather],
        }
    })
}

'use strict'

exports.handle = function handle(client) {
    const handleWelocomeEvent = function(eventType, payload) {
        client.resetConversationState();
        client.updateConversationState({
            isWelecomePromt: true
        });
        client.addResponse('prompt/welcome_siya');
        client.addResponse('ask_user_detail/name');
        client.expect('getHeight',['provide_name/patient_name']);
        client.done();

    };

    const collectHeight = client.createStep({
        satisfied() {
            return Boolean(client.getConversationState().userHeight);
        },

        extractInfo() {
            const userHeight = client.getFirstEntityWithRole(client.getMessagePart(), 'number/height');
            console.log('swapnil userHeight:' + userHeight);
            if (userHeight) {
                client.updateConversationState({
                    userHeight: userHeight
                })
            }
        },

        prompt() {  
            client.addResponse('prompt/need_some_information',{fname:client.getConversationState().userFname.value});
            client.addResponse('ask_vitals/height');
            client.expect('getWeight',['provide_vital/height']);
            client.done();
        },
    });

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

    const collectUserName = client.createStep({
        satisfied() {
            console.log(client.getConversationState().userFname);
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
            const userWeight = client.getFirstEntityWithRole(client.getMessagePart(), 'number/weight')

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
        eventHandlers: {
            // '*' Acts as a catch-all and will map all events not included in this
            // object to the assigned function
            'welcome:siya': handleWelocomeEvent,
            'getHeight':'getHeight',
            'getWeight':'getWeight'

        },
        streams: {
            main: 'promptMessage',
            promptMessage: [isPromtWelocome,'getUserName'],
            getUserName: [collectUserName],
            getHeight: [collectHeight],
            getWeight: [collectWeight]
                // getWeather: [collectCity, provideWeather],
        }
    })
}

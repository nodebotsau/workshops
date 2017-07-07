'use strict';

var Botkit = require('Botkit');
var creds = require('./creds');
var mqtt = require('mqtt');

var client  = mqtt.connect('mqtt://test.mosquitto.org');
var led_state;

var topic = "mynodetest_af/ic/light";

client.on('connect', function () {
    client.subscribe(topic);
});


client.on('message', function (topic, message) {

    // message is Buffer
    let state = message.toString();

    if (state == "on") {
        led_state = true;
    } else if (state == "off") {
        led_state = false;
    }
})

var botcontroller = Botkit.slackbot({
    debug: false,
});

botcontroller.spawn({
    token: creds.slack.token
}).startRTM(function(err, bot, payload) {
    if (err) {
        throw new Error(err);
    }
});

botcontroller.hears(['hello', 'hi', 'howdy', 'hola'],
    ['direct_message','direct_mention','mention'],
    function(bot,message) {

        let user = `<@${message.user}>`;

        let replies = [
            `Hello ${user}`,
            `Hi ${user}, what can I do for you?`,
            `What's up ${user}?`,
        ];

        let response = replies[Math.floor(Math.random() * replies.length)];

        bot.reply(message, response);
    }
);

botcontroller.hears(['light(.?) on',],
    ['direct_message', 'direct_mention', 'mention'],
    function(bot, message) {

		client.publish(topic, "on");
        let user = `<@${message.user}>`;
        let replies = [
            `Sure thing.`,
            `No worries ${user}`,
            `There you go ${user}`,
            `If that's what you'd like me t do`,
            `I am here just to switch your lights on and off, ${user}`,
            `If I'm passing, ${user}, I'll give them a flick.`,
        ];

        let response = replies[Math.floor(Math.random() * replies.length)];

        bot.reply(message, response);
    }
);

botcontroller.hears(['light(.?) off',],
    ['direct_message', 'direct_mention', 'mention'],
    function(bot, message) {

		client.publish(topic, "off");
        let user = `<@${message.user}>`;
        let replies = [
            `Sure thing.`,
            `No worries ${user}`,
            `There you go ${user}`,
            `If that's what you'd like me to do`,
            `I am here just to switch your lights on and off, ${user}`,
            `If I'm passing, ${user}, I'll give them a flick.`,
        ];

        let response = replies[Math.floor(Math.random() * replies.length)];

        bot.reply(message, response);
    }
);

botcontroller.hears(['light(.?)$'],
    ['direct_message', 'direct_mention', 'mention'],
    function(bot, message) {
        bot.startConversation(message, function(err, convo) {

            // first we look at what state the LED is in.
            let state = "off";
            let question_state = "on";

            if (led_state) {
                state = "on";
                question_state = "off";
            }

            // now ask what to do
            convo.ask(`The light is currently *${state}*. Do you want me to turn it ${question_state}?`, [
                    {
                        pattern: bot.utterances.yes,
                        callback: function(response, convo) {
                            if (led_state) {
		                        client.publish(topic, "off");
                            } else {
                                client.publish(topic, "on");
                            }

                            let user = `<@${message.user}>`;
                            let replies = [
                                `Okay, the light is now ${question_state}.`,
                                `No worries ${user}`,
                                `There you go ${user}, the light is now ${question_state}`,
                            ];

                            response = replies[Math.floor(Math.random() * replies.length)];

                            convo.say(response);
                            convo.next();
                        }
                    },
                    {
                        pattern: bot.utterances.no,
                        default: true,
                                 callback: function(response, convo) {
                                     convo.say('Cool. I\'ll leave it as it is');
                                     convo.next();
                                 }
                    }
            ]);
        });
    }
);


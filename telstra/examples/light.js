var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')

client.on('connect', function () {
    client.subscribe('mynodetest_af/#');

    if (process.argv[2] == "on") {
        client.publish("mynodetest_af/ic/light", "on");
    } else if (process.argv[2] == "off") {
        client.publish("mynodetest_af/ic/light", "off");
    }
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic, message.toString());
  client.end();
})

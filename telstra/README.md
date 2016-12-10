# Notes for the Telstra workshop.

Before coming to the workshop please make sure you have cloned this repo and
installing these dependencies

```
cd workshops/telstra
npm install
```

This will install:

* Interchange - useful for flashing your Arduino
* Johnny Five - JS framework for interacting with hardare (RPi & Arduino)
* Node Red - a rapid prototyping environment for event / flow orchestration of IoT devices from a browser
* Node Red plugins - Various plugins to node red that make your life easier and faster.
    * [Dashboard](https://github.com/node-red/node-red-dashboard) - provides a full UI suite
    * GPIO - allows interaction with GPIO components.
* Mosca - A NodeJS based MQTT broker that provides a message queue
* mqtt.js - NodeJS command line publication and subscribe clients as well as library
to interact with MQTT brokers from node or web applications.

## Install Firmata on your Arduino

From the repo folder execute the following with your arduino plugged into
your computer.

```
./node_modules/.bin/interchange install StandardFirmata -a uno
```

Assuming no errors, you're good to go, if you get errors, come talk to us.

## Run a Johnny Five blink example

To make sure you can talk to the arduino okay leave it plugged in and then
run the blink example.

```
node examples/blink.js
```

If the LED on pin 13 blinks on and off each second then you should be all good.

## Run Node Red

To run node red, run it with the following command:

```
./node-modules/.bin/node-red
```

This will then run an application server which you can access via http://localhost:1880
unless you change the port.

This [blog post](http://developers.sensetecnic.com/article/introduction-to-node-red/) is
a great introduction to Node Red.

## Run an MQTT broker

To run Mosca:

```
./node_modules/.bin/mosca -v --http-port 8883
```

This will give you both an MQTT server on port 1883 locally (which you can
point node red or some JS code at). In addition it will expose a websockets
host on port 8883 if you want to use that from a browser.

## Pub Sub from the command line

We can use the MQTT node library to publish and subscribe to topics from the
command line.

### To subscribe to a topic:

```
./node_modules/.bin/mqtt_sub -v -h test.mosquitto.org -t "sometopic/#"
```

Noting you can change the host parameter to your local mosca server for example.

### To publish to a topic

```
./node_modules/.bin/mqtt_pub -h test.mosquitto.org -t "sometopic/presence" -m "Hi there subscribers"
```

Noting again that you can change the host parameter to your local mosca server
for example.



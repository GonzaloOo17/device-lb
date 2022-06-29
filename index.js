var mqtt = require('mqtt');
var cfg = require('./config/myConfig');
var connectUrl = "mqtt://".concat(cfg.mqtt.host, ":").concat(cfg.mqtt.port);
var clientId = cfg.mqtt.clientId;
var client = mqtt.connect(connectUrl, {
    clientId: clientId,
    clean: true,
    connectTimeout: 4000,
    username: cfg.mqtt.user,
    password: cfg.mqtt.password,
    reconnectPeriod: 1000
});
var topicAWeight = '/is1234/stat/actualweight';
var topic_get_average = '/is1234/get/averageweight';
var topic_send_average = '/is1234/stat/averageweight';
var topic_start_measure = '/is1234/start/measure';
var topic_stop_measure = '/is1234/stop/measure';
var topic_turnoff = '/is1234/turnoff';
var topic_turnon = '/is1234/turnon';
client.on('connect', function () {
    console.log('Connected!!');
    client.subscribe([topicAWeight], function () { return console.log("Subscribe to topic '".concat(topicAWeight, "'")); });
    client.subscribe([topic_send_average], function () { return console.log("Subscribe to topic '".concat(topic_send_average, "'")); });
    getUserInput(client);
});
client.on('message', function (topic, payload) {
    handleTopic(topic, payload);
});
var handleTopic = function (topic, payload) {
    var t = topic.substring(1);
    t = t.substring(t.indexOf('/'));
    switch (t) {
        case '/stat/actualweight': {
            console.log('Actual weight is:', payload.toString());
            break;
        }
        case '/stat/averageweight': {
            console.log('Average weight is:', payload.toString());
            break;
        }
    }
};
var getUserInput = function (client) {
    var prompt = require('prompt');
    prompt.start();
    prompt.get(['action'], function (err, result) {
        if (err) {
            return onErr(err);
        }
        console.log('Command-line input received:');
        console.log('  Action: ' + result.action);
        if (result.action === '2') {
            client.publish(topic_get_average, '', { qos: 0, retain: false }, function (error) { return error ? console.error(error) : null; });
        }
        if (result.action === '0') {
            client.publish(topic_start_measure, '', { qos: 0, retain: false }, function (error) { return error ? console.error(error) : null; });
        }
        if (result.action === '1') {
            client.publish(topic_stop_measure, '', { qos: 0, retain: false }, function (error) { return error ? console.error(error) : null; });
        }
        if (result.action === '3') {
            client.publish(topic_turnon, '', { qos: 0, retain: false }, function (error) { return error ? console.error(error) : null; });
        }
        if (result.action === '4') {
            client.publish(topic_turnoff, '', { qos: 0, retain: false }, function (error) { return error ? console.error(error) : null; });
        }
        getUserInput(client);
    });
    function onErr(err) {
        console.log(err);
        return 1;
    }
};

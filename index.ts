const mqtt = require('mqtt');
const cfg = require('./config/myConfig');

const connectUrl: string = `mqtt://${cfg.mqtt.host}:${cfg.mqtt.port}`

const clientId: string = cfg.mqtt.clientId;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: cfg.mqtt.user,
  password: cfg.mqtt.password,
  reconnectPeriod: 1000,
});


const topicAWeight: string = '/is1234/stat/actualweight';
const topic_get_average: string = '/is1234/get/averageweight';
const topic_send_average: string = '/is1234/stat/averageweight';
const topic_start_measure: string = '/is1234/start/measure';
const topic_stop_measure: string = '/is1234/stop/measure';
const topic_turnoff: string = '/is1234/turnoff';
const topic_turnon: string = '/is1234/turnon';

client.on('connect', () => {
  console.log('Connected!!');

  client.subscribe([topicAWeight], () => console.log(`Subscribe to topic '${topicAWeight}'`))
  client.subscribe([topic_send_average], () => console.log(`Subscribe to topic '${topic_send_average}'`))

  getUserInput(client);
})

client.on('message', (topic, payload) => {
  handleTopic(topic, payload);
});

const handleTopic = (topic, payload) => {

  let t = topic.substring(1);
  t = t.substring(t.indexOf('/'));

  switch (t){
    case '/stat/actualweight': {
      console.log('Actual weight is:', payload.toString())
      break;
    }
    case '/stat/averageweight': {
      console.log('Average weight is:', payload.toString());
      break;
    }
  }

}

const getUserInput = (client) =>  {
  const prompt = require('prompt');

  prompt.start();

  prompt.get(['action'], function (err, result) {
    if (err) {
      return onErr(err);
    }
    console.log('Command-line input received:');
    console.log('  Action: ' + result.action);

    if(result.action === '2'){
      client.publish(topic_get_average, '', { qos: 0, retain: false }, (error) => error ? console.error(error) : null)
    }
    if(result.action === '0'){
      client.publish(topic_start_measure, '', { qos: 0, retain: false }, (error) => error ? console.error(error) : null)
    }
    if(result.action === '1'){
      client.publish(topic_stop_measure, '', { qos: 0, retain: false }, (error) => error ? console.error(error) : null)
    }
    if(result.action === '3'){
      client.publish(topic_turnon, '', { qos: 0, retain: false }, (error) => error ? console.error(error) : null)
    }
    if(result.action === '4'){
      client.publish(topic_turnoff, '', { qos: 0, retain: false }, (error) => error ? console.error(error) : null)
    }
    getUserInput(client);
  });

  function onErr(err) {
    console.log(err);
    return 1;
  }
}
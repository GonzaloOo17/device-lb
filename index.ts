const mqtt = require('mqtt');
const cfg = require('./config/myConfig');

const connectUrl = `mqtt://${cfg.mqtt.host}:${cfg.mqtt.port}`

const clientId = cfg.mqtt.clientId;

console.log(connectUrl)
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: cfg.mqtt.user,
  password: cfg.mqtt.password,
  reconnectPeriod: 1000,
});


const topicAWeight = '/is1234/stat/actualweight';
const topic_get_average = '/is1234/get/averageweight';

client.on('connect', () => {
  console.log('Connected');

  client.subscribe([topicAWeight], () => {
    console.log(`Subscribe to topic '${topicAWeight}'`)
  })

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

    if(result.action === '1'){
      client.publish(topic_get_average, { qos: 0, retain: false }, (error) => {
          if (error) {
            console.error(error)
          }
        })
    }
    getUserInput(client);
  });

  function onErr(err) {
    console.log(err);
    return 1;
  }
}
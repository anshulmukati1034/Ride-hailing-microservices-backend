const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBIT_URL;

let connection, channel;

async function connect() {
  if (channel) return;

  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  console.log("✅ Connected to RabbitMQ");
}

async function subscribeToQueue(queueName, callback) {
  await connect();
  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, async (message) => {
    if (!message) return;

    await callback(message.content.toString());
    channel.ack(message);
  });
}

async function publishToQueue(queueName, data) {
  await connect();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(data), {
    persistent: true
  });
}

module.exports = {
  subscribeToQueue,
  publishToQueue,
  connect
};

import { connect, StringCodec, AckPolicy } from "nats";

const startPublisher = async () => {
  const stan = await connect({ servers: "nats://localhost:4222" });

  // Create JetStream Manager
  const jsm = await stan.jetstreamManager();

  if (jsm) {
    console.log("Publisher connected to NATS");
  }

  // Publish a message
  const sc = StringCodec();

  const data = JSON.stringify({ id: "123", title: "concert", price: 20 });

  await stan.publish("ticket:created", sc.encode(data));

  console.log("Message published");

  // close the connection
  await stan.drain();
};

startPublisher();

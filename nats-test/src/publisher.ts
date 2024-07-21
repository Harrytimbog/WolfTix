import { connect, StringCodec } from "nats";

console.clear();

const startPublisher = async () => {
  const nc = await connect({ servers: "nats://localhost:4222" });

  console.log("Publisher connected to NATS");

  // Create JetStream Manager
  const jsm = await nc.jetstreamManager();

  // Add a stream if it doesn't exist
  await jsm.streams.add({ name: "tickets", subjects: ["ticket.created"] });

  // Create a JetStream client
  const js = nc.jetstream();
  const sc = StringCodec();

  const data = JSON.stringify({ id: "123", title: "concert", price: 20 });

  // Publish a message to the stream
  await js.publish("ticket.created", sc.encode(data));

  console.log("Message published");

  // Close the connection
  await nc.drain();
};

startPublisher().catch((err) => {
  console.error(`Error starting publisher: ${err.message}`);
});

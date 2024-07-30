import { connect, StringCodec } from "nats";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const startPublisher = async () => {
  const nc = await connect({ servers: "nats://localhost:4222" });

  console.log("Publisher connected to NATS");

  // Create JetStream Manager
  const jsm = await nc.jetstreamManager();

  // Add a stream if it doesn't exist
  await jsm.streams.add({ name: "tickets", subjects: ["ticket:created"] });

  // Create a JetStream client
  const js = nc.jetstream();
  const sc = StringCodec();

  // const data = JSON.stringify({ id: "123", title: "concert", price: 20 });
  const publisher = new TicketCreatedPublisher(nc);
  try {
    // Publish a message to the stream
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 20,
      userId: "123",
    });
    console.log("Message published");
  } catch (error) {
    console.log(error);
  }

  // await js.publish("ticket:created", sc.encode(data));

  // Close the connection
  await nc.drain();
};

startPublisher().catch((err) => {
  console.error(`Error starting publisher: ${err.message}`);
});

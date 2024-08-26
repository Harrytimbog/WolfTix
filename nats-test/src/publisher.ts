import { connect } from "nats";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

const startPublisher = async () => {
  const nc = await connect({ servers: "nats://localhost:4222" });
  console.log("Publisher connected to NATS");

  const jsm = await nc.jetstreamManager();

  // Ensure that the stream exists
  try {
    const streamInfo = await jsm.streams.info("tickets");
    console.log("Stream 'tickets' exists:", streamInfo);
  } catch (err) {
    // If the stream does not exist, create it
    await jsm.streams.add({
      name: "tickets",
      subjects: ["clonedwolf.ticket:created"],
    });
    console.log("Stream 'tickets' created.");
  }

  // Create a JetStream client and publish a message
  const js = nc.jetstream();
  const publisher = new TicketCreatedPublisher(js);

  try {
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 20,
      userId: "123",
    });
    console.log("Message published");
  } catch (error) {
    console.error("Error publishing message:", error);
  }

  // Close the connection
  await nc.drain();
};

startPublisher().catch((err) => {
  console.error(`Error starting publisher: ${err.message}`);
});

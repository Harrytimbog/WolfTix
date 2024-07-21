import { connect, StringCodec, consumerOpts } from "nats";

console.clear();

const startListener = async () => {
  const nc = await connect({ servers: "nats://localhost:4222" });

  console.log("Listener connected to NATS");

  // Create JetStream Manager
  const jsm = await nc.jetstreamManager();

  // Add a stream if it doesn't exist
  try {
    await jsm.streams.add({ name: "tickets", subjects: ["ticket.created"] });
  } catch (err) {
    const error = err as Error;
    if (!error.message.includes("stream name already in use")) {
      console.error(`Error adding stream: ${error.message}`);
      return;
    }
  }

  // Create a JetStream client
  const js = nc.jetstream();

  // Define consumer options
  const opts = consumerOpts();
  opts.ackExplicit();
  opts.durable("ticket-created-listener");
  opts.manualAck(); // Ensure manual acknowledgment is set

  // Subscribe to the stream using the push-based method
  const sub = await js.subscribe("ticket.created", opts);

  const sc = StringCodec();

  for await (const m of sub) {
    console.log(`Received message: ${sc.decode(m.data)}`);
    m.ack();
  }

  // Close the connection
  await nc.drain();
};

startListener().catch((err) => {
  console.error(`Error starting listener: ${err.message}`);
});

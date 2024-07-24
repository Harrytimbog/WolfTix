import { connect, StringCodec, consumerOpts, NatsConnection } from "nats";
import { randomBytes } from "crypto";

console.clear();

const startListener = async (): Promise<NatsConnection> => {
  const clientId = randomBytes(12).toString("hex");
  const durableName = `ticket-created-listener-${clientId}`;
  const inbox = `inbox-${clientId}`;
  const queueGroupName = "orders-service-queue-group";

  const nc = await connect({
    servers: "nats://localhost:4222",
    name: `listener-${clientId}`,
  });

  console.log(`Listener ${clientId} connected to NATS`);

  // Create JetStream Manager
  const jsm = await nc.jetstreamManager();

  // Add a stream if it doesn't exist
  try {
    await jsm.streams.add({ name: "tickets", subjects: ["ticket.created"] });
  } catch (err) {
    const error = err as Error;
    if (!error.message.includes("stream name already in use")) {
      console.error(`Error adding stream: ${error.message}`);
      return nc;
    }
  }

  // Create a JetStream client
  const js = nc.jetstream();

  // Define consumer options
  const opts = consumerOpts();
  opts.ackExplicit();
  opts.durable(durableName);
  opts.deliverTo(inbox); // Ensure deliver_subject is set
  opts.manualAck(); // Ensure manual acknowledgment is set
  opts.queue(queueGroupName); // Set the queue group name

  // Subscribe to the stream using the push-based method
  const sub = await js.subscribe("ticket.created", opts);

  const sc = StringCodec();
  let eventCount = 0;

  for await (const m of sub) {
    eventCount++;
    const data = sc.decode(m.data);
    console.log(`Received event #${eventCount}, with data: ${data}`);
    m.ack();
  }

  // This part will only be reached when the loop is broken
  console.log(`Listener ${clientId} shutting down gracefully.`);
  await nc.drain();

  return nc;
};

// Graceful shutdown on signals
const handleShutdown = async (nc: NatsConnection) => {
  try {
    console.log("Shutting down listener gracefully...");
    await nc.drain();
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

startListener()
  .then((nc) => {
    process.on("SIGINT", () => handleShutdown(nc));
    process.on("SIGTERM", () => handleShutdown(nc));
  })
  .catch((err) => {
    console.error(`Error starting listener: ${err.message}`);
  });

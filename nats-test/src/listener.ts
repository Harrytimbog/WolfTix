import {
  connect,
  StringCodec,
  consumerOpts,
  NatsConnection,
  JetStreamSubscription,
  JsMsg,
} from "nats";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();


// Concrete Listener Implementation

const startListener = async () => {
  const clientId = randomBytes(12).toString("hex");
  const nc = await connect({
    servers: "nats://localhost:4222",
    name: `listener-${clientId}`,
  });

  console.log(`Listener ${clientId} connected to NATS`);

  // Initialize the concrete listener
  const listener = new TicketCreatedListener(nc);
  await listener.listen();

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

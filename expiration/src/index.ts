import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedListener } from "./listeners/order-created-listener";

const start = async () => {
  console.log("Starting expiration service...");
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  try {
    // Connect to the NATS streaming server
    await natsWrapper.connect(process.env.NATS_URL);

    // Graceful shutdown handling
    process.on("SIGINT", () => natsWrapper.close());
    process.on("SIGTERM", () => natsWrapper.close());

    new OrderCreatedListener(natsWrapper.jsClient).listen();
  } catch (err) {
    console.error(err);
  }
};

start();

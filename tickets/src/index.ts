import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const start = async () => {
  console.log("Starting tickets service !!!");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

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
    new OrderCancelledListener(natsWrapper.jsClient).listen();

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDB for tickets service");

    // Start listening for incoming requests
    app.listen(3000, () => {
      console.log("Listening on port 3000!");
    });
  } catch (err) {
    console.error(err);
  }
};

start();

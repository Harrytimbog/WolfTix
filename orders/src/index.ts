import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";

const start = async () => {
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
    await natsWrapper.connect("nats://nats-srv:4222");

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

  // Graceful shutdown handling
  process.on("SIGINT", async () => {
    console.log("SIGINT signal received: closing NATS connection...");
    await natsWrapper.close();
    process.exit();
  });

  new TicketCreatedListener(natsWrapper.jsClient).listen();
  new TicketUpdatedListener(natsWrapper.jsClient).listen();

  process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received: closing NATS connection...");
    await natsWrapper.close();
    process.exit();
  });
};

start();

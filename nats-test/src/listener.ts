import {
  NatsConnection,
  consumerOpts,
  JetStreamSubscription,
  StringCodec,
  JsMsg,
  connect,
  JetStreamClient,
} from "nats";
import { randomBytes } from "crypto";

// Abstract Listener class for handling JetStream message consumption
export abstract class Listener<T> {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: T, msg: JsMsg): void;

  protected client: NatsConnection;
  protected jsClient: JetStreamClient;
  protected subscription?: JetStreamSubscription;

  constructor(client: NatsConnection) {
    this.client = client;
    this.jsClient = this.client.jetstream();
  }

  async listen() {
    const opts = consumerOpts();
    opts.ackExplicit(); // Require explicit acknowledgment of messages
    opts.manualAck(); // Ensure manual acknowledgment
    opts.queue(this.queueGroupName); // Set queue group for load balancing
    opts.durable(this.queueGroupName); // Use a durable name to persist state
    opts.deliverTo(`inbox-${randomBytes(12).toString("hex")}`); // Set an inbox for delivery

    // Subscribe to the subject using JetStream's subscription system
    this.subscription = await this.jsClient.subscribe(this.subject, opts);

    console.log(
      `Listening on subject: ${this.subject}, queue group: ${this.queueGroupName}`
    );

    const sc = StringCodec();
    for await (const msg of this.subscription) {
      const parsedData = JSON.parse(sc.decode(msg.data));
      console.log(`Received message on subject: ${this.subject}`);

      this.onMessage(parsedData, msg);
      msg.ack();
    }
  }
}

// Concrete Listener Implementation for TicketCreatedEvent
export class TicketCreatedListener extends Listener<{
  id: string;
  title: string;
  price: number;
}> {
  subject = "clonedwolf.ticket:created";
  // subject = "clonedwolf.ticket:updated";
  queueGroupName = "orders-service-queue-group";

  onMessage(data: { id: string; title: string; price: number }, msg: JsMsg) {
    console.log("Event data:", data);
  }
}

// Start the listener
const startListener = async () => {
  const nc = await connect({ servers: "nats://localhost:4222" });
  console.log("Listener connected to NATS");

  const listener = new TicketCreatedListener(nc);
  await listener.listen();

  // Graceful shutdown on SIGINT/SIGTERM signals
  const handleShutdown = async () => {
    console.log("Shutting down listener...");
    await nc.drain();
    process.exit(0);
  };

  process.on("SIGINT", handleShutdown);
  process.on("SIGTERM", handleShutdown);
};

startListener().catch((err) => {
  console.error(`Error starting listener: ${err.message}`);
});

import {
  connect,
  StringCodec,
  consumerOpts,
  NatsConnection,
  JetStreamSubscription,
  JsMsg,
} from "nats";
import { randomBytes } from "crypto";

console.clear();

abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: JsMsg): void;
  private client: NatsConnection;
  private subscription?: JetStreamSubscription;

  constructor(client: NatsConnection) {
    this.client = client;
  }

  subscriptionOptions() {
    const opts = consumerOpts();
    opts.ackExplicit();
    opts.deliverNew(); // Deliver only new messages
    opts.manualAck(); // Ensure manual acknowledgment is set
    opts.durable(this.queueGroupName); // Set the durable name
    opts.queue(this.queueGroupName); // Set the queue group name
    opts.deliverTo(this.queueGroupName + "_subject"); // Set the deliver subject
    return opts;
  }

  async listen() {
    const js = this.client.jetstream();
    this.subscription = await js.subscribe(
      this.subject,
      this.subscriptionOptions()
    );

    const sc = StringCodec();

    for await (const msg of this.subscription) {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    }
  }

  parseMessage(msg: JsMsg) {
    const data = msg.data;
    return JSON.parse(new TextDecoder().decode(data));
  }
}

// Concrete Listener Implementation
class TicketCreatedListener extends Listener {
  subject = "ticket.created";
  queueGroupName = "orders-service-queue-group";

  onMessage(data: any, msg: JsMsg) {
    console.log(`Received event with data: ${JSON.stringify(data)}`);
    msg.ack();
  }
}

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

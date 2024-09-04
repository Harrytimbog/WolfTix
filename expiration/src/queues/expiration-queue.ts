import Queue from "bull";
import { queueGroupName } from "../listeners/queue-group-name";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../../nats-wrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>(queueGroupName, {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.jsClient).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };

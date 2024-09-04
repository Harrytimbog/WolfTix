import Queue from "bull";
import { queueGroupName } from "../listeners/queue-group-name";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>(queueGroupName, {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log("Publish expiration:complete for orderId", job.data.orderId);
});

export { expirationQueue };

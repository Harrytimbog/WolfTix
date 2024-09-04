import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@clonedwolftickets/common";
import { queueGroupName } from "./queue-group-name";
import { JsMsg } from "nats";
import { expirationQueue } from "../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: JsMsg) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("Waiting this many milliseconds to process the job:", delay);
    // Add expiration logic here
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delay,
      }
    );
    msg.ack();
  }
}

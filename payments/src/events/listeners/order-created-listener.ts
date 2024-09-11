import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@clonedwolftickets/common";
import { queueGroupName } from "./queue-group-name";
import { JsMsg } from "nats";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = `${queueGroupName}-order-created`;

  async onMessage(data: OrderCreatedEvent["data"], msg: JsMsg) {
    // receive the data from the event and build a new order from it in this service
    const order = await Order.build({
      id: data.id,
      version: data.version,
      userId: data.userId,
      price: data.ticket.price,
      status: data.status,
    });

    await order.save();

    msg.ack();
  }
}

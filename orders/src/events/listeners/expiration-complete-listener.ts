import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@clonedwolftickets/common";
import { queueGroupName } from "./queue-group-name";
import { JsMsg } from "nats";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = `${queueGroupName}-expiration-completed`;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: JsMsg) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
      // not setting ticket to null so the reference to the ticket is still there
    });

    await order.save();

    // publish an event saying this order was cancelled
    // so other services can update their data
    await new OrderCancelledPublisher(this.jsClient).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}

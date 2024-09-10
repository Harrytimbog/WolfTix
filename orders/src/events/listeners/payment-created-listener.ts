import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from "@clonedwolftickets/common";
import { queueGroupName } from "./queue-group-name";
import { JsMsg } from "nats";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: JsMsg) {
    // find the order that the payment is associated with
    const order = await Order.findById(data.orderId);

    // check if the order exists
    if (!order) {
      throw new Error("Order not found");
    }

    // update the order's status to complete
    order.set({ status: OrderStatus.Complete });

    // save the order
    await order.save();
    // ack the message
    msg.ack();
  }
}

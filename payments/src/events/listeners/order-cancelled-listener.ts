import {
  OrderCancelledEvent,
  Subjects,
  Listener,
  OrderStatus,
} from "@clonedwolftickets/common";
import { queueGroupName } from "./queue-group-name";
import { JsMsg } from "nats";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: JsMsg) {
    // find the order that was cancelled and update its status
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // update the order status to cancelled
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    // ack the message
    msg.ack();
  }
}

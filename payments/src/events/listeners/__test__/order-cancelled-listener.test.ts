import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@clonedwolftickets/common";
import { JsMsg } from "nats";

// Create a setup function to create an instance of the listener and a fake order
const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.jsClient);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    price: 10,
    userId: "ahshsh",
  });

  await order.save();

  // Create a fake data event
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1, // increment the version number
    ticket: {
      id: "alskdfj",
    },
  };

  // Create a fake message object
  // @ts-ignore
  const msg: JsMsg = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

it("updates the order status to cancelled", async () => {
  const { listener, order, data, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Find the order
  const updatedOrder = await Order.findById(order.id);

  // Expect the order status to be cancelled
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Expect the ack function to be called
  expect(msg.ack).toHaveBeenCalled();
});

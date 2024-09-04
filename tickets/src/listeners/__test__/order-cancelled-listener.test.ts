import mongoose from "mongoose";
import { OrderCancelledEvent } from "@clonedwolftickets/common";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledEventListener } from "../order-cancelled-listener";
import { Ticket } from "../../models/ticket";

const setup = async () => {
  const listener = new OrderCancelledEventListener(natsWrapper.jsClient); // remember the natswrapper imported is the mock

  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "asdf",
  });

  await ticket.save();

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, ticket, orderId, listener };
};

it("updates the ticket, publishes an event, and acks the message", async () => {
  const { msg, data, ticket, orderId, listener } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.jsClient.publish).toHaveBeenCalled();
});

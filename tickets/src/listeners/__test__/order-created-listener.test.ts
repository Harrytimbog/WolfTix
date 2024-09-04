import { OrderCreatedListener } from "../order-created-listener";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@clonedwolftickets/common";
import mongoose from "mongoose";
import { JsMsg } from "nats";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.jsClient);

  // create and save a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "asdf",
  });
  await ticket.save();
  // Create a fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version,
    status: OrderStatus.Created,
    userId: ticket.userId,
    expiresAt: "asdf",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // Create a fake message object
  // @ts-ignore  // ignore the error because we are only mocking the ack function
  const msg: JsMsg = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};

it("sets the orderId of the ticket", async () => {
  // Call the onMessage function with the data object + message object
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

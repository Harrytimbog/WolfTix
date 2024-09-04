import { OrderCreatedListener } from "../order-created-listener";
import { OrderCreatedEvent, OrderStatus } from "@clonedwolftickets/common";
import mongoose from "mongoose";
import { JsMsg } from "nats";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

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

it("publishes a ticket updated event", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.jsClient.publish).toHaveBeenCalled();
  // @ts-ignore
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.jsClient.publish as jest.Mock).mock.calls[0][1]
  ); // to see the arguments passed to the publish function

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});

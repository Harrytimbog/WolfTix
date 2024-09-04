import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@clonedwolftickets/common";
import { JsMsg } from "nats";

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.jsClient);
  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  // Create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "new concert",
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // Create a fake msg object
  // @ts-ignore
  const msg: JsMsg = {
    ack: jest.fn(),
  };
  // Return all of this stuff
  return { msg, data, ticket, listener };
};

it("finds, updates, and saves a ticket", async () => {
  // Call the onMessage function with the data object + message object
  const { listener, data, msg, ticket } = await setup();
  // Write assertions to make sure a ticket was updated!
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
  // Write assertions to make sure the ack function was called
});

it("acks the message", async () => {
  // Call the onMessage function with the data object + message object
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  // Write assertions to make sure the ack function was called
  expect(msg.ack).toHaveBeenCalled();
});

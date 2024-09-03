import { JsMsg } from "nats";
import {
  Listener,
  Subjects,
  TicketUpdatedEvent,
} from "@clonedwolftickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  readonly queueGroupName: string = `${queueGroupName}-ticket-updated`;

  async onMessage(data: TicketUpdatedEvent["data"], msg: JsMsg) {
    const { id, title, price } = data;

    const ticket = await Ticket.findbyEvent({ id, version: data.version });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}

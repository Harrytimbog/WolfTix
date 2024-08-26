import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@clonedwolftickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

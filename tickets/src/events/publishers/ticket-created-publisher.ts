import {
  natsWrapper,
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@clonedwolftickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

new TicketUpdatedPublisher(natsWrapper.jsClient).publish({
  
});

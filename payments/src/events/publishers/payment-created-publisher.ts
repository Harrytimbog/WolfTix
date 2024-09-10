import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from "@clonedwolftickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

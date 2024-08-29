import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@clonedwolftickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

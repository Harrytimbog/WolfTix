import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@clonedwolftickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

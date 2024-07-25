import { JsMsg } from "nats";
import { Listener } from "./base-listener";

export class TicketCreatedListener extends Listener {
  subject = "ticket:created";
  queueGroupName = "orders-service-queue-group";

  onMessage(data: any, msg: JsMsg) {
    console.log(`Received event with data: ${JSON.stringify(data)}`);
    msg.ack();
  }
}

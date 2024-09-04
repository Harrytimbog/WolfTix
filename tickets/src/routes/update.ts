import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from "@clonedwolftickets/common";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

import { Ticket } from "../models/ticket";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    // this is to prevent editing a ticket that is already reserved
    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Update the ticket
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();

    try {
      // TypeScript workaround to include 'version' in the object
      const eventData = {
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
      };

      // Publish an event for the ticket update
      await new TicketUpdatedPublisher(natsWrapper.jsClient).publish(eventData);
    } catch (err) {
      console.error("Error publishing event:", err);
    }

    res.send(ticket);
  }
);

export { router as updateTicketRouter };

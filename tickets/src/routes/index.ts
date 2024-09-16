import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  // Find tickets where `orderId` is either null or does not exist
  const tickets = await Ticket.find();

  res.send(tickets);
});

export { router as indexTicketRouter };

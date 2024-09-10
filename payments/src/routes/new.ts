import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  OrderStatus,
  NotAuthorizedError,
} from "@clonedwolftickets/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments/new",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,

  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    // Check if the order exists
    if (!order) {
      throw new NotFoundError();
    }
    // Check if the order belongs to the user
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    // Check if the order is cancelled
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for cancelled order");
    }

    // Create the charge

    const charge = await stripe.charges.create({
      currency: "usd",
      // Convert the price to cents
      amount: order.price * 100,
      // The token from the client
      source: token,
    });

    // Save the charge in the database
    const payment = Payment.build({ orderId, stripeId: charge.id });
    await payment.save();

    // Emit an event that the payment was created

    // did not add await because we don't need to wait for the event to be published

    new PaymentCreatedPublisher(natsWrapper.jsClient).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };

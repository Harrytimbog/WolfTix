import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import mongoose from "mongoose";
import { OrderStatus } from "@clonedwolftickets/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

it("Has a route handler listening to /api/payments/new", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "abc",
    version: 0,
    price: 200,
    status: OrderStatus.Created,
  });
  await order.save();

  const response = await request(app).post("/api/payments/new").send({
    orderId: order.id,
    token: "abc",
  });

  expect(response.status).not.toEqual(404);
});

it("Returns 404 if there is no order for the provided id", async () => {
  const response = await request(app)
    .post("/api/payments/new")
    .set("Cookie", signin())
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
      token: "abc",
    });

  expect(response.status).toEqual(404);
});

it("Returns unauthorized if the user is not the owner of the id", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 200,
    status: OrderStatus.Created,
  });
  await order.save();

  // const cookie = signin(userId);
  await request(app)
    .post("/api/payments/new")
    .set("Cookie", signin())
    .send({
      orderId: order.id,
      token: "abc",
    })
    .expect(401);
});

it("returns a 201 with valid inputs", async () => {
  // Create a new order
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);

  // Create a new order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  // Save the order
  await order.save();

  // Make a request to create a payment attaching valid inputs to the request
  await request(app)
    .post("/api/payments/new")
    .set("Cookie", signin(userId))
    .send({
      orderId: order.id,
      token: "tok_visa",
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });
  // Check if the stripe module was called with the correct arguments
  expect(stripeCharge).toBeDefined();
  // Check the amount
  // Check the currency
  expect(stripeCharge!.currency).toEqual("usd");

  // Check if the payment was saved in the database
  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });

  expect(payment).not.toBeNull();
});

import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import mongoose from "mongoose";
import { OrderStatus } from "@clonedwolftickets/common";
import { stripe } from "../../stripe";

// Redirect the stripe module used for testing to the mock stripe module
jest.mock("../../stripe");

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

it("returns a 204 with valid inputs", async () => {
  // Create a new order
  const userId = new mongoose.Types.ObjectId().toHexString();

  // Create a new order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 200,
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

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual("tok_visa");
  // Check the amount
  expect(chargeOptions.amount).toEqual(200 * 100);
  // Check the currency
  expect(chargeOptions.currency).toEqual("usd");
});

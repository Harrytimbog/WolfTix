import request from "supertest";

import { app } from "../../app";

// Mock natsWrapper in your tests
jest.mock("../../nats-wrapper", () => {
  return {
    natsWrapper: {
      jsClient: {
        publish: jest.fn().mockImplementation(() => {
          return Promise.resolve();
        }),
      },
      connect: jest.fn(),
    },
  };
});

it("can fetch a list of tickets", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "concert",
      price: 20,
    })
    .expect(201);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "concert2",
      price: 30,
    })
    .expect(201);

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(2);
});

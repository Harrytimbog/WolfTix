import request from "supertest";
import { app } from "../../app";

//
it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "asdf;ljk",
    })
    .expect(201);
});

// test for invalid email
it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "olorikolobo.com",
      password: "asdf;ljk",
    })
    .expect(400);
});

// test for invalid password
it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "p",
    })
    .expect(400);
});

// test for missing password
it("returns a 400 with a missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "harrie@gmail",
      password: "",
    })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "",
      password: "password",
    })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

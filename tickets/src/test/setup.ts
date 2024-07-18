import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "testkey";

  try {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri, {});
  } catch (err) {
    console.error("Failed to connect to in-memory MongoDB", err);
    throw err;
  }
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  try {
    await mongo.stop();
    await mongoose.connection.close();
  } catch (err) {
    console.error("Error during MongoDB stop/connection close", err);
  }
});

// You can actually choose to write this helper function in a
// separate file and import it here and anywhere you need it

global.signin = async (): Promise<string[]> => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  if (!cookie) {
    throw new Error("Authentication cookie not found");
  }

  return cookie;
};

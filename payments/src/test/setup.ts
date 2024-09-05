import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

// Mock natsWrapper in your tests
jest.mock("../nats-wrapper.ts", () => {
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

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "testkey";

  try {
    mongo = await MongoMemoryServer.create({
      binary: {
        version: "6.0.4",
      },
    });
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
  } catch (err) {
    console.error("Failed to connect to in-memory MongoDB", err);
    throw err;
  }
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await (mongoose.connection.db
    ? mongoose.connection.db.collections()
    : []);

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

// JWT helper function for authentication
global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@gmail.com",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};

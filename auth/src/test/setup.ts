import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

// Setup in-memory MongoDB
let mongo: any;

beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// Setup Express server
beforeEach(async () => {
  // Clear all mocks

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Close the in-memory database

afterAll(async () => {
  await mongo.close();
  await mongoose.connection.close();
});

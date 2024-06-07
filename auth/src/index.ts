import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  // Check if the JWT_KEY is defined in the environment variables before starting the server
  // this environment variable is set in the auth-depl.yaml file and is set on kubernetes
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {});
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});

start();

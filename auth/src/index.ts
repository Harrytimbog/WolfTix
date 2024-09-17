import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Starting up Auth Service.....");
  // Check if the JWT_KEY is defined in the environment variables before starting the server
  // this environment variable is set in the auth-depl.yaml file and is set on kubernetes
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDB for auth service");
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});

start();

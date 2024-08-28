import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

// Routes

// Middlewares
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@clonedwolftickets/common";
import { deleteOrderRouter } from "./routes/delete";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes";
import { newOrderRouter } from "./routes/new";

const app = express();
// Trust the ingress-nginx proxy
app.set("trust proxy", true);
app.use(json());

// Disable the secure flag for the cookie session because this services might be needed
// to be accessed from other services that are written in different languages
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);

// Route handlers

// set the current user property on the request object
app.use(currentUser);

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

// export the app

export { app };

import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

// Routes

import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";

// Middlewares
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@clonedwolftickets/common";

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

app.use(createTicketRouter);
app.use(showTicketRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

// export the app

export { app };

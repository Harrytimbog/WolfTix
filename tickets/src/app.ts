import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

// Routes

import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

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
  // cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" }) // I used in development mode
  cookieSession({ signed: false, secure: false }) // I used in production mode before I had HTTPS set up so it doesn't break
);

// Route handlers

// set the current user property on the request object
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

// export the app

export { app };
